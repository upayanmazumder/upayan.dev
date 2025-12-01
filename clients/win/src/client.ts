import fetch from "node-fetch";
import { Config } from "./config";

async function delay(ms: number) {
	return new Promise((res) => setTimeout(res, ms));
}

export async function sendUpdate(config: Config, status: any): Promise<void> {
	const url = `${config.apiHost.replace(/\/$/, "")}/device/update`;
	const body = {
		deviceId: config.deviceId,
		status,
	};

	const maxAttempts = 5;
	let attempt = 0;
	let backoff = 1000;

	while (attempt < maxAttempts) {
		try {
			const controller = new AbortController();
			const timeout = setTimeout(() => controller.abort(), 10000);
			const res = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${config.token}`,
				},
				body: JSON.stringify(body),
				signal: controller.signal,
			});
			clearTimeout(timeout);

			if (!res.ok) {
				const text = await res.text();
				throw new Error(`HTTP ${res.status}: ${text}`);
			}
			return;
		} catch (err) {
			attempt++;
			console.error(`sendUpdate attempt ${attempt} failed: ${err}`);
			if (attempt >= maxAttempts) {
				console.error(
					"Max attempts reached, will continue retrying on next cycle"
				);
				return;
			}
			await delay(backoff);
			backoff *= 2;
		}
	}
}
