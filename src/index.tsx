import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import NavBar from "./nav-bar/nav-bar";
import Footer from "./footer/footer";
import HomePage from "./home-page/home-page";
import Committees from "./officers-page/officers";
import TutoringPage from "./tutoring-page/tutoring-page";
import SignIn from "signin-page/signin";
import Volunteer from "volunteer-page/volunteer-page";
import DocumentationPage from "documentation-page/documentation-page";
import EventsPage from "./events-page/events-page";
import SocietiesPage from "societies/societies";
//import Calendar from "./calendar/calendar";

import "./index.css";
//import "./notification/notification.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

// Usage in your component
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/officers" element={<Committees />} />
        <Route path="/tutoring" element={<TutoringPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/volunteer" element={<Volunteer />} />
        <Route path="/documentation" element={<DocumentationPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/societies" element={<SocietiesPage />} />
      </Routes>
      <NavBar />
      <Footer />
    </Router>
  </React.StrictMode>
);
