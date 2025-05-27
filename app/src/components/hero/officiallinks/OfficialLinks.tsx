import officialLinks from "../../../data/links.json";
import { motion } from "framer-motion";

const whitelist = [
  "IIT-Madras",
  "Devfolio",
  "Leetcode",
  "Microsoft Learn",
  "Gravatar",
  "Kaggle",
];

const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.1,
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function OfficialLinks() {
  const filteredLinks = officialLinks.filter((link) =>
    whitelist.includes(link.name)
  );

  return (
    <motion.div
      className="flex flex-row flex-wrap gap-3 items-center py-1 my-4 w-full
        max-sm:flex-col"
      variants={containerVariants}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, delay: 1.3 }}
    >
      {filteredLinks.map((link, index) => (
        <motion.button
          key={index}
          onClick={() => window.open(link.url, "_blank", "noopener,noreferrer")}
          style={{
            color: link.textColor,
            backgroundColor: link.backgroundColor,
          }}
          className="font-redhat px-4 py-2 text-center transition-all duration-300 shadow-md text-sm cursor-pointer hover:shadow-lg hover:-translate-y-0.5 w-auto max-sm:w-full"
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {link.name}
        </motion.button>
      ))}
    </motion.div>
  );
}
