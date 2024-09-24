import React from 'react';
import styles from './styles/nav-bar.module.css';
import ieeeLogo from "../assets/ieeelogotransparent.png";

function NavBar() {
    return <header>
    <div className={styles.container}>
      <img className={styles.logo} src={ieeeLogo} alt="Logo" />

      <nav>
        <ul>
          <li><a href="#">Home</a></li>
          <li><a href="#">Events</a></li>
          <li><a href="#">Tutoring</a></li>
          <li><a href="#">Officers</a></li>
          <li><a href="#">Society</a></li>
          <li><a href="#">Join</a></li>
          <li><button className={styles['sign-in-btn']}>Sign In</button></li>
        </ul>
      </nav>
    </div>
  </header>;
}

export default NavBar;