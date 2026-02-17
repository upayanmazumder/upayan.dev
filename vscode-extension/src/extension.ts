import * as vscode from "vscode";
import * as http from "http";
import * as https from "https";
import { URL } from "url";
import * as crypto from "crypto";
import * as path from "path";

function sendPost(
	endpoint: string,
	body: any,
	extraHeaders: Record<string, string> = {},
): Promise<{ statusCode?: number }> {
	return new Promise((resolve, reject) => {
		try {
			const url = new URL(endpoint);
			const data = Buffer.from(JSON.stringify(body));
			const headers: any = Object.assign(
				{
					"Content-Type": "application/json",
					"Content-Length": data.length,
				},
				extraHeaders,
			);
			const options: any = {
				hostname: url.hostname,
				port: url.port || (url.protocol === "https:" ? 443 : 80),
				path: url.pathname + url.search,
				method: "POST",
				headers,
			};
			const req = (url.protocol === "https:" ? https.request : http.request)(
				options,
				(res) => {
					const statusCode = res.statusCode;
					res.on("data", () => {});
					res.on("end", () => resolve({ statusCode }));
				},
			);
			req.on("error", reject);
			req.write(data);
			req.end();
		} catch (err) {
			reject(err);
		}
	});
}

export function activate(context: vscode.ExtensionContext) {
	const config = vscode.workspace.getConfiguration();
	const endpoint =
		config.get<string>("workspaceReporter.endpoint") ||
		"https://api.upayan-v5.upayan.dev/api/activity";
	let signingKey = config.get<string>("workspaceReporter.signingKey") || "";

	const intervalSeconds =
		config.get<number>("workspaceReporter.intervalSeconds") || 60;

	let workspaceName =
		vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders[0] ?
			vscode.workspace.workspaceFolders[0].name
		:	vscode.workspace.name || "unknown";

	const outputChannel = vscode.window.createOutputChannel("Workspace Reporter");
	const statusBar = vscode.window.createStatusBarItem(
		vscode.StatusBarAlignment.Right,
		100,
	);
	statusBar.command = "workspaceReporter.showStatus";
	statusBar.show();

	// privacy-respecting durations keyed by basename only
	const durations: Record<string, number> = {};
	let currentFile =
		vscode.window.activeTextEditor?.document.fileName ?
			path.basename(vscode.window.activeTextEditor!.document.fileName)
		:	"unknown";
	let lastSwitch = Date.now();

	const stateKey = "workspaceReporter.widgetState";
	const defaultState = {
		counts: {
			fileSwitch: 0,
			fileSaved: 0,
			heartbeat: 0,
			reports: 0,
			failures: 0,
		},
		lastEvent: null as null | {
			event: string;
			file: string;
			time: string;
		},
		lastSend: null as null | {
			ok: boolean;
			time: string;
			statusCode?: number;
			error?: string;
		},
		recentEvents: [] as Array<{
			event: string;
			file: string;
			time: string;
			ok: boolean | null;
			statusCode?: number;
			error?: string;
		}>,
		lastEndpoint: endpoint,
	};

	const state = Object.assign(
		{},
		defaultState,
		context.globalState.get(stateKey),
	);
	state.counts = Object.assign({}, defaultState.counts, state.counts || {});
	state.recentEvents =
		Array.isArray(state.recentEvents) ? state.recentEvents : [];
	state.lastEndpoint = state.lastEndpoint || endpoint;
	updateStatusBar();

	function persistState() {
		void context.globalState.update(stateKey, state);
	}

	function formatTimeLabel(iso: string | null) {
		if (!iso) return "--";
		try {
			return new Date(iso).toLocaleTimeString();
		} catch {
			return iso;
		}
	}

	function updateStatusBar() {
		const lastSend = state.lastSend;
		const lastSendLabel =
			lastSend ?
				lastSend.ok ?
					"OK"
				:	"ERR"
			:	"--";
		const timeLabel = formatTimeLabel(lastSend?.time || null);
		statusBar.text = `WR: ${lastSendLabel} ${timeLabel}`;

		const lastEvent =
			state.lastEvent ?
				`${state.lastEvent.event} (${state.lastEvent.file}) @ ${formatTimeLabel(
					state.lastEvent.time,
				)}`
			:	"--";
		const counts = state.counts;
		const tooltip = new vscode.MarkdownString(
			[
				"**Workspace Reporter**",
				`Endpoint: ${state.lastEndpoint || endpoint}`,
				`Last event: ${lastEvent}`,
				`Last send: ${lastSendLabel} ${timeLabel}`,
				`Counts: switch ${counts.fileSwitch}, save ${counts.fileSaved}, heartbeat ${counts.heartbeat}, failures ${counts.failures}`,
				"Click to open logs",
			].join("\n"),
		);
		statusBar.tooltip = tooltip;
	}

	function appendLog(line: string) {
		outputChannel.appendLine(line);
	}

	type EventEntry = {
		event: string;
		file: string;
		time: string;
		ok: boolean | null;
		statusCode?: number;
		error?: string;
	};

	function recordEvent(event: string, file: string): EventEntry {
		const time = new Date().toISOString();
		state.lastEvent = { event, file, time };
		state.counts.reports += 1;
		if (event === "file_switch") state.counts.fileSwitch += 1;
		if (event === "file_saved") state.counts.fileSaved += 1;
		if (event === "heartbeat") state.counts.heartbeat += 1;

		const entry: EventEntry = {
			event,
			file,
			time,
			ok: null as boolean | null,
		};
		state.recentEvents.push(entry);
		if (state.recentEvents.length > 20) state.recentEvents.shift();
		persistState();
		updateStatusBar();
		return entry;
	}

	function recordSendResult(
		ok: boolean,
		entry: EventEntry,
		statusCode?: number,
		error?: string,
	) {
		entry.ok = ok;
		if (statusCode) entry.statusCode = statusCode;
		if (error) entry.error = error;
		state.lastSend = {
			ok,
			time: new Date().toISOString(),
			statusCode,
			error,
		};
		if (!ok) state.counts.failures += 1;
		persistState();
		updateStatusBar();
		appendLog(
			`${state.lastSend.time} ${ok ? "OK" : "ERR"} ${entry.event} ${
				entry.file
			}${statusCode ? " status=" + statusCode : ""}${
				error ? " error=" + error : ""
			}`,
		);
	}

	function recordSwitch(newFileFull: string) {
		const newFile = newFileFull ? path.basename(newFileFull) : "unknown";
		const now = Date.now();
		const elapsed = (now - lastSwitch) / 1000;
		if (currentFile) {
			durations[currentFile] = (durations[currentFile] || 0) + elapsed;
		}
		lastSwitch = now;
		currentFile = newFile;
		// non-blocking
		sendReport("file_switch", { file: currentFile, durations }).catch(() => {});
	}

	function makeHeaders(body: string) {
		const h: Record<string, string> = {};
		try {
			if (signingKey && signingKey.trim() !== "") {
				const mac = crypto.createHmac("sha256", signingKey);
				mac.update(body, "utf8");
				const sig = mac.digest("hex");
				h["X-Signature"] = sig;
			}
		} catch (err) {
			console.error("failed to compute signature", err);
		}
		return h;
	}

	function sendReport(event: string, payload: any) {
		// ensure we send only basenames and sanitized fields
		const bodyObj = {
			workspaceName,
			event,
			file: payload.file || currentFile,
			durations: payload.durations || durations,
			timestamp: new Date().toISOString(),
			extra: payload.extra || {},
		};
		const bodyStr = JSON.stringify(bodyObj);
		const headers = makeHeaders(bodyStr);
		state.lastEndpoint = endpoint;
		const entry = recordEvent(event, bodyObj.file);
		return sendPost(endpoint, bodyObj, headers)
			.then((res) => {
				recordSendResult(true, entry, res.statusCode);
				return res;
			})
			.catch((err) => {
				recordSendResult(false, entry, undefined, err?.message || String(err));
				throw err;
			});
	}

	// Track editor switches (sanitized)
	const editorChange = vscode.window.onDidChangeActiveTextEditor((editor) => {
		const newFileFull = editor?.document.fileName || "unknown";
		recordSwitch(newFileFull);
	});

	const saveEvent = vscode.workspace.onDidSaveTextDocument((doc) => {
		sendReport("file_saved", { file: path.basename(doc.fileName) }).catch(
			() => {},
		);
	});

	const folderChange = vscode.workspace.onDidChangeWorkspaceFolders(() => {
		workspaceName =
			(
				vscode.workspace.workspaceFolders &&
				vscode.workspace.workspaceFolders[0]
			) ?
				vscode.workspace.workspaceFolders[0].name
			:	vscode.workspace.name || workspaceName;
		sendReport("workspace_changed", {}).catch(() => {});
	});

	const heartbeat = setInterval(
		() => {
			sendReport("heartbeat", { durations }).catch(() => {});
		},
		Math.max(5, intervalSeconds) * 1000,
	);

	context.subscriptions.push(editorChange, saveEvent, folderChange, {
		dispose: () => clearInterval(heartbeat),
	});

	sendReport("activated", { file: currentFile }).catch(() => {});

	// Command: gather a privacy-safe summary and POST it
	const cmd = vscode.commands.registerCommand(
		"workspaceReporter.sendSanitizedSummary",
		async () => {
			try {
				const summary = await gatherSanitizedSummary();
				const bodyStr = JSON.stringify({
					workspaceName,
					event: "sanitized_summary",
					summary,
					timestamp: new Date().toISOString(),
				});
				const headers = makeHeaders(bodyStr);
				await sendPost(
					endpoint,
					{
						workspaceName,
						event: "sanitized_summary",
						summary,
						timestamp: new Date().toISOString(),
					},
					headers,
				);
				vscode.window.showInformationMessage(
					"Sanitized summary sent successfully.",
				);
			} catch (err: any) {
				console.error(err);
				vscode.window.showErrorMessage(
					"Failed to send sanitized summary: " + (err.message || String(err)),
				);
			}
		},
	);

	const showStatusCmd = vscode.commands.registerCommand(
		"workspaceReporter.showStatus",
		() => {
			updateStatusBar();
			outputChannel.show(true);
			appendLog(
				`${new Date().toISOString()} STATUS lastEvent=${
					state.lastEvent ?
						`${state.lastEvent.event} ${state.lastEvent.file}`
					:	"--"
				} lastSend=${
					state.lastSend ?
						state.lastSend.ok ?
							"OK"
						:	"ERR"
					:	"--"
				}`,
			);
		},
	);

	context.subscriptions.push(cmd, showStatusCmd, outputChannel, statusBar);
}

export function deactivate() {
	// nothing to do here; extensions should have cleaned up via disposables
}

// Helper: build a privacy-safe summary of the open workspace(s)
async function gatherSanitizedSummary() {
	const folders = vscode.workspace.workspaceFolders?.map((f) => f.name) || [];

	// top-level manifests to check for, report names only
	const manifests = [
		"package.json",
		"go.mod",
		"tsconfig.json",
		"pyproject.toml",
		"Cargo.toml",
	];
	const manifestsFound: string[] = [];

	// count common language files (limit globs for performance)
	const exts = ["ts", "js", "go", "py", "rs", "java", "md", "json"];
	const counts: Record<string, number> = {};
	for (const e of exts) counts[e] = 0;

	// find top N largest files (exclude node_modules, .git)
	const files = await vscode.workspace.findFiles(
		"**/*",
		"**/{node_modules,.git,dist,build}/**",
		200,
	);

	// compute sizes for files with selected extensions and capture top N
	const sizeList: { name: string; size: number }[] = [];
	for (const uri of files) {
		const ext = path.extname(uri.path).replace(".", "").toLowerCase();
		if (exts.includes(ext)) {
			counts[ext] = (counts[ext] || 0) + 1;
		}
		try {
			const stat = await vscode.workspace.fs.stat(uri);
			sizeList.push({ name: path.basename(uri.path), size: stat.size });
		} catch (e) {
			// ignore stat errors
		}
	}

	sizeList.sort((a, b) => b.size - a.size);
	const topLargest = sizeList
		.slice(0, 10)
		.map((s) => ({ name: s.name, size: humanFileSize(s.size) }));

	// open editors
	const openEditors = vscode.window.visibleTextEditors.map((e) => ({
		fileName: path.basename(e.document.fileName),
		language: e.document.languageId,
	}));

	// parse git info (if built-in git extension is available)
	const gitExt = vscode.extensions.getExtension("vscode.git")?.exports;
	const gitInfo: any[] = [];
	try {
		if (gitExt) {
			const api = gitExt.getAPI(1);
			for (const repo of api.repositories) {
				const head = repo.state.HEAD?.name || null;
				const remotes = repo.state.remotes.map((r: any) =>
					parseRemoteUrl(r.fetchUrl || r.pushUrl || r.url || ""),
				);
				gitInfo.push({ head, remotes });
			}
		}
	} catch (e) {
		// ignore git parsing errors
	}

	// detect which manifests exist at workspace root(s)
	if (vscode.workspace.workspaceFolders) {
		for (const wf of vscode.workspace.workspaceFolders) {
			for (const m of manifests) {
				try {
					const fileUri = vscode.Uri.joinPath(wf.uri, m);
					// stat will throw if missing — await inside try/catch
					await vscode.workspace.fs.stat(fileUri);
					manifestsFound.push(m);
				} catch (e) {
					// ignore missing files or stat errors
				}
			}
		}
	}

	return {
		folders,
		manifests: Array.from(new Set(manifestsFound)),
		fileCounts: counts,
		topLargest,
		openEditors,
		gitInfo,
	};
}

function parseRemoteUrl(raw: string) {
	// return host and owner/repo if possible, but no credentials or full paths
	if (!raw) return null;
	// examples: git@github.com:owner/repo.git or https://github.com/owner/repo.git
	try {
		if (raw.startsWith("git@")) {
			// git@github.com:owner/repo.git
			const parts = raw.split(":");
			const host = parts[0].replace("git@", "");
			const repo = parts[1].replace(/\.git$/, "");
			const [owner, name] = repo.split("/");
			return { host, owner, name };
		}
		const u = new URL(raw);
		const host = u.hostname;
		const segs = u.pathname
			.replace(/^\//, "")
			.replace(/\.git$/, "")
			.split("/");
		const owner = segs[0] || null;
		const name = segs[1] || null;
		return { host, owner, name };
	} catch (e) {
		return null;
	}
}

function humanFileSize(size: number) {
	if (size <= 0) return "0 B";
	const i = Math.floor(Math.log(size) / Math.log(1024));
	const units = ["B", "KB", "MB", "GB", "TB"];
	return (size / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1) + " " + units[i];
}
