import React from "react";
import Hero from "../components/hero/Hero";
import Clubs from "../components/clubs/Clubs";
import Projects from "../components/projects/Projects";

export default function Home() {
  return (
    <main style={{ marginTop: "0px" }}>
      <Hero />
      <section id="clubs">
        <a className="section-link" href="#clubs">
          <h2 className="section-title">Clubs</h2>
        </a>
        <Clubs />
      </section>
      <section id="projects">
        <a className="section-link" href="#projects">
          <h2 className="section-title">Projects</h2>
        </a>
        <Projects />
      </section>
    </main>
  );
}
