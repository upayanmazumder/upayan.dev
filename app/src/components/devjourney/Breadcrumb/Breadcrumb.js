"use client";
import { useRouter } from "next/navigation";
import breadcrumbStyles from "./Breadcrumb.module.css";

const Breadcrumb = ({ pathname }) => {
  const router = useRouter();
  const pathSegments = pathname.replace("/devjourney", "").split("/").filter(Boolean);

  return (
    <div className={breadcrumbStyles.breadcrumbContainer} id="breadcrumb">
      <button onClick={() => router.push("/devjourney")}>Home</button>
      {pathSegments.length > 0 && " / "}
      {pathSegments.map((segment, index) => {
        const path = `/devjourney/${pathSegments.slice(0, index + 1).join("/")}`;
        return (
          <>
            <button key={path} onClick={() => router.push(path)}>{decodeURIComponent(segment)}</button>
            {index < pathSegments.length - 1 && " / "}
          </>
        );
      })}
    </div>
  );
};

export default Breadcrumb;
