import { useEffect, useState } from "react";

// Watches document.documentElement's data-theme attribute (set by
// ThemeToggle) so components can react live when the user switches themes.
export const useIsDarkMode = (): boolean => {
  const [isDark, setIsDark] = useState(
    () => document.documentElement.getAttribute("data-theme") === "dark"
  );

  useEffect(() => {
    const target = document.documentElement;
    const observer = new MutationObserver(() => {
      setIsDark(target.getAttribute("data-theme") === "dark");
    });
    observer.observe(target, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  return isDark;
};
