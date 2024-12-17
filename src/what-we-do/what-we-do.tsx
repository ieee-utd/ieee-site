import React from "react";
import styles from "./what-we-do.module.css";

const WhatWeDo = () => {
  return (
    // main section container
    <section className={styles.WhatWeDo}>
      <div className={styles.container}>
        {/* Top Section: main heading */}
        <div className={styles.titleSection}>
          <h2 className={styles.title}>
            What We Do
            <span className={styles.underline}></span>
          </h2>
        </div>

        {/* White Squares Section */}
        <div className={styles.gridContainer}>
          <div className={styles.squareBox}>
            <h3>Tutoring</h3>
            <p>
              We tutor various CE/CS courses during the week between 10am-4pm.
            </p>
            <button className={styles.learnMoreButton}>Learn More</button>
          </div>
          <div className={styles.squareBox}>
            <h3>Workshops</h3>
            <p>Join us for weekly coding and software workshops.</p>
            <button className={styles.learnMoreButton}>Learn More</button>
          </div>
          <div className={styles.squareBox}>
            <h3>Projects</h3>
            <p>Collaborate on open-source and AI-driven projects.</p>
            <button className={styles.learnMoreButton}>Learn More</button>
          </div>
          <div className={styles.squareBox}>
            <h3>Events</h3>
            <p>Participate in hackathons, seminars, and competitions.</p>
            <button className={styles.learnMoreButton}>Learn More</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatWeDo;
