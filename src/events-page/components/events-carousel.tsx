import { useEffect, useRef, useState } from "react";
import styles from "./events-carousel.module.css";
import arduinoWorkshop from "../../assets/events/arduino-workshop.png";

const upcomingEvents = [
  {
    title: "Microcontroller 101 Workshop",
    time: "September 28th, 6:00 – 8:30 PM",
    description: "Come learn to use an Arduino, breadboard, electrical components, and software to build and program your own circuits! NO EXPERIENCE NEEDED! Materials will be provided.",
    rsvpUrl: "https://forms.gle/Sut6rx9Fc1QGtmwP8",
    imageLabel: "Placeholder Image 1",
    location: "JO 4.102",
    image: arduinoWorkshop,
  },
  {
    title: "More Events Coming Soon",
    time: "Day, Time",
    description: "We’ve got something great in the works for you, stay tuned!",
    imageLabel: "Placeholder Image 2",
    location: "coming Soon",
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
            {(event as { image?: string }).image ? (
              <div className={styles.imageWrap}>
                <img
                  className={styles.cardImage}
                  src={(event as { image?: string }).image}
                  alt={event.title}
                />
                <span className={styles.locationBadge}>{event.location}</span>
              </div>
            ) : (
              <div className={styles.imagePlaceholder} aria-label={event.imageLabel} role="img">
                <span>{event.location}</span>
                <p>{event.imageLabel}</p>
              </div>
            )}
            <div className={styles.cardBody}>
              <p className={styles.time}>{event.time}</p>
              <h3>{event.title}</h3>
              <p className={styles.description}>
                {event.description}
                {event.rsvpUrl && (
                  <>
                    <br />
                    <span className={styles.rsvp}>
                      RSVP here: <a href={event.rsvpUrl} target="_blank" rel="noopener noreferrer">{event.rsvpUrl}</a>
                    </span>
                  </>
                )}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default EventsCarousel;