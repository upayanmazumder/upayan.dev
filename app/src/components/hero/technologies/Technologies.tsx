"use client";

import React, { useEffect, useState } from "react";
import { useTypewriter, Cursor } from "react-simple-typewriter";
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
    typeSpeed: 60,
    deleteSpeed: 15,
    delaySpeed: 2000,
  });

  useEffect(() => {
    if (helper.isDone) {
      const timeout = setTimeout(onDone, 500);
      return () => clearTimeout(timeout);
    }
  }, [helper.isDone, onDone]);

  return (
    <div className="whitespace-nowrap text-gray-300 text-base md:text-lg">
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
    }, 10);
  };

  return (
    <div className="flex flex-col gap-3 items-start py-4 min-h-[56px] text-gray-300">
      {show && <TechTypewriter group={techGroups[index]} onDone={nextGroup} />}
    </div>
  );
}
