"use client";

import React, { useEffect, useState } from "react";
import { useTypewriter, Cursor } from "react-simple-typewriter";
import styles from "./Technologies.module.css";
import techGroups from "../../../data/technologies.json";

function TechTypewriter({
  group,
  onDone,
}: {
  group: string[];
  onDone: () => void;
}) {
  const [text, helper] = useTypewriter({
    words: [group.join("  •  "), ""],
    loop: 1,
    typeSpeed: 40,
    deleteSpeed: 20,
    delaySpeed: 750,
  });

  useEffect(() => {
    if (helper.isDone) {
      const timeout = setTimeout(onDone, 500);
      return () => clearTimeout(timeout);
    }
  }, [helper.isDone, onDone]);

  return (
    <div className={styles.line}>
      {text}
      <Cursor cursorStyle="|" />
    </div>
  );
}

export default function Technologies() {
  const [index, setIndex] = useState(0);
  const [show, setShow] = useState(true);

  const nextGroup = () => {
    setShow(false);
    setTimeout(() => {
      setIndex((prev) => (prev + 1) % techGroups.length);
      setShow(true);
    }, 100);
  };

  return (
    <div className={styles.container}>
      {show && <TechTypewriter group={techGroups[index]} onDone={nextGroup} />}
    </div>
  );
}
