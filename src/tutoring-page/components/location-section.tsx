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
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  // How far through the animation we are, 0..1. Read by the scene.
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

  // The map locks the page while it plays. Wheel, touch and keys drive the
  // animation instead of scrolling, so it always runs to the end before the page
  // moves on (and back to the start before it lets you up). The animation is a
  // pure function of `scrollRef`, so forward and reverse run identically.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || still) return;

    const WHEEL_SPAN = 4200; // px of wheel travel for the whole animation
    const TOUCH_SPAN = 1500; // px of finger travel
    const KEY_STEP = 0.06;
    const DWELL = 450; // ms a finished animation holds before the page may move on

    let engaged = false;
    let canEngage = true;
    let lastTop = section.getBoundingClientRect().top;
    let heldUntil = 0;
    let touchY = 0;
    let leaving = false;

    const top = () => section.getBoundingClientRect().top + window.scrollY;
    const hold = () => {
      heldUntil = performance.now() + DWELL;
    };

    const engage = (fromBelow: boolean) => {
      engaged = true;
      canEngage = false;
      leaving = false;
      scrollRef.current = fromBelow ? 1 : 0;
      window.scrollTo({ top: top(), behavior: "instant" as ScrollBehavior });
      hold();
    };

    const release = (forward: boolean) => {
      engaged = false;
      leaving = true;
      window.scrollTo({
        top: forward ? top() + section.offsetHeight : top() - window.innerHeight,
        behavior: "smooth",
      });
    };

    /** Moves the animation by `delta` (a share of the whole). Returns false once it is done. */
    const advance = (delta: number) => {
      if (performance.now() < heldUntil) return;
      const next = scrollRef.current + delta;
      if (next >= 1 && delta > 0) {
        if (scrollRef.current >= 1) release(true);
        else {
          scrollRef.current = 1;
          hold();
        }
      } else if (next <= 0 && delta < 0) {
        if (scrollRef.current <= 0) release(false);
        else {
          scrollRef.current = 0;
          hold();
        }
      } else {
        scrollRef.current = next;
      }
    };

    const onScroll = () => {
      const t = section.getBoundingClientRect().top;
      if (engaged) {
        // a scrollbar drag or anything else that moved the page: pull it back
        if (Math.abs(t) > 1) window.scrollTo({ top: top(), behavior: "instant" as ScrollBehavior });
      } else {
        if (!canEngage && Math.abs(t) > window.innerHeight * 0.5) canEngage = true;
        if (canEngage && !leaving && Math.abs(t) < 6) engage(lastTop < 0);
        if (leaving && Math.abs(t) >= window.innerHeight * 0.95) leaving = false;
      }
      lastTop = t;
    };

    const onWheel = (e: WheelEvent) => {
      if (!engaged) return;
      e.preventDefault();
      const px = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaMode === 2 ? e.deltaY * window.innerHeight : e.deltaY;
      advance(px / WHEEL_SPAN);
    };
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!engaged) return;
      e.preventDefault();
      const y = e.touches[0].clientY;
      advance((touchY - y) / TOUCH_SPAN);
      touchY = y;
    };
    const onKey = (e: KeyboardEvent) => {
      if (!engaged) return;
      const forward = ["ArrowDown", "PageDown", " ", "End"].includes(e.key) && !(e.key === " " && e.shiftKey);
      const backward = ["ArrowUp", "PageUp", "Home"].includes(e.key) || (e.key === " " && e.shiftKey);
      if (!forward && !backward) return;
      e.preventDefault();
      advance(forward ? KEY_STEP : -KEY_STEP);
    };

    // Landing here already (a reload, or a link straight to it).
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKey);
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
    <section className={styles.fullscreen} data-nav-surface="light" ref={sectionRef}>
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
  );
};
export default LocationSection;
