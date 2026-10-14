#![cfg(target_os = "linux")]

mod zed;

use std::env;
use std::fs::File;
use std::io::{BufRead, BufReader};
use std::mem::MaybeUninit;
use std::net::IpAddr;
use std::thread;
use std::time::{Duration, SystemTime, UNIX_EPOCH};

use hmac::{Hmac, Mac};
use serde::Serialize;
use sha2::Sha256;
use url::{Host, Url};

type Result<T, E = &'static str> = std::result::Result<T, E>;
#[derive(Serialize)]
struct Report {
    cpu_percent: f64,
    memory_used_bytes: u64,
    memory_total_bytes: u64,
    disk_used_bytes: u64,
    disk_total_bytes: u64,
    uptime_seconds: u64,
    #[serde(skip_serializing_if = "Option::is_none")]
    zed: Option<zed::Activity>,
}

struct Config {
    pc_id: String,
    signing_key: String,
    url: Url,
}

impl Config {
    fn from_env() -> Result<Self> {
        let pc_id = match env::var("PC_ID") {
            Ok(value) => value,
            Err(env::VarError::NotPresent) => "main".to_owned(),
            Err(env::VarError::NotUnicode(_)) => return Err("PC_ID must be valid UTF-8"),
        };
        if pc_id.is_empty()
            || pc_id.len() > 64
            || !pc_id
                .bytes()
                .all(|byte| byte.is_ascii_alphanumeric() || byte == b'-' || byte == b'_')
        {
            return Err("PC_ID must be 1-64 letters, digits, hyphens, or underscores");
        }
        let signing_key = env::var("SIGNING_KEY")
            .map_err(|_| "SIGNING_KEY must be set to a valid UTF-8 value")?;
        if signing_key.len() < 32 {
            return Err("SIGNING_KEY must contain at least 32 bytes");
        }
        let base = match env::var("API_URL") {
            Ok(value) => value,
            Err(env::VarError::NotPresent) => "http://127.0.0.1:8080".to_owned(),
            Err(env::VarError::NotUnicode(_)) => return Err("API_URL must be valid UTF-8"),
        };
        let mut url = Url::parse(&base).map_err(|_| "API_URL must be a valid HTTP(S) URL")?;
        if url.host().is_none()
            || !url.username().is_empty()
            || url.password().is_some()
            || url.query().is_some()
            || url.fragment().is_some()
        {
            return Err("API_URL must have a host and no credentials, query, or fragment");
        }
        match url.scheme() {
            "https" => {}
            "http" if is_loopback(&url) => {}
            _ => return Err("API_URL must use HTTPS except for a loopback host"),
        }
        url.path_segments_mut()
            .map_err(|_| "API_URL must have a hierarchical path")?
            .pop_if_empty()
            .push("api")
            .push("pc")
            .push("report");
        Ok(Self {
            pc_id,
            signing_key,
            url,
        })
    }
}

fn is_loopback(url: &Url) -> bool {
    match url.host() {
        Some(Host::Domain(host)) => host == "localhost",
        Some(Host::Ipv4(ip)) => IpAddr::V4(ip).is_loopback(),
        Some(Host::Ipv6(ip)) => IpAddr::V6(ip).is_loopback(),
        None => false,
    }
}

struct CpuSample {
    total: u64,
    idle: u64,
}

fn cpu_sample() -> Result<CpuSample> {
    let file = File::open("/proc/stat").map_err(|_| "cannot read /proc/stat")?;
    let mut line = String::new();
    BufReader::new(file)
        .read_line(&mut line)
        .map_err(|_| "cannot read CPU counters")?;
    let mut fields = line.split_whitespace();
    if fields.next() != Some("cpu") {
        return Err("missing aggregate CPU counters");
    }
    let mut total = 0_u64;
    let mut idle = 0_u64;
    // The first eight columns are user, nice, system, idle, iowait, irq,
    // softirq, and steal. Guest columns are already included in user/nice.
    for index in 0..8 {
        let value: u64 = fields
            .next()
            .ok_or("incomplete CPU counters")?
            .parse()
            .map_err(|_| "invalid CPU counters")?;
        total = total.checked_add(value).ok_or("CPU counters overflowed")?;
        if index == 3 || index == 4 {
            idle = idle.checked_add(value).ok_or("CPU counters overflowed")?;
        }
    }
    Ok(CpuSample { total, idle })
}

fn cpu_percent(before: CpuSample, after: CpuSample) -> Result<f64> {
    let elapsed = after
        .total
        .checked_sub(before.total)
        .ok_or("CPU counters decreased")?;
    let idle = after
        .idle
        .checked_sub(before.idle)
        .ok_or("CPU counters decreased")?;
    if elapsed == 0 || idle > elapsed {
        return Err("invalid CPU sampling interval");
    }
    Ok((elapsed - idle) as f64 * 100.0 / elapsed as f64)
}

fn memory() -> Result<(u64, u64)> {
    let file = File::open("/proc/meminfo").map_err(|_| "cannot read /proc/meminfo")?;
    let mut reader = BufReader::new(file);
    let mut line = String::new();
    let mut total = None;
    let mut available = None;
    loop {
        line.clear();
        if reader
            .read_line(&mut line)
            .map_err(|_| "cannot read memory counters")?
            == 0
        {
            break;
        }
        let (field, value) = line.split_once(':').ok_or("invalid memory counters")?;
        if field == "MemTotal" || field == "MemAvailable" {
            let mut parts = value.split_whitespace();
            let kib: u64 = parts
                .next()
                .ok_or("missing memory counter")?
                .parse()
                .map_err(|_| "invalid memory counter")?;
            if parts.next() != Some("kB") || parts.next().is_some() {
                return Err("invalid memory counter unit");
            }
            let bytes = kib.checked_mul(1024).ok_or("memory counter overflowed")?;
            if field == "MemTotal" {
                total = Some(bytes);
            } else {
                available = Some(bytes);
            }
            if total.is_some() && available.is_some() {
                break;
            }
        }
    }
    let total = total.ok_or("missing MemTotal in /proc/meminfo")?;
    let available = available.ok_or("missing MemAvailable in /proc/meminfo")?;
    let used = total
        .checked_sub(available)
        .ok_or("MemAvailable exceeds MemTotal")?;
    Ok((used, total))
}

fn root_disk() -> Result<(u64, u64)> {
    let mut stats = MaybeUninit::<libc::statvfs>::uninit();
    // SAFETY: The NUL-terminated root path and writable statvfs buffer remain
    // valid for the call. The buffer is read only after statvfs succeeds.
    if unsafe { libc::statvfs(c"/".as_ptr(), stats.as_mut_ptr()) } != 0 {
        return Err("cannot stat root filesystem");
    }
    let stats = unsafe { stats.assume_init() };
    let block_size = stats.f_frsize;
    let total = stats
        .f_blocks
        .checked_mul(block_size)
        .ok_or("root filesystem size overflowed")?;
    let used_blocks = stats
        .f_blocks
        .checked_sub(stats.f_bfree)
        .ok_or("invalid root filesystem counters")?;
    let used = used_blocks
        .checked_mul(block_size)
        .ok_or("root filesystem size overflowed")?;
    Ok((used, total))
}

fn uptime_seconds() -> Result<u64> {
    let file = File::open("/proc/uptime").map_err(|_| "cannot read /proc/uptime")?;
    let mut line = String::new();
    BufReader::new(file)
        .read_line(&mut line)
        .map_err(|_| "cannot read uptime")?;
    let seconds = line.split_whitespace().next().ok_or("missing uptime")?;
    let (whole, fraction) = seconds.split_once('.').ok_or("invalid uptime")?;
    if fraction.is_empty() || !fraction.bytes().all(|byte| byte.is_ascii_digit()) {
        return Err("invalid uptime");
    }
    whole.parse().map_err(|_| "invalid uptime")
}

fn gather_report() -> Result<Report> {
    let before = cpu_sample()?;
    thread::sleep(Duration::from_millis(100));
    let after = cpu_sample()?;
    let (memory_used_bytes, memory_total_bytes) = memory()?;
    let (disk_used_bytes, disk_total_bytes) = root_disk()?;
    Ok(Report {
        cpu_percent: cpu_percent(before, after)?,
        memory_used_bytes,
        memory_total_bytes,
        disk_used_bytes,
        disk_total_bytes,
        uptime_seconds: uptime_seconds()?,
        zed: zed::collect(),
    })
}

fn run() -> Result<()> {
    let config = Config::from_env()?;
    let report = gather_report()?;
    let body = serde_json::to_string(&report).map_err(|_| "cannot encode report")?;
    let timestamp = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map_err(|_| "system clock is before Unix epoch")?
        .as_secs()
        .to_string();
    let mut mac = Hmac::<Sha256>::new_from_slice(config.signing_key.as_bytes())
        .map_err(|_| "cannot initialize signature")?;
    mac.update(timestamp.as_bytes());
    mac.update(b"\n");
    mac.update(config.pc_id.as_bytes());
    mac.update(b"\n");
    mac.update(body.as_bytes());
    let digest = mac.finalize().into_bytes();
    let mut signature = [0_u8; 64];
    const HEX: &[u8; 16] = b"0123456789abcdef";
    for (byte, pair) in digest.iter().zip(signature.as_chunks_mut::<2>().0) {
        pair[0] = HEX[(byte >> 4) as usize];
        pair[1] = HEX[(byte & 15) as usize];
    }
    let signature = std::str::from_utf8(&signature).map_err(|_| "cannot encode signature")?;
    let agent = ureq::AgentBuilder::new()
        .timeout_connect(Duration::from_secs(10))
        .timeout(Duration::from_secs(20))
        .redirects(0)
        .build();
    let response = agent
        .post(config.url.as_str())
        .set("Content-Type", "application/json")
        .set("X-PC-ID", &config.pc_id)
        .set("X-Timestamp", &timestamp)
        .set("X-Signature", signature)
        .send_string(&body)
        .map_err(|_| "report POST failed (HTTP or transport error)")?;
    if !(200..300).contains(&response.status()) {
        return Err("report POST failed (unexpected HTTP status)");
    }
    Ok(())
}

fn main() {
    if let Err(error) = run() {
        eprintln!("pc-report-client: {error}");
        std::process::exit(1);
    }
}
