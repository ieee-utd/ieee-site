import React, { useEffect, useRef, useState } from "react";
import styles from "./what-we-do.module.css";
import eventsImage from "../../assets/gridimages/what-we-do-events.jpg";
import tutoringImage from "../../assets/gridimages/tutoring.png";
import workshopsImage from "../../assets/gridimages/what-we-do-workshops.jpg";
import societiesImage from "../../assets/gridimages/what-we-do-societies.jpg";
import hknImage from "../../assets/gridimages/hkn-tabling.jpg";
import Skeleton from "../../shared/skeleton";

interface Offering {
  title: string;
  /** Left out for a card with no real photo yet — a placeholder spot is
   * shown instead of mismatching it to an unrelated existing photo. */
  image?: string;
  href: string;
  alt: string;
  description: string;
}

const offerings: Offering[] = [
  {
    title: "Events",
    image: eventsImage,
    href: "/events",
    alt: "IEEE UTD event",
    description:
      "Talks, mixers, and socials throughout the semester so you can learn and meet people.",
  },
  {
    title: "Tutoring",
    image: tutoringImage,
    href: "/tutoring",
    alt: "IEEE UTD tutoring",
    description:
      "Peer tutoring for core courses, with a room and calendar you can actually use.",
  },
  {
    title: "Workshops",
    image: workshopsImage,
    href: "/events",
    alt: "IEEE UTD workshop",
    description:
      "Hands-on sessions to build skills you can put on a project or a resume.",
  },
  {
    title: "Societies",
    image: societiesImage,
    href: "/societies",
    alt: "IEEE UTD societies",
    description:
      "Join a technical society and work with students who care about the same topics.",
  },
  {
    title: "Branches",
    href: "/branch",
    alt: "IEEE UTD branch team",
    description:
      "Pick a branch — Engineering, Initiatives, and more — and work with a team on something ongoing.",
  },
  {
    title: "HKN",
    image: hknImage,
    href: "/hkn",
    alt: "IEEE-HKN members tabling at UT Dallas",
    description:
      "Eta Kappa Nu is IEEE's honor society, recognizing Scholarship, Character, and Attitude.",
  },
];

const WhatWeDo = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);
  // One loaded flag per card, keyed by title, so each image's skeleton
  // clears independently instead of waiting on all four.
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const markLoaded = (title: string) =>
    setLoadedImages((prev) => ({ ...prev, [title]: true }));

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      className={`${styles.whatWeDo} ${revealed ? styles.revealed : ""}`}
      id="what-we-do"
      ref={sectionRef}
    >
      <div className={styles.container}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Get involved</p>
          <h2 className={styles.title}>What we do</h2>
          <p className={styles.lede}>
            Six ways to plug in, whether you want help in a class, a project
            team, or a reason to show up on campus.
          </p>
        </header>

        <div className={styles.grid}>
          {offerings.map((item) => (
            <article className={styles.card} key={item.title}>
              <div className={styles.imageWrap}>
                {item.image ? (
                  <>
                    {!loadedImages[item.title] && <Skeleton />}
                    <img
                      src={item.image}
                      alt={item.alt}
                      // .loaded here combines with .imageWrap img's own opacity +
                      // hover-zoom transition in what-we-do.module.css (keeping
                      // this a className, not an inline style, is what lets
                      // prefers-reduced-motion still turn both off there)
                      className={loadedImages[item.title] ? styles.loaded : ""}
                      onLoad={() => markLoaded(item.title)}
                      onError={() => markLoaded(item.title)}
                    />
                  </>
                ) : (
                  <div className={styles.photoSpot} aria-label={item.alt} role="img">
                    <span>Photo</span>
                  </div>
                )}
              </div>
              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardCopy}>{item.description}</p>
                <a href={item.href} className={styles.link}>
                  Find out more
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatWeDo;
