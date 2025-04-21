import officialLinks from "../../../data/links.json";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import officialLinksStyles from "./officiallinks.module.css";

const whitelist = [
  "IIT-Madras",
  "Devfolio",
  "Leetcode",
  "Microsoft Learn",
  "Gravatar",
  "Kaggle",
];

export default function OfficialLinks() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <motion.div
      className={officialLinksStyles.officialLinks}
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
            className={officialLinksStyles.officialLink}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {link.name}
          </motion.button>
        ))}
    </motion.div>
  );
}
