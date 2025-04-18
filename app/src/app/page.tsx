import React from "react";
import Hero from "../components/hero/hero";
import dynamic from "next/dynamic";

const Projects = dynamic(() => import("../components/projects/projects"), {
  ssr: true,
});

export default function Home() {
  return (
    <main>
      <Hero />
      <Projects />
    </main>
  );
}
