'use client';

import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import { FaPalette } from 'react-icons/fa';
import styles from './theme.module.css';

const themes = {
  light: { '--background-color': 'white', '--color': 'black' },
  dark: { '--background-color': 'black', '--color': 'white' },
  pastel: { '--background-color': 'linear-gradient(135deg, #ffebcd, #f5c7c7)', '--color': '#5d5d5d' },
  nature: { '--background-color': 'url("https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg") center/cover no-repeat', '--color': '#1d3557' },
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
  neon: { '--background-color': 'linear-gradient(90deg, #0ff, #f0f)', '--color': '#000' },
  cyberpunk: { '--background-color': 'url("https://images4.alphacoders.com/856/thumb-1920-856858.jpg") center/cover no-repeat', '--color': '#ffffff' },
  monochrome: { '--background-color': 'linear-gradient(160deg, #555, #888)', '--color': '#eee' },
  amethyst: { '--background-color': 'linear-gradient(45deg, #9966cc, #f0e6f6)', '--color': '#f0e6f6' },
  excited: { '--background-color': 'linear-gradient(135deg, #f72585, #7209b7)', '--color': '#ffffff' },
};

const moodToThemes = {
  Dark: ['dark'],
  Light: ['light'],
  Happy: ['pastel', 'neon', 'sunset'],
  Calm: ['nature', 'ocean', 'amethyst'],
  Adventurous: ['ocean', 'cyberpunk', 'neon'],
  Romantic: ['sunset', 'amethyst', 'pastel'],
  Cozy: ['monochrome', 'light', 'amethyst'],
  Excited: ['excited', 'neon'],
  Mysterious: ['cyberpunk', 'dark'],
  Focused: ['monochrome', 'dark', 'ocean'],
  Dreamy: ['amethyst', 'pastel', 'sunset'],
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