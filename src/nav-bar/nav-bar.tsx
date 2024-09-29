import styles from "./nav-bar.module.css";
import ieeeLogo from "../assets/ieeelogotransparent.png";
import accountIcon from "../assets/account-white-icon.png";

function NavBar() {
  const signedIn = false;

  return (
    <header>
      <div className={styles.mobileContainer}>
        <nav className={styles.mobileNav} role="navigation">
          <div id={styles.menuToggle}>
            <input type="checkbox" id="mobileCheckbox" />
            <span></span>
            <span></span>
            <span></span>
            <ul id={styles.menu}>
              <li>
                <a className={styles.mobileLink} href="/">
                  Home
                </a>
              </li>
              <li>
                <a className={styles.mobileLink} href="/events">
                  Events
                </a>
              </li>
              <li>
                <a className={styles.mobileLink} href="/tutoring">
                  Tutoring
                </a>
              </li>
              <li>
                <a className={styles.mobileLink} href="/officers">
                  Officers
                </a>
              </li>
              <li>
                <a className={styles.mobileLink} href="/society">
                  Society
                </a>
              </li>
              <li>
                <a className={styles.mobileLink} href="/join">
                  Join
                </a>
              </li>
              <li>
                {signedIn ? (
                  <a href="/account" className={styles.mobileLink}>
                    Account
                  </a>
                ) : (
                  <a href="/signin" className={styles.mobileLink}>
                    Sign In
                  </a>
                )}
              </li>
            </ul>
          </div>
        </nav>
        <a href="/" className={styles.mobileLogo}>
          <p className={styles.mobileLogoText}>IEEE UTD</p>
          <img
            className={styles.mobileLogoImg}
            src={ieeeLogo}
            alt="IEEE Logo"
          />
        </a>
      </div>
      <div className={styles.desktopContainer}>
        <a href="/">
          <img className={styles.logo} src={ieeeLogo} alt="IEEE Logo" />
        </a>

        <nav className={styles.navDesktop}>
          <ul>
            <li>
              <a className={styles.link} href="/">
                Home
              </a>
            </li>
            <li>
              <a className={styles.link} href="/events">
                Events
              </a>
            </li>
            <li>
              <a className={styles.link} href="/tutoring">
                Tutoring
              </a>
            </li>
            <li>
              <a className={styles.link} href="/officers">
                Officers
              </a>
            </li>
            <li>
              <a className={styles.link} href="/society">
                Society
              </a>
            </li>
            <li>
              <a className={styles.link} href="/join">
                Join
              </a>
            </li>
            <li>
              {signedIn ? (
                <a href="/account">
                  <img
                    className={`${styles.accountIcon} ${styles.link}`}
                    src={accountIcon}
                    alt="Account Icon"
                  />
                </a>
              ) : (
                <a href="/signin">
                  <button className={styles["sign-in-btn"]}>Sign In</button>
                </a>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default NavBar;
