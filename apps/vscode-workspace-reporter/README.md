Workspace Reporter VS Code extension

This extension reports basic workspace activity (workspace name, active file, durations, heartbeat) to a configured backend telemetry endpoint.

Requirements

- A signing key (shared secret) is mandatory. Configure it in the extension settings as `workspaceReporter.signingKey` (or provide a local file path via `workspaceReporter.signingKeyFile`). The extension will deactivate if a signing key is not provided.

Quick start

1. In the extension folder run:

```bash
cd apps/vscode-workspace-reporter
pnpm install
pnpm run build
```

2. Configure the extension settings (File → Preferences → Settings → Extensions → Workspace Reporter):

- `workspaceReporter.endpoint` — Backend URL to receive telemetry (default: `https://api.upayan-v5.upayan.dev/api/activity`).
- `workspaceReporter.signingKey` — REQUIRED: HMAC signing secret used to compute `X-Signature` for each POST.
- `workspaceReporter.intervalSeconds` — Heartbeat interval in seconds (default: 60).

3. Run the extension in the Extension Development Host or package and install the VSIX.

Packaging

To produce a VSIX (requires `pnpm`):

```bash
cd apps/vscode-workspace-reporter
pnpm install
pnpm run package
```

This uses `vsce` to create a `.vsix` you can install via `Extensions: Install from VSIX...`.

Backend notes

- The backend must validate the HMAC-SHA256 `X-Signature` header. In the server, set `SIGNING_KEY` (env) to the same secret used by the extension.
- The backend endpoint expected by default is `https://api.upayan-v5.upayan.dev/api/activity` and accepts POST telemetry JSON in the format:

```json
{
	"workspaceName": "...",
	"event": "activated|heartbeat|file_switch|file_saved|workspace_changed",
	"file": "...",
	"durations": { "/path/to/file": 123.4 },
	"timestamp": "2026-01-05T...Z",
	"extra": {}
}
```

Security

- Use a long random secret for `workspaceReporter.signingKey` and `SIGNING_KEY` (server). Do not commit secrets into source control.

Troubleshooting

- If telemetry is not sent, confirm the signing key is set; the extension will show an error and disable itself if the signing key is missing.
- Use the `workspaceReporter.endpoint` setting to point to a local dev backend during testing.

License

MIT
