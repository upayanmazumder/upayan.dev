import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
	const config = vscode.workspace.getConfiguration();
	const serverUrl: string = config.get("upayan.serverUrl") || "";
	const apiKey: string = config.get("upayan.apiKey") || "";
	const deviceId: string = config.get("upayan.deviceId") || "vscode-client";

	if (!serverUrl || !apiKey) {
		console.log(
			"Upayan Activity Client: serverUrl or apiKey not configured, skipping auto-reporting"
		);
		return;
	}

	// send a heartbeat with active editor info every 30s
	const send = async () => {
		const editor = vscode.window.activeTextEditor;
		const payload: any = { deviceId };
		if (editor) {
			payload.extra = {
				file: editor.document.uri.toString(),
				language: editor.document.languageId,
				isDirty: editor.document.isDirty,
			};
		}

		try {
			await fetch(serverUrl, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${apiKey}`,
				},
				body: JSON.stringify(payload),
			});
		} catch (err) {
			console.error("Upayan Activity Client: failed to send activity", err);
		}
	};

	const interval = setInterval(send, 30000);
	// send once immediately
	send();

	context.subscriptions.push({ dispose: () => clearInterval(interval) });
}

export function deactivate() {}
