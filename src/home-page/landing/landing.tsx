import React, { useState, useEffect } from "react";
import Styles from "./landing.module.css";
import image1 from "../../assets/carousel1.jpg";
import image2 from "../../assets/carousel4.jpg";
import image3 from "../../assets/4.jpg";
import UtdSeal from "../../assets/UTDLogo.png";
import ieeeLogo from "../../assets/ieeelogotransparent.png";

const images = [image1, image2, image3];

const MOTTOS = [
  "Advancing Technology for Humanity",
  "Inspiring Innovation, Empowering Tomorrow",
  "Connecting Technology and Community",
  "Learn. Build. Innovate.",
  "Engineering a Better Future",
  "Where Technology Meets Opportunity",
  "Creating Impact Through Innovation",
  "Empowering Engineers, Shaping the Future",
  "Innovation Starts Here",
  "Building the Future Together",
];

const usePrefersReducedMotion = (): boolean => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReducedMotion(media.matches);

    update();
    media.addEventListener("change", update);

    return () => media.removeEventListener("change", update);
  }, []);

  return prefersReducedMotion;
};

const useTypewriter = (
  texts: string[],
  speed: number,
  enabled: boolean
): string => {
  const [textIndex, setTextIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState(
    enabled ? "" : texts[0]
  );
  const [index, setIndex] = useState(enabled ? 0 : texts[0].length);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setDisplayedText(texts[textIndex]);
      return;
    }

    const text = texts[textIndex];

    if (isDeleting) {
      if (index > 0) {
        const timeout = setTimeout(() => {
          setDisplayedText(text.slice(0, index - 1));
          setIndex((prev) => prev - 1);
        }, speed / 2);

        return () => clearTimeout(timeout);
      }

      // Move to the next motto after deleting
      const nextTextTimeout = setTimeout(() => {
        setTextIndex((prev) => (prev + 1) % texts.length);
        setIsDeleting(false);
        setIndex(0);
      }, 700);

      return () => clearTimeout(nextTextTimeout);
    }

    // Type the current motto
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, index + 1));
        setIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }

    // Hold the completed motto
    const holdTimeout = setTimeout(() => {
      setIsDeleting(true);
    }, 5000);

    return () => clearTimeout(holdTimeout);
  }, [enabled, index, textIndex, texts, speed, isDeleting]);

  return displayedText;
};

const Landing: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const prefersReducedMotion = usePrefersReducedMotion();

  const typewriterText = useTypewriter(
    MOTTOS,
    42,
    !prefersReducedMotion
  );

  useEffect(() => {
    if (paused || prefersReducedMotion) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % images.length
      );
    }, 8000);

    return () => clearInterval(interval);
  }, [paused, prefersReducedMotion]);

  return (
    <section
      className={Styles.hero}
      aria-label="IEEE at UT Dallas"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {images.map((image, index) => (
        <div
          key={image}
          className={`${Styles.slide} ${
            index === currentImageIndex ? Styles.active : ""
          }`}
          style={{ backgroundImage: `url(${image})` }}
          role="img"
          aria-hidden={index !== currentImageIndex}
        />
      ))}

      <div className={Styles.overlay} />

      <div className={Styles.content}>
        <img
          className={Styles.brandMark}
          src={ieeeLogo}
          alt="IEEE"
        />

        <p className={Styles.eyebrow}>
          Student Branch · UT Dallas
        </p>

        <h1 className={Styles.title}>
          IEEE at UT Dallas
        </h1>

        <p className={Styles.subhead}>
          Institute of Electrical and Electronics Engineers
        </p>

        <p className={Styles.motto} aria-live="polite">
          {typewriterText}
          {!prefersReducedMotion && (
            <span className={Styles.cursor} />
          )}
        </p>

        <div className={Styles.actions}>
          <a href="#who-we-are" className={Styles.primaryBtn}>
            Find out more
          </a>

          <a
            href="https://discord.gg/8SXQe9pGu9"
            className={Styles.secondaryBtn}
            target="_blank"
            rel="noreferrer"
          >
            Join Discord
          </a>
        </div>

      </div>

      <img
        className={Styles.watermark}
        src={UtdSeal}
        alt=""
      />

      <div className={Styles.controls}>
        <div
          className={Styles.dots}
          role="tablist"
          aria-label="Hero photos"
        >
          {images.map((_, index) => (
            <button
              key={index}
              type="button"
              role="tab"
              aria-selected={index === currentImageIndex}
              aria-label={`Show photo ${index + 1}`}
              className={`${Styles.dot} ${
                index === currentImageIndex
                  ? Styles.dotActive
                  : ""
              }`}
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Landing;
