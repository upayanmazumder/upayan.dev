import * as vscode from "vscode";
import * as http from "http";
import * as https from "https";
import { URL } from "url";
import * as crypto from "crypto";

function sendPost(
	endpoint: string,
	body: any,
	extraHeaders: Record<string, string> = {}
): Promise<void> {
	return new Promise((resolve, reject) => {
		try {
			const url = new URL(endpoint);
			const data = Buffer.from(JSON.stringify(body));
			const headers: any = Object.assign(
				{
					"Content-Type": "application/json",
					"Content-Length": data.length,
				},
				extraHeaders
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
					res.on("data", () => {});
					res.on("end", () => resolve());
				}
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

	if (!signingKey || signingKey.trim() === "") {
		vscode.window.showErrorMessage(
			"Workspace Reporter disabled: `workspaceReporter.signingKey` is required for secure telemetry."
		);
		return;
	}
	const intervalSeconds =
		config.get<number>("workspaceReporter.intervalSeconds") || 60;

	let workspaceName =
		vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders[0]
			? vscode.workspace.workspaceFolders[0].name
			: vscode.workspace.name || "unknown";

	const durations: Record<string, number> = {};
	let currentFile =
		vscode.window.activeTextEditor?.document.uri.fsPath || "unknown";
	let lastSwitch = Date.now();

	function recordSwitch(newFile: string) {
		const now = Date.now();
		const elapsed = (now - lastSwitch) / 1000;
		if (currentFile) {
			durations[currentFile] = (durations[currentFile] || 0) + elapsed;
		}
		lastSwitch = now;
		currentFile = newFile;
		sendReport("file_switch", { file: currentFile, durations }).catch(() => {});
	}

	function makeHeaders(body: string) {
		const h: Record<string, string> = {};
		try {
			const mac = crypto.createHmac("sha256", signingKey);
			mac.update(body, "utf8");
			const sig = mac.digest("hex");
			h["X-Signature"] = sig;
		} catch (err) {
			console.error("failed to compute signature", err);
		}
		return h;
	}

	function sendReport(event: string, payload: any) {
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
		return sendPost(endpoint, bodyObj, headers);
	}

	const editorChange = vscode.window.onDidChangeActiveTextEditor((editor) => {
		const newFile = editor?.document.uri.fsPath || "unknown";
		recordSwitch(newFile);
	});

	const saveEvent = vscode.workspace.onDidSaveTextDocument((doc) => {
		// send small event on save
		sendReport("file_saved", { file: doc.uri.fsPath }).catch(() => {});
	});

	const folderChange = vscode.workspace.onDidChangeWorkspaceFolders(() => {
		workspaceName =
			vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders[0]
				? vscode.workspace.workspaceFolders[0].name
				: vscode.workspace.name || workspaceName;
		sendReport("workspace_changed", {}).catch(() => {});
	});

	const heartbeat = setInterval(() => {
		sendReport("heartbeat", { durations }).catch(() => {});
	}, Math.max(5, intervalSeconds) * 1000);

	context.subscriptions.push(editorChange, saveEvent, folderChange, {
		dispose: () => clearInterval(heartbeat),
	});

	sendReport("activated", { file: currentFile }).catch(() => {});
}

export function deactivate() {
	// nothing to do here; extensions should have cleaned up via disposables
}
