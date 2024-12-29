import React, { useState, useEffect } from 'react';
import Styles from "./landing.module.css";
import image1 from '../../assets/carousel1.png';
import image2 from '../../assets/carousel2.png';
import image3 from '../../assets/carousel3.png';

const images = [image1, image2, image3];

function Carousel() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 10 * 1000); // Change image every 3 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={Styles.Carousel}>
      {images.map((image, index) => (
        <div
          key={index}
          className={`${Styles.CarouselImage} ${index === currentImageIndex ? Styles.active : ''}`}
          style={{ backgroundImage: `url(${image})` }}
        ></div>
      ))}
      <div className={Styles.Container}>
        <h2 className={Styles.Header}>IEEE UTD</h2>
        <p>Advancing Technology for Humanity</p>
        <a href="#who-we-are" className={Styles.Button}>Find Out More</a>
      </div>
    </div>
  );
}

export default Carousel;
