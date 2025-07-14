import React from "react";
import Hero from "../components/hero/Hero";
import Clubs from "../components/clubs/Clubs";
import Projects from "../components/projects/Projects";
import SponsorCard from "../components/sponsors/SponsorCard";

export default function Home() {
  return (
    <main style={{ marginTop: "0px" }}>
      <Hero />

      {/* Sponsors Section */}
      <section
        id="sponsors"
        style={{
          minHeight: "0",
        }}
      >
        <a className="section-link" href="#sponsors">
          <h2 className="section-title">Sponsors</h2>
        </a>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "40px",
          }}
        >
          <SponsorCard
            imgSrc="/sponsors/hax.png"
            alt="Max (Hax)"
            name="Max"
            handle="@Hax"
          />
        </div>
      </section>
      {/* Clubs Section */}
      <section id="clubs">
        <a className="section-link" href="#clubs">
          <h2 className="section-title">Clubs</h2>
        </a>
        <Clubs />
      </section>
      {/* Projects Section */}
      <section id="projects">
        <a className="section-link" href="#projects">
          <h2 className="section-title">Projects</h2>
        </a>
        <Projects />
      </section>
    </main>
  );
}
