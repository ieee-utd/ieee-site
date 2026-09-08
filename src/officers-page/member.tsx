import styles from "./officers.module.css";
import { FaLinkedin } from "react-icons/fa";
import { SiMicrosoftoutlook } from "react-icons/si";
import blank from "../assets/IEEE/placeholder.jpeg";
import { useLayoutEffect, useRef, useState } from "react";

interface Supervisor {
  label?: string;
  name: string;
}

interface MemberProps {
  name: string;
  title: string;
  email?: string;
  linkedin?: string;
  image?: string;
  showSupervisor?: boolean;
  supervisors?: Supervisor[];
}

const MIN_FIT_FONT_SIZE_REM = 0.55;
const FIT_FONT_STEP_REM = 0.05;

// Shrinks font size in steps to fit text on a single line
const FitText: React.FC<{ text: string; baseSizeRem: number }> = ({ text, baseSizeRem }) => {
  const ref = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    let size = baseSizeRem;
    el.style.fontSize = `${size}rem`;
    while (el.scrollWidth > el.clientWidth && size > MIN_FIT_FONT_SIZE_REM) {
      size -= FIT_FONT_STEP_REM;
      el.style.fontSize = `${size}rem`;
    }
  }, [text, baseSizeRem]);

  return (
    <span ref={ref} className={styles.supervisor_fit_text}>
      {text}
    </span>
  );
};

export default function Member({
  name = "default",
  title,
  email,
  linkedin,
  image,
  showSupervisor = false,
  supervisors = [{ name: "Filler" }, { name: "Filler" }],
}: MemberProps) {
  const [isSupervisorOpen, setIsSupervisorOpen] = useState(false);
  
  return (
    <div className={styles.member__container}>
      <div className={styles.outer_image}>
        <div className={styles.image_wrapper}>
          <img
            src={image}
            alt={`${name}, ${title}`}
            className={styles.member__image}
            onError={(e) => {
              // Swap to alternative imported placeholder image on error
              if (e.currentTarget.src !== blank) {
                e.currentTarget.src = blank;
              }
            }}
          />
        </div>
      </div>

      <div className={styles.member__info}>
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

        <p className={styles.member__name}>{name}</p>
        <p className={styles.member__title}>{title}</p>

        {(linkedin || email) && (
          <div className={styles.member__links}>
            {linkedin && (
              <a href={linkedin} aria-label={`${name} on LinkedIn`}>
                <FaLinkedin className={styles.linkedin_icon} />
              </a>
            )}
            {email && (
              <a href={`mailto:${email}`} aria-label={`Email ${name}`}>
                <SiMicrosoftoutlook className={styles.email_icon} />
              </a>
            )}
          </div>
        )}

        {showSupervisor && isSupervisorOpen && (
          <div className={styles.supervisor_grid}>
            {supervisors.map((supervisor, index) => (
              <div key={index} className={styles.supervisor_card}>
                <strong>
                  <FitText text={supervisor.label || "Supervisor"} baseSizeRem={0.9} />
                </strong>
                <div>
                  <FitText text={supervisor.name} baseSizeRem={0.84} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}