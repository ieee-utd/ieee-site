import Styles from "./sponsors.module.css";
import BurnsMcDonnell from "./assets/burns_mcdonnell.png";
import TexasInstruments from "./assets/texas_instruments.avif";
import Qorvo from "./assets/qorvo.png";

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
        observer.unobserve(entry.target); // Stop observing once the animation is triggered
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
    image: <img className={Styles["Client-item"]} src={BurnsMcDonnell}></img>,
  },
  {
    id: 2,
    image: <img className={Styles["Client-item"]} src={TexasInstruments}></img>,
  },
  {
    id: 3,
    image: (
      <img
        className={`${Styles["Client-item"]} ${Styles.Qorvo}`}
        src={Qorvo}
      ></img>
    ),
  },
];

function Sponsors() {
  return (
    <div className={Styles.Container}>
      <div className={Styles.SponsorSection}>
        <p className={Styles.SectionDescription}>
          Our Corporate Sponsors
        </p>
        <div className={Styles["Client-list"]}>
          {clients.map((client) => (
            <div key={client.id} className={Styles["Client-item"]}>
              {client.image}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Sponsors;
