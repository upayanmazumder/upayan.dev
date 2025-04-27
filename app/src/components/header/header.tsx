"use client";

import Link from "next/link";
import styles from "./header.module.css";
import { ThemeSelector } from "../theme/theme";
import GitHubSponsor from "../githubsponsor/githubsponsor";
import sidebarData from "../../data/navigation.json";
import * as Icons from "react-icons/bs";

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
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
