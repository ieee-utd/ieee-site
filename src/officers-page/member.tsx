import styles from "./officers.module.css";
import { FaLinkedin } from "react-icons/fa";
import { SiMicrosoftoutlook } from "react-icons/si";
import officerData from "./officerData";
import blank from "../assets/IEEE/placeholder.jpeg";
import { useState } from "react";

interface Supervisor {
  label?: string;
  name: string;
}

const LONG_TEXT_THRESHOLD = 12;

const supervisorTextClass = (text: string) =>
  text.length > LONG_TEXT_THRESHOLD ? styles.supervisor_text_compact : "";

export default function Member({
  name = "default",
  title,
  email,
  linkedin,
  image = officerData[officerData.length - 1],
  showSupervisor = false,
  supervisors = [{ name: "filler" }, { name: "filler" }],
}: {
  name: string;
  title: string;
  email: any;
  linkedin: string;
  image: any;
  showSupervisor?: boolean;
  supervisors?: Supervisor[];
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
            {supervisors.map((supervisor, index) => (
              <div key={index} className={styles.supervisor_card}>
                <strong className={supervisorTextClass(supervisor.label || "Supervisor")}>
                  {supervisor.label || "Supervisor"}
                </strong>
                <div className={supervisorTextClass(supervisor.name)}>{supervisor.name}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
