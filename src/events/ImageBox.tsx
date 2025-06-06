import React from "react";
import "./ImageBox.css";

export interface ImageBoxProps {
  imageUrl: string;
  name: string;
  date: string;
  food: string;
  description: string;
}

const ImageBox: React.FC<ImageBoxProps> = ({ imageUrl, name, date, food, description }) => {
  return (
    <div className="image-box">
      <img src={imageUrl} alt="Image not found" />
      <div className="section">
        <div className="field">
          <span className="details">Name:</span> {name}
        </div>
        <div className="field">
          <span className="details">Date:</span> {date}
        </div>
        <div className="field">
          <span className="details">Food:</span> {food}
        </div>
        <div className="description">
          {description}
        </div>
      </div>
    </div>
  );
};

export default ImageBox;
