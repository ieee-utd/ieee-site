import React, { useState } from "react";
import styles from "./volunteer-page.module.css";

interface Session {
  checkIn: string; // "HH:MM AM/PM"
  checkOut: string; // "HH:MM AM/PM"
  createdAt: string;
  hours: number;
}

export default function Volunteer() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [showForm, setShowForm] = useState(false);

  const [checkInHour, setCheckInHour] = useState("08");
  const [checkInMinute, setCheckInMinute] = useState("00");
  const [checkInAM, setCheckInAM] = useState("AM");

  const [checkOutHour, setCheckOutHour] = useState("09");
  const [checkOutMinute, setCheckOutMinute] = useState("00");
  const [checkOutAM, setCheckOutAM] = useState("AM");

  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [skipConfirm, setSkipConfirm] = useState(false);

  const parseTime = (hour: string, minute: string, ampm: string) => {
    let h = parseInt(hour, 10);
    const m = parseInt(minute, 10);
    if (ampm === "PM" && h < 12) h += 12;
    if (ampm === "AM" && h === 12) h = 0;
    const date = new Date();
    date.setHours(h, m, 0, 0);
    return date;
  };

  const calculateHours = () => {
    const start = parseTime(checkInHour, checkInMinute, checkInAM);
    const end = parseTime(checkOutHour, checkOutMinute, checkOutAM);
    const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return diff > 0 ? diff : 0;
  };

  // Utility function to stringify session inputs
const formatSessionString = (
    checkInHour: string,
    checkInMinute: string,
    checkInAM: string,
    checkOutHour: string,
    checkOutMinute: string,
    checkOutAM: string,
    hours: number
  ) => {
    return JSON.stringify({
      checkIn: `${checkInHour.padStart(2, "0")}:${checkInMinute.padStart(2, "0")} ${checkInAM}`,
      checkOut: `${checkOutHour.padStart(2, "0")}:${checkOutMinute.padStart(2, "0")} ${checkOutAM}`,
      hours: hours.toFixed(2),
      createdAt: new Date().toISOString(), // good for parsing later
    });
  };
  
  // Example usage inside handleAddSession
  const handleAddSession = async () => {
    const hours = calculateHours();
    if (hours <= 0) {
      setError("Check-out must be after check-in.");
      return;
    }
  
    // Create a parseable string for storage
    const sessionString = formatSessionString(
      checkInHour,
      checkInMinute,
      checkInAM,
      checkOutHour,
      checkOutMinute,
      checkOutAM,
      hours
    );

    // Parse it back into an object if needed
    const newSession: Session = JSON.parse(sessionString);

    console.log(sessionString);

    try {
      const res = await fetch(`${API_BASE_URL}:4000${"/changehours"}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Api-Key": API_KEY || "", // fallback ensures string
          "sessionToken": localStorage.getItem("sessionToken") || "",
        },
        body: JSON.stringify({ sessionString }),
      });

    } catch (error) {
      console.error(error);
    }
  
    setSessions([...sessions, newSession]);
    setShowForm(false);
    setError("");
  };

  const setDoNotAskAgain = (ask: boolean) => {
    console.log(ask);
  };

  const API_KEY = process.env.REACT_APP_AWS_AUTH_KEY;
  const API_BASE_URL = process.env.REACT_APP_AWS_BASE_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (skipConfirm) {
      handleAddSession();
    } else {
      setShowConfirm(true);
    }
  };

  const netHours = sessions.reduce((acc, s) => acc + s.hours, 0);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Volunteer Hours Tracker</h1>

      <button
        className={styles.addBtn}
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Cancel" : "Add Session"}
      </button>

      {showForm && (
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.timeRow}>
            <label className={styles.timeLabel}>
              Check In:
              <input
                type="number"
                min={1}
                max={12}
                value={checkInHour}
                onChange={(e) => setCheckInHour(e.target.value)}
                className={styles.timeInput}
              />
              :
              <input
                type="number"
                min={0}
                max={59}
                value={checkInMinute}
                onChange={(e) => setCheckInMinute(e.target.value)}
                className={styles.timeInput}
              />
              <select
                value={checkInAM}
                onChange={(e) => setCheckInAM(e.target.value)}
                className={styles.ampmSelect}
              >
                <option>AM</option>
                <option>PM</option>
              </select>
            </label>

            <label className={styles.timeLabel}>
              Check Out:
              <input
                type="number"
                min={1}
                max={12}
                value={checkOutHour}
                onChange={(e) => setCheckOutHour(e.target.value)}
                className={styles.timeInput}
              />
              :
              <input
                type="number"
                min={0}
                max={59}
                value={checkOutMinute}
                onChange={(e) => setCheckOutMinute(e.target.value)}
                className={styles.timeInput}
              />
              <select
                value={checkOutAM}
                onChange={(e) => setCheckOutAM(e.target.value)}
                className={styles.ampmSelect}
              >
                <option>AM</option>
                <option>PM</option>
              </select>
            </label>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.primaryBtn}>
            Save Session
          </button>
        </form>
      )}

      {showConfirm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <p>Are you sure you want to add this session?</p>

            <div className={styles.modalButtons}>
              <button
                className={styles.primaryBtn}
                onClick={() => {
                  handleAddSession();
                  setShowConfirm(false);
                }}
              >
                Yes
              </button>
              <button
                className={styles.addBtn}
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
            </div>
            <p
  className={styles.checkboxLabel}
  onClick={() => setDoNotAskAgain(true)} // your state handler
>
  Do not ask again
</p>

          </div>
        </div>
      )}

      <div className={styles.sessions}>
        <h2>Logged Sessions</h2>
        {sessions.length === 0 && <p>No sessions yet.</p>}
        {sessions.map((s, idx) => (
          <div key={idx} className={styles.session}>
            <p>
              <strong>Check In:</strong> {s.checkIn}
            </p>
            <p>
              <strong>Check Out:</strong> {s.checkOut}
            </p>
            <p>
              <strong>Created At:</strong> {s.createdAt}
            </p>
            <p>
              <strong>Hours:</strong> {s.hours.toFixed(2)}
            </p>
          </div>
        ))}
        {sessions.length > 0 && (
          <h3 className={styles.netHours}>Net Hours: {netHours.toFixed(2)}</h3>
        )}
      </div>
    </div>
  );
}
