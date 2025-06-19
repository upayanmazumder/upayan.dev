"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BsList } from "react-icons/bs";
import * as Icons from "react-icons/bs";
import sidebarData from "../../data/navigation.json";
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
      setVisible(false);
      setInitialLoadComplete(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (open || !initialLoadComplete) return;

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

  return (
    <>
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
          </nav>
        </div>
      </aside>

      {open && <div className={styles.overlay} onClick={toggle} />}
    </>
  );
};

export default Sidebar;
