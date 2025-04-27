"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BsList } from "react-icons/bs";
import * as Icons from "react-icons/bs";
import sidebarData from "../../data/navigation.json";
import styles from "./Sidebar.module.css";
import { ThemeSelector } from "../theme/Theme";
import GitHubSponsor from "../githubsponsor/GithubSponsor";

const Sidebar = () => {
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen(!open);

  const handleLinkClick = () => {
    setOpen(false);
  };

  return (
    <>
      <div className={styles.hamburger} onClick={toggle}>
        <BsList />
      </div>

      <aside className={`${styles.sidebar} ${open ? styles.open : ""}`}>
        <nav className={styles.nav}>
          {sidebarData.map((item, index) => {
            const Icon = Icons[item.icon as keyof typeof Icons];
            return (
              <Link
                key={index}
                href={item.href}
                className={styles.link}
                onClick={handleLinkClick}
              >
                <Icon className={styles.icon} />
                <span className={styles.label}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <ul className={styles.bottom}>
          <GitHubSponsor />
          <ThemeSelector />
        </ul>
      </aside>

      {open && <div className={styles.overlay} onClick={toggle} />}
    </>
  );
};

export default Sidebar;
