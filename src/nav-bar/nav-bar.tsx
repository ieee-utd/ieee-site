import { useEffect, useState } from "react";
import styles from "./nav-bar.module.css";
import ieeeLogo from "../assets/ieeelogotransparent.png";
import accountIcon from "../assets/account-white-icon.png";
import ThemeToggle from "../shared/theme-toggle";
import { useIsDarkMode } from "../shared/use-is-dark-mode";

// Roughly the nav bar's own height, used to place the IntersectionObserver's
// detection line where the bar actually sits rather than at the viewport top.
const NAV_DETECTION_OFFSET_PX = 80;

function NavBar() {
  const signedIn = false;
  const isDarkMode = useIsDarkMode();
  const [isOverLightSection, setIsOverLightSection] = useState(false);

  // Sections marked data-nav-surface="light" (white/off-white backgrounds)
  // make the nav switch to dark grey text/icons while scrolled behind them,
  // so it stays readable instead of white-on-white. Only relevant in light
  // theme — in dark theme those same surfaces render dark, not white.
  useEffect(() => {
    const targets = Array.from(
      document.querySelectorAll('[data-nav-surface="light"]')
    );
    if (targets.length === 0) return;

    const intersecting = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            intersecting.add(entry.target);
          } else {
            intersecting.delete(entry.target);
          }
        });
        setIsOverLightSection(intersecting.size > 0);
      },
      { rootMargin: `-${NAV_DETECTION_OFFSET_PX}px 0px -100% 0px`, threshold: 0 }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const isOnLight = isOverLightSection && !isDarkMode;

  return (
    <header className={isOnLight ? styles.onLight : undefined}>
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
                <a className={styles.mobileLink} href="/societies">
                  Societies
                </a>
              </li>
              <li>
                <a className={styles.mobileLink} target="_blank" rel="noopener noreferrer" href="https://discord.gg/8SXQe9pGu9">
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
              <li>
                <ThemeToggle isOnLight={isOnLight} />
              </li>
            </ul>
          </div>
        </nav>
        <a href="/" className={styles.mobileLogo}>
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
              <a className={styles.link} href="/societies">
                Societies
              </a>
            </li>
            <li>
              <a className={styles.link} target="_blank" rel="noopener noreferrer" href="https://discord.gg/8SXQe9pGu9">
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
            <li>
              <ThemeToggle isOnLight={isOnLight} />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default NavBar;
