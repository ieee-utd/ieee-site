//Use cookies for log in

//https://ieeeutd.org/privacy-policy
import WhoWeAre from "../who-we-are/who-we-are";
import WhatWeDo from "what-we-do/what-we-do";
import Sponsors from "./sponsors/sponsors";
import Landing from "./landing/landing";
import Chatbot from "../chatbot/components/chatbot";
import Calendar from "../calendar/calendar";
import tutoringSchedule from "../calendar/calendar-data"; 
import styles from './home-page.module.css'

function HomePage() {
  return (
    <>
      <Landing />
      <WhoWeAre />
      <WhatWeDo />
      <Sponsors />
      <Chatbot />
    </>
  );
}

/*
      <section className={styles.calendar_section}>
      <Calendar
              events={tutoringSchedule}
              config={{ startTime: "10:00", endTime: "18:30", rowHeight: 50 }}
            />
      </section>

*/

export default HomePage;
