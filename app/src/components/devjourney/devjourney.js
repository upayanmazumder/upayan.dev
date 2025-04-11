"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import Breadcrumb from "./breadcrumb/breadcrumb";
import GitHubButton from "./githubbutton/githubbutton";
import FileContent from "./filecontent/filecontent";
import DirectoryMap from "./directorymap/directorymap";

import djStyles from "./devjourney.module.css";

const Repository = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fileContent, setFileContent] = useState(null);
  const pathname = usePathname();
  const router = useRouter();
  const repoOwner = "upayanmazumder";
  const repoName = "DevJourney";

  const fetchRepoContents = async (path = "") => {
    const token = process.env.GITHUB_TOKEN;
    const headers = token ? { Authorization: `token ${token}` } : {};

    try {
      const response = await fetch(
        `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${path}`,
        { headers }
      );

      if (!response.ok) throw new Error("Failed to fetch repository contents");

      return await response.json();
    } catch (err) {
      setError(`Error fetching repository contents: ${err.message}`);
      return null;
    }
  };

  const fetchFileContent = async (path) => {
    const token = process.env.GITHUB_TOKEN;
    const headers = token ? { Authorization: `token ${token}` } : {};

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
    } catch (err) {
      setError(`Error fetching file content: ${err.message}`);
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
      } catch (err) {
        setError(`Error during data fetching: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (pathname) fetchData();
  }, [pathname]);

  const handleItemClick = (item) => {
    router.push(`/devjourney/${item.path}`);
  };

  return (
    <div className={djStyles.devjourneyContainer} id="main">
      <Breadcrumb pathname={pathname} />
      <GitHubButton pathname={pathname} repoOwner={repoOwner} repoName={repoName} />
      <FileContent fileContent={fileContent} />
      <DirectoryMap data={data} loading={loading} error={error} handleItemClick={handleItemClick} />
    </div>
  );
};

export default Repository;
