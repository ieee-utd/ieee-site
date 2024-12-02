import React from 'react';
import styles from './tutoring-page.module.css';
import tutorialImage from '../assets/gridimages/grid2.jpg';
import TutoringCalendar from '../home-page/tutoring-calendar/tutoring-calendar';
import CoursesSection from './components/courses-section';
import LocationSection from './components/location-section';
import BecomeTutor from './components/become-tutor';

const TutoringPage = () => {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <div className={styles.hero_container}>
        <div className={styles.hero_content}>
          <div className={styles.hero_header}>
            <h1>Tutoring</h1>
          </div>
        </div>
        <img
          className={styles.hero_img}
          src={tutorialImage}
          alt="Tutoring Session"
        />
      </div>
      {/* Tutoring Room Title Section */}
      <div className={styles.title_container}>
        <h1 className={styles.title}>Tutoring Room</h1>
      </div>
      {/* Location Section */}
      <LocationSection />
      {/* Courses Section */}
      <CoursesSection />

      {/* Calendar Section */}
      <section className={styles.calendar_section}>
        <h2 className={styles.calendar_title}>Tutoring Calendar</h2>
        <TutoringCalendar />
      </section>
      {/* "Want to be a tutor?" Section */}
      <BecomeTutor />
    </div>
  );
};

export default TutoringPage;
