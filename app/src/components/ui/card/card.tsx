import React from "react";
import styles from "./Card.module.css";

interface CardProps {
  title: string;
  content: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, content, className }) => {
  return (
    <div className={`${styles.card} ${className || ""}`}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.content}>{content}</div>{" "}
    </div>
  );
};

export default Card;
