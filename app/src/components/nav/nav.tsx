'use client'

import React, { useState } from 'react';
import navigationData from '../../data/navigation.json';
import { BsList } from 'react-icons/bs';
import * as Icons from 'react-icons/bs';
import styles from './nav.module.css';

const Nav = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.hamburger} onClick={toggleMenu}>
        <BsList />
      </div>
      <ul className={`${styles.navMenu} ${menuOpen ? styles.open : ''}`}>
        {navigationData.map((item, index) => {
          const IconComponent = Icons[item.icon as keyof typeof Icons];
          return (
            <li key={index} className={styles.navItem}>
              <a href={item.href} className={styles.navLink}>
                <IconComponent className={styles.navIcon} />
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Nav;
