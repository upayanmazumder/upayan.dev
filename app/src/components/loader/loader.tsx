import React from "react";
import styles from "./loader.module.css";

const Loader = ({ text = "Loading   " }) => {
  return (
    <div className={styles.loaderContainer}>
      <span className={styles.loaderText}>{text}</span>
      <div className={styles.dotsContainer}>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
      </div>
    </div>
  );
};

export default Loader;