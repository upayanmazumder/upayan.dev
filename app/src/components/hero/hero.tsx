"use client"

import React from 'react';
import { motion } from 'framer-motion';
import heroStyles from "./hero.module.css";
import Image from "next/image";
import technologies from "../../data/technologies.json";
import officialLinks from "../../data/links.json";
import Activity from "../activity/activity";

const whitelist = ["IIT-Madras", "Devfolio", "Leetcode", "Microsoft Learn", "Gravatar"];

const Hero: React.FC = () => {
    return (
        <div className={heroStyles.hero}>
            <motion.ul 
                className={heroStyles.branding}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                <Image src="/upayan-transparent.svg" alt="logo" width={100} height={100} />
                <motion.ul 
                    className={heroStyles.technologies}
                    initial={{ x: -100 }}
                    animate={{ x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {technologies.map((technology, index) => (
                        <li 
                            key={index} 
                            style={{ color: technology.textColor, backgroundColor: technology.backgroundColor }} 
                            className={heroStyles.technology}
                        >
                            {technology.name}
                        </li>
                    ))}
                </motion.ul>
            </motion.ul>
            <motion.ul 
                className={heroStyles.officialLinks}
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {officialLinks
                    .filter(link => whitelist.includes(link.name))
                    .map((link, index) => (
                        <motion.button 
                            key={index} 
                            onClick={() => window.open(link.url, "_blank", "noopener")} 
                            style={{ color: link.textColor, backgroundColor: link.backgroundColor }} 
                            className={heroStyles.officialLink}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            {link.name}
                        </motion.button>
                ))}
            </motion.ul>
            <Activity/>
        </div>
    );
};

export default Hero;