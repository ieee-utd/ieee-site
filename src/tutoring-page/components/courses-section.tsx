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
  return normalized.split(/\s*\(/)[0].trim();
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

const fallbackSchedulesByCourse: Record<string, TutorSchedule[]> = {
  'EE/CE 1202': [
    { tutor: 'Josphin', times: ['Mon 4PM-6PM'] },
    { tutor: 'Kaushik', times: ['Tue 1:30PM-2:30PM', 'Thu 1:30PM-2:30PM'] },
    { tutor: 'Danish', times: ['Tue 3PM-5PM'] },
    { tutor: 'Jenny', times: ['Thu 3PM-5PM'] },
    { tutor: 'Nermin', times: ['Wed 1PM-3PM'] },
    { tutor: 'Armaan', times: ['Wed 4PM-6PM'] },
  ],
  'EE/CE 2301': [
    { tutor: 'Jesus', times: ['Wed 10AM-12PM'] },
    { tutor: 'Avinash', times: ['Wed 10AM-12PM'] },
  ],
  'EE/CE 2310': [
    { tutor: 'Shreya', times: ['Mon 11AM-1PM'] },
    { tutor: 'Kasish', times: ['Mon 3:15PM-5:15PM'] },
    { tutor: 'Deeksha', times: ['Tue 10AM-12PM'] },
    { tutor: 'Alicia', times: ['Tue 1PM-2PM', 'Thu 1PM-2PM'] },
    { tutor: 'Tessa', times: ['Fri 12PM-2PM'] },
  ],
  'EE/CE 3300': [{ tutor: 'Jayne', times: ['Mon 1:30PM-2:30PM', 'Thu 1PM-2PM'] }],
  'EE/CE 3310': [
    { tutor: 'Dyanada', times: ['Mon 11:30AM-1:30PM'] },
    { tutor: 'Avinash', times: ['Wed 10AM-12PM'] },
  ],
  'EE/CE 3311': [
    { tutor: 'Sebastian', times: ['Mon 4:30PM-5:30PM', 'Wed 4:30PM-5:30PM'] },
    { tutor: 'Jenny', times: ['Tue 3PM-5PM'] },
  ],
  'EE/CE 3320': [
    { tutor: 'Rushil', times: ['Tue 11AM-1PM'] },
    { tutor: 'Onyeze', times: ['Tue 1PM-2PM', 'Wed 2:30PM-3:30PM'] },
    { tutor: 'Karla', times: ['Wed 10:30AM-12:30PM'] },
  ],
  'EE 4301': [{ tutor: 'Aarnav', times: ['Mon 11:30AM-1:30PM'] }],
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
                    Match course titles in the calendar as Tutor Name ({course.code}) to show tutors here.
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
