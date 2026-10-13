use serde::{Deserialize, Serialize, de::IgnoredAny};
use serde_json::json;
use std::time::{SystemTime, UNIX_EPOCH};

const QUERY: &str = "query($login:String!){ user(login:$login){ contributionsCollection{ contributionCalendar{ totalContributions weeks{ contributionDays{ date contributionCount contributionLevel } } } } } }";

pub struct GitHub {
    client: reqwest::Client,
    user: String,
    token: String,
    url: String,
}

#[derive(Serialize)]
pub struct Contributions {
    pub user: String,
    pub total: u64,
    pub weeks: Vec<Week>,
    pub fetched_at: String,
}

#[derive(Serialize)]
pub struct Week {
    pub days: Vec<Day>,
}

#[derive(Serialize)]
pub struct Day {
    pub date: String,
    pub count: u64,
    pub level: u8,
}

#[derive(Deserialize)]
struct Envelope {
    data: Option<Data>,
    errors: Option<Vec<IgnoredAny>>,
}

#[derive(Deserialize)]
struct Data {
    user: Option<User>,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct User {
    contributions_collection: Collection,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct Collection {
    contribution_calendar: Calendar,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct Calendar {
    total_contributions: u64,
    weeks: Vec<CalendarWeek>,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct CalendarWeek {
    contribution_days: Vec<CalendarDay>,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct CalendarDay {
    date: String,
    contribution_count: u64,
    contribution_level: Level,
}

#[derive(Deserialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
enum Level {
    None,
    FirstQuartile,
    SecondQuartile,
    ThirdQuartile,
    FourthQuartile,
}

impl Level {
    fn value(&self) -> u8 {
        match self {
            Level::None => 0,
            Level::FirstQuartile => 1,
            Level::SecondQuartile => 2,
            Level::ThirdQuartile => 3,
            Level::FourthQuartile => 4,
        }
    }
}

impl GitHub {
    pub fn new(client: reqwest::Client, user: String, token: String, api_base: String) -> Self {
        Self {
            client,
            user,
            token,
            url: format!("{}/graphql", api_base.trim_end_matches('/')),
        }
    }

    pub async fn fetch(&self) -> Result<Contributions, String> {
        let response = self
            .client
            .post(&self.url)
            .header(
                reqwest::header::AUTHORIZATION,
                format!("bearer {}", self.token),
            )
            .header(reqwest::header::USER_AGENT, "upayan.dev-stats-api")
            .json(&json!({ "query": QUERY, "variables": { "login": self.user } }))
            .send()
            .await
            .map_err(|_| "GitHub request failed".to_owned())?;
        if !response.status().is_success() {
            return Err("GitHub returned an error".to_owned());
        }
        let envelope: Envelope = response
            .json()
            .await
            .map_err(|_| "Invalid GitHub response".to_owned())?;
        if envelope.errors.is_some_and(|errors| !errors.is_empty()) {
            return Err("GitHub query failed".to_owned());
        }
        let calendar = envelope
            .data
            .and_then(|data| data.user)
            .ok_or_else(|| "GitHub user not found".to_owned())?
            .contributions_collection
            .contribution_calendar;
        let mut weeks = Vec::with_capacity(calendar.weeks.len());
        for week in calendar.weeks {
            let mut days = Vec::with_capacity(week.contribution_days.len());
            for day in week.contribution_days {
                if !valid_date(&day.date) {
                    return Err("Invalid GitHub response".to_owned());
                }
                days.push(Day {
                    level: day.contribution_level.value(),
                    date: day.date,
                    count: day.contribution_count,
                });
            }
            if days.is_empty() {
                continue;
            }
            days.sort_unstable_by(|a, b| a.date.cmp(&b.date));
            weeks.push(Week { days });
        }
        weeks.sort_unstable_by(|a, b| a.days[0].date.cmp(&b.days[0].date));
        Ok(Contributions {
            user: self.user.clone(),
            total: calendar.total_contributions,
            weeks,
            fetched_at: rfc3339(SystemTime::now()),
        })
    }
}

/// GitHub logins: 1-39 ASCII letters, digits, or hyphens.
pub fn valid_login(value: &str) -> bool {
    !value.is_empty()
        && value.len() <= 39
        && value
            .bytes()
            .all(|b| b.is_ascii_alphanumeric() || b == b'-')
}

fn valid_date(value: &str) -> bool {
    let bytes = value.as_bytes();
    bytes.len() == 10
        && bytes.iter().enumerate().all(|(i, b)| match i {
            4 | 7 => *b == b'-',
            _ => b.is_ascii_digit(),
        })
}

fn rfc3339(time: SystemTime) -> String {
    let secs = time
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .as_secs();
    let (days, rem) = (secs / 86_400, secs % 86_400);
    // Civil date from days since 1970-01-01 (Howard Hinnant's algorithm).
    let z = days + 719_468;
    let era = z / 146_097;
    let doe = z - era * 146_097;
    let yoe = (doe - doe / 1_460 + doe / 36_524 - doe / 146_096) / 365;
    let doy = doe - (365 * yoe + yoe / 4 - yoe / 100);
    let mp = (5 * doy + 2) / 153;
    let day = doy - (153 * mp + 2) / 5 + 1;
    let month = if mp < 10 { mp + 3 } else { mp - 9 };
    let year = yoe + era * 400 + u64::from(month <= 2);
    format!(
        "{year:04}-{month:02}-{day:02}T{:02}:{:02}:{:02}Z",
        rem / 3_600,
        rem % 3_600 / 60,
        rem % 60
    )
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::time::Duration;

    #[test]
    fn formats_utc_timestamps() {
        let at = |secs| rfc3339(UNIX_EPOCH + Duration::from_secs(secs));
        assert_eq!(at(0), "1970-01-01T00:00:00Z");
        assert_eq!(at(951_825_599), "2000-02-29T11:59:59Z");
        assert_eq!(at(1_791_885_600), "2026-10-13T10:00:00Z");
        assert_eq!(at(1_798_761_599), "2026-12-31T23:59:59Z");
    }
}
