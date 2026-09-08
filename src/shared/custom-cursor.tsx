import React, { useEffect, useRef, useState } from "react";
import styles from "./custom-cursor.module.css";

const CustomCursor: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supportsFinePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;
    setIsEnabled(supportsFinePointer);
  }, []);

  useEffect(() => {
    if (!isEnabled) return;

    const handleMouseMove = (event: MouseEvent) => {
      const el = cursorRef.current;
      if (!el) return;
      el.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
    };

    // relatedTarget is null when the mouse leaves the browser window
    // entirely (as opposed to moving between elements on the page).
    const handleMouseOut = (event: MouseEvent) => {
      if (!event.relatedTarget) setIsVisible(false);
    };

    const handleMouseOver = () => setIsVisible(true);

    document.addEventListener("mousemove", handleMouseMove);
    document.documentElement.addEventListener("mouseout", handleMouseOut);
    document.documentElement.addEventListener("mouseover", handleMouseOver);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.documentElement.removeEventListener("mouseout", handleMouseOut);
      document.documentElement.removeEventListener("mouseover", handleMouseOver);
    };
  }, [isEnabled]);

  if (!isEnabled) return null;

  return (
    <div
      ref={cursorRef}
      className={`${styles.cursor} ${isVisible ? "" : styles.hidden}`}
      aria-hidden="true"
    />
  );
};

export default CustomCursor;
