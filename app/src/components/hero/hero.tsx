// filepath: d:\upayanmazumder\upayan.dev\app\src\components\hero\hero.tsx
"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import heroStyles from "./hero.module.css";
import Image from "next/image";
import technologies from "../../data/technologies.json";
import officialLinks from "../../data/links.json";
import Activity from "./activity/activity";

const whitelist = [
  "IIT-Madras",
  "Devfolio",
  "Leetcode",
  "Microsoft Learn",
  "Gravatar",
  "Kaggle",
];

const techVariants = {
  hidden: { opacity: 0, color: "transparent" },
  visible: (index: number) => ({
    opacity: 1,
    color: technologies[index].textColor,
    backgroundColor: technologies[index].backgroundColor,
    transition: { delay: index * 0.05, duration: 0.05 },
  }),
};

const Hero: React.FC = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Ensure client-specific logic runs only on the client
  }, []);

  return (
    <div className={heroStyles.hero}>
      <motion.div
        className={heroStyles.branding}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="imageWrapper">
          <Image
            src="/upayan-transparent-cropped.avif"
            alt="Upayan's personal branding logo"
            width={200}
            height={100}
            priority
            className={heroStyles.upayanIcon}
          />
        </div>

        <motion.div
          className={heroStyles.technologies}
          initial="hidden"
          animate="visible"
        >
          {technologies.map((tech, index) => (
            <motion.span
              key={index}
              custom={index}
              variants={techVariants}
              className={heroStyles.technology}
            >
              {tech.name}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>

      {isClient && (
        <motion.div
          className={heroStyles.officialLinks}
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {officialLinks
            .filter((link) => whitelist.includes(link.name))
            .map((link, index) => (
              <motion.button
                key={index}
                onClick={() => window.open(link.url, "_blank", "noopener")}
                style={{
                  color: link.textColor,
                  backgroundColor: link.backgroundColor,
                }}
                className={heroStyles.officialLink}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {link.name}
              </motion.button>
            ))}
        </motion.div>
      )}
      <Activity />
    </div>
  );
};

export default Hero;
