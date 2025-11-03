import express from "express";
import type { Request, Response } from "express";
import logger from "winston";

const router = express.Router();

const repoOwner = process.env.DEVJOURNEY_REPO_OWNER ?? "upayanmazumder";
const repoName = process.env.DEVJOURNEY_REPO_NAME ?? "DevJourney";
const githubToken = process.env.GITHUB_TOKEN;
const baseUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents`;

const buildGithubUrl = (requestedPath: string | undefined): string => {
  if (!requestedPath) return baseUrl;
  
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

router.get("/", async (req: Request, res: Response): Promise<void> => {
  // Express automatically decodes query parameters
  const requestedPath = typeof req.query.path === "string" ? req.query.path : undefined;
  const githubUrl = buildGithubUrl(requestedPath);

  logger.info(`DevJourney request: path="${requestedPath || "/"}" -> GitHub URL="${githubUrl}"`);

  try {
    const response = await fetch(githubUrl, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "upayan.dev-devjourney-proxy",
        ...(githubToken ? { Authorization: `token ${githubToken}` } : {}),
      },
    });

    if (!response.ok) {
      const details = await response.text();
      logger.error(
        `GitHub API error: status=${response.status}, path="${requestedPath || "/"}", url="${githubUrl}"`
      );
      res.status(response.status).json({
        error: "Failed to fetch DevJourney data from GitHub.",
        status: response.status,
        details,
        requestedPath,
        githubUrl,
      });
      return;
    }

    const payload = await response.json();
    logger.info(`DevJourney success: path="${requestedPath || "/"}", items=${Array.isArray(payload) ? payload.length : 'file'}`);
    res.status(200).json(payload);
  } catch (error) {
    logger.error(
      `Error handling request to '/devjourney': ${error instanceof Error ? error.message : "Unknown error"}, path="${requestedPath || "/"}"`
    );
    res.status(500).json({
      error: "Unexpected error while fetching DevJourney data.",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
