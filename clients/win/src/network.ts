import si from "systeminformation";
import fetch from "node-fetch";
import ping from "ping";
import os from "os";

async function publicIp() {
	try {
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), 5000);
		const r = await fetch("https://api.ipify.org?format=json", {
			signal: controller.signal,
		});
		clearTimeout(timeout);
		const j = (await r.json()) as { ip: string };
		return j.ip;
	} catch (err) {
		return null;
	}
}

export async function collectNetworkInfo() {
	const interfaces = os.networkInterfaces();
	const wifi = await si.wifiNetworks().catch(() => []);
	const wifiIfaces = await si.wifiInterfaces().catch(() => []);
	const wifiIface = wifiIfaces && wifiIfaces.length > 0 ? wifiIfaces[0] : null;

	const localIps: string[] = [];
	Object.values(interfaces).forEach((list) => {
		if (!list) return;
		list.forEach((i) => {
			if (i.family === "IPv4" && !i.internal) localIps.push(i.address);
		});
	});

	let latency: number | null = null;
	try {
		const res = await ping.promise.probe("8.8.8.8", { timeout: 2 });
		latency = res.time ? Number(res.time) : null;
	} catch (err) {
		latency = null;
	}

	const pub = await publicIp();

	// VPN detection heuristic: look for tun/tap adapters or multiple default adapters
	const adapters = await si.networkInterfaces();
	const vpnDetected = adapters.some(
		(a) =>
			/tun|tap|ppp|vpn/i.test(a.iface || "") ||
			(a.operstate === "up" &&
				/TAP-Windows|OpenVPN|WireGuard/i.test(a.iface || ""))
	);

	return {
		localIps,
		publicIp: pub,
		wifi: wifiIface
			? { ssid: (wifiIface as any).ssid || null, iface: wifiIface.iface }
			: null,
		latencyTo8_8_8_8_ms: latency,
		vpnDetected,
	};
}
