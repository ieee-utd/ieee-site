import styles from "./officers.module.css";
import { FaLinkedin } from "react-icons/fa";
import { SiMicrosoftoutlook } from "react-icons/si";
import officerData from "./officerData";
import blank from "../assets/IEEE/placeholder.jpeg";
import { useState } from "react";

export default function Member({
  name = "default",
  title,
  email,
  linkedin,
  image = officerData[officerData.length - 1],
  showSupervisor = false,
}: {
  name: string;
  title: string;
  email: any;
  linkedin: string;
  image: any;
  showSupervisor?: boolean;
}) {
  const [isSupervisorOpen, setIsSupervisorOpen] = useState(false);

  if (image === "") {
    image = blank;
  }

  return (
    <div className={styles.member__container}>
      {showSupervisor && (
        <button
          type="button"
          className={`${styles.supervisor_toggle} ${isSupervisorOpen ? styles.expanded : ""}`}
          onClick={() => setIsSupervisorOpen((prev) => !prev)}
          aria-expanded={isSupervisorOpen}
          aria-label="Toggle supervisor"
        >
          +
        </button>
      )}
      <div className={styles.outer_image}>
        <div className={styles.image_wrapper}>
          <img
            src={image}
            alt={`${name}, ${title}`}
            className={styles.member__image}
          />
        </div>
      </div>
      <div className={styles.member__info}>
        <p className={styles.member__name}>{name}</p>
        <p className={styles.member__title}>{title}</p>
        {(linkedin || email) && <div className={styles.member__links}>
          {linkedin && <a href={linkedin} aria-label={`${name} on LinkedIn`}>
            <FaLinkedin className={styles.linkedin_icon} />
          </a>}
          {email && <a href={`mailto:${email}`} aria-label={`Email ${name}`}>
            <SiMicrosoftoutlook className={styles.email_icon} />
          </a>}
        </div>}
        {showSupervisor && isSupervisorOpen && (
          <div className={styles.supervisor_grid}>
            <div className={styles.supervisor_card}>
              <strong>Supervisor</strong>
              <div>filler</div>
            </div>
            <div className={styles.supervisor_card}>
              <strong>Supervisor</strong>
              <div>filler</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
