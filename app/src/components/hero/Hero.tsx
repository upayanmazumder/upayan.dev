"use client";

import heroStyles from "./Hero.module.css";
import OfficialLinks from "./officiallinks/OfficialLinks";
import Technologies from "./technologies/Technologies";
import Activity from "./activity/Activity";
import React from "react";

export default function Hero() {
  return (
    <div className={heroStyles.hero}>
      <div className={heroStyles.branding}>
        <div className={heroStyles.left}>
          <p className={heroStyles.greet}>Hi, my name is</p>
          <h1 className={heroStyles.name}>Upayan Mazumder</h1>
          <h2 className={heroStyles.role}>I build things for the web</h2>
          <p className={heroStyles.description}>
            I am a full stack developer passionate about building web
            applications and learning new technologies.
          </p>
          <div className={heroStyles.cta}>
            <button
              className={heroStyles.cta__button}
              onClick={() => {
                const link = document.createElement("a");
                link.href = "/resume.pdf";
                link.download = "Upayan Mazumder Resume.pdf";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            >
              Resume
            </button>

            <button
              className={heroStyles.cta__button}
              onClick={() => (window.location.href = "#clubs")}
            >
              Clubs
            </button>
            <button
              className={heroStyles.cta__button}
              onClick={() => (window.location.href = "#projects")}
            >
              Projects
            </button>
          </div>
        </div>
        <div className={heroStyles.right}>
          <img
            src="/upayan-transparent-cropped.avif"
            alt="Upayan Mazumder"
            className={heroStyles.image}
          />
          <Activity />
        </div>
      </div>
      <div className={heroStyles.info}>
        <OfficialLinks />
        <Technologies />
      </div>
    </div>
  );
}
