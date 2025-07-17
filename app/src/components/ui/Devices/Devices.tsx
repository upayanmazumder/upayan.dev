"use client";
import React from "react";
import Sidebar from "../Sidebar/Sidebar";
import DevicesDesktop from "./DevicesDesktop";
import DevicesMobile from "./DevicesMobile";

interface DevicesProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
}

export default function Devices({ children, sidebar }: DevicesProps) {
  const sidebarContent = sidebar ?? <Sidebar />;
  return (
    <div className="relative w-full flex flex-col md:flex-row items-center justify-center max-w-6xl mx-auto py-10 md:py-24 gap-6 md:gap-16 h-full">
      {/* Desktop Section: Main Content (always visible) */}
      <DevicesDesktop>{children}</DevicesDesktop>

      {/* Phone Section: Sidebar (always visible as phone mockup) */}
      <DevicesMobile sidebar={sidebarContent} />

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
      `}</style>
    </div>
  );
}
