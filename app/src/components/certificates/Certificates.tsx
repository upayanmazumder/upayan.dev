"use client";

import React, { useState } from "react";
import certificateStyles from "./Certificates.module.css";
import {
	createSlug,
	createIssuerSlug,
	certificates,
} from "../../data/certificates";
import { BsFunnel, BsFunnelFill } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";
import CertificateCard from "./CertificateCard";

interface Certificate {
	title: string;
	path: string;
	tags: string[];
	issuer: string;
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
					{filteredCertificates.map((certificate: Certificate) => {
						const slug = createSlug(certificate.title);
						const issuerSlug = createIssuerSlug(certificate.issuer);
						return (
							<CertificateCard
								key={`${issuerSlug}-${slug}`}
								certificate={certificate}
								slug={slug}
								issuerSlug={issuerSlug}
							/>
						);
					})}
				</AnimatePresence>
			</div>
		</section>
	);
};

export default Certificates;
