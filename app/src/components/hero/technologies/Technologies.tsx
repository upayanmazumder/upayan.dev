"use client";

import React from "react";
import { motion } from "framer-motion";
import technologyStyles from "./Technologies.module.css";
import technologies from "../../../data/technologies.json";

const techVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (index: number) => ({
    opacity: 1,
    scale: 1,
    color: technologies[index].textColor,
    backgroundColor: technologies[index].backgroundColor,
    transition: { delay: index * 0.04, duration: 0.3, ease: "easeOut" },
  }),
};

const Technologies: React.FC = () => {
  return (
    <section className={technologyStyles.container}>
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
            whileHover={{ scale: 1.1, backgroundColor: "#ffffff0f" }}
            whileTap={{ scale: 0.95 }}
          >
            {tech.name}
          </motion.span>
        ))}
      </motion.div>
    </section>
  );
};

export default Technologies;
