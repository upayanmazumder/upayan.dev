"use client";

import React, { useState } from "react";
import Image from "next/image";
import certificateStyles from "./Certificates.module.css";
import { createSlug, certificates } from "../../data/certificates";
import { BsFunnel, BsFunnelFill } from "react-icons/bs";
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
    <section className={certificateStyles.pageContainer}>
      <div className={certificateStyles.filterContainer}>
        <button
          aria-label="Toggle tag filter"
          className={certificateStyles.filterSummary}
          onClick={() => document.getElementById("tagFilter")?.focus()}
        >
          <motion.div
            key={selectedTag ? "filled" : "empty"}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {selectedTag ? <BsFunnelFill /> : <BsFunnel />}
          </motion.div>
        </button>
        <motion.div
          className={certificateStyles.filterDropdown}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <label htmlFor="tagFilter" className={certificateStyles.filterLabel}>
            Filter by tag
          </label>
          <select
            id="tagFilter"
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className={certificateStyles.filterSelect}
          >
            <option value="">All</option>
            {validTags.map((tag, index) => (
              <option
                key={index}
                value={tag}
                className={certificateStyles.filterOption}
              >
                {tag}
              </option>
            ))}
          </select>
        </motion.div>
      </div>

      <div className={certificateStyles.gridContainer}>
        <AnimatePresence mode="wait">
          {filteredCertificates.map(
            (certificate: Certificate, index: number) => {
              const slug = createSlug(certificate.title);
              return (
                <motion.div
                  key={slug}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className={certificateStyles.certificateCard}
                >
                  <a
                    href={`/certificates/${slug}`}
                    title={`View certificate: ${certificate.title}`}
                  >
                    <Image
                      src={certificate.path}
                      alt={`${certificate.title} certificate`}
                      className={certificateStyles.certificateImage}
                      width={500}
                      height={300}
                      loading="lazy"
                    />
                  </a>
                  <div className={certificateStyles.cardContent}>
                    <h2 className={certificateStyles.cardTitle}>
                      {certificate.title}
                    </h2>
                    <div className={certificateStyles.tagsContainer}>
                      {certificate.tags.map((tag, tagIndex) => (
                        <motion.span
                          key={tagIndex}
                          className={certificateStyles.certificateTag}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          {tag}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            }
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Certificates;
