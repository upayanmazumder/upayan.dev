"use client";

import React from "react";
import Certificate, {
  certificates,
} from "../../../components/certificate/certificate";
import { useParams } from "next/navigation";

const CertificatePage = () => {
  const { certificate: slug } = useParams();

  const certificate = certificates.find(
    (cert) => cert.title.toLowerCase().replace(/\s+/g, "-") === slug
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
      <Certificate slug={Array.isArray(slug) ? slug.join("") : slug || ""} />
    </main>
  );
};

export default CertificatePage;
