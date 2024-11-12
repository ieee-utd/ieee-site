import Styles from "./sponsors.module.css";
import BurnsMcDonnell from "./assets/burns_mcdonnell.png";
import TexasInstruments from "./assets/texas_instruments.avif";
import Qorvo from "./assets/qorvo.png";

interface Client {
  id: number;
  image: React.JSX.Element;
}

//Get images from db and upload to website.

const clients: Client[] = [
  {
    id: 1,
    image: <img className={Styles["Client-item"]} src={BurnsMcDonnell}></img>,
  },
  {
    id: 2,
    image: <img className={Styles["Client-item"]} src={TexasInstruments}></img>,
  },
  { id: 3, image: <img className={`${Styles["Client-item"]} ${Styles.Qorvo}`} src={Qorvo}></img> },
];

function Sponsors() {
  return (
    <div className={Styles.Container}>
      <h2>Our Sponsors {/* underline element */}
      <span className={Styles.underline}></span>
      </h2>
      <div className={Styles["Client-list"]}>
        {clients.map((client) => (
          <div key={client.id} className={Styles["Client-item"]}>
            {client.image}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sponsors;
