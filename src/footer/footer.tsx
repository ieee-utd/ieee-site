import styles from "./footer.module.css";

export default function Footer() {
  return (
    <footer>
      <div className={styles["footer"]}>
        <h1 className={styles.hsub}>
          Sign Up for Our Newsletter to Receive IEEE Updates.
        </h1>
        <p className={styles.psub}>
          Join our IEEE UTD newsletter to stay updated on the latest events,
          workshops, and networking opportunities.
        </p>
        <div className={styles["subscribe"]}>
          <input
            className={styles.input}
            type="text"
            placeholder="email@email.com"
          ></input>
          <button className={styles["button-18"]} role="button">
            subscribe
          </button>
        </div>
        <div className={styles["row"]}>
          Copyright © {new Date().getFullYear()} IEEE at the University of Texas
          at Dallas - All rights reserved
        </div>
      </div>
    </footer>
  );
}
