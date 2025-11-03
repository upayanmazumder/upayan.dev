"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Breadcrumb from "./breadcrumb/BreadCrumb";
import GitHubButton from "./githubbutton/GithubButton";
import FileContent from "./filecontent/FileContent";
import DirectoryMap from "./directorymap/DirectoryMap";
import djStyles from "./Devjourney.module.css";
import API from "../../utils/api";

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

interface RepoFileContent extends RepoContent {
  content?: string;
  encoding?: string;
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

  const buildDevJourneyUrl = useCallback((path: string = "") => {
    const url = new URL("/devjourney", API);
    if (path) url.searchParams.set("path", path);
    return url.toString();
  }, []);

  const requestDevJourney = useCallback(
    async (path: string = ""): Promise<RepoContent[] | RepoFileContent> => {
      const response = await fetch(buildDevJourneyUrl(path));

      if (!response.ok) {
        let details = "Unknown error";
        try {
          const payload = await response.json();
          if (typeof payload?.error === "string") details = payload.error;
        } catch {
          /* ignore JSON parse errors */
        }
        throw new Error(details);
      }

      return response.json();
    },
    [buildDevJourneyUrl]
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      const repoPath = pathname.replace("/devjourney", "").replace(/^\//, "");

      try {
        const result = await requestDevJourney(repoPath);

        if (Array.isArray(result)) {
          setData(result);
          setFileContent(null);
        } else if (result.type === "file") {
          const file = result as RepoFileContent;
          const decodedContent =
            typeof file.content === "string" && file.encoding === "base64"
              ? atob(file.content)
              : file.content ?? "";
          setData([]);
          setFileContent({ name: file.name, content: decodedContent });
        } else {
          setData([]);
          setFileContent(null);
          setError("Unsupported DevJourney content type.");
        }
      } catch (err: unknown) {
        setData([]);
        setFileContent(null);
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
  }, [pathname, requestDevJourney]);

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
