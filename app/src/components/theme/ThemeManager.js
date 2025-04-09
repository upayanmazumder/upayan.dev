'use client'

import React, { createContext, useState, useEffect, useContext, useMemo } from "react";
import { ThemeProvider as StyledThemeProvider, createGlobalStyle } from "styled-components";
import { FaPalette } from "react-icons/fa";
import styles from "./ThemeManager.module.css";

const themes = {
  light: { background: "#ffffff", color: "#000000" },
  dark: { background: "#121212", color: "#ffffff" },
  pastel: { background: "linear-gradient(135deg, #ffebcd, #f5c7c7)", color: "#5d5d5d" },
  nature: { background: "url('https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg') center/cover no-repeat", color: "#1d3557" },
  ocean: {
    background: `
      radial-gradient(at top left, #0a344a 40%, transparent 60%),
      radial-gradient(at top right, #08283d 40%, transparent 60%),
      radial-gradient(at bottom left, #2e4d5b 40%, transparent 60%),
      radial-gradient(at bottom right, #114256 40%, transparent 60%)
    `,
    color: "#caf0f8"
  },
  sunset: { background: "linear-gradient(120deg, #ff6f61, #ff9a8b)", color: "#2d3436" },
  neon: { background: "linear-gradient(90deg, #0ff, #f0f)", color: "#000" },
  cyberpunk: { background: "url('https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg') center/cover no-repeat", color: "#0c0032" },
  monochrome: { background: "linear-gradient(160deg, #555, #888)", color: "#eee" },
  amethyst: { background: "linear-gradient(45deg, #9966cc, #f0e6f6)", color: "#f0e6f6" },
  excited: { background: "url('https://media.giphy.com/media/l0HU20BZ6LbSEITza/giphy.gif') center/cover no-repeat", color: "#ffffff" },
};

const moodToThemes = {
  Dark: ["dark"],
  Light: ["light"],
  Happy: ["pastel", "neon"],
  Calm: ["nature", "ocean"],
  Adventurous: ["ocean", "cyberpunk"],
  Romantic: ["sunset", "amethyst"],
  Cozy: ["coffee", "monochrome"],
  Excited: ["excited"],
  Mysterious: ["cyberpunk", "monochrome"],
  Focused: ["monochrome", "dark"],
  Dreamy: ["amethyst", "pastel"],
};

const GlobalStyles = createGlobalStyle`
  body {
    background: ${({ theme }) => (theme.video ? "none" : theme.background)};
    color: ${({ theme }) => theme.color};
    transition: background 0.7s ease, color 0.3s ease;
  }
  iframe.bg-video {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: -1;
  }
`;

const ThemeContext = createContext();

const ThemeManager = ({ children }) => {
  const [selectedMood, setSelectedMood] = useState(localStorage.getItem("mood") || "Happy");

  const theme = useMemo(() => {
    const themesForMood = moodToThemes[selectedMood] || ["dark"];
    return { ...themes[themesForMood[Math.floor(Math.random() * themesForMood.length)]], mood: selectedMood };
  }, [selectedMood]);

  useEffect(() => {
    localStorage.setItem("mood", selectedMood);
  }, [selectedMood]);

  return (
    <ThemeContext.Provider value={{ selectedMood, setSelectedMood }}>
      <StyledThemeProvider theme={theme}>
        <GlobalStyles />
        {theme.video && (
          <iframe
            className="bg-video"
            src={theme.background + "?autoplay=1&loop=1&controls=0&mute=1"}
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
            title="Rick Astley - Never Gonna Give You Up"
          ></iframe>
        )}
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};

const MoodSelector = () => {
  const { selectedMood, setSelectedMood } = useContext(ThemeContext);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`${styles.moodWidget} ${isOpen ? styles.open : ""}`}>
      <button className={styles.moodButton} onClick={() => setIsOpen(!isOpen)} aria-label="Select Mood">
        <FaPalette size={15} />
      </button>
      <div className={styles.moodContainer}>
        <label htmlFor="mood-selector" className={styles.moodLabel}>
          Select your mood:
        </label>
        <select
          id="mood-selector"
          value={selectedMood}
          onChange={(e) => setSelectedMood(e.target.value)}
          className={styles.moodSelect}
        >
          {Object.keys(moodToThemes).map((mood) => (
            <option key={mood} value={mood}>{mood}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export { ThemeManager, MoodSelector };