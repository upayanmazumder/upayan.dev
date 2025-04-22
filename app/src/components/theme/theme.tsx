"use client";

import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useMemo,
  ReactNode,
} from "react";
import { FaPalette } from "react-icons/fa";
import styles from "./theme.module.css";

interface Theme {
  name: string;
  "--background-color": string;
  "--color": string;
}

interface ThemeContextType {
  selectedTheme: string;
  setSelectedTheme: React.Dispatch<React.SetStateAction<string>>;
}

const themes: Record<string, Theme> = {
  dark: {
    name: "Dark",
    "--background-color": "black",
    "--color": "white",
  },
  noir: {
    name: "Noir",
    "--background-color": "linear-gradient(135deg, #000000, #434343)",
    "--color": "#ffffff",
  },
  midnight: {
    name: "Midnight",
    "--background-color": "linear-gradient(120deg, #232526, #414345)",
    "--color": "#dcdcdc",
  },
  space: {
    name: "Space",
    "--background-color":
      "radial-gradient(circle at 30% 30%, #1a1a2e, #16213e, #0f3460)",
    "--color": "#e0e0e0",
  },
  ocean: {
    name: "Ocean",
    "--background-color": `
      radial-gradient(at top left, #0a344a 40%, transparent 60%),
      radial-gradient(at top right, #08283d 40%, transparent 60%),
      radial-gradient(at bottom left, #2e4d5b 40%, transparent 60%),
      radial-gradient(at bottom right, #114256 40%, transparent 60%)
    `,
    "--color": "#caf0f8",
  },
  aurora: {
    name: "Aurora",
    "--background-color": "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
    "--color": "#e0f7fa",
  },
  cyberpunk: {
    name: "Cyberpunk",
    "--background-color": "linear-gradient(120deg, #0f0c29, #302b63, #24243e)",
    "--color": "#fff",
  },
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeManagerProps {
  children: ReactNode;
}

const ThemeManager: React.FC<ThemeManagerProps> = ({ children }) => {
  const [selectedTheme, setSelectedTheme] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "space";
    }
    return "space";
  });

  const theme = useMemo(() => {
    return themes[selectedTheme] || themes.space;
  }, [selectedTheme]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", selectedTheme);
      const root = document.documentElement;
      Object.entries(theme).forEach(([key, value]) => {
        if (key.startsWith("--")) {
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

const ThemeSelector: React.FC = () => {
  const { selectedTheme, setSelectedTheme } = useContext(
    ThemeContext
  ) as ThemeContextType;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const selectorRef = React.useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectorRef.current &&
        !selectorRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
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
          <label htmlFor="theme-select" className={styles.label}>
            Select theme:
          </label>
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
                    if (cssVar.startsWith("--")) {
                      root.style.setProperty(cssVar, value);
                    }
                  });
                }}
                onMouseLeave={() => {
                  const root = document.documentElement;
                  const currentTheme = themes[selectedTheme];
                  Object.entries(currentTheme).forEach(([cssVar, value]) => {
                    if (cssVar.startsWith("--")) {
                      root.style.setProperty(cssVar, value);
                    }
                  });
                }}
                style={{
                  background: theme["--background-color"],
                  color: theme["--color"],
                  border:
                    selectedTheme === key
                      ? "2px solid white"
                      : "1px solid #aaa",
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
