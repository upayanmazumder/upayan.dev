"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const winston_1 = __importDefault(require("winston"));
const router = express_1.default.Router();
const repoOwner = process.env.DEVJOURNEY_REPO_OWNER ?? "upayanmazumder";
const repoName = process.env.DEVJOURNEY_REPO_NAME ?? "DevJourney";
const githubToken = process.env.GITHUB_TOKEN;
const baseUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents`;
const buildGithubUrl = (requestedPath) => {
    if (!requestedPath)
        return baseUrl;
    // Decode the path first (in case it comes URL-encoded from the client)
    // Then split and re-encode each segment properly for GitHub API
    const decodedPath = decodeURIComponent(requestedPath);
    const normalizedPath = decodedPath
        .split("/")
        .filter(Boolean)
        .map((segment) => encodeURIComponent(segment))
        .join("/");
    return `${baseUrl}/${normalizedPath}`;
};
router.get("/", async (req, res) => {
    // Express automatically decodes query parameters
    const requestedPath = typeof req.query.path === "string" ? req.query.path : undefined;
    const githubUrl = buildGithubUrl(requestedPath);
    winston_1.default.info(`DevJourney request: path="${requestedPath || "/"}"`);
    try {
        const response = await fetch(githubUrl, {
            headers: {
                Accept: "application/vnd.github.v3+json",
                "User-Agent": "upayan.dev-devjourney-proxy",
                ...(githubToken ? { Authorization: `token ${githubToken}` } : {}),
            },
        });
        if (!response.ok) {
            winston_1.default.error(`GitHub API error: status=${response.status}, path="${requestedPath || "/"}"`);
            // Internal GitHub URL and raw upstream error body are logged, not
            // returned to the client - the previous version leaked both.
            res.status(response.status).json({
                error: "Failed to fetch DevJourney data from GitHub.",
                status: response.status,
            });
            return;
        }
        const payload = await response.json();
        winston_1.default.info(`DevJourney success: path="${requestedPath || "/"}", items=${Array.isArray(payload) ? payload.length : "file"}`);
        res.status(200).json(payload);
    }
    catch (error) {
        winston_1.default.error(`Error handling request to '/devjourney': ${error instanceof Error ? error.message : "Unknown error"}, path="${requestedPath || "/"}"`);
        res.status(500).json({ error: "Unexpected error while fetching DevJourney data." });
    }
});
exports.default = router;
