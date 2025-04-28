"use client";

import heroStyles from "./Hero.module.css";
import OfficialLinks from "./officiallinks/OfficialLinks";
import Technologies from "./technologies/Technologies";
import Activity from "./activity/Activity";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";

export default function Hero() {
  const [nameDone, setNameDone] = useState(false);
  const [roleDone, setRoleDone] = useState(false);

  return (
    <section className={heroStyles.hero}>
      <motion.div
        className={heroStyles.branding}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        <div className={heroStyles.left}>
          <motion.p
            className={heroStyles.greet}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            Hi, my name is
          </motion.p>

          <motion.h1
            className={heroStyles.name}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <Typewriter
              words={["Upayan Mazumder"]}
              cursor={!nameDone}
              cursorStyle="|"
              typeSpeed={70}
              deleteSpeed={0}
              delaySpeed={300}
              loop={1}
              onLoopDone={() => setNameDone(true)}
            />
          </motion.h1>

          <motion.h2
            className={heroStyles.role}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <Typewriter
              words={["I build things for the web"]}
              cursor={!roleDone}
              cursorStyle="|"
              typeSpeed={50}
              deleteSpeed={0}
              delaySpeed={200}
              loop={1}
              onLoopDone={() => setRoleDone(true)}
            />
          </motion.h2>

          <motion.p
            className={heroStyles.description}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            I am a full stack developer passionate about building web
            applications and learning new technologies.
          </motion.p>

          <motion.div
            className={heroStyles.cta}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={heroStyles.cta__button}
              onClick={() => {
                const link = document.createElement("a");
                link.href = "/resume.pdf";
                link.download = "Upayan Mazumder Resume.pdf";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            >
              Resume
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={heroStyles.cta__button}
              onClick={() => (window.location.href = "#clubs")}
            >
              Clubs
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={heroStyles.cta__button}
              onClick={() => (window.location.href = "#projects")}
            >
              Projects
            </motion.button>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.2, delayChildren: 1.2 },
              },
            }}
          >
            <OfficialLinks />
          </motion.div>
        </div>

        <motion.div
          className={heroStyles.right}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 1 }}
        >
          <motion.img
            src="/upayan-transparent-cropped.avif"
            alt="Upayan Mazumder"
            className={heroStyles.image}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5 }}
          />
          <Activity />
        </motion.div>
      </motion.div>

      <motion.div
        className={heroStyles.technologies}
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.3, delayChildren: 1.5 },
          },
        }}
      >
        <Technologies />
      </motion.div>
    </section>
  );
}
