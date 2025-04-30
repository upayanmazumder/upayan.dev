import officialLinks from "../../../data/links.json";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import officialLinksStyles from "./OfficialLinks.module.css";

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
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
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
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {link.name}
          </motion.button>
        ))}
    </motion.div>
  );
}
