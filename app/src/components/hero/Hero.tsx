"use client";

import React from "react";
import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";

import heroStyles from "./Hero.module.css";
import OfficialLinks from "./officiallinks/OfficialLinks";
import Technologies from "./technologies/Technologies";
import Activity from "./activity/Activity";
import Resume from "./resume/Resume";
import Button from "../ui/button/Button";

export default function Hero() {
  return (
    <section className={heroStyles.hero}>
      <motion.div
        className={heroStyles.branding}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        <div className={heroStyles.left}>
          <div>
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
                cursor={false}
                typeSpeed={70}
                deleteSpeed={0}
                delaySpeed={300}
                loop={1}
              />
            </motion.h1>
          </div>

          <motion.h2
            className={heroStyles.role}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <Typewriter
              words={["I build things for the web"]}
              cursor={false}
              typeSpeed={50}
              deleteSpeed={0}
              delaySpeed={200}
              loop={1}
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
            className={heroStyles.technologies}
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.3, delayChildren: 1 },
              },
            }}
          >
            <Technologies />
          </motion.div>

          <motion.div
            className={heroStyles.cta}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.1 }}
          >
            <Resume />
            <Button text="Clubs" to="#clubs" />
            <Button text="Projects" to="#projects" />
          </motion.div>

          <OfficialLinks />
        </div>

        <motion.div
          className={heroStyles.right}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 1 }}
        >
          <motion.img
            src="/upayan.avif"
            alt="Upayan Mazumder"
            className={heroStyles.image}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5, delay: 2 }}
          />
          <Activity />
        </motion.div>
      </motion.div>
    </section>
  );
}
