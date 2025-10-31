import React, { useState } from "react";
import styles from "./signin.module.css";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  const API_KEY = process.env.REACT_APP_AWS_AUTH_KEY;
  const API_BASE_URL = process.env.REACT_APP_AWS_BASE_URL;

  // Simple regex for email validation
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  async function handleSubmit() {
    setMessage("");

    // Basic auth checks
    if (!email.trim() || !password.trim()) {
      setMessage("Both email and password are required.");
      return;
    }

    if (!isValidEmail(email)) {
      setMessage("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      const endpoint = mode === "signin" ? "/signin" : "/signup";

      const res = await fetch(`${API_BASE_URL}:3000${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Api-Key": API_KEY || "", // fallback ensures string
        },
        body: JSON.stringify({ email, password }),
      });
      

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();
      console.log("Response:", data);

      setMessage(
        mode === "signin"
          ? "Signed in successfully!"
          : "Account created successfully!"
      );

      // Optionally store session token
      if (data.sessionToken) {
        localStorage.setItem("sessionToken", data.sessionToken);
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>
          {mode === "signin" ? "Sign In" : "Sign Up"}
        </h1>

        <div className={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
          />

          <button
            className={styles.primaryBtn}
            disabled={isLoading}
            onClick={handleSubmit}
          >
            {isLoading
              ? "Loading..."
              : mode === "signin"
              ? "Sign In"
              : "Sign Up"}
          </button>

          <p className={styles.toggleText}>
            {mode === "signin" ? (
              <>
                Don’t have an account?{" "}
                <button
                  type="button"
                  className={styles.linkBtn}
                  onClick={() => setMode("signup")}
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  className={styles.linkBtn}
                  onClick={() => setMode("signin")}
                >
                  Sign In
                </button>
              </>
            )}
          </p>

          {message && <p className={styles.message}>{message}</p>}
        </div>
      </div>
    </div>
  );
}
