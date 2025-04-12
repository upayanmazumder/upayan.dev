"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { BsList } from "react-icons/bs";
import * as Icons from "react-icons/bs";
import sidebarData from "../../data/navigation.json";
import styles from "./sidebar.module.css";
import { ThemeSelector } from "../theme/theme";
import GitHubSponsor from "../githubsponsor/githubsponsor";

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const toggle = () => setOpen(!open);

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      if (sidebarRef.current) {
        const sidebarWidth = sidebarRef.current.offsetWidth;
        setCollapsed(sidebarWidth < 160); // adjust this value as needed
      }
    });

    if (sidebarRef.current) {
      observer.observe(sidebarRef.current);
    }

    return () => {
      if (sidebarRef.current) {
        observer.unobserve(sidebarRef.current);
      }
    };
  }, []);

  return (
    <>
      <div className={styles.hamburger} onClick={toggle}>
        <BsList />
      </div>

      <aside
        ref={sidebarRef}
        className={`${styles.sidebar} ${open ? styles.open : ""} ${
          collapsed ? styles.collapsed : ""
        }`}
      >
        <nav className={styles.nav}>
          {sidebarData.map((item, index) => {
            const Icon = Icons[item.icon as keyof typeof Icons];
            return (
              <Link
                key={index}
                href={item.href}
                className={styles.link}
                onClick={() => setOpen(false)}
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
