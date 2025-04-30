import React from "react";
import Hero from "../components/hero/Hero";
import dynamic from "next/dynamic";

const Clubs = dynamic(() => import("../components/clubs/Clubs"), {
  ssr: true,
});

const Projects = dynamic(() => import("../components/projects/Projects"), {
  ssr: true,
});

export default function Home() {
  return (
    <main style={{ marginTop: "0px" }}>
      <Hero />
      <Clubs />
      <Projects />
    </main>
  );
}
