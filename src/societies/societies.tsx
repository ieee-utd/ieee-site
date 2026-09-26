import React, { useEffect, useState } from "react";
import styles from "./societies.module.css";
import ieeeLogo1x from "assets/ieee-logo-140.png";
import ieeeLogo2x from "assets/ieee-logo-280.png";
import ieeeLogo3x from "assets/ieee-logo-420.png";

/** One monthly blog post. Add new ones to a society's `blogPosts`, newest first. */
interface BlogPost {
  /** Month the post covers, e.g. "October 2026". */
  month: string;
  title: string;
  summary: string;
  /** Where the full post lives. Omit it and the card shows without a link. */
  url?: string;
}

/** A titled paragraph in a society's expanded "Learn more" section. */
interface AboutSection {
  heading: string;
  text: string;
}

interface Society {
  name: string;
  /** Short blurb shown on the card, and searched. */
  description: string;
  category: string;
  /**
   * The full write-up shown when the card is opened. Leave it out and the shared
   * placeholder paragraph is used instead.
   */
  about?: AboutSection[];
  /**
   * The society's monthly blog, newest first. Leave empty until the first post is
   * written; the card then shows a "coming soon" placeholder in its place.
   * Example:
   *   { month: "October 2026", title: "What we built this month",
   *     summary: "A short recap.", url: "https://example.com/post" }
   */
  blogPosts: BlogPost[];
}

const societies: Society[] = [
  {
    name: "Power & Energy Society",
    description:
      "Explore electrical power systems, renewable energy, smart grids, and the technologies shaping the future of energy.",
    category: "Power & Energy",
    blogPosts: [],
  },
  {
    name: "Radio Frequencies Society - MTT-S/AP-S",
    description:
      "Learn about radio frequency technology, wireless communication, antennas, and high-frequency electronic systems.",
    category: "Radio Frequencies",
    blogPosts: [],
  },
  {
    name: "Robotics & Automation Society",
    description:
      "Explore robotics, automation, intelligent systems, and the technologies driving the future of autonomous machines.",
    category: "Robotics & Automation",
    blogPosts: [],
  },
  {
    name: "Computer Intelligence Society",
    description:
      "Discover artificial intelligence, machine learning, computational intelligence, and intelligent systems.",
    category: "Computer Intelligence",
    about: [
      {
        heading: "What it is",
        text: "CIS is a technical community within IEEE UTD focused on AI, software, and intelligent hardware systems. We create opportunities for students to take what they learn in the classroom and apply it through hands-on projects, workshops, and technical events.",
      },
      {
        heading: "Who it is for",
        text: "CIS is for students who are interested in AI, software development, embedded systems, hardware, or simply want to explore these areas. No prior experience is required. Whether someone is completely new or already has technical experience, they can find opportunities to learn, contribute, and grow.",
      },
      {
        heading: "What members get out of it",
        text: "Members get the chance to build real projects from start to finish, strengthen their technical and problem-solving skills, and gain experience working as part of a team. They can build projects for their resume, have meaningful experiences to talk about in interviews, learn from other students, and connect with a community of people who share similar technical interests.",
      },
    ],
    blogPosts: [],
  },
  {
    name: "Solid-State Circuits Society",
    description:
      "Explore integrated circuits, semiconductor technology, chip design, and the hardware powering modern electronics.",
    category: "Solid-State Circuits",
    blogPosts: [],
  },
];

/**
 * Placeholder "learn more" content, shared by every society for now. Replace the
 * text (or give each society its own copy in the `societies` list) once the real
 * details are ready; the layout will hold whatever length you drop in.
 */
const PLACEHOLDER = {
  about:
    "A longer description of this society goes here: what it is, who it is for, and what members get out of being part of it. This is placeholder text.",
  stats: [
    { value: "—", label: "Members" },
    { value: "—", label: "Events a year" },
    { value: "—", label: "Projects" },
  ],
  highlights: [
    { title: "Workshops", text: "Hands-on sessions run by members and industry guests." },
    { title: "Projects", text: "Build something real with a team, from idea to demo." },
    { title: "Community", text: "Meet people who share your interests and goals." },
  ],
  upcoming: ["Upcoming event one", "Upcoming event two", "Upcoming event three"],
};

const BLOG_PLACEHOLDER: BlogPost = {
  month: "This month",
  title: "Our first monthly post is on the way",
  summary:
    "Each month this society will share what it has been working on, what members learned, and what is coming next.",
};

export default function Societies() {
  const [search, setSearch] = useState("");
  const [openSociety, setOpenSociety] = useState<string | null>(null);

  // The site snaps scrolling to sections (see index.css), but this page is one
  // continuous list with no sections. Its only snap point is the footer, which sits
  // past the reachable bottom, so mandatory snapping keeps dragging the page back
  // down and it gets stuck there. Turn snapping off while this page is showing.
  useEffect(() => {
    const root = document.documentElement;
    const previous = root.style.scrollSnapType;
    root.style.scrollSnapType = "none";
    return () => {
      root.style.scrollSnapType = previous;
    };
  }, []);

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
        {/* Pre-scaled copies of the logo: the original is ~1,400px wide, and letting the
            browser shrink it ten-fold leaves ragged, shimmering edges. */}
        <img
          src={ieeeLogo1x}
          srcSet={`${ieeeLogo1x} 1x, ${ieeeLogo2x} 2x, ${ieeeLogo3x} 3x`}
          alt="IEEE Logo"
          width={140}
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
              <div
                className={`${styles.societyCard} ${
                  openSociety === society.name ? styles.societyCardOpen : ""
                }`}
                key={society.name}
                data-society-card
              >
                <div className={styles.cardTop}>
                  <span className={styles.category}>
                    {society.category}
                  </span>
                </div>

                <h2 className={styles.societyName}>{society.name}</h2>

                <p className={styles.description}>
                  {society.description}
                </p>

                <button
                  type="button"
                  className={styles.learnButton}
                  aria-expanded={openSociety === society.name}
                  aria-controls={`society-${society.category}`}
                  onClick={(e) => {
                    const opening = openSociety !== society.name;
                    setOpenSociety(opening ? society.name : null);
                    if (opening) {
                      // Bring the card to the top once the row has re-flowed.
                      const card = e.currentTarget.closest("[data-society-card]");
                      window.setTimeout(() => {
                        if (card) card.scrollIntoView({ behavior: "smooth", block: "center" });
                      }, 60);
                    }
                  }}
                >
                  {openSociety === society.name ? "Show less" : "Learn more"}
                  <span className={styles.arrow} aria-hidden="true">
                    →
                  </span>
                </button>

                <div
                  className={styles.detailsWrap}
                  id={`society-${society.category}`}
                  aria-hidden={openSociety !== society.name}
                >
                  <div className={styles.details}>
                    <div className={styles.detailsInner}>
                      {society.about ? (
                        <div className={styles.aboutSections}>
                          {society.about.map((section) => (
                            <div key={section.heading}>
                              <h3 className={styles.aboutHeading}>{section.heading}</h3>
                              <p className={styles.detailsAbout}>{section.text}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className={styles.detailsAbout}>{PLACEHOLDER.about}</p>
                      )}

                      <div className={styles.stats}>
                        {PLACEHOLDER.stats.map((stat) => (
                          <div className={styles.stat} key={stat.label}>
                            <span className={styles.statValue}>{stat.value}</span>
                            <span className={styles.statLabel}>{stat.label}</span>
                          </div>
                        ))}
                      </div>

                      <h3 className={styles.detailsHeading}>What you can do</h3>
                      <div className={styles.highlights}>
                        {PLACEHOLDER.highlights.map((item) => (
                          <div className={styles.highlight} key={item.title}>
                            <h4>{item.title}</h4>
                            <p>{item.text}</p>
                          </div>
                        ))}
                      </div>

                      <h3 className={styles.detailsHeading}>Monthly blog</h3>
                      <div className={styles.blog}>
                        {(society.blogPosts.length > 0
                          ? society.blogPosts
                          : [BLOG_PLACEHOLDER]
                        ).map((post) => {
                          const card = (
                            <>
                              <span className={styles.blogMonth}>{post.month}</span>
                              <h4>{post.title}</h4>
                              <p>{post.summary}</p>
                              {post.url && (
                                <span className={styles.blogRead}>
                                  Read post <span aria-hidden="true">→</span>
                                </span>
                              )}
                            </>
                          );
                          return post.url ? (
                            <a
                              className={`${styles.blogPost} ${styles.blogLink}`}
                              href={post.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              tabIndex={openSociety === society.name ? 0 : -1}
                              key={post.month + post.title}
                            >
                              {card}
                            </a>
                          ) : (
                            <div
                              className={`${styles.blogPost} ${
                                society.blogPosts.length === 0 ? styles.blogSoon : ""
                              }`}
                              key={post.month + post.title}
                            >
                              {card}
                            </div>
                          );
                        })}
                      </div>

                      <h3 className={styles.detailsHeading}>Coming up</h3>
                      <ul className={styles.upcoming}>
                        {PLACEHOLDER.upcoming.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>

                      <a
                        className={styles.joinButton}
                        href="https://linktr.ee/ieeeutdallas"
                        target="_blank"
                        rel="noopener noreferrer"
                        tabIndex={openSociety === society.name ? 0 : -1}
                      >
                        Join this society
                      </a>
                    </div>
                  </div>
                </div>
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