"use client";

import Link from "next/link";
import styles from "./Header.module.css";
import { ThemeSelector } from "../theme/Theme";
import GitHubSponsor from "../githubsponsor/GithubSponsor";
import sidebarData from "../../data/navigation.json";
import * as Icons from "react-icons/bs";

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <a className={styles.branding} href="/">
          <img src="/upayan.svg" alt="Logo" className={styles.logo} />
          <h1 className={styles.title}>Upayan</h1>
        </a>
        {sidebarData.map((item, index) => {
          const Icon = Icons[item.icon as keyof typeof Icons];
          return (
            <Link key={index} href={item.href} className={styles.link}>
              <Icon className={styles.icon} />
              <span className={styles.label}>{item.label}</span>
            </Link>
          );
        })}
      </div>
      <div className={styles.right}>
        <GitHubSponsor />
        <ThemeSelector />
      </div>
    </header>
  );
};

export default Header;
