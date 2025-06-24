import React from "react";
import ImageBox from "./ImageBox";
import EventCalendar from "./eventcalendar"; 

const Events: React.FC = () => {
  return (
    <div style={{ padding: "20px" }}>
      <ImageBox
        imageUrl="/assets/carousel1.jpg"
        name="Tech Talk"
        date="June 5, 2025"
        food="Pizza and Drinks"
        description="Join us for an engaging discussion on artificial intelligence and future tech trends."
      />
      <EventCalendar /> 
    </div>
  );
};

export default Events;
