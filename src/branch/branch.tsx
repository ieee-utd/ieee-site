import React, { useEffect, useState } from "react";
import styles from "./branch.module.css";
import ieeeLogo1x from "assets/ieee-logo-140.png";
import ieeeLogo2x from "assets/ieee-logo-280.png";
import ieeeLogo3x from "assets/ieee-logo-420.png";

/** One monthly blog post. Add new ones to a team's `blogPosts`, newest first. */
interface BlogPost {
  /** Month the post covers, e.g. "October 2026". */
  month: string;
  title: string;
  summary: string;
  /** Where the full post lives. Omit it and the card shows without a link. */
  url?: string;
}

/** A titled paragraph in a team's expanded "Learn more" section. */
interface AboutSection {
  heading: string;
  text: string;
}

interface Team {
  name: string;
  /** Short blurb shown on the card, and searched. */
  description: string;
  category: string;
  /**
   * The full write-up shown when the card is opened. Leave it out and the shared
   * placeholder paragraph is used instead.
   */
  about?: AboutSection[];
  /** What this branch does, as three short cards. Falls back to a shared placeholder. */
  highlights?: { title: string; text: string }[];
  /**
   * The team's monthly blog, newest first. Leave empty until the first post is
   * written; the card then shows a "coming soon" placeholder in its place.
   * Example:
   *   { month: "October 2026", title: "What we built this month",
   *     summary: "A short recap.", url: "https://example.com/post" }
   */
  blogPosts: BlogPost[];
}

const branches: Team[] = [
  {
    name: "Engineering Branch",
    description:
      "Design, build, and program hardware and software projects with a hands-on team.",
    category: "Engineering",
    highlights: [
      { title: "Design & build", text: "Design and build the hardware and software the branch uses and shows off." },
      { title: "Maintain", text: "Look after the tools, kits, and equipment that members rely on." },
      { title: "Teach", text: "Prepare the technical material other members learn from." },
    ],
    blogPosts: [],
  },
  {
    name: "Initiatives Branch",
    description:
      "Plan and launch the projects, programs, and ideas that grow IEEE at UT Dallas.",
    category: "Initiatives",
    highlights: [
      { title: "Plan", text: "Turn ideas into programs and campaigns for IEEE at UT Dallas." },
      { title: "Organize", text: "Coordinate people, dates, and budgets so plans actually happen." },
      { title: "Follow through", text: "Track results and improve what we run each semester." },
    ],
    blogPosts: [],
  },
  {
    name: "Marketing Branch",
    description:
      "Tell IEEE's story through design, social media, photography, and campaigns.",
    category: "Marketing",
    highlights: [
      { title: "Design", text: "Create the graphics, flyers, and branding people see." },
      { title: "Promote", text: "Run social media and announcements for events and opportunities." },
      { title: "Capture", text: "Photograph and film events for the community and our archive." },
    ],
    blogPosts: [],
  },
  {
    name: "Outreach Branch",
    description:
      "Connect IEEE with students, schools, and the community through events and partnerships.",
    category: "Outreach",
    highlights: [
      { title: "Connect", text: "Build relationships with students, clubs, and partner organizations." },
      { title: "Represent", text: "Speak for IEEE at events, fairs, and school visits." },
      { title: "Recruit", text: "Bring new members and volunteers into the community." },
    ],
    blogPosts: [],
  },
  {
    name: "Tutoring Branch",
    description:
      "Help fellow students succeed by running and supporting IEEE's tutoring program.",
    category: "Tutoring",
    highlights: [
      { title: "Schedule", text: "Plan the weekly tutoring calendar and keep sessions covered." },
      { title: "Support", text: "Help tutors and students with questions and requests." },
      { title: "Recruit tutors", text: "Find, train, and onboard new tutors each semester." },
    ],
    blogPosts: [],
  },
  {
    name: "Web Development Branch",
    description:
      "Build and maintain the IEEE at UT Dallas website and the tools behind it.",
    category: "Web Development",
    highlights: [
      { title: "Build", text: "Add new pages and features to the IEEE at UT Dallas site." },
      { title: "Maintain", text: "Keep the site fast, accessible, and up to date." },
      { title: "Collaborate", text: "Work with other branches to publish what they need online." },
    ],
    blogPosts: [],
  },
];

/**
 * Placeholder "learn more" content, shared by every team for now. Replace the
 * text (or give each team its own copy in the `branches` list) once the real
 * details are ready; the layout will hold whatever length you drop in.
 */
const PLACEHOLDER = {
  about:
    "A longer description of this team goes here: what it does, who it is for, and what members get out of being part of it. This is placeholder text.",
  stats: [
    { value: "—", label: "Members" },
    { value: "—", label: "Meetings a month" },
    { value: "—", label: "Open roles" },
  ],
  highlights: [
    { title: "Responsibilities", text: "What this branch is responsible for across IEEE at UT Dallas." },
    { title: "Who we need", text: "The skills and interests that fit well on this team." },
    { title: "What you gain", text: "Experience, connections, and leadership you can point to." },
  ],
  upcoming: ["Next branch meeting", "Open role announcements", "Branch social"],
};

const BLOG_PLACEHOLDER: BlogPost = {
  month: "This month",
  title: "Our first monthly post is on the way",
  summary:
    "Each month this branch will share what it has been working on and what is coming next.",
};

export default function Branch() {
  const [search, setSearch] = useState("");
  const [openTeam, setOpenTeam] = useState<string | null>(null);

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

  const filteredTeams = branches.filter((team) => {
    const query = search.toLowerCase();

    return (
      team.name.toLowerCase().includes(query) ||
      team.description.toLowerCase().includes(query) ||
      team.category.toLowerCase().includes(query)
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
          <h1 className={styles.title}>Branches</h1>

          <p className={styles.subtitle}>
            Explore the teams that run IEEE at UT Dallas and find where you
            fit.
          </p>
        </header>

        <div className={styles.searchContainer}>
          <span className={styles.searchIcon}>⌕</span>

          <input
            type="text"
            placeholder="Search teams..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.results}>
          {filteredTeams.length > 0 ? (
            filteredTeams.map((team) => (
              <div
                className={`${styles.societyCard} ${
                  openTeam === team.name ? styles.societyCardOpen : ""
                }`}
                key={team.name}
                data-team-card
              >
                <div className={styles.cardTop}>
                  <span className={styles.category}>
                    {team.category}
                  </span>
                </div>

                <h2 className={styles.societyName}>{team.name}</h2>

                <p className={styles.description}>
                  {team.description}
                </p>

                <button
                  type="button"
                  className={styles.learnButton}
                  aria-expanded={openTeam === team.name}
                  aria-controls={`team-${team.category}`}
                  onClick={(e) => {
                    const opening = openTeam !== team.name;
                    setOpenTeam(opening ? team.name : null);
                    if (opening) {
                      // Bring the card to the top once the row has re-flowed.
                      const card = e.currentTarget.closest("[data-team-card]");
                      window.setTimeout(() => {
                        if (card) card.scrollIntoView({ behavior: "smooth", block: "center" });
                      }, 60);
                    }
                  }}
                >
                  {openTeam === team.name ? "Show less" : "Learn more"}
                  <span className={styles.arrow} aria-hidden="true">
                    →
                  </span>
                </button>

                <div
                  className={styles.detailsWrap}
                  id={`team-${team.category}`}
                  aria-hidden={openTeam !== team.name}
                >
                  <div className={styles.details}>
                    <div className={styles.detailsInner}>
                      {team.about ? (
                        <div className={styles.aboutSections}>
                          {team.about.map((section) => (
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

                      <h3 className={styles.detailsHeading}>What this branch does</h3>
                      <div className={styles.highlights}>
                        {(team.highlights || PLACEHOLDER.highlights).map((item) => (
                          <div className={styles.highlight} key={item.title}>
                            <h4>{item.title}</h4>
                            <p>{item.text}</p>
                          </div>
                        ))}
                      </div>

                      <h3 className={styles.detailsHeading}>Monthly blog</h3>
                      <div className={styles.blog}>
                        {(team.blogPosts.length > 0
                          ? team.blogPosts
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
                              tabIndex={openTeam === team.name ? 0 : -1}
                              key={post.month + post.title}
                            >
                              {card}
                            </a>
                          ) : (
                            <div
                              className={`${styles.blogPost} ${
                                team.blogPosts.length === 0 ? styles.blogSoon : ""
                              }`}
                              key={post.month + post.title}
                            >
                              {card}
                            </div>
                          );
                        })}
                      </div>

                      <h3 className={styles.detailsHeading}>Branch meetings</h3>
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
                        tabIndex={openTeam === team.name ? 0 : -1}
                      >
                        Join this branch
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.noResults}>
              <h2>No teams found</h2>
              <p>Try searching for something else.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}