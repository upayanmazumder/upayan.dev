**Workspace Reporter** — VS Code extension

Reports lightweight workspace activity (workspace name, active file, durations, heartbeats) to a configurable backend endpoint. This README covers development, packaging, local distribution, and optional CI/publishing.

**Quick Links**

- Source repository: https://github.com/upayanmazumder/upayan.dev
- Extension folder: `vscode-extension`

Requirements

- `pnpm` (recommended) or a compatible Node package manager
- `code` CLI (for installing `.vsix` locally) — ensure `code --version` works

Developer quick start

1. Install and build:

```bash
cd vscode-extension
pnpm install
pnpm run build
```

2. Run in the Extension Development Host for debugging:

- Open the folder in VS Code and press F5 (Launch Extension Development Host)

Configuration (user-level)

- `workspaceReporter.endpoint` — Backend URL to receive telemetry (default: `https://api.upayan-v5.upayan.dev/api/activity`).
- `workspaceReporter.signingKey` — REQUIRED: HMAC signing secret used to compute `X-Signature` for POSTs.
- `workspaceReporter.intervalSeconds` — Heartbeat interval in seconds (default: `60`).

Set these at the _User_ level (File → Preferences → Settings) to keep the same configuration across workspaces. To sync settings across machines enable VS Code Settings Sync.

Local packaging & installation

1. Package the extension into a VSIX file:

```bash
cd vscode-extension
pnpm run package:out
```

Output: `dist/extension.vsix`.

2. Install the VSIX locally for the current user:

```bash
code --install-extension ./dist/extension.vsix --force
```

Distribute the generated `dist/extension.vsix` to other machines and run the same `code --install-extension` command.

Fast development loop (auto package + reinstall)
Run the provided live watcher which rebuilds, repackages and reinstalls when `src/` changes:

```bash
cd vscode-extension
pnpm run dev:live
```

Notes:

- Ensure `code` is on your PATH; on Windows it may be `"C:\\Program Files\\Microsoft VS Code\\bin\\code.cmd"`.
- `dev:live` depends on `concurrently` and `chokidar-cli` (installed as devDependencies) and will repackage and reinstall on file changes.

Packaging notes

- `vsce` is used to create the `.vsix` bundle. If `vsce` prompts interactively during packaging, ensure `package.json` contains `repository` and `license` fields and that a `LICENSE` file exists in the extension folder.
- The `publisher` field in `package.json` must match your Marketplace publisher if you later publish.

Private distribution vs Marketplace

- Installing the `.vsix` makes the extension available across all workspaces for that VS Code user on that machine.
- To deliver automatic updates across machines, publish to the Visual Studio Marketplace (recommended) or use an internal update mechanism.

Optional: publish to Visual Studio Marketplace

1. Create a publisher at https://marketplace.visualstudio.com/manage (publisher name must match `publisher` in `package.json`).
2. Create a Personal Access Token (PAT) in Azure DevOps with Marketplace (Manage) scope.
3. Login then publish using `vsce`:

```bash
npx vsce login <publisher-name>
# paste PAT
npx vsce publish minor
```

CI/CD: example GitHub Action to publish on tag
Save `VSCE_PAT` as a repository secret and add a workflow `.github/workflows/publish.yml`:

```yaml
name: Publish Extension
on:
	push:
		tags: ['v*']
jobs:
	publish:
		runs-on: ubuntu-latest
		steps:
			- uses: actions/checkout@v4
			- uses: pnpm/action-setup@v2
				with:
					version: 7
			- run: pnpm install
			- run: npx vsce publish --pat ${{ secrets.VSCE_PAT }}
```

Telemetry payload (backend expectations)
The extension sends JSON to `workspaceReporter.endpoint`. Example:

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

The server MUST verify an `X-Signature` HMAC-SHA256 header computed with the shared signing key.

Security

- Keep `workspaceReporter.signingKey` secret. Do not commit it.
- Use a long random secret (>= 32 bytes) for HMAC.

Troubleshooting

- Packaging fails with prompts: add `repository` and `license` to `package.json` and include `LICENSE` file in the extension folder.
- `code` CLI not found: ensure VS Code's `bin` folder is on PATH, or use the full path to `code.cmd` on Windows.
- Extension disabled: open View → Output and choose the extension's output channel to see why the extension was disabled (commonly a missing signing key).

Developer tips

- Bump the `version` in `package.json` before packaging/publishing to avoid caching issues.
- Use `npx vsce package -o ./dist/extension.vsix` to create a VSIX without the helper scripts.

License
MIT
