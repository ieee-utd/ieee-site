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
    about: [
      {
        heading: "What it is",
        text: "PES is a technical community within IEEE UTD focused on power, energy, and the technologies that make modern electrical systems possible. We aim to expose students to projects and workshops involving renewable energy, power electronics, energy storage, power generation, and the electrical grid.",
      },
      {
        heading: "Who it is for",
        text: "PES is for students interested in energy, electrical engineering, electronics, renewable energy, sustainability, or simply learning how the systems that power the world actually work. No prior experience is required. Students with any background in engineering or just interested in PES are welcome.",
      },
      {
        heading: "What members get out of it",
        text: "Members receive experience designing and building real energy-related projects while developing solid engineering, problem-solving, and teamwork skills. They are expected to gain experience with electrical hardware and power systems, build a resume project portfolio, and connect with other students interested in energy and engineering. PES also aims to get students exposed to power and energy industries and the different career paths within it.",
      },
    ],
    blogPosts: [],
  },
  {
    name: "Radio Frequencies Society - MTT-S/AP-S",
    description:
      "Learn about radio frequency technology, wireless communication, antennas, and high-frequency electronic systems.",
    category: "Radio Frequencies",
    about: [
      {
        heading: "What it is",
        text: "The RF Society is the technical group within IEEE UTD that focuses on Radio Frequency technology such as antennas, radios, and other wireless communication systems. We not only give students opportunities to improve their preexisting RF skills, but we also teach them concepts that they won't learn in their classes.",
      },
      {
        heading: "Who it is for",
        text: "RF is for all students with an interest in wireless communication technologies, regardless of their major or existing skills/experience. Whether someone is already an RF pro or a complete beginner, IEEE RF will provide ample opportunities for technical and personal growth and learning.",
      },
      {
        heading: "What members get out of it",
        text: "Members in RF will have many opportunities to get real-world experience by building projects to develop their skills in many areas. Members gain skills in RF fundamentals, embedded systems, circuit design, and soft skills such as collaboration and task coordination. These projects appear very strong on resumes, giving members a permanent boost to their career prospects.",
      },
    ],
    blogPosts: [],
  },
  {
    name: "Robotics & Automation Society",
    description:
      "Explore robotics, automation, intelligent systems, and the technologies driving the future of autonomous machines.",
    category: "Robotics & Automation",
    about: [
      {
        heading: "What it is",
        text: "The Robotics and Automation Society (RAS) is an engineering branch of IEEE UTD that focuses on the embedded hardware and software side of engineering, where students can learn how to apply concepts about mechanical design, electrical fabrication, and software programming into a full-scale project. Members learn how to work hands-on with elements of robotics and face technical problems in a group environment.",
      },
      {
        heading: "Who it is for",
        text: "RAS is open to students across any discipline with an interest in embedded, electrical, mechanical, or software engineering. Projects introduced through RAS are designed to help students build their skills from the ground up, making the organization accessible to beginners in electrical or mechanical engineering, as well as experienced students from other majors who want to develop their EE/ME skills.",
      },
      {
        heading: "What members get out of it",
        text: "Whether that be an autonomous race car, object organizer, maze speedrunner, or another robotics project, members of RAS will learn every step that goes into developing a robotics-focused electrical project. Everything including research, design, and implementation will be taught as part of RAS, so students can complete the school year knowing they played a crucial role in a real embedded project while also picking up new knowledge in various software programs (KiCad, SolidWorks, etc.) and developing the soft skills needed to work effectively as a multidisciplinary team.",
      },
    ],
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
    about: [
      {
        heading: "What it is",
        text: "IEEE SSCS at UTD focuses on digital design, hardware accelerators, and FPGAs, with plans to expand into VLSI and mixed-signal design as the branch grows. We aim to build an industry-ready chip design community through collaborative projects, reusable educational infrastructure, and participation in hardware competitions.",
      },
      {
        heading: "Who it is for",
        text: "SSCS is for students interested in chip design and digital hardware at any experience level. We offer beginner-friendly projects that require no prior experience, as well as intermediate, exploratory projects for students interested in open-ended hardware accelerator design and helping shape the future direction of the club.",
      },
      {
        heading: "What members get out of it",
        text: "Members gain hands-on experience through real hardware design projects that can be developed into strong portfolio and resume projects. Leadership works closely with members to help them pursue their individual interests, develop practical skills, and get the most out of their time with SSCS.",
      },
    ],
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
                  className={`${styles.learnButton} flow-blue`}
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
                        className={`${styles.joinButton} flow-orange`}
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