import { useState } from "react";
import RevealOnScroll from "../shared/reveal-on-scroll";
import Skeleton from "../shared/skeleton";
import skeletonStyles from "../shared/skeleton.module.css";
import styles from "./hkn-page.module.css";
import heroPhoto from "../assets/gridimages/hkn-tabling.jpg";

// TODO: swap for the chapter's real interest-form link once one exists.
const INTEREST_FORM_URL = "#how-to-join";
// TODO: confirm with chapter officers and replace.
const CONTACT_EMAIL = "hkn@ieeeutd.org";

const pillars = [
  {
    title: "Scholarship",
    detail:
      "Judged by class rank. Students who have finished at least one-third of their degree and rank in the top fifth of their class can be elected. Those halfway through who rank in the top quarter, and those three-fourths through who rank in the top third, also qualify.",
  },
  {
    title: "Character",
    detail:
      "Judged through things like participation in chapter events and demonstrated integrity toward classmates, faculty, and the broader community.",
  },
  {
    title: "Attitude",
    detail:
      "Judged through service hours and a visible commitment to the profession — showing up, helping out, and representing HKN well.",
  },
];

const awards = [
  {
    name: "Madni Family Scholarship",
    blurb:
      "Goes to HKN students who show exceptional scholarship, service to their communities, and commitment to HKN.",
    amount: "Up to 3 undergraduates and up to 2 graduate students receive $1,000 each year, for tuition, books, and fees.",
    extra: "Applications for the 2027 cycle open January 1, 2027.",
    caveat:
      "Applicants must be U.S. citizens studying full-time at an accredited U.S. school, inducted into IEEE-HKN, and have completed their third year in an HKN field. Not open to international students.",
    href: "https://hkn.ieee.org/awards/madni-family-scholarship",
  },
  {
    name: "Outstanding Student Award",
    sub: "Alton B. Zerby and Carl T. Koerner",
    blurb:
      "Honors scholastic excellence and strong character combined with service to classmates, university, community, and country.",
    amount: "Past winners have received a $1,000 honorarium.",
    href: "https://hkn.ieee.org/awards/alton-b-zerby-and-carl-t-koerner-outstanding-studentaward",
  },
];

const conferences = [
  {
    name: "Student Leadership Conference",
    abbr: "SLC",
    headline: true,
    blurb:
      "A three-day event with leadership training, technical presentations, professional development, labs, workshops, and a career and graduate school fair.",
    when: "November 6–8, 2026",
    where: "Embassy Suites, Grapevine, Texas",
    note: "It's local this year — right up the road.",
    href: "https://slc.hkn.events/",
  },
  {
    name: "Pathways to Industry Conference",
    blurb:
      "A three-day virtual event that prepares students for the workforce. Registration covers all sessions, networking, and a recruitment fair.",
    when: "Held annually — the 2026 edition already took place in February",
    where: "Virtual",
    note: "$10 for HKN members, $30 for non-members. 2027 dates will be added once announced.",
    href: "https://www.ieeefoundation.org/event/ieee-hkn-2026-pathways-to-industry-conference/",
  },
];

const careerResources = [
  "A job board of HKN-affiliated postings",
  "Résumé and cover-letter help",
  "Interview tips and career coaching",
  "Career Conversations, HKN's podcast hosted by alumni",
];

const faqs = [
  {
    question: "Who's eligible?",
    answer:
      "Anyone meeting the Scholarship, Character, and Attitude requirements above — see the Eligibility section for the exact class-rank thresholds, and the Graduate Students note if you're in a graduate program.",
  },
  {
    question: "What does it cost?",
    answer:
      "Membership is a one-time induction fee with no annual dues after that — it's yours for life. We'll list Kappa Kappa's exact amount here once it's confirmed with chapter officers.",
  },
  {
    question: "How much time does it take?",
    answer:
      "Day to day, HKN asks for the same kind of involvement that earns you Character and Attitude credit in the first place — showing up to chapter events and logging service hours. The graduate mentoring program is a separate, optional commitment of 2–4 hours a month.",
  },
];

function HknPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [heroLoaded, setHeroLoaded] = useState(false);

  return (
    <main className={styles.page}>
      {/* ---- hero ---- */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>IEEE at UT Dallas · Kappa Kappa Chapter</p>
          <h1 className={styles.heroHeader}>IEEE‑HKN</h1>
          <p className={styles.heroCopy}>
            Eta Kappa Nu is the honor society of IEEE, recognizing students who
            combine Scholarship, Character, and Attitude. UT Dallas&rsquo;s own
            chapter — Kappa Kappa, chartered November 17, 1995 — is newly
            reactivated and building back up.
          </p>
          <div className={styles.heroActions}>
            <a className={`${styles.primaryBtn} flow-gold`} href="#how-to-join">
              How to join
            </a>
            <a
              className={styles.secondaryBtn}
              href="https://hkn.ieee.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit hkn.ieee.org
            </a>
          </div>
        </div>
        {!heroLoaded && <Skeleton className={styles.heroPhoto} />}
        <img
          className={`${styles.heroPhoto} ${skeletonStyles.fadeImg} ${heroLoaded ? skeletonStyles.loaded : ""}`}
          src={heroPhoto}
          alt="IEEE-HKN members tabling at UT Dallas"
          onLoad={() => setHeroLoaded(true)}
          onError={() => setHeroLoaded(true)}
        />
      </section>

      {/* ---- eligibility ---- */}
      <RevealOnScroll>
        <section className={styles.section} data-nav-surface="light" id="eligibility">
          <div className={styles.sectionHeading}>
            <p className={styles.sectionLabel}>Eligibility</p>
            <h2>Scholarship, Character, Attitude</h2>
            <p className={styles.sectionLede}>
              IEEE‑HKN describes its ideals as Scholarship, Character, and
              Attitude, and promotes excellence in the profession and in
              education through all three.
            </p>
          </div>

          <div className={styles.pillarGrid}>
            {pillars.map((pillar) => (
              <article className={styles.pillarCard} key={pillar.title}>
                <h3>{pillar.title}</h3>
                <p>{pillar.detail}</p>
              </article>
            ))}
          </div>

          <div className={styles.gradNote}>
            <h3>Graduate students</h3>
            <p>
              UT Dallas has a large graduate population, so graduate students
              get their own path to eligibility rather than being measured
              against undergraduate class rank. Other HKN chapters keep this
              simple — for example, one chapter makes graduate students with a
              cumulative GPA above a set threshold eligible outright.
            </p>
            <p className={styles.tbd}>
              Kappa Kappa&rsquo;s exact graduate GPA threshold: to be confirmed
              with chapter officers and added here.
            </p>
          </div>
        </section>
      </RevealOnScroll>

      {/* ---- scholarships & awards ---- */}
      <RevealOnScroll>
        <section className={styles.section} data-nav-surface="light" id="scholarships">
          <div className={styles.sectionHeading}>
            <p className={styles.sectionLabel}>Scholarships &amp; awards</p>
            <h2>Money for your membership</h2>
          </div>

          <div className={styles.awardGrid}>
            {awards.map((award) => (
              <article className={styles.awardCard} key={award.name}>
                <h3>{award.name}</h3>
                {award.sub && <p className={styles.awardSub}>{award.sub}</p>}
                <p>{award.blurb}</p>
                <p className={styles.awardAmount}>{award.amount}</p>
                {award.extra && <p>{award.extra}</p>}
                {award.caveat && (
                  <p className={styles.callout}>{award.caveat}</p>
                )}
                <a
                  className={`${styles.cardBtn} flow-orange`}
                  href={award.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Learn more
                </a>
              </article>
            ))}
          </div>

          <div className={styles.spotlight}>
            <div className={styles.spotlightPhoto} aria-label="Fernando Villa" role="img">
              <span>Photo</span>
            </div>
            <div>
              <p className={styles.sectionLabel}>Right next door</p>
              <p>
                A recent Madni Family Scholarship recipient came from right
                next door: <strong>Fernando Villa</strong> of the Epsilon Mu
                Chapter at UT Arlington was a 2025 undergraduate winner. A DFW
                example like this makes the scholarship feel within reach.
              </p>
            </div>
          </div>
        </section>
      </RevealOnScroll>

      {/* ---- conferences ---- */}
      <RevealOnScroll>
        <section className={styles.section} data-nav-surface="light" id="conferences">
          <div className={styles.sectionHeading}>
            <p className={styles.sectionLabel}>Conferences &amp; career fairs</p>
            <h2>Go represent Kappa Kappa</h2>
          </div>

          <div className={styles.conferenceGrid}>
            {conferences.map((conf) => (
              <article
                className={`${styles.conferenceCard} ${
                  conf.headline ? styles.conferenceHeadline : ""
                }`}
                key={conf.name}
              >
                {conf.headline && (
                  <span className={styles.badge}>It&rsquo;s local this year</span>
                )}
                <h3>
                  {conf.name}
                  {conf.abbr && <span className={styles.abbr}> ({conf.abbr})</span>}
                </h3>
                <p>{conf.blurb}</p>
                <dl className={styles.conferenceFacts}>
                  <div>
                    <dt>When</dt>
                    <dd>{conf.when}</dd>
                  </div>
                  <div>
                    <dt>Where</dt>
                    <dd>{conf.where}</dd>
                  </div>
                </dl>
                {conf.note && <p className={styles.conferenceNote}>{conf.note}</p>}
                <a
                  className={`${styles.cardBtn} flow-orange`}
                  href={conf.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {conf.headline ? "Register for SLC" : "Learn more"}
                </a>
              </article>
            ))}
          </div>
        </section>
      </RevealOnScroll>

      {/* ---- additions: career resources, mentoring, membership, recognition ---- */}
      <RevealOnScroll>
        <section className={styles.section} data-nav-surface="light" id="benefits">
          <div className={styles.sectionHeading}>
            <p className={styles.sectionLabel}>More of what HKN offers</p>
            <h2>Beyond the induction ceremony</h2>
          </div>

          <div className={styles.benefitGrid}>
            <article className={styles.benefitCard}>
              <h3>Career resources</h3>
              <ul className={styles.benefitList}>
                {careerResources.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <a
                className={styles.textLink}
                href="https://hkn.ieee.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Browse career resources →
              </a>
            </article>

            <article className={styles.benefitCard}>
              <h3>Graduate mentoring program</h3>
              <p>
                Mentees must be HKN candidates or inductees in a graduate
                program and commit 2–4 hours a month from March through
                December — a strong draw for UTD&rsquo;s graduate students.
              </p>
              <a
                className={styles.textLink}
                href="https://hkn.ieee.org/mentoring"
                target="_blank"
                rel="noopener noreferrer"
              >
                See the mentoring program →
              </a>
            </article>

            <article className={styles.benefitCard}>
              <h3>Lifetime membership</h3>
              <p>
                Once you&rsquo;re inducted, membership never expires. It&rsquo;s
                a one-time fee with no annual dues.
              </p>
              <p className={styles.tbd}>
                Kappa Kappa&rsquo;s exact amount: to be confirmed with chapter
                officers and added here, since cost is a common question.
              </p>
            </article>

            <article className={styles.benefitCard}>
              <h3>Graduation recognition</h3>
              <p>
                HKN members can wear the HKN stole with their cap and gown at
                graduation — students care about this more than you&rsquo;d
                expect.
              </p>
            </article>
          </div>
        </section>
      </RevealOnScroll>

      {/* ---- chapter activity ----
         Before swapping any of the spots below for real photos from the
         BUILDVERSE recap or chapter events: if any show the high school
         team, confirm parental consent is on file first. */}
      <RevealOnScroll>
        <section className={styles.section} data-nav-surface="light" id="chapter-activity">
          <div className={styles.sectionHeading}>
            <p className={styles.sectionLabel}>Chapter activity</p>
            <h2>Kappa Kappa is active again</h2>
            <p className={styles.sectionLede}>
              Showing the chapter in motion is the whole point of this
              section — swap these spots for real photos as events happen.
            </p>
          </div>

          <div className={styles.photoGrid}>
            <div className={styles.photoSpot}>
              <span>Photo</span>
              <p>BUILDVERSE recap</p>
            </div>
            <div className={styles.photoSpot}>
              <span>Photo</span>
              <p>Event photo</p>
            </div>
            <div className={styles.photoSpot}>
              <span>Photo</span>
              <p>Event photo</p>
            </div>
            <div className={styles.photoSpot}>
              <span>Photo</span>
              <p>Officers</p>
            </div>
          </div>
          <p className={styles.sectionLede}>
            Looking for who&rsquo;s running the chapter?{" "}
            <a className={styles.textLink} href="/officers">
              See the full officers page →
            </a>
          </p>
        </section>
      </RevealOnScroll>

      {/* ---- how to join ---- */}
      <RevealOnScroll>
        <section className={styles.section} data-nav-surface="light" id="how-to-join">
          <div className={styles.sectionHeading}>
            <p className={styles.sectionLabel}>How to join</p>
            <h2>Getting inducted</h2>
          </div>

          <ol className={styles.timeline}>
            <li>
              <span className={styles.timelineStep}>1</span>
              <div>
                <h3>Meet the bar</h3>
                <p>
                  Hit the Scholarship, Character, and Attitude requirements
                  above for your class standing — or the graduate path if
                  that applies to you.
                </p>
              </div>
            </li>
            <li>
              <span className={styles.timelineStep}>2</span>
              <div>
                <h3>Let us know you&rsquo;re interested</h3>
                <p>
                  Fill out the interest form so the chapter has you on file
                  when eligibility review and invitations go out.
                </p>
              </div>
            </li>
            <li>
              <span className={styles.timelineStep}>3</span>
              <div>
                <h3>Get inducted</h3>
                <p>
                  Accept your invitation and take part in the induction
                  ceremony — membership is yours for life from that point on.
                </p>
              </div>
            </li>
          </ol>

          <a className={`${styles.primaryBtn} flow-orange`} href={INTEREST_FORM_URL}>
            Fill out the interest form
          </a>

          <div className={styles.faqList}>
            {faqs.map((item, index) => {
              const open = openFaq === index;
              return (
                <div
                  className={`${styles.faqItem} ${open ? styles.faqOpen : ""}`}
                  key={item.question}
                >
                  <button
                    type="button"
                    className={styles.faqQuestion}
                    aria-expanded={open}
                    aria-controls={`hkn-faq-answer-${index}`}
                    onClick={() => setOpenFaq(open ? null : index)}
                  >
                    <span>{item.question}</span>
                    <span className={styles.faqIcon} aria-hidden="true" />
                  </button>
                  <div
                    className={styles.faqAnswerWrap}
                    id={`hkn-faq-answer-${index}`}
                    role="region"
                    aria-hidden={!open}
                  >
                    <div className={styles.faqAnswer}>
                      <p>{item.answer}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <p className={styles.closingCta}>
            Questions about eligibility, cost, or anything else? Email{" "}
            <a className={styles.textLink} href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </section>
      </RevealOnScroll>
    </main>
  );
}

export default HknPage;
