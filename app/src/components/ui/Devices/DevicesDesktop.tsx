"use client";
import React from "react";
import { motion } from "framer-motion";

interface DevicesDesktopProps {
  children: React.ReactNode;
}

export default function DevicesDesktop({ children }: DevicesDesktopProps) {
  return (
    <motion.div
      className="devices-desktop flex flex-col justify-center items-center w-full md:w-[900px] h-auto md:h-[600px] bg-neutral-300 dark:bg-neutral-700 rounded-lg shadow-lg"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="flex flex-col items-center w-full md:w-[896px] h-auto md:h-[596px] bg-neutral-900 rounded-lg p-4 md:p-3 gap-3">
        <div className="w-full md:w-[880px] h-[300px] md:h-[540px] rounded-md bg-background flex items-center justify-center overflow-auto scrollbar-thin scrollbar-thumb-neutral-500 scrollbar-track-neutral-900">
          {children}
        </div>
        <div className="w-[50px] h-[22px] bg-[url('/upayan-transparent-cropped.avif')] bg-contain bg-no-repeat" />
      </div>
    </motion.div>
  );
}
