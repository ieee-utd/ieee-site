import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import NavBar from "./nav-bar/nav-bar";
import Footer from "./footer/footer";
import HomePage from "./home-page/home-page";
import Committees from "./officers/officers"

import "./index.css";
import './notification/notification.css';

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/Officers" element={<Committees />} />
      </Routes>
      <Footer />
    </Router>
  </React.StrictMode>
);