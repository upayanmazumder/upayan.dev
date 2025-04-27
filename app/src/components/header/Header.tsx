"use client";

import Link from "next/link";
import styles from "./Header.module.css";
import sidebarData from "../../data/navigation.json";
import * as Icons from "react-icons/bs";

const Header = () => {
  return (
    <header className={styles.header}>
      <Link className={`${styles.branding} ${styles.left}`} href="/">
        <img
          src="/upayan-transparent.webp"
          alt="Logo"
          className={styles.logo}
        />
        <h1 className={styles.title}>Upayan</h1>
      </Link>
      <div className={styles.right}>
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
    </header>
  );
};

export default Header;
