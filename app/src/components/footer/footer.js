"use client";

import React from 'react';
import Link from 'next/link';
import packageJson from '../../../../package.json';
import footerStyles from './footer.module.css';

const Footer = () => {
  return (
    <div className={footerStyles.footer}>
      <Link href="/p/terms-of-service">Terms of Service</Link>
      <span>  |  </span>
      <Link href="/p/privacy-policy">Privacy Policy</Link>
      <div>&copy; 2024 Upayan v{packageJson.version}</div>
    </div>
  );
};

export default Footer;