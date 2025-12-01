import { loadConfig } from "./config";
import { collectSystemInfo } from "./system";
import { collectNetworkInfo } from "./network";
import { sendUpdate } from "./client";
import activeWin from "active-win";

async function main() {
	let config;
	try {
		config = loadConfig();
	} catch (err) {
		console.error(err);
		process.exit(1);
	}

	const interval = (config.intervalSeconds || 10) * 1000;

	while (true) {
		try {
			const [sys, net] = await Promise.all([
				collectSystemInfo(config.topNProcesses),
				collectNetworkInfo(),
			]);

			const active = await activeWin().catch(() => null);

			const status = {
				timestamp: new Date().toISOString(),
				system: sys,
				network: net,
				activity: {
					activeWindowTitle: active?.title ?? null,
					activeApp: active?.owner?.name ?? null,
				},
			};

			await sendUpdate(config, status);
		} catch (err) {
			console.error("Main loop error:", err);
		}

		await new Promise((res) => setTimeout(res, interval));
	}
}

main().catch((err) => {
	console.error("Fatal error", err);
});
