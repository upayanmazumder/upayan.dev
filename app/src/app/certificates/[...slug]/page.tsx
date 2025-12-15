"use client";

import React from "react";
import Certificate, {
	certificates,
} from "../../../components/certificate/Certificate";
import { useParams } from "next/navigation";
import { createSlug, createIssuerSlug } from "../../../data/certificates";

const CertificatePage = () => {
	const { slug } = useParams();

	// slug is an array like ["vit", "codechef-vit", "internal-hackathon-2025"]
	// or ["github", "github-foundations"]
	const slugArray = Array.isArray(slug) ? slug : [slug];

	// Last item is the certificate slug, everything before is the issuer path
	const certSlug = slugArray[slugArray.length - 1] || "";
	const issuerSlug = slugArray.slice(0, -1).join("/");

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
							Issued by {certificate.issuer.split("/").pop()} on{" "}
							{certificate.date}
						</p>
					</>
				)}
			</div>
			<Certificate issuerSlug={issuerSlug} slug={certSlug} />
		</main>
	);
};

export default CertificatePage;
