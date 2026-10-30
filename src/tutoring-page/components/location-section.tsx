import { useEffect, useRef, useState, lazy, Suspense } from "react";
import styles from "./location-section.module.css";
import utdMap from "../../assets/gridimages/utdmap-clean.png";
import escnMap from "../../assets/gridimages/escnmap-clean.png";

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
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  // How far through the pinned scroll track the page is, 0..1. Read by the scene.
  const scrollRef = useRef(0);
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

  // The map is pinned while a tall track scrolls past, and that scroll drives
  // the animation. The site's mandatory scroll snapping would drag the page out
  // of the track mid-animation, so it is switched off while the track is showing.
  useEffect(() => {
    const track = trackRef.current;
    if (!track || still) return;
    const root = document.documentElement;
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = track.getBoundingClientRect();
      const span = rect.height - window.innerHeight;
      scrollRef.current = span > 0 ? Math.min(Math.max(-rect.top / span, 0), 1) : 0;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    let previous = "";
    let snapOff = false;
    const snap = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !snapOff) {
        previous = root.style.scrollSnapType;
        root.style.scrollSnapType = "none";
        snapOff = true;
      } else if (!entry.isIntersecting && snapOff) {
        root.style.scrollSnapType = previous;
        snapOff = false;
      }
    });
    snap.observe(track);
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      snap.disconnect();
      if (raf) cancelAnimationFrame(raf);
      if (snapOff) root.style.scrollSnapType = previous;
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
    <div className={styles.track} ref={trackRef}>
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
              scrollRef={scrollRef}
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
    </div>
  );
};
export default LocationSection;
