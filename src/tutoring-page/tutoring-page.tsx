import React from "react";
import styles from "./tutoring-page.module.css";
import tutorialImage from "../assets/gridimages/grid2.jpg";
import CoursesSection from "./components/courses-section";
import LocationSection from "./components/location-section";
import BecomeTutor from "./components/become-tutor";
import Calendar from "../calendar/calendar";

const TutoringPage = () => {
  return (
    <div className={styles.container}>
      <section className={styles.hero_container}>
        <div className={styles.hero_content}>
          <p className={styles.eyebrow}>IEEE at UT Dallas</p>
          <h1 className={styles.hero_header}>Tutoring</h1>
          <a className={styles.hero_cta} href="#courses">Explore available courses</a>
        </div>
        <img
          className={styles.hero_img}
          src={tutorialImage}
          alt="Tutoring Session"
        />
      </section>
      <section className={styles.title_container}>
        <p className={styles.section_label}>Your study space</p>
        <h2 className={styles.title}>Find the tutoring room</h2>
        <p className={styles.title_copy}>Come by ECSN 2.318 for help, study time, and a welcoming community of fellow engineers.</p>
      </section>
      <LocationSection />
      <CoursesSection />

      <section className={styles.calendar_section}>
        <div className={styles.calendar_heading}>
          <p className={styles.section_label}>Plan your visit</p>
          <h2>Tutoring hours this week</h2>
          <p>Choose a time that works for you and stop by the tutoring room.</p>
        </div>
        <Calendar
          config={{ startTime: "10:00", endTime: "18:30", rowHeight: 50 }}
        />
      </section>
      <BecomeTutor />
    </div>
  );
};

export default TutoringPage;
