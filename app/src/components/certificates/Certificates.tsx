"use client";

import React, { useState } from "react";
import Image from "next/image";
import certificateStyles from "./Certificates.module.css";
import { createSlug, certificates } from "../../data/certificates";
import { BsFunnel, BsFunnelFill } from "react-icons/bs";

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
          {selectedTag ? <BsFunnelFill /> : <BsFunnel />}
        </button>
        <div className={certificateStyles.filterDropdown}>
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
        </div>
      </div>

      <div className={certificateStyles.gridContainer}>
        {filteredCertificates.map((certificate: Certificate, index: number) => {
          const slug = createSlug(certificate.title);
          return (
            <div key={index} className={certificateStyles.certificateCard}>
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
                    <span
                      key={tagIndex}
                      className={certificateStyles.certificateTag}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Certificates;
