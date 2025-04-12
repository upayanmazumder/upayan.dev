'use client';

import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import { FaPalette } from 'react-icons/fa';
import styles from './theme.module.css';

const themes = {
  light: {
    name: 'Light',
    '--background-color': 'lightgray',
    '--color': 'black',
  },
  dark: {
    name: 'Dark',
    '--background-color': 'black',
    '--color': 'white',
  },
  ocean: {
    name: 'Ocean',
    '--background-color': `
      radial-gradient(at top left, #0a344a 40%, transparent 60%),
      radial-gradient(at top right, #08283d 40%, transparent 60%),
      radial-gradient(at bottom left, #2e4d5b 40%, transparent 60%),
      radial-gradient(at bottom right, #114256 40%, transparent 60%)
    `,
    '--color': '#caf0f8',
  },
  cyberpunk: {
    name: 'Cyberpunk',
    '--background-color': 'linear-gradient(120deg, #0f0c29, #302b63, #24243e)',
    '--color': '#fff',
  },
  forest: {
    name: 'Forest',
    '--background-color': 'linear-gradient(120deg, #2b580c, #639a67, #a3c4bc)',
    '--color': '#f4f4f9',
  },
  sunset: {
    name: 'Sunset',
    '--background-color': 'linear-gradient(120deg, #ff7e5f, #feb47b)',
    '--color': '#2c3e50',
  },
  pastel: {
    name: 'Pastel',
    '--background-color': 'linear-gradient(120deg, #ff9a9e, #fad0c4)',
    '--color': '#6a0572',
  },
  midnight: {
    name: 'Midnight',
    '--background-color': 'linear-gradient(120deg, #232526, #414345)',
    '--color': '#dcdcdc',
  },
  aurora: {
    name: 'Aurora',
    '--background-color': 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
    '--color': '#e0f7fa',
  },
  space: {
    name: 'Space',
    '--background-color': 'radial-gradient(circle at 30% 30%, #1a1a2e, #16213e, #0f3460)',
    '--color': '#e0e0e0',
  },
  sakura: {
    name: 'Sakura',
    '--background-color': 'linear-gradient(135deg, #ffe3e3, #ffc1cc)',
    '--color': '#5c3c3c',
  },
  desert: {
    name: 'Desert',
    '--background-color': 'linear-gradient(120deg, #edc9af, #d2b48c, #c19a6b)',
    '--color': '#3e2f1c',
  },
  mint: {
    name: 'Mint',
    '--background-color': 'linear-gradient(120deg, #98ff98, #b2f7ef)',
    '--color': '#065535',
  },
  noir: {
    name: 'Noir',
    '--background-color': 'linear-gradient(135deg, #000000, #434343)',
    '--color': '#ffffff',
  },
  lavender: {
    name: 'Lavender',
    '--background-color': 'linear-gradient(120deg, #e0c3fc, #8ec5fc)',
    '--color': '#4b0082',
  },
  winter: {
    name: 'Winter',
    '--background-color': 'linear-gradient(120deg, #a8c0ff, #3f2b96)',
    '--color': '#ffffff',
  },
  spring: {
    name: 'Spring',
    '--background-color': 'linear-gradient(120deg, #f6d365, #fda085)',
    '--color': '#2c3e50',
  },
};

const ThemeContext = createContext();

const ThemeManager = ({ children }) => {
  const [selectedTheme, setSelectedTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'ocean';
    }
    return 'ocean';
  });

  const theme = useMemo(() => {
    return themes[selectedTheme] || themes.ocean;
  }, [selectedTheme]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', selectedTheme);
      const root = document.documentElement;
      Object.entries(theme).forEach(([key, value]) => {
        if (key.startsWith('--')) {
          root.style.setProperty(key, value);
        }
      });
    }
  }, [theme, selectedTheme]);

  return (
    <ThemeContext.Provider value={{ selectedTheme, setSelectedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

const ThemeSelector = () => {
  const { selectedTheme, setSelectedTheme } = useContext(ThemeContext);
  const [isOpen, setIsOpen] = useState(false);
  const selectorRef = React.useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectorRef.current && !selectorRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.widget} ref={selectorRef}>
      <button
        className={styles.toggleButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select Theme"
        aria-expanded={isOpen}
      >
        <FaPalette size={15} />
      </button>

      {isOpen && (
        <div className={styles.selector}>
          <label htmlFor="theme-select" className={styles.label}>Select theme:</label>
          <div className={styles.options}>
            {Object.entries(themes).map(([key, theme]) => (
              <button
                key={key}
                className={styles.option}
                onClick={() => {
                  setSelectedTheme(key);
                  setIsOpen(false);
                }}
                onMouseEnter={() => {
                  const root = document.documentElement;
                  Object.entries(theme).forEach(([cssVar, value]) => {
                    if (cssVar.startsWith('--')) {
                      root.style.setProperty(cssVar, value);
                    }
                  });
                }}
                onMouseLeave={() => {
                  const root = document.documentElement;
                  const currentTheme = themes[selectedTheme];
                  Object.entries(currentTheme).forEach(([cssVar, value]) => {
                    if (cssVar.startsWith('--')) {
                      root.style.setProperty(cssVar, value);
                    }
                  });
                }}
                style={{
                  background: theme['--background-color'],
                  color: theme['--color'],
                  border: selectedTheme === key ? '2px solid white' : '1px solid #aaa',
                }}
              >
                {theme.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};


export { ThemeManager, ThemeSelector };
