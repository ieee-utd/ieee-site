import styles from "./officers.module.css";
import { FaLinkedin } from "react-icons/fa";
import { SiMicrosoftoutlook } from "react-icons/si";
import officerData from "./officerData";
import blank from "../assets/IEEE/placeholder.jpeg";

export default function Member({
  name = "default",
  title,
  email,
  linkedin,
  image = officerData[officerData.length - 1],
}: {
  name: string;
  title: string;
  email: any;
  linkedin: string;
  image: any;
}) {
  if (image === "") {
    image = blank;
  }

  return (
    <div className={styles.member__container}>
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
      </div>
    </div>
  );
}
