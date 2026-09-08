import React, { useEffect, useRef, useState } from "react";
import styles from "./custom-cursor.module.css";

const TEXT_SELECTOR =
  "p, h1, h2, h3, h4, h5, h6, span, a, li, label, strong, em, b, td, th, button, blockquote, figcaption";

const CustomCursor: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isOverText, setIsOverText] = useState(false);
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

    const handleMouseOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      setIsOverText(Boolean(target.closest && target.closest(TEXT_SELECTOR)));
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseover", handleMouseOver);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
    };
  }, [isEnabled]);

  if (!isEnabled) return null;

  return (
    <div
      ref={cursorRef}
      className={`${styles.cursor} ${isOverText ? styles.xray : ""}`}
      aria-hidden="true"
    />
  );
};

export default CustomCursor;
