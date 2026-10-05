import { useEffect, useState } from "react";
import styles from "./nav-bar.module.css";
import ieeeLogo from "../assets/ieeelogotransparent.png";
import accountIcon from "../assets/account-white-icon.png";

// Roughly the nav bar's own height, used to place the IntersectionObserver's
// detection line where the bar actually sits rather than at the viewport top.
const NAV_DETECTION_OFFSET_PX = 80;

interface NavLink {
  label: string;
  href: string;
  external?: boolean;
}

// The desktop nav's own links, paginated 4 at a time with the arrow button
// below rather than shown all at once (see navPage state).
const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Events", href: "/events" },
  { label: "Tutoring", href: "/tutoring" },
  { label: "Officers", href: "/officers" },
  { label: "Societies", href: "/societies" },
  { label: "Branches", href: "/branch" },
  { label: "About Us", href: "/about" },
  { label: "Join", href: "https://linktr.ee/ieeeutdallas", external: true },
];
const NAV_PAGE_SIZE = 4;
const NAV_PAGE_COUNT = Math.ceil(NAV_LINKS.length / NAV_PAGE_SIZE);

function NavBar() {
  const signedIn = false;
  const [isOverLightSection, setIsOverLightSection] = useState(false);
  const [navPage, setNavPage] = useState(0);
  // Which way the tab strip last moved, so the newly-shown tabs can slide in
  // from the side they conceptually came from instead of just popping in.
  const [navDirection, setNavDirection] = useState<"next" | "prev">("next");

  const isFirstNavPage = navPage === 0;
  const isLastNavPage = navPage === NAV_PAGE_COUNT - 1;

  const goToPrevNavPage = () => {
    setNavDirection("prev");
    setNavPage((page) => Math.max(page - 1, 0));
  };
  const goToNextNavPage = () => {
    setNavDirection("next");
    setNavPage((page) => Math.min(page + 1, NAV_PAGE_COUNT - 1));
  };

  // Sections marked data-nav-surface="light" (white/off-white backgrounds)
  // make the nav switch to dark grey text/icons while scrolled behind them,
  // so it stays readable instead of white-on-white.
  useEffect(() => {
    const targets = Array.from(
      document.querySelectorAll('[data-nav-surface="light"]'),
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
      {
        rootMargin: `-${NAV_DETECTION_OFFSET_PX}px 0px -100% 0px`,
        threshold: 0,
      },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const isOnLight = isOverLightSection;

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
                <a className={styles.mobileLink} href="/branch">
                  Branches
                </a>
              </li>
              <li>
                <a className={styles.mobileLink} href="/about">
                  About Us
                </a>
              </li>
              <li>
                <a
                  className={styles.mobileLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://linktr.ee/ieeeutdallas"
                >
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
            {NAV_PAGE_COUNT > 1 && !isFirstNavPage && (
              <li>
                <button
                  type="button"
                  className={`${styles.link} ${styles.navArrow}`}
                  onClick={goToPrevNavPage}
                  aria-label="Show previous tabs"
                >
                  ‹
                </button>
              </li>
            )}
            {NAV_LINKS.slice(
              navPage * NAV_PAGE_SIZE,
              navPage * NAV_PAGE_SIZE + NAV_PAGE_SIZE,
            ).map((link, i) => {
              const animClass =
                navDirection === "next" ? styles.tabEnterNext : styles.tabEnterPrev;
              // key includes navPage so React remounts these (rather than just
              // re-pointing the same nodes at new hrefs) every time the page
              // changes, which is what makes the entrance animation replay.
              const key = `${navPage}-${link.label}`;
              const style = { animationDelay: `${i * 35}ms` };
              return link.external ? (
                <li key={key} className={animClass} style={style}>
                  <a
                    className={styles.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    href={link.href}
                  >
                    {link.label}
                  </a>
                </li>
              ) : (
                <li key={key} className={animClass} style={style}>
                  <a className={styles.link} href={link.href}>
                    {link.label}
                  </a>
                </li>
              );
            })}
            {NAV_PAGE_COUNT > 1 && !isLastNavPage && (
              <li>
                <button
                  type="button"
                  className={`${styles.link} ${styles.navArrow}`}
                  onClick={goToNextNavPage}
                  aria-label="Show more tabs"
                >
                  ›
                </button>
              </li>
            )}
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
