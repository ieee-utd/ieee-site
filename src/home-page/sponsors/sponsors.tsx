import { useEffect } from "react";
import Styles from "./sponsors.module.css";
import BurnsMcDonnell from "./assets/burns_mcdonnell.png";
import TexasInstruments from "./assets/texas_instruments.avif";
import Murata from './assets/murata.png';
import Qorvo from "./assets/qorvo.png";

interface Client {
  id: number;
  image: React.JSX.Element;
}

const clients: Client[] = [
  {
    id: 1,
    image: <img className={Styles["Client-item"]} src={BurnsMcDonnell} alt="Burns McDonnell" />,
  },
  {
    id: 2,
    image: <img className={Styles["Client-item"]} src={TexasInstruments} alt="Texas Instruments" />,
  },
  {
    id: 3,
    image: <img className={Styles["Client-item"]} src={Murata} alt="Murata" />,
  },
  {
    id: 4,
    image: (
      <img
        className={`${Styles["Client-item"]} ${Styles.Qorvo}`}
        src={Qorvo}
        alt="Qorvo"
      />
    ),
  },
];

function Sponsors() {
  const duplicatedClients = [...clients, ...clients, ...clients];

  useEffect(() => {
    const elementsToAnimate = document.querySelectorAll<HTMLElement>("[data-animate]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(Styles.animated);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    elementsToAnimate.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className={Styles.Container} data-nav-surface="light">
      <div className={Styles.SponsorSection} data-animate>
        <h1 className={Styles.SectionDescription}>Our Corporate Sponsors</h1>
        <p className={Styles.SectionSubtext}>
          {/* placeholder copy — swap in your own line */}
          The companies backing our equipment, travel, and builds.
        </p>
        <div className={Styles["carousel-container"]}>
          <div className={Styles["carousel-track"]}>
            {duplicatedClients.map((client, index) => (
              <div key={index} className={Styles["carousel-item"]}>
                {client.image}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sponsors;