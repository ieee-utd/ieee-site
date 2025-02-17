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
      id: 1,
      name: 'Electrical Engineering Basics (EE/CE 1202)',
      schedules: [
        { tutor: 'Aurawyn', times: ['Tues 1PM-2PM'] },
        { tutor: 'Oliver I', times: ['Tues 1:15PM-3:15PM'] },
        { tutor: 'Areebah H', times: ['Wed 12PM-2PM'] },
        { tutor: 'Nermin', times: ['Mon 10AM-12PM'] },
        { tutor: 'Shreya', times: ['Wed 12PM-2PM'] },
        { tutor: 'Josphin K', times: ['Mon 3PM-5PM'] },
      ],
    },
    {
      id: 2,
      name: 'Circuits and Electronics (EE/CE 2310)',
      schedules: [
        { tutor: 'Sai P.', times: ['Mon 4PM-6PM', 'Thur 3PM-5PM'] },
        { tutor: 'Deeksha', times: ['Mon 11AM-1PM'] },
        { tutor: 'Alicia P', times: ['Tues 12:50PM-2:20PM'] },
        { tutor: 'Ugonna', times: ['Thur 3PM-5PM'] },
      ],
    },
    {
      id: 3,
      name: 'Signals and Systems (EE/CE 2301)',
      schedules: [
        { tutor: 'Avinash', times: ['Mon 4PM-6PM'] },
        { tutor: 'Dyanada G', times: ['Wed 2PM-3PM'] },
      ],
    },
    {
      id: 4,
      name: 'Intermediate Electronics (EE 3302, EE 3301)',
      schedules: [
        { tutor: 'Aurawyn', times: ['Tues 11:30AM-12:30PM'] },
      ],
    },
    {
      id: 5,
      name: 'Embedded Systems (EE/CE 3320)',
      schedules: [
        { tutor: 'Rushil', times: ['Wed 12:30PM-2:15PM'] },
      ],
    },
    {
      id: 6,
      name: 'Computer Architecture (CE 3303)',
      schedules: [
        { tutor: 'Rushil', times: ['Mon 10AM-12:15PM'] },
      ],
    },
    {
      id: 7,
      name: 'Power Systems (EE 3202)',
      schedules: [
        { tutor: 'Miguel Q', times: ['Wed 12PM-2PM'] },
      ],
    },
    {
      id: 8,
      name: 'Computer Science Fundamentals (CS 1325)',
      schedules: [
        { tutor: 'Avinash', times: ['Tues 2:30PM-3:30PM'] },
        { tutor: 'Minh', times: ['Mon 10AM-12PM'] },
      ],
    },
    {
      id: 9,
      name: 'Data Structures and Algorithms (CS 3345)',
      schedules: [
        { tutor: 'Minh', times: ['Tues 2:30PM-3:30PM'] },
      ],
    },
  ]

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
