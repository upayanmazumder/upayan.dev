import fs from "fs";
import path from "path";
import os from "os";

export type Config = {
	deviceId: string;
	token: string;
	apiHost: string;
	topNProcesses?: number;
	intervalSeconds?: number;
};

// Preferred per-user config location on Windows: %APPDATA%\UpayanDeviceClient\config.json
const appData =
	process.env.APPDATA || path.join(os.homedir(), "AppData", "Roaming");
const appDataConfig = path.join(appData, "UpayanDeviceClient", "config.json");

const possiblePaths = [
	appDataConfig,
	path.resolve(process.cwd(), "config.json"),
	path.resolve(process.cwd(), "clients/win/config.json"),
	path.resolve(process.cwd(), "apps/clients/win/config.json"),
];

function findConfigPath(): string | null {
	for (const p of possiblePaths) {
		try {
			if (fs.existsSync(p)) return p;
		} catch (e) {
			// ignore
		}
	}
	return null;
}

export function loadConfig(): Config {
	const p = findConfigPath();
	if (!p)
		throw new Error(
			`Failed to find config.json in any of: ${possiblePaths.join(", ")}`
		);

	try {
		const raw = fs.readFileSync(p, "utf8");
		const parsed = JSON.parse(raw) as Config;
		if (!parsed.deviceId) throw new Error("deviceId missing in config");
		if (!parsed.token) throw new Error("token missing in config");

		const result = {
			topNProcesses: 10,
			intervalSeconds: 10,
			...parsed,
		} as Config;

		if (!result.apiHost) result.apiHost = "https://api.upayan-v5.upayan.dev";

		return result;
	} catch (err) {
		throw new Error(`Failed to load config from ${p}: ${err}`);
	}
}

export function saveConfig(cfg: Partial<Config>) {
	// ensure directory exists for appDataConfig
	const dir = path.dirname(appDataConfig);
	try {
		fs.mkdirSync(dir, { recursive: true });
	} catch (e) {
		// ignore
	}

	let existing: any = {};
	const p = findConfigPath();
	if (p) {
		try {
			existing = JSON.parse(fs.readFileSync(p, "utf8"));
		} catch (e) {
			existing = {};
		}
	}

	const merged = { ...existing, ...cfg };
	fs.writeFileSync(appDataConfig, JSON.stringify(merged, null, 2), "utf8");
}
