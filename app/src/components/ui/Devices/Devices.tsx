import React from "react";
import styles from "./Devices.module.css";

interface DevicesProps {
  children: React.ReactNode;
}

export default function Devices({ children }: DevicesProps) {
  return (
    <div className={styles.devicesWrapper}>
      <div className={styles.topSection}>
        <div className={styles.displaySection}>
          <div className={styles.screenSection}>{children}</div>
          <div className={styles.transparentIcon} />
        </div>
      </div>
      <div className={styles.phoneSection}>
        <div className={styles.phoneScreen} />
        <div className={styles.ellipse} />
      </div>
    </div>
  );
}
