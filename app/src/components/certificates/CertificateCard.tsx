"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import certificateStyles from "./Certificates.module.css";
import CertificateFallback from "../certificate/CertificateFallback";

interface CertificateCardProps {
	certificate: {
		title: string;
		path: string;
		tags: string[];
		issuer: string;
	};
	slug: string;
	issuerSlug: string;
}

const CertificateCard: React.FC<CertificateCardProps> = ({
	certificate,
	slug,
	issuerSlug,
}) => {
	const [imageError, setImageError] = useState(false);

	return (
		<motion.div
			key={`${issuerSlug}-${slug}`}
			layout
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0.9 }}
			transition={{ duration: 0.3, ease: "easeInOut" }}
			className={certificateStyles.certificateCard}
		>
			{imageError ? (
				<CertificateFallback
					title={certificate.title}
					className={certificateStyles.certificateImage}
				/>
			) : (
				<a
					href={`/certificates/${issuerSlug}/${slug}`}
					title={`View certificate: ${certificate.title}`}
				>
					<Image
						src={certificate.path}
						alt={`${certificate.title} certificate`}
						className={certificateStyles.certificateImage}
						width={500}
						height={300}
						loading="lazy"
						onError={() => setImageError(true)}
					/>
				</a>
			)}
			<div className={certificateStyles.cardContent}>
				<h2 className={certificateStyles.cardTitle}>{certificate.title}</h2>
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
};

export default CertificateCard;
