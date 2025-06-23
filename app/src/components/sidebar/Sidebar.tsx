"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
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

const socialIcons: Record<string, React.ElementType> = {
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

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveringEdge, setHoveringEdge] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const isNearRight = e.clientX > window.innerWidth * 0.92;
      setHoveringEdge(isNearRight);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      <motion.div
        className={styles.sidebarTrigger}
        animate={{ x: hoveringEdge || isOpen ? 0 : "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={() => setIsOpen(true)}
        ref={sidebarRef}
      >
        <Image
          src="/sidebar.svg"
          alt="Sidebar"
          width={48}
          height={96}
          className={styles.sidebarImage}
        />
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className={styles.overlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            <motion.aside
              className={styles.sidebarPanel}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", ease: "easeInOut", duration: 0.4 }}
            >
              <div className={styles.header}>
                <BsList
                  className={styles.closeIcon}
                  onClick={() => setIsOpen(false)}
                />
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
              </div>

              <nav className={styles.nav}>
                {sidebarData.map((item, index) => {
                  const Icon = Icons[item.icon as keyof typeof Icons];
                  return (
                    <Link
                      key={index}
                      href={item.href}
                      className={styles.link}
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon className={styles.icon} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className={styles.social}>
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
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.socialLink}
                      >
                        <Icon className={styles.icon} />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
