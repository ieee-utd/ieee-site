import React, { useEffect } from 'react';
import styles from './who-we-are.module.css';
import conferenceImage from '../assets/gridimages/grid3.jpg';
import matchaImage from '../assets/gridimages/grid4.jpg';

const WhoWeAre = () => {
  useEffect(() => {
    const handleScroll = () => {
      const imageSections = document.querySelectorAll(`.${styles.imageSection}`);
      imageSections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          section.classList.add(styles.visible);
        } else {
          section.classList.remove(styles.visible);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section className={styles.whoWeAre} id='who-we-are'>
      <div className={styles.container}>
        <div className={styles.gridContainer}>
          <div className={styles.titleSection}>
            <div className={styles.titleContent}>
              <h2 className={styles.title}>
                Who We Are
                <span className={styles.underline}></span>
              </h2>
              <p className={styles.description}>
                IEEE UTD is one of the largest technical professional societies in the region!
              </p>
            </div>
          </div>

          <div className={`${styles.imageSection} ${styles.hidden}`}>
            <div className={styles.imageWrapper}>
              <img
                src={conferenceImage}
                alt="IEEE UTD Conference"
                className={styles.image}
              />
            </div>
          </div>

          <div className={`${styles.imageSection} ${styles.hidden}`}>
            <div className={styles.imageWrapper}>
              <img
                src={matchaImage}
                alt="Matcha with Murata Event"
                className={styles.image}
              />
            </div>
          </div>

          <div className={styles.contentSection}>
            <div className={styles.contentWrapper}>
              <p className={styles.services}>
                We provide tutoring, societies, networking opportunities, and various events throughout the semester
              </p>
              <a href="#what-we-do" className={styles.learnMoreButton}>
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
