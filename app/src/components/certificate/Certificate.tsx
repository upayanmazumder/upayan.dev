import Image from "next/image";
import React from "react";
import certificateStyles from "./Certificate.module.css";
import {
	createSlug,
	createIssuerSlug,
	certificates,
} from "../../data/certificates";
import Four04 from "../404/404";

interface Certificate {
	title: string;
	path: string;
	tags: string[];
	issuer: string;
}

interface CertificateDetailProps {
	issuerSlug: string;
	slug: string;
}

const CertificateDetail: React.FC<CertificateDetailProps> = ({
	issuerSlug,
	slug,
}) => {
	const certificate = certificates.find(
		(cert: Certificate) =>
			createIssuerSlug(cert.issuer) === issuerSlug &&
			createSlug(cert.title) === slug
	);

	if (!certificate) {
		return <Four04 />;
	}

	return (
		<section className={certificateStyles.detailPageContainer}>
			<div className={certificateStyles.certificateCard}>
				<div className={certificateStyles.imageContainer}>
					<a
						href={certificate.path}
						target="_blank"
						rel="noopener noreferrer"
						className={certificateStyles.certificateLink}
						title={`View ${certificate.title} certificate`}
					>
						<Image
							src={certificate.path}
							alt={`${certificate.title} certificate`}
							className={certificateStyles.certificateImage}
							width={700}
							height={475}
						/>
					</a>
				</div>
				<div className={certificateStyles.cardContent}>
					<h3 className={certificateStyles.certificateTitle}>
						{certificate.title}
					</h3>
					<div className={certificateStyles.tagsContainer}>
						{certificate.tags.map((tag, index) => (
							<span key={index} className={certificateStyles.certificateTag}>
								{tag}
							</span>
						))}
					</div>
				</div>
			</div>
		</section>
	);
};

export default CertificateDetail;
export { certificates };
