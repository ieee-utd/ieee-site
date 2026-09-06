import styles from "./officers.module.css";
import Officers from "../assets/IEEE/Officers.jpeg";
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

const SupervisorDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.director_dropdown}>
      <button
        type="button"
        className={styles.director_dropdown_preview}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
      >
        <span className={styles.director_dropdown_label}>Supervisor</span>
        <span
          className={`${styles.director_expand_button} ${isOpen ? styles.expanded : ""}`}
          aria-hidden="true"
        >
          +
        </span>
      </button>

      {isOpen && (
        <div className={styles.director_dropdown_details}>
          <div className={styles.supervisor_grid}>
            <div className={styles.supervisor_card}>
              <strong>Supervisor</strong>
              <div>filler</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Committees: React.FC = () => {
  const sections = officerData.map((section) => (
    <div key={section.section}>
      <div className={styles.section_subheading}>
        <h3>{section.section}</h3>
      </div>
      <div className={styles.member__grid}>
        {section.members.map((member) => (
          <FadeInSection key={member.name}>
            <Member
              name={member.name}
              title={member.title}
              image={member.image}
              linkedin={member.linkedin}
              email={member.email}
              key={member.name}
            />
            {section.section === "Society Directors" && <SupervisorDropdown />}
          </FadeInSection>
        ))}
      </div>
    </div>
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
      <section className={styles.officers_section}>
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
