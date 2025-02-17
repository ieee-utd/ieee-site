import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import NavBar from './nav-bar/nav-bar';
import Footer from './footer/footer';
import HomePage from './home-page/home-page';
import Committees from './officers/officers';
import TutoringPage from './tutoring-page/tutoring-page';
import Calendar from './calendar/calendar';

import './index.css';
import './notification/notification.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

interface CalendarEvent {
  id: string;
  title: string;
  startTime: string;
  duration: string;
  colorClass: number;
  content: string;
}

const tutoringSchedule: CalendarEvent[] = [
  {
    id: 'mon-1',
    title: 'EE/CE 3320 - Aurawyn',
    startTime: '11:30',
    duration: 'PT1H',
    colorClass: 1,
    content: '<p>Class session for EE/CE 3320 with Aurawyn.</p>',
  },
  {
    id: 'mon-2',
    title: 'EE 3202 - Miguel',
    startTime: '12:00',
    duration: 'PT2H',
    colorClass: 2,
    content: '<p>Class session for EE 3202 with Miguel.</p>',
  },
  {
    id: 'mon-3',
    title: 'EE/CE 1202 - David',
    startTime: '14:00',
    duration: 'PT1H30M',
    colorClass: 3,
    content: '<p>Class session for EE/CE 1202 with David.</p>',
  },
  {
    id: 'mon-4',
    title: 'EE 3310 - Avinash',
    startTime: '14:15',
    duration: 'PT1H',
    colorClass: 1,
    content: '<p>Class session for EE 3310 with Avinash.</p>',
  },
  {
    id: 'mon-5',
    title: 'CS 3345 - Minh',
    startTime: '14:30',
    duration: 'PT1H',
    colorClass: 2,
    content: '<p>Class session for CS 3345 with Minh.</p>',
  },
  {
    id: 'mon-6',
    title: 'EE/CE 2301 - Avinash',
    startTime: '15:15',
    duration: 'PT45M',
    colorClass: 3,
    content: '<p>Class session for EE/CE 2301 with Avinash.</p>',
  },
  {
    id: 'tue-1',
    title: 'CE 3303 - Rushil',
    startTime: '10:30',
    duration: 'PT2H15M',
    colorClass: 1,
    content: '<p>Class session for CE 3303 with Rushil.</p>',
  },
  {
    id: 'tue-2',
    title: 'CS 3345 - Rushil',
    startTime: '10:30',
    duration: 'PT2H15M',
    colorClass: 2,
    content: '<p>Class session for CS 3345 with Rushil.</p>',
  },
  {
    id: 'tue-3',
    title: 'EE/CE 1202 - Jenny',
    startTime: '11:00',
    duration: 'PT2H',
    colorClass: 3,
    content: '<p>Class session for EE/CE 1202 with Jenny.</p>',
  },
  {
    id: 'tue-4',
    title: 'EE/CE 2310 - Alicia',
    startTime: '12:50',
    duration: 'PT1H30M',
    colorClass: 1,
    content: '<p>Class session for EE/CE 2310 with Alicia.</p>',
  },
  {
    id: 'tue-5',
    title: 'EE/CE 3320 - Aurawyn',
    startTime: '13:00',
    duration: 'PT1H',
    colorClass: 2,
    content: '<p>Class session for EE/CE 3320 with Aurawyn.</p>',
  },
  {
    id: 'tue-6',
    title: 'EE/CE 2301 - Dyanada',
    startTime: '14:00',
    duration: 'PT1H',
    colorClass: 3,
    content: '<p>Class session for EE/CE 2301 with Dyanada.</p>',
  },
  {
    id: 'tue-7',
    title: 'EE/CE 2301 - Avinash',
    startTime: '16:00',
    duration: 'PT1H',
    colorClass: 1,
    content: '<p>Class session for EE/CE 2301 with Avinash.</p>',
  },
  {
    id: 'tue-8',
    title: 'EE/CE 1202 - David',
    startTime: '17:00',
    duration: 'PT1H',
    colorClass: 2,
    content: '<p>Class session for EE/CE 1202 with David.</p>',
  },
  {
    id: 'wed-1',
    title: 'EE/CE 1202 - Nermin',
    startTime: '10:00',
    duration: 'PT2H',
    colorClass: 3,
    content: '<p>Class session for EE/CE 1202 with Nermin.</p>',
  },
  {
    id: 'wed-2',
    title: 'EE/CE 1202 - Oliver',
    startTime: '13:15',
    duration: 'PT2H',
    colorClass: 1,
    content: '<p>Class session for EE/CE 1202 with Oliver.</p>',
  },
  {
    id: 'wed-3',
    title: 'EE 3310 - Avinash',
    startTime: '14:15',
    duration: 'PT1H',
    colorClass: 2,
    content: '<p>Class session for EE 3310 with Avinash.</p>',
  },
  {
    id: 'wed-4',
    title: 'CS 3345 - Minh',
    startTime: '14:30',
    duration: 'PT1H',
    colorClass: 3,
    content: '<p>Class session for CS 3345 with Minh.</p>',
  },
  {
    id: 'wed-5',
    title: 'EE/CE 2310 - Ugonna',
    startTime: '15:00',
    duration: 'PT2H',
    colorClass: 1,
    content: '<p>Class session for EE/CE 2310 with Ugonna.</p>',
  },
  {
    id: 'wed-6',
    title: 'EE/CE 2301 - Avinash',
    startTime: '15:15',
    duration: 'PT45M',
    colorClass: 2,
    content: '<p>Class session for EE/CE 2301 with Avinash.</p>',
  },
  {
    id: 'wed-7',
    title: 'EE/CE 2310 - Sai',
    startTime: '16:00',
    duration: 'PT2H',
    colorClass: 3,
    content: '<p>Class session for EE/CE 2310 with Sai.</p>',
  },
  {
    id: 'thu-1',
    title: 'EE/CE 1202 - Areebah',
    startTime: '12:00',
    duration: 'PT2H',
    colorClass: 1,
    content: '<p>Class session for EE/CE 1202 with Areebah.</p>',
  },
  {
    id: 'thu-2',
    title: 'EE/CE 1202 - Shreya',
    startTime: '12:00',
    duration: 'PT2H',
    colorClass: 2,
    content: '<p>Class session for EE/CE 1202 with Shreya.</p>',
  },
  {
    id: 'thu-3',
    title: 'EE/CE 2310 - Alicia',
    startTime: '13:50',
    duration: 'PT30M',
    colorClass: 3,
    content: '<p>Class session for EE/CE 2310 with Alicia.</p>',
  },
  {
    id: 'thu-4',
    title: 'EE/CE 2301 - Dyanada',
    startTime: '14:00',
    duration: 'PT1H',
    colorClass: 1,
    content: '<p>Class session for EE/CE 2301 with Dyanada.</p>',
  },
  {
    id: 'thu-5',
    title: 'EE/CE 2310 - Vishal',
    startTime: '16:00',
    duration: 'PT1H',
    colorClass: 2,
    content: '<p>Class session for EE/CE 2310 with Vishal.</p>',
  },
  {
    id: 'thu-6',
    title: 'EE/CE 1202 - David',
    startTime: '17:00',
    duration: 'PT1H',
    colorClass: 3,
    content: '<p>Class session for EE/CE 1202 with David.</p>',
  },
  {
    id: 'fri-1',
    title: 'CS 1325 - Minh',
    startTime: '10:00',
    duration: 'PT2H',
    colorClass: 1,
    content: '<p>Class session for CS 1325 with Minh.</p>',
  },
  {
    id: 'fri-2',
    title: 'EE/CE 2310 - Deeksha',
    startTime: '11:00',
    duration: 'PT2H',
    colorClass: 2,
    content: '<p>Class session for EE/CE 2310 with Deeksha.</p>',
  },
  {
    id: 'fri-3',
    title: 'EE/CE 3320 - Rushil',
    startTime: '12:30',
    duration: 'PT1H45M',
    colorClass: 3,
    content: '<p>Class session for EE/CE 3320 with Rushil.</p>',
  },
  {
    id: 'fri-4',
    title: 'EE/CE 1202 - Josphin',
    startTime: '15:00',
    duration: 'PT2H',
    colorClass: 1,
    content: '<p>Class session for EE/CE 1202 with Josphin.</p>',
  },
  {
    id: 'fri-5',
    title: 'EE/CE 2310 - Vishal',
    startTime: '16:00',
    duration: 'PT1H',
    colorClass: 2,
    content: '<p>Class session for EE/CE 2310 with Vishal.</p>',
  },
];


// Usage in your component
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/Officers" element={<Committees />} />
        <Route path="/Tutoring" element={<TutoringPage />} />
        <Route path="/Calendar" element={<Calendar events={tutoringSchedule} config={{ startTime: '10:00', endTime: '18:00', rowHeight: 50 }} />
} />
      </Routes>
      <NavBar />
      <Footer />
    </Router>
  </React.StrictMode>
);
