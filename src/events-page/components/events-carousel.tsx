import { useEffect, useRef, useState } from "react";
import styles from "./events-carousel.module.css";

const upcomingEvents = [
  {
    title: "Event Title 1",
    time: "Day, Time",
    description: "Brief description for Event 1 goes here.",
    imageLabel: "Placeholder Image 1",
    location: "Location / Venue 1",
  },
  {
    title: "Event Title 2",
    time: "Day, Time",
    description: "Brief description for Event 2 goes here.",
    imageLabel: "Placeholder Image 2",
    location: "Location / Venue 2",
  },
  {
    title: "Event Title 3",
    time: "Day, Time",
    description: "Brief description for Event 3 goes here.",
    imageLabel: "Placeholder Image 3",
    location: "Location / Venue 3",
  },
  {
    title: "Event Title 4",
    time: "Day, Time",
    description: "Brief description for Event 4 goes here.",
    imageLabel: "Placeholder Image 4",
    location: "Location / Venue 4",
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
      <div className={styles.carousel} ref={carouselRef} aria-label="Upcoming events">
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