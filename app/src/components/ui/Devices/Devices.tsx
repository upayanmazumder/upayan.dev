"use client";
import React from "react";
import Sidebar from "../Sidebar/Sidebar";
import { motion } from "framer-motion";

interface DevicesProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
}

export default function Devices({ children, sidebar }: DevicesProps) {
  const sidebarContent = sidebar ?? <Sidebar />;
  return (
    <div className="relative w-full flex flex-col md:flex-row items-center justify-center max-w-6xl mx-auto py-10 md:py-24 gap-10 md:gap-36">
      {/* Desktop Section: Main Content (always visible) */}
      <motion.div
        className="devices-desktop flex flex-col justify-center items-center w-full md:w-[720px] h-auto md:h-[460px] bg-neutral-300 dark:bg-neutral-700 rounded-lg shadow-lg"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="flex flex-col items-center w-full md:w-[716px] h-auto md:h-[456px] bg-neutral-900 rounded-lg p-4 md:p-3 gap-3">
          <div className="w-full md:w-[700px] h-[200px] md:h-[400px] rounded-md bg-background flex items-center justify-center overflow-auto scrollbar-thin scrollbar-thumb-neutral-500 scrollbar-track-neutral-900">
            {children}
          </div>
          <div className="w-[50px] h-[22px] bg-[url('/upayan-transparent.svg')] bg-contain bg-no-repeat" />
        </div>
      </motion.div>

      {/* Phone Section: Sidebar (always visible as phone mockup) */}
      <motion.div
        className="devices-phone flex flex-col justify-center items-center w-full max-w-[240px] md:max-w-[250px] h-[200px] md:h-[400px] bg-neutral-900 rounded-xl shadow-lg p-2 gap-3"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        style={{}}
      >
        <div className="w-full h-full rounded-md bg-background flex items-center justify-center overflow-auto scrollbar-thin scrollbar-thumb-neutral-500 scrollbar-track-neutral-900">
          {sidebarContent}
        </div>
        <div className="w-5 h-5 bg-neutral-400 border border-neutral-200 rounded-full animate-pulse" />
      </motion.div>

      {/* Responsive Styles */}
      <style jsx>{`
        @media (max-width: 900px) {
          .devices-desktop {
            width: 100% !important;
            height: auto !important;
            min-width: 0;
            margin-bottom: 24px;
          }
          .devices-phone {
            width: 100% !important;
            max-width: 300px !important;
            height: auto !important;
            margin-bottom: 0;
            display: flex !important;
          }
        }
        /* Remove hiding of phone section on desktop */
      `}</style>
    </div>
  );
}
