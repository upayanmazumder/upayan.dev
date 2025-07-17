"use client";
import React from "react";

interface DevicesMobileProps {
  sidebar: React.ReactNode;
}

export default function DevicesMobile({ sidebar }: DevicesMobileProps) {
  return (
    <div
      className="devices-phone flex flex-col justify-center items-center w-full min-w-[180px] max-w-[240px] md:min-w-[200px] md:max-w-[250px] h-[200px] md:h-[400px] bg-neutral-900 rounded-xl shadow-lg p-2 gap-3"
      style={{}}
    >
      <div className="w-full h-full rounded-md bg-background flex items-center justify-center overflow-auto scrollbar-thin scrollbar-thumb-neutral-500 scrollbar-track-neutral-900">
        {sidebar}
      </div>
      <div className="w-5 h-5 bg-neutral-400 border border-neutral-200 rounded-full animate-pulse" />
    </div>
  );
}
