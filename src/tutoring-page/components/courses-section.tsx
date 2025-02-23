import React, { useState } from 'react';
import styles from './courses-section.module.css';

interface Course {
  id: number;
  name: string;
  schedules: { tutor: string; times: string[] }[];
}

const courses = [
  {
    id: 5,
    name: 'Digital Circuits (EE/CE 3320)',
    schedules: [
      { tutor: 'Aurawyn', times: ['Mon 11:30AM-12:30PM', 'Tue 1PM-2PM'] },
      { tutor: 'Rushil', times: ['Fri 12:30PM-2:15PM'] },
    ],
  },
  {
    id: 7,
    name: 'Electrical and Computer Engineering Fundamentals (EE 3202)',
    schedules: [{ tutor: 'Miguel', times: ['Mon 12PM-2PM'] }],
  },
  {
    id: 1,
    name: 'Introduction to Electrical and Computer Engineering (EE/CE 1202)',
    schedules: [
      { tutor: 'David', times: ['Mon 2PM-3:30PM', 'Tue 5PM-6PM', 'Thu 5PM-6PM'] },
      { tutor: 'Jenny', times: ['Tue 11AM-1PM'] },
      { tutor: 'Nermin', times: ['Wed 10AM-12PM'] },
      { tutor: 'Oliver', times: ['Wed 1:15PM-3:15PM'] },
      { tutor: 'Areebah', times: ['Thu 12PM-2PM'] },
      { tutor: 'Shreya', times: ['Thu 12PM-2PM'] },
      { tutor: 'Josphin', times: ['Fri 3PM-5PM'] },
    ],
  },
  {
    id: 3,
    name: 'Electrical Network Analysis (EE/CE 2301)',
    schedules: [
      { tutor: 'Avinash', times: ['Mon 2:15PM-3:15PM', 'Tue 4PM-5PM', 'Wed 3:15PM-4PM'] },
      { tutor: 'Dyanada', times: ['Tue 2PM-3PM', 'Thu 2PM-3PM'] },
    ],
  },
  {
    id: 2,
    name: 'Introduction to Digital Systems (EE/CE 2310)',
    schedules: [
      { tutor: 'Alicia', times: ['Tue 12:50PM-2:20PM', 'Thu 1:50PM-2:20PM'] },
      { tutor: 'Deeksha', times: ['Fri 11AM-1PM'] },
      { tutor: 'Sai', times: ['Wed 4PM-6PM'] },
      { tutor: 'Ugonna', times: ['Wed 3PM-5PM'] },
      { tutor: 'Vishal', times: ['Thu 4PM-5PM', 'Fri 4PM-5PM'] },
    ],
  },
  {
    id: 6,
    name: 'Discrete-Time Signals and Systems (CE 3303)',
    schedules: [{ tutor: 'Rushil', times: ['Tue 10:30AM-12:45PM'] }],
  },
  {
    id: 9,
    name: 'Data Structures and Introduction to Algorithmic Analysis (CS 3345)',
    schedules: [
      { tutor: 'Minh', times: ['Mon 2:30PM-3:30PM', 'Wed 2:30PM-3:30PM'] },
      { tutor: 'Rushil', times: ['Tue 10:30AM-12:45PM'] },
    ],
  },
  {
    id: 8,
    name: 'Introduction to Programming (CS 1325)',
    schedules: [{ tutor: 'Minh', times: ['Fri 10AM-12PM'] }],
  },
];

const CoursesSection = () => {
  const [expandedCourses, setExpandedCourses] = useState<number[]>([]);

  const toggleCourse = (courseId: number) => {
    setExpandedCourses((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

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
            {/* Course preview (clickable header) */}
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

            {/* Expanded course details (grid layout) */}
            {expandedCourses.includes(course.id) && (
              <div className={styles.course_details}>
                <div className={styles.tutors_grid}>
                  {course.schedules.map((schedule, index) => (
                    <div key={index} className={styles.tutor_card}>
                      <strong>{schedule.tutor}</strong>
                      <div>{schedule.times.join(', ')}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default CoursesSection;