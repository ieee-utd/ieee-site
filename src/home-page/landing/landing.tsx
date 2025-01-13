import React, { useState, useEffect } from 'react';
import Styles from "./landing.module.css";
import image1 from '../../assets/carousel1.png';
import image2 from '../../assets/carousel2.png';
import image3 from '../../assets/carousel3.png';

const images = [image1, image2, image3];

const useTypewriter = (text: string, speed: number = 50): string => {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (isDeleting) {
      if (index > 0) {
        const timeout = setTimeout(() => {
          setDisplayedText(text.slice(0, index - 1));
          setIndex(prev => prev - 1);
        }, speed);
        return () => clearTimeout(timeout);
      } else {
        const restartTimeout = setTimeout(() => {
          setIsDeleting(false);
        }, 3000); // Wait 3 seconds before starting to type again
        return () => clearTimeout(restartTimeout);
      }
    } else {
      if (index < text.length) {
        const timeout = setTimeout(() => {
          setDisplayedText(prev => prev + text[index]);
          setIndex(prev => prev + 1);
        }, speed);
        return () => clearTimeout(timeout);
      } else {
        const restartTimeout = setTimeout(() => {
          setIsDeleting(true);
        }, 10000); // Wait 5 seconds before starting to delete the text
        return () => clearTimeout(restartTimeout);
      }
    }
  }, [index, text, speed, isDeleting]);

  return displayedText;
};

const Carousel: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const typewriterText = useTypewriter('Advancing Technology for Humanity');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 10 * 1000); // Change image every 10 seconds
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
        <h2 className={Styles.Header}>Institute of Electrical and Electronics Engineers at UTD</h2>
        <p className={Styles.Description}>
          {typewriterText}
          <span className={Styles.Cursor}>‎</span>
        </p>
        <a href="#who-we-are" className={Styles.Button}>Find Out More</a>
      </div>
    </div>
  );
}

export default Carousel;
