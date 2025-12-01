import fs from "fs";
import path from "path";

export type Config = {
	deviceId: string;
	token: string;
	apiHost: string;
	topNProcesses?: number;
	intervalSeconds?: number;
};

const configPath = path.resolve(process.cwd(), "apps/clients/win/config.json");

export function loadConfig(): Config {
	try {
		const raw = fs.readFileSync(configPath, "utf8");
		const parsed = JSON.parse(raw) as Config;
		if (!parsed.deviceId) throw new Error("deviceId missing in config");
		if (!parsed.token) throw new Error("token missing in config");
		return {
			topNProcesses: 10,
			intervalSeconds: 10,
			...parsed,
		} as Config;
	} catch (err) {
		throw new Error(`Failed to load config from ${configPath}: ${err}`);
	}
}
