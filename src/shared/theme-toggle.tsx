import React, { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import styles from "./theme-toggle.module.css";

type Theme = "light" | "dark";

const THEME_STORAGE_KEY = "theme";
const THEME_CHANGE_EVENT = "ieee-theme-change";

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

// The nav renders this twice (desktop + mobile layouts), each with its own
// component instance. A same-tab custom event keeps both icons in sync
// regardless of which one the user actually clicked.
const ThemeToggle: React.FC<ThemeToggleProps> = ({ className, isOnLight }) => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    const handleThemeChange = (event: Event) => {
      const nextTheme = (event as CustomEvent<Theme>).detail;
      setTheme(nextTheme);
    };

    window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange);
    return () => window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange);
  }, []);

  const toggleTheme = () => {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", nextTheme);
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, { detail: nextTheme }));
    setTheme(nextTheme);
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
