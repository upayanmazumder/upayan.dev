import React from "react";
import styles from "./Button.module.css";

interface ButtonProps {
  text: string;
  to: string;
}

const Button: React.FC<ButtonProps> = ({ text, to }) => {
  const handleClick = () => {
    if (to) {
      window.location.href = to;
    }
  };

  return (
    <div>
      <button className={styles.button} onClick={handleClick}>
        {text}
      </button>
    </div>
  );
};

export default Button;
