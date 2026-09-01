import React, { useEffect, useRef, useState } from "react";
import styles from "./what-we-do.module.css";
import eventsImage from "../../assets/gridimages/events.png";
import tutoringImage from "../../assets/gridimages/tutoring.png";
import workshopsImage from "../../assets/gridimages/workshops.png";
import societiesImage from "../../assets/gridimages/Societies.png";

const offerings = [
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
    href: "/workshops",
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
];

const WhatWeDo = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);

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
            Four ways to plug in, whether you want help in a class, a project
            team, or a reason to show up on campus.
          </p>
        </header>

        <div className={styles.grid}>
          {offerings.map((item) => (
            <article className={styles.card} key={item.title}>
              <div className={styles.imageWrap}>
                <img src={item.image} alt={item.alt} />
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
