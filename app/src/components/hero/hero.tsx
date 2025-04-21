// Hero.tsx
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
        transition={{ duration: 1 }}
      >
        <Branding />
        <Technologies />
      </motion.div>

      <OfficialLinks />
    </div>
  );
};

export default Hero;
