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
            <h1 className={styles.group__title}>2023-2024</h1>
            <h1 className={styles.group__subtitle}>IEEE Officers</h1>
          </div>
        </div>
        <img
          className={styles.group__img}
          src={Officers}
          alt="ieee-officer-group"
        />
      </div>
      <div className={styles.member__grid}>{mappedMembers}</div>
    </>
  );
};

export default Committees;
