import React from "react";
import "./NotFound.css";
import ieeeutdlogo from "../assets/ieeeutdlogo.png"

const NotFound: React.FC = () => {
  const handleGoHome = () => {
    window.location.href = "/"; // redirect to home
  };

  return (
    <div className="not-found-container">
      <img
        src={ieeeutdlogo}
        alt="Not Found Icon"
        className="not-found-image"
      />
      <h1 className="not-found-code">404</h1>
      <button className="home-button" onClick={handleGoHome}>
        Go Back to Home
      </button>
    </div>
  );
};

export default NotFound;
