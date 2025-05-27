"use client";

import React from "react";
import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";
import OfficialLinks from "./officiallinks/OfficialLinks";
import Technologies from "./technologies/Technologies";
import Activity from "./activity/Activity";
import Resume from "./resume/Resume";
import Button from "../ui/button/Button";

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col justify-center px-4 max-w-5xl mx-auto">
      <motion.div
        className="grid md:grid-cols-[70%_30%] grid-cols-1 gap-8 my-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        <div className="flex flex-col justify-center items-start md:items-start px-8 gap-4">
          <div>
            <motion.p
              className="m-0 text-gray-400 text-lg"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              Hi, my name is
            </motion.p>

            <motion.h1
              className="m-0 text-white leading-none text-5xl font-bold font-montserrat mb-[-10px]"
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
            className="my-2 text-gray-300 leading-none text-2xl"
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
            className="my-2 text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            I am a full stack developer passionate about building web
            applications and learning new technologies.
          </motion.p>

          <motion.div
            className="py-2"
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
            className="flex w-full flex-row justify-start gap-6 items-center mt-2"
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
          className="flex flex-col justify-center items-center px-12"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 1 }}
        >
          <motion.img
            src="/upayan-transparent-cropped.avif"
            alt="Upayan Mazumder"
            className="w-[70%] max-w-[400px] mb-4"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5, delay: 2 }}
          />
          <Activity />
        </motion.div>
      </motion.div>
    </section>
  );
}
