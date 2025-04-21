"use client";

import React from "react";
import { motion } from "framer-motion";
import technologyStyles from "./technologies.module.css";
import technologies from "../../../data/technologies.json";

const techVariants = {
  hidden: { opacity: 0, color: "transparent" },
  visible: (index: number) => ({
    opacity: 1,
    color: technologies[index].textColor,
    backgroundColor: technologies[index].backgroundColor,
    transition: { delay: index * 0.05, duration: 0.05 },
  }),
};

const Technologies: React.FC = () => {
  return (
    <motion.div
      className={technologyStyles.technologies}
      initial="hidden"
      animate="visible"
    >
      {technologies.map((tech, index) => (
        <motion.span
          key={tech.name}
          custom={index}
          variants={techVariants}
          className={technologyStyles.technology}
        >
          {tech.name}
        </motion.span>
      ))}
    </motion.div>
  );
};

export default Technologies;
