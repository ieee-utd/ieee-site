import React, { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import styles from "./theme-toggle.module.css";

type Theme = "light" | "dark";

const THEME_STORAGE_KEY = "theme";

const getInitialTheme = (): Theme => {
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

interface ThemeToggleProps {
  className?: string;
  /** True when the fixed nav is scrolled over a light/white section. */
  isOnLight?: boolean;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className, isOnLight }) => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <button
      type="button"
      className={`${styles.themeToggle} ${isOnLight ? styles.onLight : ""} ${className || ""}`}
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? <FaMoon /> : <FaSun />}
    </button>
  );
};

export default ThemeToggle;
