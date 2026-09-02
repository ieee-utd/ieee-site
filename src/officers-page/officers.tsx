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

const Committees: React.FC = () => {
  const mappedMembers = officerData.map((member) => (
    <FadeInSection key={member.name}>
      <Member
        name={member.name}
        title={member.title}
        image={member.image}
        linkedin={member.linkedin}
        email={member.email}
        key={member.name}
      />
    </FadeInSection>
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
        <div className={styles.member__grid}>{mappedMembers}</div>
      </section>
    </>
  );
};

export default Committees;
