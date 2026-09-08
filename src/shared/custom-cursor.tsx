import React, { useEffect, useRef, useState } from "react";
import styles from "./custom-cursor.module.css";

const CustomCursor: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(false);
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

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isEnabled]);

  if (!isEnabled) return null;

  return <div ref={cursorRef} className={styles.cursor} aria-hidden="true" />;
};

export default CustomCursor;
