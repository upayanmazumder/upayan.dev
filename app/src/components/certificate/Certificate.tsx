import Image from "next/image";
import React from "react";
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
    <div className="backdrop-blur-sm bg-gray-900/80 border border-gray-700 rounded-2xl max-w-xl w-full text-center overflow-hidden transition-transform duration-300 hover:scale-[1.03] shadow-lg">
      <div className="w-full bg-gray-950 border-b border-gray-700">
        <a
          href={certificate.path}
          target="_blank"
          rel="noopener noreferrer"
          title={`View ${certificate.title} certificate`}
          className="block"
        >
          <Image
            src={certificate.path}
            alt={`${certificate.title} certificate`}
            className="w-full h-auto object-contain"
            width={700}
            height={475}
          />
        </a>
      </div>
      <div className="p-5 text-sm">
        <h3 className="font-bold text-blue-300 mb-2 uppercase text-lg">
          {certificate.title}
        </h3>
        <div className="flex justify-center flex-wrap gap-2 mt-2">
          {certificate.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-block text-gray-100 px-3 py-1 rounded bg-blue-900 uppercase tracking-wide text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CertificateDetail;
export { certificates };
