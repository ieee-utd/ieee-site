import React, { useMemo, useState } from 'react';
import styles from './courses-section.module.css';
import { COURSES, courseCodePatterns, TutorSchedule } from '../courseMappings';
import { useCalendarEvents } from '../../calendar/use-calendar-events';

const formatDisplayTime = (date: string, startTime: string) => {
  const [hours, minutes] = startTime.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHour = hours % 12 || 12;
  const displayMinute = minutes.toString().padStart(2, '0');
  const day = new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
    weekday: 'short',
  });

  return `${day} ${displayHour}:${displayMinute} ${period}`;
};

const extractTutorName = (title: string) => {
  const normalized = title.replace(/\s+/g, ' ').trim();
  return normalized.split(/\s*-\s*/)[0].trim();
};

const matchCourseCode = (title: string) =>
  courseCodePatterns.find(({ pattern }) => pattern.test(title))?.code ?? null;

const groupSchedules = (events: { title: string; startTime: string; date: string }[]) => {
  const grouped: Record<string, TutorSchedule[]> = {};

  for (const course of COURSES) {
    grouped[course.code] = [];
  }

  for (const event of events) {
    const courseCode = matchCourseCode(event.title);
    if (!courseCode) continue;

    const tutor = extractTutorName(event.title);
    const time = formatDisplayTime(event.date, event.startTime);
    const scheduleList = grouped[courseCode];
    const existing = scheduleList.find((item) => item.tutor === tutor);

    if (existing) {
      existing.times.push(time);
    } else {
      scheduleList.push({ tutor, times: [time] });
    }
  }

  return grouped;
};

const CoursesSection = () => {
  const [expandedCourses, setExpandedCourses] = useState<number[]>([]);
  const { events } = useCalendarEvents();

  const schedulesByCourse = useMemo(() => groupSchedules(events), [events]);

  const toggleCourse = (courseId: number) => {
    setExpandedCourses((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  return (
    <section className={styles.courses_section} id="courses">
      <div className={styles.courses_header}>
        <p className={styles.eyebrow}>Find your course</p>
        <h2 className={styles.courses_title}>Courses</h2>
        <p className={styles.courses_subtitle}>
          We currently provide tutoring in the following courses
        </p>
      </div>
      <div className={styles.courses_list}>
        {COURSES.map((course) => (
          <div key={course.id} className={styles.course_card}>
            <button
              type="button"
              className={styles.course_preview}
              onClick={() => toggleCourse(course.id)}
              aria-expanded={expandedCourses.includes(course.id)}
            >
              <div className={styles.course_main_info}>
                <span className={styles.status_indicator} />
                <h3 className={styles.course_name}>
                  {course.name} ({course.code})
                </h3>
              </div>
              <span
                className={`${styles.expand_button} ${
                  expandedCourses.includes(course.id) ? styles.expanded : ''
                }`}
                aria-hidden="true"
              >
                +
              </span>
            </button>

            {expandedCourses.includes(course.id) && (
              <div className={styles.course_details}>
                {schedulesByCourse[course.code]?.length > 0 ? (
                  <div className={styles.tutors_grid}>
                    {schedulesByCourse[course.code].map((schedule) => (
                      <div key={schedule.tutor} className={styles.tutor_card}>
                        <strong>{schedule.tutor}</strong>
                        <div>{schedule.times.join(', ')}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.emptyState}>
                    Tutor assignments for this course will be posted soon.
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default CoursesSection;
