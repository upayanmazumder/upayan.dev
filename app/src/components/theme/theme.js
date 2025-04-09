'use client';

import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import { FaPalette } from 'react-icons/fa';
import styles from './theme.module.css';

const themes = {
  light: { '--background-color': 'lightgray', '--color': 'black' },
  dark: { '--background-color': 'black', '--color': 'white' },
  monochrome: { '--background-color': 'linear-gradient(160deg, #555, #888)', '--color': '#eee' },
  pastel: { '--background-color': 'linear-gradient(135deg, #ffebcd, #f5c7c7)', '--color': '#5d5d5d' },
  ocean: {
    '--background-color': `
      radial-gradient(at top left, #0a344a 40%, transparent 60%),
      radial-gradient(at top right, #08283d 40%, transparent 60%),
      radial-gradient(at bottom left, #2e4d5b 40%, transparent 60%),
      radial-gradient(at bottom right, #114256 40%, transparent 60%)
    `,
    '--color': '#caf0f8',
  },
  sunset: { '--background-color': 'linear-gradient(120deg, #ff6f61, #ff9a8b)', '--color': '#2d3436' },
  amethyst: { '--background-color': 'linear-gradient(45deg, #9966cc, #f0e6f6)', '--color': '#f0e6f6' },
  neon: { '--background-color': 'linear-gradient(90deg, #0ff, #f0f)', '--color': '#000' },
  cyberpunk: {
    '--background-color': 'linear-gradient(120deg, #0f0c29, #302b63, #24243e)',
    '--color': '#ffffff'
  },
  excited: { '--background-color': 'linear-gradient(135deg, #f72585, #7209b7)', '--color': '#ffffff' },
};

const moodToThemes = {
  Dark: ['dark'],
  Light: ['light'],
  Happy: ['sunset', 'pastel'],
  Calm: ['ocean', 'amethyst'],
  Romantic: ['sunset', 'amethyst'],
  Adventurous: ['cyberpunk', 'ocean'],
  Cozy: ['monochrome', 'light'],
  Excited: ['neon', 'excited'],
  Mysterious: ['cyberpunk', 'dark'],
  Focused: ['monochrome', 'ocean'],
  Dreamy: ['pastel', 'amethyst'],
};


const ThemeContext = createContext();

const ThemeManager = ({ children }) => {
  const [selectedMood, setSelectedMood] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('mood') || 'Dark';
    }
    return 'Dark';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('mood', selectedMood);
    }
  }, [selectedMood]);

  const theme = useMemo(() => {
    const themesForMood = moodToThemes[selectedMood] || moodToThemes['Dark'];
    const chosen = themesForMood[Math.floor(Math.random() * themesForMood.length)];
    return themes[chosen];
  }, [selectedMood]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = document.documentElement;
      Object.entries(theme).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ selectedMood, setSelectedMood }}>
      {children}
    </ThemeContext.Provider>
  );
};

const MoodSelector = () => {
  const { selectedMood, setSelectedMood } = useContext(ThemeContext);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`${styles.moodWidget} ${isOpen ? styles.open : ''}`}>
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
            <option key={mood} value={mood}>
              {mood}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export { ThemeManager, MoodSelector };