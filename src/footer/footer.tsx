import styles from "./footer.module.css";
import discordLogo from "../assets/discord-white-logo.png";
import facebookLogo from "../assets/facebook-app-round-white-icon.png";
import linkedinLogo from "../assets/linkedin-app-white-icon.png";
import youtubeLogo from "../assets/youtube-app-white-icon.png";
import instagramLogo from "../assets/instagram-white-logo.png";

export default function Footer() {
  const images = [
    { src: discordLogo, alt: "Discord Logo", href: "https://discord.gg/8SXQe9pGu9"},
    { src: facebookLogo, alt: "Facebook Logo", href: "https://www.facebook.com/IEEEUTD/"},
    { src: linkedinLogo, alt: "LinkedIn Logo", href: "https://www.linkedin.com/company/ieee-utd/"},
    { src: youtubeLogo, alt: "YouTube Logo", href: "https://www.youtube.com/@ieeeutdallas1989"},
    { src: instagramLogo, alt: "Instagram Logo", href: "https://www.instagram.com/ieeeutd/"},
  ];

  return (
    <footer>
      <div className={styles["footer"]}>
        <h1>Sign Up for Our Newsletter to Receive IEEE Updates.</h1>
        <p>
          Join our IEEE UTD newsletter to stay updated on the latest events,
          workshops, and networking opportunities.
        </p>
        <div className={styles["news-letter"]}>
          <input
            className={styles["news-letter-input"]}
            type="text"
            placeholder="email@email.com"
          ></input>
          <button className={styles["subscribe-button"]}>
            subscribe
          </button>
        </div>
        <ul className={styles.ul}>
          {images.map((image, index) => (
            <li key={index}>
              <a href={image.href} target="_blank" rel="noreferrer">
                <img
                  key={index}
                  src={image.src}
                  alt={image.alt}
                  className={styles.socialLogos}
                />
              </a>
            </li>
          ))}
        </ul>
        <div className={styles.copyright}>
          Copyright © {new Date().getFullYear()} IEEE at the University of Texas
          at Dallas - All rights reserved
        </div>
      </div>
    </footer>
  );
}
