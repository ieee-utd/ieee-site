import React from 'react';
import styles from './who-we-are.module.css';
import conferenceImage from '../assets/gridimages/grid3.jpg';
import matchaImage from '../assets/gridimages/grid4.jpg';

const WhoWeAre = () => {
  return (
    // main section container
    <section className={styles.whoWeAre}>
      <div className={styles.container}>
        {/* 2x2 Grid layout container */}
        <div className={styles.gridContainer}>
          {/* Top Left Quadrant: main heading and organization description */}
          <div className={styles.titleSection}>
            <div className={styles.titleContent}>
              <h2 className={styles.title}>
                Who we are
                {/* underline element */}
                <span className={styles.underline}></span>
              </h2>
              <p className={styles.description}>
                IEEE UTD is one of the largest technical professional societies
                in the region!
              </p>
            </div>
          </div>

          {/* Top Right Quadrant: Conference Image*/}
          <div className={styles.imageSection}>
            <div className={styles.imageWrapper}>
              <img
                src={conferenceImage}
                alt="IEEE UTD Conference"
                className={styles.image}
              />
            </div>
          </div>

          {/* Bottom Left Quadrant: Event Image*/}
          <div className={styles.imageSection}>
            <div className={styles.imageWrapper}>
              <img
                src={matchaImage}
                alt="Matcha with Murata Event"
                className={styles.image}
              />
            </div>
          </div>

          {/* Bottom Right Quadrant: services and CTA button*/}
          <div className={styles.contentSection}>
            <div className={styles.contentWrapper}>
              <p className={styles.services}>
                We provide tutoring, societies, networking opportunities, and
                various events throughout the semester
              </p>
              {/* "Learn More" button w/placeholder link*/}
              <a href="about-us" className={styles.learnMoreButton}>
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoWeAre;
