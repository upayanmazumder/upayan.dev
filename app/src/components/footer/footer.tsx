"use client";

import React, { JSX } from "react";
import footerStyles from "./footer.module.css";
import links from "../../data/links.json";
import { FaGithub, FaDiscord, FaInstagram, FaFacebook, FaLinkedin, FaArrowUp } from "react-icons/fa";

const whitelist = ["Github", "Discord", "Instagram", "Facebook", "LinkedIn"];

const iconDictionary: { [key: string]: JSX.Element } = {
    Github: <FaGithub />,
    Discord: <FaDiscord />,
    Instagram: <FaInstagram />,
    Facebook: <FaFacebook />,
    LinkedIn: <FaLinkedin />
};

const Footer: React.FC = () => {
    const filteredLinks = links.filter(link => whitelist.includes(link.name));

    return (
        <footer className={footerStyles.footer}>
            <div className={footerStyles.footerTop}>
                <div className={footerStyles.column}>
                    <h3>Resources</h3>
                    <ul>
                        <li><a href="https://github.com/upayanmazumder/upayan.dev">Source Code</a></li>
                        <li><a href="/p/privacy-policy">Privacy Policy</a></li>
                        <li><a href="/p/terms-of-service">Terms of Service</a></li>
                    </ul>
                </div>
                <div className={footerStyles.column}>
                    <h3>Companies</h3>
                    <ul>
                        <li><a href="https://bbn.one">BBN</a></li>
                        <li><a href="https://eranodes.com">EraNodes</a></li>
                        <li><a href="https://purbyte.com">Purbyte</a></li>
                    </ul>
                </div>
                <div className={footerStyles.column}>
                    <h3>Projects</h3>
                    <ul>
                        <li><a href="https://www.boardly.in/">Boardly</a></li>
                        <li><a href="https://github.com/upayanmazumder/Collaborative-Article-Sharing">Collaborative Article Sharing</a></li>
                        <li><a href="https://github.com/upayanmazumder/Status-Page">Status Page</a></li>
                    </ul>
                </div>
            </div>
            <div className={footerStyles.footerBottom}>
                <ul className={footerStyles.footerLinks}>
                    {filteredLinks.map((link, index) => (
                        <li key={index}>
                            <a href={link.url} target="_blank" rel="noopener noreferrer">
                                {iconDictionary[link.name]}
                            </a>
                        </li>
                    ))}
                </ul>
                <ul className={footerStyles.toTop}>
                    <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <FaArrowUp />
                    </button>
                </ul>
            </div>
        </footer>
    );
};

export default Footer;
