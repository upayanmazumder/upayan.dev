"use client";
import { BsGithub } from "react-icons/bs";
import githubButtonStyles from "./GithubButton.module.css"

const GitHubButton = ({ pathname, repoOwner, repoName }) => {
  const repoPath = pathname.replace("/devjourney", "").replace(/^\//, "");
  const githubUrl = `https://github.com/${repoOwner}/${repoName}/tree/main/${repoPath}`;

  return (
    <div className={githubButtonStyles.githubButtonContainer}>
      <button onClick={() => window.open(githubUrl, "_blank", "noopener,noreferrer")}>
        <BsGithub /> View this page on GitHub
      </button>
    </div>
  );
};

export default GitHubButton;
