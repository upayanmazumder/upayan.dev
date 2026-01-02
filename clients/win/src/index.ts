import { loadConfig, saveConfig } from "./config";
import { collectSystemInfo } from "./system";
import { collectNetworkInfo } from "./network";
import { sendUpdate } from "./client";
import activeWin from "active-win";
import { spawn } from "child_process";

function parseFlags(argv: string[]) {
	const out: any = {};
	for (let i = 0; i < argv.length; i++) {
		const a = argv[i];
		if (!a.startsWith("--")) continue;
		const key = a.slice(2);
		const next = argv[i + 1];
		if (next && !next.startsWith("--")) {
			out[key] = next;
			i++;
		} else {
			out[key] = true;
		}
	}
	return out;
}

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

async function cli() {
	const cmd = process.argv[2];
	if (cmd === "configure") {
		const flags = parseFlags(process.argv.slice(3));
		const toSave: any = {};
		if (flags.deviceId) toSave.deviceId = flags.deviceId;
		if (flags.token) toSave.token = flags.token;
		if (flags.apiHost) toSave.apiHost = flags.apiHost;
		if (flags.intervalSeconds)
			toSave.intervalSeconds = Number(flags.intervalSeconds);
		if (flags.topNProcesses) toSave.topNProcesses = Number(flags.topNProcesses);

		if (!toSave.deviceId || !toSave.token) {
			console.error("configure requires --deviceId and --token");
			process.exit(1);
		}
		saveConfig(toSave);
		console.log("Configuration saved to per-user appdata.");
		process.exit(0);
	}

	if (cmd === "install" || cmd === "uninstall") {
		const script =
			cmd === "install" ?
				"./scripts/install-service.js"
			:	"./scripts/uninstall-service.js";
		const child = spawn(process.execPath, [script], {
			stdio: "inherit",
			cwd: process.cwd(),
		});
		child.on("exit", (code) => process.exit(code || 0));
		return;
	}

	// default: run main loop
	await main();
}

cli().catch((err) => {
	console.error("Fatal error", err);
	process.exit(1);
});
