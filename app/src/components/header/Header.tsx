"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import styles from "./Header.module.css";
import sidebarData from "../../data/navigation.json";
import * as Icons from "react-icons/bs";

type IconName = keyof typeof Icons;
interface SidebarItem {
  label: string;
  href: string;
  icon: IconName;
}

const Header = () => {
  const pathname = usePathname();

  const handleClick = (href: string) => (e: React.MouseEvent) => {
    if (href === "/" && pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <header className={styles.header}>
      <Link
        href="/"
        className={`${styles.branding} ${styles.left}`}
        onClick={handleClick("/")}
      >
        <Image
          src="/upayan-transparent.webp"
          alt="Logo"
          className={styles.logo}
          width={63}
          height={63}
        />
        <h1 className={styles.title}>Upayan</h1>
      </Link>

      <nav
        className={styles.right}
        role="navigation"
        aria-label="Main navigation"
      >
        {(sidebarData as SidebarItem[]).map((item, index) => {
          const Icon = Icons[item.icon];
          const isActive = pathname === item.href;

          return (
            <Link
              key={index}
              href={item.href}
              onClick={handleClick(item.href)}
              className={`${styles.link} ${isActive ? styles.active : ""}`}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className={styles.icon} />
              <span className={styles.label}>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </header>
  );
};

export default Header;
