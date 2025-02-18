import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import NavBar from "./nav-bar/nav-bar";
import Footer from "./footer/footer";
import HomePage from "./home-page/home-page";
import Committees from "./officers/officers";
import TutoringPage from "./tutoring-page/tutoring-page";
import Calendar from "./calendar/calendar";

import "./index.css";
import "./notification/notification.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

// Usage in your component
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/Officers" element={<Committees />} />
        <Route path="/Tutoring" element={<TutoringPage />} />
      </Routes>
      <NavBar />
      <Footer />
    </Router>
  </React.StrictMode>
);
