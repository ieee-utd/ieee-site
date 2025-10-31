import React, { useEffect } from "react";
import styles from "./what-we-do.module.css";
import eventsImage from "../../assets/gridimages/events.png";
import tutoringImage from "../../assets/gridimages/tutoring.png";
import workshopsImage from "../../assets/gridimages/workshops.png";
import societiesImage from "../../assets/gridimages/Societies.png";

const WhatWeDo = () => {
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll(`.${styles.section}`);
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          section.classList.add(styles.visible);
        } else {
          section.classList.remove(styles.visible);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section className={styles.whatWeDo} id="what-we-do">
      <div className={styles.container}>
        <div className={styles.gridContainer}>
          <div className={`${styles.section} ${styles.hidden}`}>
            <div className={styles.imageWrapper}>
              <img src={eventsImage} alt="Events" className={styles.image} />
            </div>
            <div className={styles.contentWrapper}>
              <h3>Events</h3>
              <p>
                From talks to networking events, we organize numerous events to
                keep you engaged and learning.
              </p>
              <a href="/events" className={styles.link}>
                Find Out More
              </a>
            </div>
          </div>

          <div className={`${styles.section} ${styles.hidden}`}>
            <div className={styles.imageWrapper}>
              <img
                src={tutoringImage}
                alt="Tutoring"
                className={styles.image}
              />
            </div>
            <div className={styles.contentWrapper}>
              <h3>Tutoring</h3>
              <p>
                Offering peer tutoring sessions to help you excel in your
                studies.
              </p>
              <a href="/tutoring" className={styles.link}>
                Find Out More
              </a>
            </div>
          </div>

          <div className={`${styles.section} ${styles.hidden}`}>
            <div className={styles.imageWrapper}>
              <img
                src={workshopsImage}
                alt="Workshops"
                className={styles.image}
              />
            </div>
            <div className={styles.contentWrapper}>
              <h3>Workshops</h3>
              <p>
                Hands-on workshops to build skills and gain practical
                experience.
              </p>
              <a href="/workshops" className={styles.link}>
                Find Out More
              </a>
            </div>
          </div>

          <div className={`${styles.section} ${styles.hidden}`}>
            <div className={styles.imageWrapper}>
              <img
                src={societiesImage}
                alt="Societies"
                className={styles.image}
              />
            </div>
            <div className={styles.contentWrapper}>
              <h3>Societies</h3>
              <p>
                Join one of our many societies to connect with like-minded
                individuals.
              </p>
              <a href="/societies" className={styles.link}>
                Find Out More
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatWeDo;
