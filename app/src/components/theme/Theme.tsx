"use client";

import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useMemo,
  useRef,
  ReactNode,
} from "react";
import { FaPalette } from "react-icons/fa";
import styles from "./Theme.module.css";

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

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [selectedTheme, setSelectedTheme] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "space";
    }
    return "space";
  });

  const theme = useMemo(
    () => themes[selectedTheme] || themes.space,
    [selectedTheme]
  );

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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
  }, [selectedTheme, theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const starColors = [
      "rgba(255, 255, 255, 0.8)",
      "rgba(255, 255, 200, 0.7)",
      "rgba(230, 230, 250, 0.6)",
      "rgba(255, 250, 205, 0.7)",
      "rgba(240, 248, 255, 0.5)",
    ];

    const stars = Array.from({ length: 70 }).map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: Math.random() * 2.5,
      vx: (Math.random() - 0.5) * 0.1,
      vy: (Math.random() - 0.5) * 0.1,
      color: starColors[Math.floor(Math.random() * starColors.length)],
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const star of stars) {
        ctx.fillStyle = star.color;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();

        star.x += star.vx;
        star.y += star.vy;

        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;
      }
      requestAnimationFrame(draw);
    };

    resizeCanvas();
    draw();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <ThemeContext.Provider value={{ selectedTheme, setSelectedTheme }}>
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: -1,
          width: "100%",
          height: "100%",
        }}
      />
      {children}
    </ThemeContext.Provider>
  );
};

const ThemeSelector: React.FC = () => {
  const { selectedTheme, setSelectedTheme } = useContext(ThemeContext)!;
  const selectorRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
          <label className={styles.label}>Select theme:</label>
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
                  Object.entries(themes[selectedTheme]).forEach(
                    ([cssVar, value]) => {
                      if (cssVar.startsWith("--")) {
                        root.style.setProperty(cssVar, value);
                      }
                    }
                  );
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

export { ThemeProvider, ThemeSelector };
