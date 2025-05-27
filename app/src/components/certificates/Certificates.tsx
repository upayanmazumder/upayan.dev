"use client";

import React, { useState } from "react";
import Image from "next/image";
import { createSlug, certificates } from "../../data/certificates";
import { motion, AnimatePresence } from "framer-motion";

interface Certificate {
  title: string;
  path: string;
  tags: string[];
}

const Certificates: React.FC = () => {
  const [selectedTag, setSelectedTag] = useState<string>("");

  const tagOccurrences = certificates
    .flatMap((certificate: Certificate) => certificate.tags)
    .reduce((acc: Record<string, number>, tag: string) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {});

  const validTags = Object.keys(tagOccurrences).filter(
    (tag) => tagOccurrences[tag] >= 2
  );

  const filteredCertificates = selectedTag
    ? certificates.filter((certificate) =>
        certificate.tags.includes(selectedTag)
      )
    : certificates;

  return (
    <section className="flex flex-col gap-8 p-0 text-white rounded-2xl mb-16">
      <div className="ml-auto flex flex-row items-center">
        <motion.div
          className="ml-2 flex flex-row items-center gap-2 text-gray-400 hover:text-blue-300 transition-colors duration-300 cursor-pointer"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <label
            htmlFor="tagFilter"
            className="mr-2 text-sm font-medium text-gray-300"
          >
            Filter by tag
          </label>
          <select
            id="tagFilter"
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="px-3 py-2 text-white bg-gray-800 border border-gray-700 rounded-lg cursor-pointer transition-all duration-300 uppercase"
          >
            <option value="">All</option>
            {validTags.map((tag, index) => (
              <option key={index} value={tag} className="bg-gray-800">
                {tag}
              </option>
            ))}
          </select>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        <AnimatePresence mode="wait">
          {filteredCertificates.map((certificate: Certificate) => {
            const slug = createSlug(certificate.title);
            return (
              <motion.div
                key={slug}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="backdrop-blur-sm bg-gray-900/80 border border-gray-700 rounded-xl overflow-hidden text-center text-xs shadow-lg hover:-translate-y-1 transition-transform"
              >
                <a
                  href={`/certificates/${slug}`}
                  title={`View certificate: ${certificate.title}`}
                >
                  <Image
                    src={certificate.path}
                    alt={`${certificate.title} certificate`}
                    className="w-full h-auto block border-b border-gray-700"
                    width={500}
                    height={300}
                    loading="lazy"
                  />
                </a>
                <div className="p-4">
                  <h2 className="text-blue-300 font-semibold mb-2 text-base">
                    {certificate.title}
                  </h2>
                  <div className="flex justify-center flex-wrap gap-2">
                    {certificate.tags.map((tag, tagIndex) => (
                      <motion.span
                        key={tagIndex}
                        className="inline-block text-white px-2 py-1 rounded-md bg-blue-900 uppercase tracking-wide text-xs"
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Certificates;
