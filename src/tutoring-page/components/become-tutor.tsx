import React from 'react';
import styles from './become-tutor.module.css';

const BecomeTutor = () => {
  // Handle application button click
  const handleApplyClick = () => {
    // Add later: Add application form link
    console.log('Apply button clicked');
  };

  return (
    <section className={styles.become_tutor_section}>
      <div className={styles.content_container}>
        {/* Main title */}
        <h2 className={styles.main_title}>Want to be a tutor?</h2>

        {/* Requirements subtitle */}
        <h3 className={styles.subtitle}>Tutor Requirements</h3>

        {/* Requirements list */}
        <ul className={styles.requirements_list}>
          <li>- 2 hours every week</li>
          <li>- good understanding of course</li>
          <li>- finished the class</li>
          <li>- any major, any grade</li>
        </ul>

        {/* Apply button */}
        {/* Doesn't go anywhere for now - embed app later*/}
        <button
          className={styles.apply_button}
          onClick={handleApplyClick}
          aria-label="Apply to become a tutor"
        >
          Apply Now
        </button>
      </div>
    </section>
  );
};

export default BecomeTutor;
