import React from 'react';
import styles from './loader.module.css';

const Loader: React.FC = () => {
    return (
        <div className={styles.loader}>
            <div className={styles.square} id="sq1"></div>
            <div className={styles.square} id="sq2"></div>
            <div className={styles.square} id="sq3"></div>
            <div className={styles.square} id="sq4"></div>
            <div className={styles.square} id="sq5"></div>
            <div className={styles.square} id="sq6"></div>
            <div className={styles.square} id="sq7"></div>
            <div className={styles.square} id="sq8"></div>
            <div className={styles.square} id="sq9"></div>
        </div>
    );
};

export default Loader;