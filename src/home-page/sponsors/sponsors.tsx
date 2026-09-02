import Styles from "./sponsors.module.css";
import BurnsMcDonnell from "./assets/burns_mcdonnell.png";
import TexasInstruments from "./assets/texas_instruments.avif";
import Murata from './assets/murata.png';
import Qorvo from "./assets/qorvo.png";
import { useState, useEffect } from "react";

interface Client {
  id: number;
  image: React.JSX.Element;
}

document.addEventListener('DOMContentLoaded', function() {
  let elementsToAnimate = document.querySelectorAll('.SponsorSection, .InstagramSection');
  let options = {
    threshold: 0.1
  };

  let observer = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, options);

  elementsToAnimate.forEach(element => {
    observer.observe(element);
  });
});


const clients: Client[] = [
  {
    id: 1,
    image: <img className={Styles["Client-item"]} src={BurnsMcDonnell} alt="Burns McDonnell" ></img>,
  },
  {
    id: 2,
    image: <img className={Styles["Client-item"]} src={TexasInstruments} alt="Texas Instruments" ></img>,
  },
  {
    id: 3,
    image: <img className={Styles["Client-item"]} src={Murata} alt="Murata" ></img>,
  },
  {
    id: 4,
    image: (
      <img
        className={`${Styles["Client-item"]} ${Styles.Qorvo}`}
        src={Qorvo}
      alt="Qorvo" ></img>
    ),
  },
];

function Sponsors() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % clients.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const visibleClients = [
    clients[currentIndex],
    clients[(currentIndex + 1) % clients.length],
    clients[(currentIndex + 2) % clients.length],
    clients[(currentIndex + 3) % clients.length],
  ];

  return (
    <div className={Styles.Container}>
      <div className={Styles.SponsorSection}>
        <h1 className={Styles.SectionDescription}>
          Our Corporate Sponsors
        </h1>
        <div className={Styles["Client-list"]}>
          {visibleClients.map((client, index) => (
            <div key={`${client.id}-${currentIndex}-${index}`} className={Styles["Client-item"]}>
              {client.image}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Sponsors;
