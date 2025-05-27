/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { FaExternalLinkAlt, FaLinkedin } from "react-icons/fa";
import clubs from "../../data/clubs.json";

const ClubShowcase: React.FC = () => {
  const isLinkedIn = (url: string) => {
    try {
      const parsedUrl = new URL(url);
      return (
        parsedUrl.host === "linkedin.com" ||
        parsedUrl.host.endsWith(".linkedin.com")
      );
    } catch {
      return false;
    }
  };

  return (
    <div id="clubs">
      <div className="flex flex-wrap justify-center gap-8">
        {clubs.map((club, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-blue-950 via-cyan-900 to-blue-900 bg-opacity-90 backdrop-blur-md rounded-2xl shadow-xl hover:shadow-2xl transition-shadow w-full max-w-xs flex flex-col items-center p-8 border border-cyan-800"
          >
            <img
              src={club.icon}
              alt={club.name}
              className="w-24 h-24 object-cover rounded-full mb-6"
            />
            <h3 className="text-xl font-bold text-white mb-2">{club.name}</h3>
            <p className="text-slate-300 text-center mb-4">
              {club.description}
            </p>
            <div className="flex gap-4 mt-auto">
              {club.links.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-blue-400 text-2xl transition-colors"
                  aria-label={
                    isLinkedIn(link.url) ? "LinkedIn" : "External Link"
                  }
                >
                  {isLinkedIn(link.url) ? (
                    <FaLinkedin />
                  ) : (
                    <FaExternalLinkAlt />
                  )}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClubShowcase;
