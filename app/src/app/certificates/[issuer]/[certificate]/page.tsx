"use client";

import React from "react";
import Certificate, {
	certificates,
} from "../../../../components/certificate/Certificate";
import { useParams } from "next/navigation";
import { createSlug, createIssuerSlug } from "../../../../data/certificates";

const CertificatePage = () => {
	const { issuer: issuerSlug, certificate: certSlug } = useParams();

	const certificate = certificates.find(
		(cert) =>
			createIssuerSlug(cert.issuer) === issuerSlug &&
			createSlug(cert.title) === certSlug
	);

	return (
		<main id="image">
			<div className="page-header">
				<h1>{certificate ? certificate.title : "Certificate Not Found"}</h1>
				{certificate && (
					<>
						<p>
							Issued by {certificate.issuer} on {certificate.date}
						</p>
					</>
				)}
			</div>
			<Certificate
				issuerSlug={
					Array.isArray(issuerSlug) ? issuerSlug.join("") : issuerSlug || ""
				}
				slug={Array.isArray(certSlug) ? certSlug.join("") : certSlug || ""}
			/>
		</main>
	);
};

export default CertificatePage;
