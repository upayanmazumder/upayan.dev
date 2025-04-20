"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import Breadcrumb from "./breadcrumb/breadcrumb";
import GitHubButton from "./githubbutton/githubbutton";
import FileContent from "./filecontent/filecontent";
import DirectoryMap from "./directorymap/directorymap";

import djStyles from "./devjourney.module.css";

interface FileContentData {
  name: string;
  content: string;
}

interface RepoContent {
  name: string;
  path: string;
  type: "file" | "dir";
  sha: string;
}

const Repository = () => {
  const [data, setData] = useState<RepoContent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<FileContentData | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const repoOwner = "upayanmazumder";
  const repoName = "DevJourney";

  const fetchRepoContents = async (
    path: string = ""
  ): Promise<RepoContent[] | null> => {
    const token = process.env.GITHUB_TOKEN;
    const headers: Record<string, string> = token
      ? { Authorization: `token ${token}` }
      : {};

    try {
      const response = await fetch(
        `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${path}`,
        { headers }
      );

      if (!response.ok) throw new Error("Failed to fetch repository contents");

      return await response.json();
    } catch (err: unknown) {
      setError(
        `Error fetching repository contents: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
      return null;
    }
  };

  const fetchFileContent = async (path: string): Promise<void> => {
    const token = process.env.GITHUB_TOKEN;
    const headers: Record<string, string> = token
      ? { Authorization: `token ${token}` }
      : {};

    try {
      const response = await fetch(
        `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${path}`,
        { headers }
      );

      if (!response.ok) throw new Error("Failed to fetch file content");

      const result = await response.json();
      if (result.type === "file") {
        setFileContent({ name: result.name, content: atob(result.content) });
      } else {
        setFileContent(null);
        throw new Error("Path is not a file");
      }
    } catch (err: unknown) {
      setError(
        `Error fetching file content: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      const repoPath = pathname.replace("/devjourney", "").replace(/^\//, "");

      try {
        const contents = await fetchRepoContents(repoPath);
        if (Array.isArray(contents)) {
          setData(contents);
          setFileContent(null);
        } else {
          await fetchFileContent(repoPath);
        }
      } catch (err: unknown) {
        setError(
          `Error during data fetching: ${
            err instanceof Error ? err.message : "Unknown error"
          }`
        );
      } finally {
        setLoading(false);
      }
    };

    if (pathname) fetchData();
  }, [pathname]);

  const handleItemClick = (item: RepoContent): void => {
    router.push(`/devjourney/${item.path}`);
  };

  return (
    <div className={djStyles.devjourneyContainer} id="main">
      <Breadcrumb pathname={pathname} />
      <GitHubButton
        pathname={pathname}
        repoOwner={repoOwner}
        repoName={repoName}
      />
      <FileContent fileContent={fileContent} />
      <DirectoryMap
        data={data}
        loading={loading}
        error={error}
        handleItemClick={handleItemClick}
      />
    </div>
  );
};

export default Repository;
