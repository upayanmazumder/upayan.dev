"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import breadcrumbStyles from "./BreadCrumb.module.css";

interface BreadcrumbProps {
  pathname: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ pathname }) => {
  const router = useRouter();
  const pathSegments = pathname
    .replace("/devjourney", "")
    .split("/")
    .filter(Boolean);

  return (
    <div className={breadcrumbStyles.breadcrumbContainer} id="breadcrumb">
      <motion.button
        onClick={() => router.push("/devjourney")}
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        Home
      </motion.button>
      {pathSegments.length > 0 && " / "}
      {pathSegments.map((segment, index) => {
        const path = `/devjourney/${pathSegments
          .slice(0, index + 1)
          .join("/")}`;
        return (
          <React.Fragment key={path}>
            <motion.button
              onClick={() => router.push(path)}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.2 }} // Delayed animation
            >
              {decodeURIComponent(segment)}
            </motion.button>
            {index < pathSegments.length - 1 && " / "}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Breadcrumb;
