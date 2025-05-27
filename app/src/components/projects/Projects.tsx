"use client";

import React, { useRef, useState } from "react";
import projectsData from "../../data/projects.json";
import defaultImage from "../../media/icon.png";

const Projects = () => {
  const [current, setCurrent] = useState(0);
  const total = projectsData.length;
  const containerRef = useRef<HTMLDivElement>(null);

  const goTo = (idx: number) => {
    if (idx < 0) idx = 0;
    if (idx > total - 1) idx = total - 1;
    setCurrent(idx);
    containerRef.current?.scrollTo({
      left: idx * (containerRef.current.offsetWidth + 24),
      behavior: "smooth",
    });
  };

  const prev = () => goTo(current - 1);
  const next = () => goTo(current + 1);

  return (
    <section id="projects" className="relative py-20 overflow-hidden">
      <div className="flex justify-center items-center gap-4 z-10 relative">
        <button
          onClick={prev}
          disabled={current === 0}
          className="p-2 rounded-full bg-cyan-900 text-cyan-300 hover:bg-cyan-700 disabled:opacity-30 transition"
          style={{
            boxShadow: "none",
            backgroundColor: "none",
            background: "none",
          }}
          aria-label="Previous"
        >
          &#8592;
        </button>
        <div
          ref={containerRef}
          className="flex overflow-x-hidden scroll-smooth w-full max-w-5xl"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {projectsData.map((project, index) => (
            <div
              key={index}
              className={`flex-shrink-0 w-full max-w-md mx-3 transition-transform duration-300 ${
                index === current ? "scale-100" : "scale-95 opacity-60"
              }`}
              style={{ scrollSnapAlign: "center" }}
            >
              <div className="flex flex-col justify-between bg-gradient-to-br from-blue-950 via-cyan-950 to-blue-900 bg-opacity-95 backdrop-blur-xl rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.45)] border border-cyan-900 p-10 min-h-[420px]">
                <div className="flex flex-col items-center">
                  <div className="relative mb-6">
                    <img
                      src={project.icon || defaultImage.src}
                      alt={`${project.name} icon`}
                      className="w-24 h-24 object-cover rounded-full border-4 border-cyan-500 shadow-xl bg-blue-950"
                    />
                    <span className="absolute -bottom-2 -right-2 w-6 h-6 bg-cyan-500 rounded-full blur-sm opacity-60" />
                  </div>
                  <h3 className="text-2xl font-bold text-cyan-100 mb-2 text-center tracking-wide">
                    {project.name}
                  </h3>
                  <p className="text-slate-300 text-center mb-6 text-base min-h-[60px]">
                    {project.description}
                  </p>
                </div>
                <div>
                  <div className="flex flex-wrap justify-center gap-3 mb-3">
                    {project.links.map((link, i) => (
                      <a
                        key={i}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gradient-to-r from-cyan-700 via-blue-700 to-blue-900 hover:from-cyan-500 hover:to-blue-700 text-white px-5 py-2 rounded-xl shadow-md transition-all text-sm font-semibold tracking-wide border border-cyan-800"
                      >
                        {link.name}
                      </a>
                    ))}
                  </div>
                  {project.packageLinks && (
                    <div className="flex flex-wrap justify-center gap-2">
                      {project.packageLinks.map((pkg, i) => (
                        <a
                          key={i}
                          href={pkg.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-blue-950 hover:bg-cyan-800 text-cyan-300 px-3 py-1 rounded-md text-xs font-medium border border-cyan-900 transition-colors"
                        >
                          {pkg.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={next}
          disabled={current === projectsData.length - 1}
          className="p-2 rounded-full bg-cyan-900 text-cyan-300 hover:bg-cyan-700 disabled:opacity-30 transition"
          style={{
            boxShadow: "none",
            backgroundColor: "none",
            background: "none",
          }}
          aria-label="Next"
        >
          &#8594;
        </button>
      </div>
      <div className="flex justify-center mt-6 gap-2">
        {projectsData.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goTo(idx)}
            className={`w-3 h-3 rounded-full transition-all ${
              idx === current
                ? "bg-cyan-400 scale-125"
                : "bg-cyan-900 hover:bg-cyan-600"
            }`}
            style={{
              boxShadow: "none",
            }}
            aria-label={`Go to project ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Projects;
