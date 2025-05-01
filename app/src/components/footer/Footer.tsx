"use client";

import React, { JSX } from "react";
import footerStyles from "./Footer.module.css";
import links from "../../data/links.json";
import {
  FaGithub,
  FaDiscord,
  FaInstagram,
  FaFacebook,
  FaLinkedin,
  FaArrowUp,
} from "react-icons/fa";
import { ThemeSelector } from "../theme/Theme";
import GitHubSponsor from "../githubsponsor/GithubSponsor";

const whitelist = ["Github", "Discord", "Instagram", "Facebook", "LinkedIn"];

const iconDictionary: { [key: string]: JSX.Element } = {
  Github: <FaGithub />,
  Discord: <FaDiscord />,
  Instagram: <FaInstagram />,
  Facebook: <FaFacebook />,
  LinkedIn: <FaLinkedin />,
};

const Footer: React.FC = () => {
  const filteredLinks = links.filter((link) => whitelist.includes(link.name));

  return (
    <footer className={footerStyles.footer}>
      <ul className={footerStyles.footerLinks}>
        {filteredLinks.map((link, index) => (
          <a key={index} href={link.url} target="_blank" rel="noopener">
            {iconDictionary[link.name]}
          </a>
        ))}
      </ul>
      <ul className={footerStyles.helper}>
        <li>
          <GitHubSponsor />
        </li>
        <li>
          <button title="Change theme">
            <ThemeSelector />
          </button>
        </li>
        <li>
          <button
            title="Scroll to top"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <FaArrowUp />
          </button>
        </li>
      </ul>
    </footer>
  );
};

export default Footer;
