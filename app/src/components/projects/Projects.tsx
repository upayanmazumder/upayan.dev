"use client";

import React from "react";
import Image from "next/image";
import { useKeenSlider } from "keen-slider/react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import projectsData from "../../data/projects.json";
import defaultImage from "../../media/icon.png";

const Projects: React.FC = () => {
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: false,
    mode: "snap",
    slides: {
      perView: 3,
      spacing: 24,
    },
    breakpoints: {
      "(max-width: 1280px)": {
        slides: { perView: 2.5, spacing: 20 },
      },
      "(max-width: 1024px)": {
        slides: { perView: 2, spacing: 16 },
      },
      "(max-width: 768px)": {
        slides: { perView: 1.3, spacing: 14 },
      },
      "(max-width: 480px)": {
        slides: { perView: 1.05, spacing: 12 },
      },
    },
  });

  return (
    <section id="projects" className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="relative max-w-7xl mx-auto">
        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mb-6 px-1 sm:px-2">
          <button
            onClick={() => instanceRef.current?.prev()}
            className="text-slate-400 hover:text-white disabled:opacity-30 transition"
            aria-label="Previous"
          >
            <IoChevronBack size={28} />
          </button>
          <button
            onClick={() => instanceRef.current?.next()}
            className="text-slate-400 hover:text-white disabled:opacity-30 transition"
            aria-label="Next"
          >
            <IoChevronForward size={28} />
          </button>
        </div>

        {/* Slider */}
        <div
          ref={sliderRef}
          className="keen-slider mx-auto max-w-screen-xl px-2 sm:px-4"
        >
          {projectsData.map((project, index) => (
            <div key={index} className="keen-slider__slide px-1 sm:px-2">
              <div className="flex flex-col justify-between bg-slate-900 border border-slate-700 rounded-2xl p-6 h-full shadow-md transition-all duration-300 min-h-[350px]">
                {/* Header */}
                <div className="flex flex-col items-center text-center">
                  <Image
                    src={project.icon || defaultImage}
                    alt={`${project.name} icon`}
                    width={96}
                    height={96}
                    className="w-24 h-24 rounded-full object-cover border-2 border-slate-600 mb-4"
                    unoptimized={typeof project.icon === "string"}
                  />
                  <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
                  <p className="text-slate-400 text-sm mb-4 min-h-[48px]">
                    {project.description}
                  </p>
                </div>

                {/* Project Links */}
                <div className="flex flex-wrap justify-center gap-2 mt-auto">
                  {project.links.map((link, i) => (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 text-sm rounded-md bg-slate-800 hover:bg-slate-700 transition border border-slate-600 whitespace-nowrap"
                    >
                      {link.name}
                    </a>
                  ))}
                </div>

                {/* Optional Package Links */}
                {project.packageLinks?.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2 mt-3">
                    {project.packageLinks.map((pkg, i) => (
                      <a
                        key={i}
                        href={pkg.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600 whitespace-nowrap"
                      >
                        {pkg.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
