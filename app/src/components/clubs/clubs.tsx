/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { FaLink, FaLinkedin } from "react-icons/fa";
import clubs from "../../data/clubs.json";
import styles from "./clubs.module.css";
import Card from "../ui/card/card";

const ClubShowcase: React.FC = () => {
  const isLinkedIn = (url: string) => {
    try {
      const parsedUrl = new URL(url);
      return (
        parsedUrl.host === "linkedin.com" ||
        parsedUrl.host.endsWith(".linkedin.com")
      );
    } catch {
      return false;
    }
  };

  return (
    <div className={styles.container} id="clubs">
      <h1 className={styles.title}>Clubs</h1>
      <div className={styles.grid}>
        {clubs.map((club, index) => (
          <Card
            key={index}
            className={styles.card}
            content={
              <>
                <img src={club.icon} alt={club.name} className={styles.image} />
                <h2 className={styles.name}>{club.name}</h2>
                <p className={styles.description}>{club.description}</p>
                <div className={styles.links}>
                  {club.links.map((link, i) => (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.link}
                    >
                      {isLinkedIn(link.url) ? <FaLinkedin /> : <FaLink />}
                    </a>
                  ))}
                </div>
              </>
            }
            title={""}
          />
        ))}
      </div>
    </div>
  );
};

export default ClubShowcase;
