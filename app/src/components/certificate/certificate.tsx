import React from "react";
import Image from "next/image";
import certificateStyles from "./certificate.module.css";
import { createSlug, certificates } from "../../data/certificates";
import Four04 from "../404/404";

interface Certificate {
  title: string;
  path: string;
  tags: string[];
}

interface CertificateDetailProps {
  slug: string;
}

const CertificateDetail: React.FC<CertificateDetailProps> = ({ slug }) => {
  const certificate = certificates.find(
    (cert: Certificate) => createSlug(cert.title) === slug
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
              layout="responsive"
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
