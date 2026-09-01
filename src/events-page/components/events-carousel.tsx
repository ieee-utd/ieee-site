import { useEffect, useRef, useState } from "react";
import styles from "./events-carousel.module.css";

const upcomingEvents = [
  {
    title: "IEEE General Meeting",
    time: "Wednesday, 7:00 PM",
    description:
      "Hear what IEEE is planning this semester, meet the team, and connect with fellow members over snacks.",
    imageLabel: "Event photo placeholder",
    location: "Location / Building",
  },
  {
    title: "Introduction to Embedded Systems",
    time: "Thursday, 6:30 PM",
    description:
      "A beginner-friendly workshop covering the building blocks behind small, intelligent hardware projects.",
    imageLabel: "Workshop photo placeholder",
    location: "Location / Building",
  },
  {
    title: "Industry Speaker Night",
    time: "Friday, 5:30 PM",
    description:
      "Join an engineer from industry for an honest conversation about internships, careers, and building your path.",
    imageLabel: "Speaker event photo placeholder",
    location: "Location / Building",
  },
  {
    title: "Project Build Night",
    time: "Saturday, 2:00 PM",
    description:
      "Bring your ideas and make progress alongside a room full of students who love to build.",
    imageLabel: "Project showcase photo placeholder",
    location: "Location / Building",
  },
];

function EventsCarousel() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    let animationFrame: number | null = null;

    const updateActiveCard = () => {
      const carouselCenter = carousel.getBoundingClientRect().left + carousel.clientWidth / 2;
      let closestIndex = 0;
      let closestDistance = Infinity;

      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const distance = Math.abs(rect.left + rect.width / 2 - carouselCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setActiveIndex(closestIndex);
      animationFrame = null;
    };

    const handleScroll = () => {
      if (animationFrame === null) {
        animationFrame = window.requestAnimationFrame(updateActiveCard);
      }
    };

    carousel.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      carousel.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div className={styles.carouselWrap}>
      <p className={styles.instruction}>Scroll to explore</p>
      <div className={styles.carousel} ref={carouselRef} aria-label="Upcoming IEEE events">
        {upcomingEvents.map((event, index) => (
          <article
            className={`${styles.card} ${activeIndex === index ? styles.active : ""}`}
            key={event.title}
            ref={(element) => {
              cardRefs.current[index] = element;
            }}
          >
            <div className={styles.imagePlaceholder} aria-label={event.imageLabel} role="img">
              <span>{event.location}</span>
              <p>{event.imageLabel}</p>
            </div>
            <div className={styles.cardBody}>
              <p className={styles.time}>{event.time}</p>
              <h3>{event.title}</h3>
              <p className={styles.description}>{event.description}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default EventsCarousel;
