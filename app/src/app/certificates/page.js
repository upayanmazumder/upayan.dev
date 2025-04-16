import React from "react";
import Certificates from "../../components/certificates/certificates";

const CertificatesPage = () => {
  return (
    <main>
      <div className="page-header">
        <h1>Certificates</h1>
        <p>My certificates</p>
      </div>
      <Certificates />
    </main>
  );
};

export default CertificatesPage;

export const metadata = {
  title: "Upayan - Certificates",
  description: "View my certificates",
};
