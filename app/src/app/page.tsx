import React from "react";
import Hero from "../components/hero/Hero";
import Clubs from "../components/clubs/Clubs";
import Projects from "../components/projects/Projects";

export default function Home() {
  return (
    <main style={{ marginTop: "0px" }}>
      <Hero />
      <Clubs />
      <Projects />
    </main>
  );
}
