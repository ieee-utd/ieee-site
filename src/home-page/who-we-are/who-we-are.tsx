import React, { useEffect, useRef, useState } from "react";
import styles from "./who-we-are.module.css";
import conferenceImage from "../../assets/gridimages/grid3.jpg";
import matchaImage from "../../assets/gridimages/grid4.jpg";

const highlights = [
  "Peer tutoring",
  "Technical societies",
  "Industry networking",
  "Events all semester",
];

const WhoWeAre = () => {
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
      { threshold: 0.18 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      className={`${styles.whoWeAre} ${revealed ? styles.revealed : ""}`}
      id="who-we-are"
      ref={sectionRef}
    >
      <div className={styles.container}>
        <div className={styles.layout}>
          <div className={styles.copy}>
            <p className={styles.eyebrow}>About the branch</p>
            <h2 className={styles.title}>Who we are</h2>
            <p className={styles.description}>
              IEEE UTD is one of the largest technical professional societies
              in the region. Students come here to learn with peers, meet
              people in the field, and take part in events all semester.
            </p>
            <ul className={styles.highlights}>
              {highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <a href="#what-we-do" className={styles.learnMoreButton}>
              See what we do
            </a>
          </div>

          <div className={styles.photos}>
            <div className={`${styles.photo} ${styles.photoPrimary}`}>
              <img src={conferenceImage} alt="IEEE UTD members at a conference" />
            </div>
            <div className={`${styles.photo} ${styles.photoSecondary}`}>
              <img src={matchaImage} alt="IEEE UTD Matcha with Murata event" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoWeAre;
