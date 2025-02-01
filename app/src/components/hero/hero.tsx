"use client"

import React from 'react';
import heroStyles from "./hero.module.css";
import Image from "next/image";
import technologies from "../../data/technologies.json";
import officialLinks from "../../data/links.json";

const whitelist = ["IIT-Madras", "Devfolio", "Leetcode", "Microsoft Learn", "Gravatar"];

const Hero: React.FC = () => {
    return (
        <div className={heroStyles.hero}>
            <ul className={heroStyles.branding}>
                <Image src="/upayan-transparent.svg" alt="logo" width={100} height={100} />
                <ul className={heroStyles.technologies}>
                    {technologies.map((technology, index) => (
                        <li key={index} style={{ color: technology.textColor, backgroundColor: technology.backgroundColor }} className={heroStyles.technology}>
                            {technology.name}
                        </li>
                    ))}
                </ul>
            </ul>
            <ul className={heroStyles.officialLinks}>
                {officialLinks
                    .filter(link => whitelist.includes(link.name))
                    .map((link, index) => (
                        <button key={index} onClick={() => window.open(link.url, "_blank", "noopener")} style={{ color: link.textColor, backgroundColor: link.backgroundColor }} className={heroStyles.officialLink}>
                            {link.name}
                        </button>
                    ))}
            </ul>
        </div>
    );
};

export default Hero;