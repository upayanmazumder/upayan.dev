"use client";
import { BsFileEarmark, BsFolder } from "react-icons/bs";
import directoryMapStyles from "./DirectoryMap.module.css";
import Loader from "../../loader/Loader";

interface RepoContent {
  name: string;
  path: string;
  type: "file" | "dir";
  sha: string;
}
interface DirectoryMapProps {
  data: RepoContent[];
  loading: boolean;
  error: string | null;
  handleItemClick: (item: RepoContent) => void;
}

const DirectoryMap: React.FC<DirectoryMapProps> = ({
  data,
  loading,
  error,
  handleItemClick,
}) => {
  if (loading) return <Loader />;
  if (error) return <p style={{ color: "red", textAlign: "center" }}>Error: {error}</p>;
  if (!data || data.length === 0) return null;

  const sortedData = [...data].sort((a, b) => {
    // Sort directories first, then files, alphabetically within each group
    if (a.type === "dir" && b.type !== "dir") return -1;
    if (a.type !== "dir" && b.type === "dir") return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <ul className={directoryMapStyles.dirMapContainer}>
      {sortedData.map((item) => (
        <li key={item.sha}>
          <button onClick={() => handleItemClick(item)}>
            {item.type === "dir" ? <BsFolder /> : <BsFileEarmark />}
            {item.name}
          </button>
        </li>
      ))}
    </ul>
  );
};

export default DirectoryMap;
