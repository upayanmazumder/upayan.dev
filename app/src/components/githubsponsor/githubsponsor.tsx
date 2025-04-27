import React from "react";
import githubSponsorStyles from "./GithubSponsor.module.css";

const GitHubSponsor: React.FC = () => {
  return (
    <div>
      <iframe
        src="https://github.com/sponsors/upayanmazumder/button"
        title="Sponsor upayanmazumder"
        height="32"
        width="114"
        className={githubSponsorStyles.githubSponsor}
      />
    </div>
  );
};

export default GitHubSponsor;
