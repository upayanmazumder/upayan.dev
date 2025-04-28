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
    <div className={heroStyles.hero}>
      <div className={heroStyles.branding}>
        <div className={heroStyles.left}>
          <p className={heroStyles.greet}>Hi, my name is</p>
          <h1 className={heroStyles.name}>
            <Typewriter
              words={["Upayan Mazumder"]}
              cursor={!nameDone}
              cursorStyle="|"
              typeSpeed={70}
              deleteSpeed={0}
              delaySpeed={200}
              loop={1}
              onLoopDone={() => setNameDone(true)} // Using onLoopDone to detect when typing ends
            />
          </h1>
          <h2 className={heroStyles.role}>
            <Typewriter
              words={["I build things for the web"]}
              cursor={!roleDone}
              cursorStyle="|"
              typeSpeed={50}
              deleteSpeed={0}
              delaySpeed={200}
              loop={1}
              onLoopDone={() => setRoleDone(true)} // Using onLoopDone to detect when typing ends
            />
          </h2>
          <p className={heroStyles.description}>
            I am a full stack developer passionate about building web
            applications and learning new technologies.
          </p>
          <div className={heroStyles.cta}>
            <button
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
            </button>
            <button
              className={heroStyles.cta__button}
              onClick={() => (window.location.href = "#clubs")}
            >
              Clubs
            </button>
            <button
              className={heroStyles.cta__button}
              onClick={() => (window.location.href = "#projects")}
            >
              Projects
            </button>
          </div>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.3,
                },
              },
            }}
          >
            <OfficialLinks />
          </motion.div>
        </div>
        <motion.div
          className={heroStyles.right}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          <img
            src="/upayan-transparent-cropped.avif"
            alt="Upayan Mazumder"
            className={heroStyles.image}
          />
          <Activity />
        </motion.div>
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.3,
              delayChildren: 1,
            },
          },
        }}
      >
        <Technologies />
      </motion.div>
    </div>
  );
}
