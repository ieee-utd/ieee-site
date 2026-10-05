import { useState } from "react";
import aboutImage from "../assets/gridimages/who-we-are-hackutd.jpg";
import RevealOnScroll from "../shared/reveal-on-scroll";
import styles from "./about-page.module.css";

// TODO: replace with the real alumni registration form link once it exists.
const ALUMNI_FORM_URL = "#faq";

const benefits = [
  {
    title: "Expand Your Professional Network",
    description:
      "Stay connected with fellow alumni across diverse engineering sectors, startups, and established enterprises.",
  },
  {
    title: "Mentorship & Speaking Opportunities",
    description:
      "Share your unique career trajectory, industry knowledge, and technical expertise through panels, workshops, and informal mentorship.",
  },
  {
    title: "Stay Updated",
    description:
      "Receive updates on student projects, major milestones, and chapter initiatives shaping the UT Dallas engineering landscape.",
  },
];

// Placeholder answers: check each one against how the alumni network really works.
const faqs = [
  {
    question: "Who counts as an IEEE UTD alumnus?",
    answer:
      "Anyone who was an active member of IEEE at UT Dallas and has since graduated or moved on. If you helped run events, tutored, or served on a team, you are welcome.",
  },
  {
    question: "What does registering involve?",
    answer:
      "The alumni registration form takes a few minutes. It asks for your contact details, when you were involved, and what you do now, so we can keep you in the loop and match you with students.",
  },
  {
    question: "Is there a cost to join?",
    answer:
      "No. Joining the alumni network is free. Some events may have their own costs, and those will always be listed up front.",
  },
  {
    question: "What kinds of events will I be invited to?",
    answer:
      "Networking nights, career panels, technical talks, and socials that bring alumni together with current students and with each other.",
  },
  {
    question: "How can I mentor or speak to students?",
    answer:
      "Tick the mentorship or speaking option on the registration form. We will reach out when a panel, workshop, or mentoring program fits your background.",
  },
  {
    question: "How often will I hear from the network?",
    answer:
      "Around once a month: a short update on student projects and upcoming alumni events. You can opt out at any time.",
  },
];

function AboutPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <img
          className={styles.heroImg}
          src={aboutImage}
          alt="IEEE UT Dallas members together at the IEEE table"
        />
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>IEEE at UT Dallas</p>
          <h1 className={styles.heroHeader}>Alumni Network</h1>
          <p className={styles.heroCopy}>
            An established network of former members for professional
            development and advancement.
          </p>
          <a
            className={`${styles.registerLink} flow-gold`}
            href={ALUMNI_FORM_URL}
          >
            Alumni registration form
          </a>
        </div>
      </section>

      <RevealOnScroll>
        <section className={styles.intro}>
          <div className={styles.introText}>
            <p className={styles.sectionLabel}>Once IEEE, always IEEE</p>
            <h2>Grow Beyond Graduation</h2>
            <p>
              The IEEE UTD alumni network connects former members with one
              another and with current students. Through events, mentorship,
              and shared experience, it builds a community where everyone
              grows professionally.
            </p>
          </div>

          <div className={styles.benefits} aria-label="Why join the alumni network">
            {benefits.map((benefit, index) => (
              <article className={styles.benefit} key={benefit.title}>
                <span className={styles.benefitNumber}>0{index + 1}</span>
                <div>
                  <h3>{benefit.title}</h3>
                  <p>{benefit.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </RevealOnScroll>

      <RevealOnScroll>
        <section className={styles.faq} id="faq">
          <div className={styles.faqHeading}>
            <p className={styles.sectionLabel}>Good to know</p>
            <h2>Frequently Asked Questions</h2>
          </div>

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
                    aria-controls={`faq-answer-${index}`}
                    onClick={() => setOpenFaq(open ? null : index)}
                  >
                    <span>{item.question}</span>
                    <span className={styles.faqIcon} aria-hidden="true" />
                  </button>
                  <div
                    className={styles.faqAnswerWrap}
                    id={`faq-answer-${index}`}
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
        </section>
      </RevealOnScroll>
    </main>
  );
}

export default AboutPage;
