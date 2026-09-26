import styles from "./officers.module.css";
import Officers from "../assets/IEEE/Officers2.jpg";
import officerData from "./officerData";
import Member from "./member";
import React, { useState, useRef, useEffect } from "react";

interface FadeInSectionProps {
  children: React.ReactNode;
}

const FadeInSection: React.FC<FadeInSectionProps> = (props) => {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.isIntersecting && setVisible(true));
    });

    if (domRef.current) {
      observer.observe(domRef.current);
    }

    return () => {
      if (domRef.current) {
        observer.unobserve(domRef.current);
      }
    };
  }, []);

  return (
    <div
      className={`${styles["fade-in-section"]} ${
        isVisible ? styles["is-visible"] : ""
      }`}
      ref={domRef}
    >
      {props.children}
    </div>
  );
};

/** Distance, in px, over which a section title fades in and out at its ends. */
const TITLE_FADE_PX = 240;

const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);

interface OfficerSectionProps {
  title: string;
  children: React.ReactNode;
}

/**
 * One titled group of members. The title is pinned to the corner by CSS while the
 * group is on screen; here it is also faded in as the group's top arrives and
 * faded out just before its bottom leaves, so it cross-fades with the next
 * group's title instead of the two overlapping.
 */
const OfficerSection: React.FC<OfficerSectionProps> = ({ title, children }) => {
  const groupRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const group = groupRef.current;
      const heading = titleRef.current;
      if (!group || !heading) return;
      const { top, bottom } = group.getBoundingClientRect();
      const vh = window.innerHeight;
      const fadeIn = clamp01((vh - top) / TITLE_FADE_PX);
      const fadeOut = clamp01((bottom - vh) / TITLE_FADE_PX);
      heading.style.opacity = String(Math.min(fadeIn, fadeOut));
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={groupRef}>
      <div className={styles.section_subheading} ref={titleRef}>
        <h3>{title}</h3>
      </div>
      {children}
    </div>
  );
};

const Committees: React.FC = () => {
  const sections = officerData.map((section) => (
    <OfficerSection key={section.section} title={section.section}>
      <div className={styles.member__grid}>
        {section.members.map((member) => (
          <FadeInSection key={member.name}>
            <Member
              name={member.name}
              title={member.title}
              image={member.image}
              linkedin={member.linkedin}
              email={member.email}
              showSupervisor={section.section === "Society Directors"}
              supervisors={
                (member as { supervisors?: { label?: string; name: string }[] })
                  .supervisors
              }
              imageZoom={(member as { imageZoom?: number }).imageZoom}
              imagePosition={(member as { imagePosition?: string }).imagePosition}
              key={member.name}
            />
          </FadeInSection>
        ))}
      </div>
    </OfficerSection>
  ));

  return (
    <>
      <div className={styles.group__container}>
        <div className={styles.group__content}>
          <div className={styles.group__header}>
            <p className={styles.eyebrow}>IEEE at UT Dallas</p>
            <h1 className={styles.group__subtitle}>Meet the officers</h1>
            <p className={styles.group__description}>The student leaders building opportunities, community, and hands-on experiences for IEEE at UT Dallas.</p>
          </div>
        </div>
        <img
          className={styles.group__img}
          src={Officers}
          alt="ieee-officer-group"
        />
      </div>
      <section className={styles.officers_section} data-nav-surface="light">
        <div className={styles.section_heading}>
          <p>Our team</p>
          <h2>Meet the officers</h2>
        </div>
        {sections}
      </section>
    </>
  );
};

export default Committees;
