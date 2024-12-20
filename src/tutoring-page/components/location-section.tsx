import React from 'react';
import styles from './location-section.module.css';
import utdMap from '../../assets/gridimages/utdmap.png';
import escnMap from '../../assets/gridimages/escnmap.png';

const LocationSection = () => {
  return (
    <section className={styles.location_section}>
      <div className={styles.maps_container}>
        <img src={utdMap} alt="UTD Campus Map" className={styles.map_image} />
        <img src={escnMap} alt="ESCN Floor Plan" className={styles.map_image} />
      </div>
      <p className={styles.location_text}>
        The tutoring room is located at ECSN 2.318. We are the room in the main
        lobby with IEEE signs and a big window. The entrance is in the hallway
        on the other side of the tutoring room.
      </p>
    </section>
  );
};
export default LocationSection;
