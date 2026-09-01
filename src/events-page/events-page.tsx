import eventImage from "../assets/gridimages/events.png";
import EventsCarousel from "./components/events-carousel";
import styles from "./events-page.module.css";

const eventHighlights = [
  {
    title: "Professional growth",
    description:
      "Meet engineers and industry guests, learn about careers, and build the skills that carry beyond the classroom.",
  },
  {
    title: "Hands-on learning",
    description:
      "Join technical workshops, project sessions, and friendly challenges designed for every experience level.",
  },
  {
    title: "A connected community",
    description:
      "Find collaborators, make friends, and get involved with the people shaping IEEE at UT Dallas.",
  },
];

function EventsPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>IEEE at UT Dallas</p>
          <h1>Events</h1>
          <p className={styles.heroCopy}>
            From workshops to tech talks, there is always a
            place to learn, connect, and create with IEEE.
          </p>
          <a className={styles.calendarLink} href="#upcoming-events">
            View this week&apos;s events
          </a>
        </div>
        <div className={styles.heroVisual}>
          <img src={eventImage} alt="Students attending an IEEE event" />
        </div>
      </section>

      <section className={styles.intro}>
        <div>
          <p className={styles.sectionLabel}>More than a meeting</p>
          <h2>Why Should You Come?</h2>
        </div>
        <p>
          IEEE events are open spaces for students to explore new technology,
          meet people with shared interests, and turn a spark of curiosity into
          something tangible.
        </p>
      </section>

      <section className={styles.highlights} aria-label="What to expect at IEEE events">
        {eventHighlights.map((highlight, index) => (
          <article className={styles.highlight} key={highlight.title}>
            <span className={styles.highlightNumber}>0{index + 1}</span>
            <h3>{highlight.title}</h3>
            <p>{highlight.description}</p>
          </article>
        ))}
      </section>

      <section className={styles.calendarSection} id="upcoming-events">
        <div className={styles.calendarHeading}>
          <p className={styles.sectionLabel}>Plan your week</p>
          <h2>Upcoming events</h2>
          <p>Find your next workshop, social, or opportunity to get involved.</p>
        </div>
        <EventsCarousel />
      </section>
    </main>
  );
}

export default EventsPage;
