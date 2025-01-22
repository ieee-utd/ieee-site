import React, { useState } from 'react';
import styles from './courses-section.module.css';

interface Course {
  id: number;
  name: string;
  schedules: { tutor: string; times: string[] }[];
}

const CoursesSection = () => {
  // Track expanded course cards
  const [expandedCourses, setExpandedCourses] = useState<number[]>([]);

  // Toggle course expansion
  const toggleCourse = (courseId: number) => {
    setExpandedCourses((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  // Course data - updated with individual tutor schedules
  const courses: Course[] = [
    {
      id: 3,
      name: 'Electrical Engineering Basics (EE/CE 1202)',
      schedules: [
        { tutor: 'Josphin K', times: ['Mon 10AM-11AM'] },
        { tutor: 'Oliver I', times: ['Tues 1:30PM-3:30PM'] },
        { tutor: 'Areebah H', times: ['Wed 12PM-2PM'] },
      ],
    },
    {
      id: 4,
      name: 'Circuits and Electronics (EE/CE 2310)',
      schedules: [
        { tutor: 'Dyanada G', times: ['Mon 4PM-6PM'] },
        { tutor: 'Alicia P', times: ['Tues 11:30AM-12:30PM', 'Wed 1PM-2PM'] },
        { tutor: 'Dylan L', times: ['Thur 4PM-5PM'] },
        { tutor: 'Sai P.', times: ['Thur 3PM-5PM'] },
      ],
    },
    {
      id: 5,
      name: 'Advanced Electronics (EE 4301)',
      schedules: [
        { tutor: 'Sebastian C.', times: ['Tues 2:30PM-3:30PM', 'Wed 2:30PM-3:30PM'] },
      ],
    },
    {
      id: 6,
      name: 'Intermediate Electronics (EE 3302, EE 3301)',
      schedules: [
        { tutor: 'Hadeel Cato', times: ['Thur 12PM-1PM', 'Thur 1PM-2PM'] },
      ],
    },
    {
      id: 7,
      name: 'Digital Systems Design (EE/CE 3310)',
      schedules: [
        { tutor: 'Miguel Q', times: ['Fri 10AM-11AM'] },
      ],
    },
  ];

  return (
    <section className={styles.courses_section}>
      <div className={styles.courses_header}>
        <h2 className={styles.courses_title}>Courses</h2>
        <p className={styles.courses_subtitle}>
          We currently provide tutoring in the following courses
        </p>
        <div className={styles.divider} />
      </div>
      <div className={styles.courses_list}>
        {courses.map((course) => (
          <div key={course.id} className={styles.course_card}>
            <div
              className={styles.course_preview}
              onClick={() => toggleCourse(course.id)}
            >
              <div className={styles.course_main_info}>
                <span className={styles.status_indicator} />
                <h3 className={styles.course_name}>{course.name}</h3>
              </div>
              <button
                className={`${styles.expand_button} ${
                  expandedCourses.includes(course.id) ? styles.expanded : ''
                }`}
              >
                ▼
              </button>
            </div>
            {expandedCourses.includes(course.id) && (
              <div className={styles.course_details}>
                {course.schedules.map((schedule, index) => (
                  <div key={index} className={styles.tutor_row}>
                    <div>
                      <strong>{schedule.tutor}</strong>
                    </div>
                    <div>{schedule.times.join(', ')}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default CoursesSection;
