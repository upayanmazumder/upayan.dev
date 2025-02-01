import React from "react";
import certificateStyles from "./certificate.module.css";
import { createSlug, certificates } from "../../data/certificates";
import Four04 from "../../components/404/404";

const CertificateDetail = ({ slug }) => {
  const certificate = certificates.find((cert) => createSlug(cert.title) === slug);

  // Unavailable certificate
  if (!certificate) {
    return <Four04 />;
  }

  return (
    <section className={certificateStyles.detailPageContainer}>
      <div className={certificateStyles.certificateCard}>
        <div className={certificateStyles.imageContainer}>
          <img
            src={certificate.path}
            alt={`${certificate.title} certificate`}
            className={certificateStyles.certificateImage}
          />
        </div>
        <div className={certificateStyles.cardContent}>
          <h3 className={certificateStyles.certificateTitle}>{certificate.title}</h3>
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
