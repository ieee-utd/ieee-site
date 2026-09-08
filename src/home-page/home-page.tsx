//Use cookies for log in

//https://ieeeutd.org/privacy-policy
import WhoWeAre from "./who-we-are/who-we-are";
import WhatWeDo from "home-page/what-we-do/what-we-do";
import Sponsors from "./sponsors/sponsors";
import Landing from "./landing/landing";
//import Chatbot from "../chatbot/components/chatbot";
import Calendar from "../calendar/calendar";
import RevealOnScroll from "../shared/reveal-on-scroll";
import styles from "./home-page.module.css";

function HomePage() {
  return (
    <div data-cursor-ignore>
      <Landing />
      <section className={styles.calendar_section}>
        <div className={styles.calendar_header}>
          <p className={styles.calendar_eyebrow}>Tutoring</p>
          <h2 className={styles.calendar_heading}>
            Fall 2026 Tutoring Schedule
          </h2>
          <p className={styles.calendar_subheading}>
            All sessions are held in the IEEE UTD room — ECSN 2.318
          </p>
        </div>
        <RevealOnScroll>
          <Calendar
            config={{ startTime: "10:00", endTime: "18:30", rowHeight: 50 }}
          />
        </RevealOnScroll>
      </section>
      <RevealOnScroll>
        <WhoWeAre />
      </RevealOnScroll>
      <WhatWeDo />
      <Sponsors />
    </div>
  );
}

export default HomePage;
