"use client";

import React from "react";
import { motion } from "framer-motion";
import heroStyles from "./Hero.module.css";
import Branding from "./branding/Branding";
import OfficialLinks from "./officiallinks/OfficialLinks";
import Technologies from "./technologies/Technologies";

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
