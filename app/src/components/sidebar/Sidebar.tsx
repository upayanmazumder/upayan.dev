"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BsList } from "react-icons/bs";
import * as Icons from "react-icons/bs";
import {
  BsGithub,
  BsLinkedin,
  BsInstagram,
  BsFacebook,
  BsDiscord,
  BsKanban,
  BsCode,
  BsMortarboard,
  BsAward,
} from "react-icons/bs";
import { SiLeetcode, SiKaggle, SiGravatar } from "react-icons/si";
import sidebarData from "../../data/navigation.json";
import links from "../../data/links.json";
import styles from "./Sidebar.module.css";

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const sidebarRef = React.useRef<HTMLDivElement>(null);
  const [mouseNear, setMouseNear] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = React.useState(false);
  React.useEffect(() => {
    // Initial visibility timer
    const timer = setTimeout(() => {
      if (!open) {
        // Only hide if the menu isn't explicitly opened
        setVisible(false);
      }
      setInitialLoadComplete(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, [open]);

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (open) return; // Only handle mouse movement when menu is closed

      const sidebar = sidebarRef.current;
      if (!sidebar) return;

      // Calculate sidebar position
      const mouseY = e.clientY;
      const windowHeight = window.innerHeight;
      const sidebarHeight = sidebar.offsetHeight;

      // Keep sidebar within screen bounds
      let newY = mouseY - sidebarHeight / 2;
      newY = Math.max(0, Math.min(newY, windowHeight - sidebarHeight));

      sidebar.style.top = `${newY}px`;

      // Check if mouse is in right 10% of screen
      const triggerZone = window.innerWidth * 0.9; // 90% from left = 10% from right
      if (e.clientX > triggerZone) {
        setVisible(true);
        setMouseNear(true);
      } else {
        setMouseNear(false);
        // Only hide if not in open state
        if (!open) {
          setVisible(false);
        }
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [open, initialLoadComplete]);

  const toggle = () => setOpen(!open);

  const handleLinkClick = () => {
    setOpen(false);
    setVisible(false);
  };

  const socialIcons: {
    [key: string]: React.ComponentType<{ className?: string }>;
  } = {
    Github: BsGithub,
    LinkedIn: BsLinkedin,
    Instagram: BsInstagram,
    Facebook: BsFacebook,
    Discord: BsDiscord,
    Leetcode: SiLeetcode,
    Kaggle: SiKaggle,
    Gravatar: SiGravatar,
    "IIT-Madras": BsMortarboard,
    "Microsoft Learn": BsCode,
    Devfolio: BsKanban,
  };

  return (
    <React.Fragment>
      <aside
        ref={sidebarRef}
        className={`${styles.sidebar} ${open ? styles.open : ""} ${
          mouseNear ? styles.expanded : ""
        } ${visible ? styles.visible : styles.hidden}`}
        onClick={() => !open && toggle()}
      >
        <div className={styles.sidebarContent}>
          <div
            className={styles.hamburger}
            onClick={(e) => {
              e.stopPropagation();
              toggle();
            }}
          >
            <BsList />
          </div>
          <div className={styles.branding}>
            <Image
              src="/upayan-transparent.webp"
              alt="Upayan Mazumder"
              width={48}
              height={48}
              className={styles.brandingImage}
            />
            <span className={styles.brandingText}>Upayan Mazumder</span>
          </div>
          <nav className={styles.nav}>
            {sidebarData.map((item, index) => {
              const Icon = Icons[item.icon as keyof typeof Icons];
              return (
                <Link
                  key={index}
                  href={item.href}
                  className={styles.link}
                  onClick={handleLinkClick}
                  style={{
                    transitionDelay: `${index * 0.05}s`,
                  }}
                >
                  <Icon className={styles.icon} />
                  <span className={styles.label}>{item.label}</span>
                </Link>
              );
            })}
          </nav>{" "}
          <div className={styles.bottom}>
            {links
              .filter((item) =>
                [
                  "LinkedIn",
                  "Github",
                  "Discord",
                  "Instagram",
                  "Facebook",
                ].includes(item.name)
              )
              .map((item, index) => {
                const Icon = socialIcons[item.name] || BsAward;
                return (
                  <Link
                    key={index}
                    href={item.url}
                    className={styles.socialLink}
                    onClick={handleLinkClick}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      transitionDelay: `${index * 0.05}s`,
                      background: "rgba(255, 255, 255, 0.03)",
                      color: "antiquewhite",
                    }}
                  >
                    <Icon className={styles.icon} />
                    <span className={styles.label}>{item.name}</span>
                  </Link>
                );
              })}
          </div>
        </div>
      </aside>
      {open && <div className={styles.overlay} onClick={toggle} />}
    </React.Fragment>
  );
};

export default Sidebar;
