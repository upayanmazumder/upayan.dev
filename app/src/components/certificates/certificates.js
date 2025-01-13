"use client";

import React, { useState } from "react";
import certificateStyles from "./certificates.module.css";
import { createSlug, certificates } from "../../data/certificates";
import { BsFunnel, BsFunnelFill } from "react-icons/bs";

const Certificates = () => {
    const [selectedTag, setSelectedTag] = useState("");

    // Count the occurrence of each tag
    const tagOccurrences = certificates
        .flatMap((certificate) => certificate.tags)
        .reduce((acc, tag) => {
            acc[tag] = (acc[tag] || 0) + 1;
            return acc;
        }, {}); // Removed TypeScript type annotation

    // Filter tags to include only those that occur at least twice
    const validTags = Object.keys(tagOccurrences).filter((tag) => tagOccurrences[tag] >= 2);

    // Filter certificates based on the selected tag
    const filteredCertificates = selectedTag
        ? certificates.filter((certificate) => certificate.tags.includes(selectedTag))
        : certificates;

    return (
        <section className={certificateStyles.pageContainer}>
            {/* Filter Section */}
            <div className={certificateStyles.filterContainer}>
                <summary className={certificateStyles.filterSummary}>
                    {selectedTag ? <BsFunnelFill /> : <BsFunnel />}
                </summary>
                <div className={certificateStyles.filterDropdown}>
                    <select
                        value={selectedTag}
                        onChange={(e) => setSelectedTag(e.target.value)}
                        className={certificateStyles.filterSelect}
                    >
                        <option value="">All</option>
                        {validTags.map((tag, index) => (
                            <option key={index} value={tag}>
                                {tag}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Certificates Grid */}
            <div className={certificateStyles.gridContainer}>
                {filteredCertificates.map((certificate, index) => (
                    <div key={index} className={certificateStyles.certificateCard}>
                        <a href={`/certificates/${createSlug(certificate.title)}#image`}>
                            <img
                                src={certificate.path}
                                alt={`${certificate.title} certificate`}
                                className={certificateStyles.certificateImage}
                            />
                        </a>
                        <div className={certificateStyles.cardContent}>
                            <h2 className={certificateStyles.cardTitle}>{certificate.title}</h2>
                            <div className={certificateStyles.tagsContainer}>
                                {certificate.tags.map((tag, tagIndex) => (
                                    <span key={tagIndex} className={certificateStyles.certificateTag}>
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Certificates;
