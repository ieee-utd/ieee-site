import { useEffect, useRef, useState, lazy, Suspense } from "react";
import styles from "./location-section.module.css";
import utdMap from "../../assets/gridimages/utdmap-clean.png";
import escnMap from "../../assets/gridimages/escnmap-clean.png";
import CometField from "../../shared/comet-field";

// three.js is only pulled down once the map scrolls into view.
const CampusScene = lazy(() => import("./campus-scene"));

const CAPTIONS = [
  "UT Dallas Campus",
  "Engineering & Computer Science North",
  "Level 2 · Main Lobby",
  "Room 2.318 · IEEE Tutoring",
  "",
];

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const LocationSection = () => {
  const stageRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);
  const [phase, setPhase] = useState(0);
  const [still] = useState(prefersReducedMotion);

  // Build the scene as soon as the section is within a screen or so of view,
  // so the heavy setup happens off-screen rather than as it scrolls in...
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || still) return;
    const preload = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setMounted(true);
      },
      { rootMargin: "900px 0px" },
    );
    // ...and only run (and draw) it while it is actually visible.
    const visible = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.2 },
    );
    preload.observe(stage);
    visible.observe(stage);
    return () => {
      preload.disconnect();
      visible.disconnect();
    };
  }, [still]);

  const description = (
    <p className={styles.location_text}>
      The tutoring room is located at ECSN 2.318. It is the room in the main
      lobby with IEEE signs and a large window. The entrance is in the hallway
      on the opposite side of the tutoring room.
    </p>
  );

  // prefers-reduced-motion: no animation, so keep the original static layout.
  if (still) {
    return (
      <section className={styles.location_section} data-nav-surface="light">
        <CometField count={2} cycleSeconds={10} />
        <div className={styles.location_heading}>
          <p>Where to find us</p>
          <h2>ECSN 2.318</h2>
        </div>
        <div className={styles.stills}>
          <img src={utdMap} alt="UTD campus map" className={styles.still} />
          <img src={escnMap} alt="ECSN floor plan" className={styles.still} />
        </div>
        {description}
      </section>
    );
  }

  return (
    <section className={styles.fullscreen} data-nav-surface="light">
      <div className={styles.stage} ref={stageRef}>
        <img
          src={utdMap}
          alt="UTD campus map"
          className={`${styles.poster} ${ready ? styles.hidden : ""}`}
        />
        {mounted && (
          <Suspense fallback={null}>
            <CampusScene
              playing={inView}
              onPhase={setPhase}
              onReady={() => setReady(true)}
              progressRef={progressRef}
            />
          </Suspense>
        )}
        <div className={styles.vignette} />
      </div>

      <div className={styles.arch}>
        <div className={styles.location_heading}>
          <p>Where to find us</p>
          <h2>ECSN 2.318</h2>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className={styles.caption} aria-hidden="true">
          <span key={phase} className={CAPTIONS[phase] ? styles.on : ""}>
            {CAPTIONS[phase]}
          </span>
        </div>
        {description}
      </div>
      <div className={styles.progress} ref={progressRef} />
    </section>
  );
};
export default LocationSection;
