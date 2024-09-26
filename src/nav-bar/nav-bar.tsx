import styles from "./nav-bar.module.css";
import ieeeLogo from "../assets/ieeelogotransparent.png";

function NavBar() {
  //If Signed In Remove replace sign in button with profile icon

  const signedIn = false;
  return (
    <header>
      <div className={styles.container}>
        <img className={styles.logo} src={ieeeLogo} alt="Logo" />

        <nav>
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/Events">Events</a>
            </li>
            <li>
              <a href="/Tutoring">Tutoring</a>
            </li>
            <li>
              <a href="/Officers">Officers</a>
            </li>
            <li>
              <a href="/Society">Society</a>
            </li>
            <li>
              <a href="/Join">Join</a>
            </li>
            <li>
              {signedIn ? (
                <button className={styles["sign-in-btn"]}>Account</button>
              ) : (
                <button className={styles["sign-in-btn"]}>Sign In</button>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default NavBar;
