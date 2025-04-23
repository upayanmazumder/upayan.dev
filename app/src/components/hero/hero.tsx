"use client";

import React from "react";
import { motion } from "framer-motion";
import heroStyles from "./hero.module.css";
import Branding from "./branding/branding";
import OfficialLinks from "./officiallinks/officiallinks";
import Technologies from "./technologies/technologies";

const Hero: React.FC = () => {
  return (
    <div className={heroStyles.hero}>
      <motion.div
        className={heroStyles.branding}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 3 }}
      >
        <Branding />
        <Technologies />
      </motion.div>

      <motion.div
        className={heroStyles.image}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 4 }}
      >
        <OfficialLinks />
      </motion.div>
    </div>
  );
};

export default Hero;
