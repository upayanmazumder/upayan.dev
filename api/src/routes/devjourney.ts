import express from "express";
import type { Request, Response } from "express";

const router = express.Router();

const repoOwner = process.env.DEVJOURNEY_REPO_OWNER ?? "upayanmazumder";
const repoName = process.env.DEVJOURNEY_REPO_NAME ?? "DevJourney";
const githubToken = process.env.GITHUB_TOKEN;
const baseUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents`;

const buildGithubUrl = (requestedPath: string | undefined): string => {
  const normalizedPath = (requestedPath ?? "")
    .split("/")
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  return normalizedPath ? `${baseUrl}/${normalizedPath}` : baseUrl;
};

router.get("/", async (req: Request, res: Response): Promise<void> => {
  const requestedPath = typeof req.query.path === "string" ? req.query.path : undefined;
  const githubUrl = buildGithubUrl(requestedPath);

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
      res.status(response.status).json({
        error: "Failed to fetch DevJourney data from GitHub.",
        status: response.status,
        details,
      });
      return;
    }

    const payload = await response.json();
    res.status(200).json(payload);
  } catch (error) {
    res.status(500).json({
      error: "Unexpected error while fetching DevJourney data.",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
