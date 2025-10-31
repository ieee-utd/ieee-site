import styles from "./officers.module.css";
import { FaLinkedin } from "react-icons/fa";
import { SiMicrosoftoutlook } from "react-icons/si";
import officerData from "./officerData";
import { useEffect, useRef, useState } from "react";
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
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  if (image === "") {
    image = blank;
  }

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      });
    });
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }
    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, []);

  return (
    <div className={styles.member__container}>
      <div className={styles.outer_image}>
        <div className={styles.image_wrapper}>
          <img
            ref={imgRef}
            src={image}
            alt="pic"
            className={styles.member__image}
          />
        </div>
      </div>
      <div className={styles.member__info}>
        <p className={styles.member__name}>{name}</p>
        <p className={styles.member__title}>{title}</p>
        <div className={styles.member__links}>
          <a href={linkedin}>
            <FaLinkedin className={styles.linkedin_icon} />
          </a>
          <a href={`mailto:${email}`}>
            <SiMicrosoftoutlook className={styles.email_icon} />
          </a>
        </div>
      </div>
    </div>
  );
}
