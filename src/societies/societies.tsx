import React, { useState } from "react";
import styles from "./societies.module.css";
import ieeeLogo from "assets/ieeelogotransparent.png";

interface Society {
  name: string;
  description: string;
  category: string;
}

const societies: Society[] = [
  {
    name: "Power & Energy Society",
    description:
      "Explore electrical power systems, renewable energy, smart grids, and the technologies shaping the future of energy.",
    category: "Power & Energy",
  },
  {
    name: "Radio Frequency Society",
    description:
      "Learn about radio frequency technology, wireless communication, antennas, and high-frequency electronic systems.",
    category: "Radio Frequencies",
  },
  {
    name: "Robotics & Automation Society",
    description:
      "Explore robotics, automation, intelligent systems, and the technologies driving the future of autonomous machines.",
    category: "Robotics & Automation",
  },
  {
    name: "Computer Intelligence Society",
    description:
      "Discover artificial intelligence, machine learning, computational intelligence, and intelligent systems.",
    category: "Computer Intelligence",
  },
  {
    name: "Solid-State Circuits Society",
    description:
      "Explore integrated circuits, semiconductor technology, chip design, and the hardware powering modern electronics.",
    category: "Solid-State Circuits",
  },
];

export default function Societies() {
  const [search, setSearch] = useState("");

  const filteredSocieties = societies.filter((society) => {
    const query = search.toLowerCase();

    return (
      society.name.toLowerCase().includes(query) ||
      society.description.toLowerCase().includes(query) ||
      society.category.toLowerCase().includes(query)
    );
  });

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <img
          src={ieeeLogo}
          alt="IEEE Logo"
          className={styles.ieeeLogo}
        />

        <header className={styles.header}>
          <h1 className={styles.title}>Societies</h1>

          <p className={styles.subtitle}>
            Explore IEEE societies and find a community that matches your
            interests.
          </p>
        </header>

        <div className={styles.searchContainer}>
          <span className={styles.searchIcon}>⌕</span>

          <input
            type="text"
            placeholder="Search societies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.results}>
          {filteredSocieties.length > 0 ? (
            filteredSocieties.map((society) => (
              <div className={styles.societyCard} key={society.name}>
                <div className={styles.cardTop}>
                  <span className={styles.category}>
                    {society.category}
                  </span>
                </div>

                <h2 className={styles.societyName}>{society.name}</h2>

                <p className={styles.description}>
                  {society.description}
                </p>

                <button className={styles.viewButton}>
                  View Society
                  <span className={styles.arrow}>→</span>
                </button>
              </div>
            ))
          ) : (
            <div className={styles.noResults}>
              <h2>No societies found</h2>
              <p>Try searching for something else.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}