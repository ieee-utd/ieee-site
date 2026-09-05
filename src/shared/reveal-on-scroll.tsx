import React, { useEffect, useRef, useState } from "react";
import styles from "./reveal-on-scroll.module.css";

interface RevealOnScrollProps {
  children: React.ReactNode;
  className?: string;
}

const RevealOnScroll: React.FC<RevealOnScrollProps> = ({ children, className }) => {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = domRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => entry.isIntersecting && setVisible(true));
      },
      { threshold: 0.15 }
    );

    observer.observe(node);

    return () => {
      observer.unobserve(node);
    };
  }, []);

  return (
    <div
      ref={domRef}
      className={`${styles.reveal} ${isVisible ? styles.visible : ""} ${className || ""}`}
    >
      {children}
    </div>
  );
};

export default RevealOnScroll;
