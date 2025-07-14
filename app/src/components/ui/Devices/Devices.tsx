import React from "react";

interface DevicesProps {
  children: React.ReactNode;
}

export default function Devices({ children }: DevicesProps) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-6xl mx-auto py-10 md:py-24 gap-10 md:gap-36 relative self-center">
      {/* Desktop/Tablet Section */}
      <div className="flex flex-col justify-center items-center w-full md:w-[720px] h-auto md:h-[460px] bg-neutral-300 dark:bg-neutral-700 rounded-lg shadow-lg">
        <div className="flex flex-col items-center w-full md:w-[716px] h-auto md:h-[456px] bg-neutral-900 rounded-lg p-4 md:p-3 gap-3">
          <div className="w-full md:w-[700px] h-[200px] md:h-[400px] rounded-md bg-background flex items-center justify-center overflow-auto scrollbar-thin scrollbar-thumb-neutral-500 scrollbar-track-neutral-900">
            {children}
          </div>
          <div className="w-[50px] h-[22px] bg-[url('/upayan-transparent.svg')] bg-contain bg-no-repeat" />
        </div>
      </div>

      {/* Phone Section */}
      <div className="flex flex-col justify-center items-center w-full max-w-[240px] md:max-w-[250px] h-[200px] md:h-[400px] bg-neutral-900 rounded-xl shadow-lg p-2 gap-3">
        <div className="w-full h-full rounded-md bg-background flex items-center justify-center overflow-auto scrollbar-thin scrollbar-thumb-neutral-500 scrollbar-track-neutral-900" />
        <div className="w-5 h-5 bg-neutral-400 border border-neutral-200 rounded-full" />
      </div>
    </div>
  );
}
