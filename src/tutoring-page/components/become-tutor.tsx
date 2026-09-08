import React, { useEffect, useRef } from 'react';
import styles from './become-tutor.module.css';
import CometField from '../../shared/comet-field';

const TUTOR_APPLICATION_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSfBX0GF0a5xtKr7OiCXoCn1Wc0zm9lBc6-ZJms-0n5QiOhu_Q/closedform';

const BecomeTutor = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Handle application button click
  // const handleApplyClick = () => {
  //   // Add later: Add application form link
  //   console.log('Apply button clicked');
  // };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of the element is visible
      }
    );

    const currentSection = sectionRef.current;
    if (currentSection) {
      observer.observe(currentSection);
    }

    return () => {
      if (currentSection) {
        observer.unobserve(currentSection);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className={`${styles.become_tutor_section} ${styles.hidden}`}>
      <CometField count={2} cycleSeconds={10} />
      <div className={styles.content_container}>
        {/* Main title */}
        <h2 className={styles.main_title}>Want to be a tutor?</h2>
        {/* Subtitle */}
        <h3 className={styles.subtitle}>Tutor Requirements</h3>
        {/* Requirements list */}
        <ul className={styles.requirements_list}>
          {[
            'Atleast TWO hours every week',
            'A good understanding of the course',
            'Finished the course',
            'Any major in any grade',
          ].map((requirement, index) => (
            <li key={index} className={styles.requirement_item}>
              <span className={styles.checkmark}>✓</span> {requirement}
            </li>
          ))}
        </ul>
        {/* Apply button */}
        {/* <button
          className={styles.apply_button}
          onClick={handleApplyClick}
          aria-label="Apply to become a tutor"
        >
          Apply Now
        </button> */}
        <p className={styles.apply_notice}>
          Applications will open for Spring 2027 later, keep an eye out for these!
        </p>
      </div>
    </section>
  );
};

export default BecomeTutor;