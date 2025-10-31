//Use cookies for log in

//https://ieeeutd.org/privacy-policy
import WhoWeAre from "./who-we-are/who-we-are";
import WhatWeDo from "home-page/what-we-do/what-we-do";
import Sponsors from "./sponsors/sponsors";
import Landing from "./landing/landing";
import Chatbot from "../chatbot/components/chatbot";
import Calendar from "../calendar/calendar";
import styles from './home-page.module.css'

function HomePage() {
  return (
    <>
      <Landing />
      <section className={styles.calendar_section}>
      <Calendar
              config={{ startTime: "10:00", endTime: "18:30", rowHeight: 50 }}
            />
      </section>
      <WhoWeAre />
      <WhatWeDo />
      <Sponsors />
    </>
  );
}

export default HomePage;
