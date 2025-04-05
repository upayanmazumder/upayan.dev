"use client";

import React from "react";
import Certificate from "@/components/certificate/certificate";
import { useParams } from "next/navigation";

const CertificatePage = () => {
  const { certificate: slug } = useParams();

  return (
    <main id="image">
      <Certificate slug={slug} />
    </main>
  );
};

export default CertificatePage;
