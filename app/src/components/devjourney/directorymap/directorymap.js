"use client";
import { BsFileEarmark, BsFolderFill } from "react-icons/bs";
import directoryMapStyles from "./directorymap.module.css";
import Loader from "../../loader/loader";

const DirectoryMap = ({ data, loading, error, handleItemClick }) => {
  if (loading) return <Loader />;
  if (error) return <p>Error: {error}</p>;
  if (data.length === 0) return null;

  const sortedData = [...data].sort((a, b) => {
    if (a.type === "dir" && b.type !== "dir") return -1;
    if (a.type !== "dir" && b.type === "dir") return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <ul className={directoryMapStyles.dirMapContainer}>
      {sortedData.map((item) => (
        <li key={item.sha}>
          <button onClick={() => handleItemClick(item)}>
            {item.type === "dir" ? <BsFolderFill /> : <BsFileEarmark />}
            {item.name}
          </button>
        </li>
      ))}
    </ul>
  );
};

export default DirectoryMap;
