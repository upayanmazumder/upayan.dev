"use client";
import { BsFileEarmark, BsFolder } from "react-icons/bs";
import directoryMapStyles from "./DirectoryMap.module.css";
import Loader from "../../loader/loader";

const DirectoryMap = ({ data, loading, error, handleItemClick }) => {
  if (loading) return <Loader />;
  if (error) return <p>Error: {error}</p>;
  if (data.length === 0) return null;

  return (
    <ul className={directoryMapStyles.dirMapContainer}>
      {data.map((item) => (
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
