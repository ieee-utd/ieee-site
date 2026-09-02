import React, { useState, useEffect } from "react";
import "./eventcalendar.css";

type CalendarEvent = {
  day: string;
  title: string;
  start: string;
  end: string;
  color: string;
  description: string;
};

const events: CalendarEvent[] = [
  {
    day: "Monday",
    title: "Tech Talk",
    start: "10:00",
    end: "11:00",
    color: "#673AB7",
    description: "AI and future tech discussion.",
  },
  {
    day: "Wednesday",
    title: "Workshop",
    start: "13:00",
    end: "15:00",
    color: "#E91E63",
    description: "IoT hands-on session.",
  },
  {
    day: "Saturday",
    title: "Workshop",
    start: "14:00",
    end: "15:30",
    color: "#009688",
    description: "Lecture",
  },
];

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const times = Array.from({ length: 10 }, (_, i) => `${9 + i}:00`);

const parseTime = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + (m || 0);
};

const EventCalendar: React.FC = () => {
  const [popup, setPopup] = useState<{
    x: number;
    y: number;
    content: string;
  } | null>(null);

  useEffect(() => {
    const dismiss = () => setPopup(null);
    document.addEventListener("click", dismiss);
    return () => document.removeEventListener("click", dismiss);
  }, []);

  return (
    <div className="weekly-calendar">
      <div className="header-row">
        <div className="time-col" />
        {days.map((day) => (
          <div key={day} className="day-col-header">{day}</div>
        ))}
      </div>

      <div className="calendar-body">
        {times.map((time, i) => (
          <React.Fragment key={i}>
            <div className="time-label">{time}</div>
            {days.map((day) => (
              <div key={`${day}-${time}`} className="time-slot" />
            ))}
          </React.Fragment>
        ))}

        {events.map((event, i) => {
          const columnStart = days.indexOf(event.day);
          const start = parseTime(event.start);
          const end = parseTime(event.end);
          const top = ((start - 540) / 60) * 60;
          const height = ((end - start) / 60) * 60;

          return (
            <div
              key={i}
              className="calendar-event"
              style={{
                top: `${top}px`,
                height: `${height}px`,
                backgroundColor: event.color,
                "--column-start": columnStart.toString(),
              } as React.CSSProperties}
              onClick={(e) => {
                e.stopPropagation();
                setPopup({
                  x: e.clientX + 10,
                  y: e.clientY + 10,
                  content: `${event.title}\n${event.start}–${event.end}\n${event.description}`,
                });
              }}
            >
              <div className="event-title">{event.title}</div>
            </div>
          );
        })}

        {popup && (
          <div
            className="calendar-popup"
            style={{ top: popup.y, left: popup.x }}
          >
            {popup.content.split("\n").map((line, idx) => (
              <div key={idx}>{line}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCalendar;
