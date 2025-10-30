import React, { useState } from 'react';
import styles from './courses-section.module.css';

interface Course {
  id: number;
  name: string;
  schedules: { tutor: string; times: string[] }[];
}

const courses = [
  {
    id: 1,
    name: 'Introduction to Electrical and Computer Engineering II (EE/CE 1202)',
    schedules: [
      { tutor: 'Josphin', times: ['Mon 4PM-6PM'] },
      { tutor: 'Kaushik', times: ['Tue 1:30PM-2:30PM', 'Thu 1:30PM-2:30PM'] },
      { tutor: 'Danish', times: ['Tue 3PM-5PM'] },
      { tutor: 'Jenny', times: ['Thu 3PM-5PM'] },
      { tutor: 'Nermin', times: ['Wed 1PM-3PM'] },
      { tutor: 'Armaan', times: ['Wed 4PM-6PM'] },
    ],
  },
  {
    id: 2,
    name: 'Electrical Network Analysis (EE/CE 2301)',
    schedules: [
      { tutor: 'Jesus', times: ['Wed 10AM-12PM'] },
      { tutor: 'Avinash', times: ['Wed 10AM-12PM'] },
    ],
  },
  {
    id: 3,
    name: 'Introduction to Digital Systems (EE/CE 2310)',
    schedules: [
      { tutor: 'Shreya', times: ['Mon 11AM-1PM'] },
      { tutor: 'Kasish', times: ['Mon 3:15PM-5:15PM'] },
      { tutor: 'Deeksha', times: ['Tue 10AM-12PM'] },
      { tutor: 'Alicia', times: ['Tue 1PM-2PM', 'Thu 1PM-2PM'] },
      { tutor: 'Tessa', times: ['Fri 12PM-2PM'] },
    ],
  },
  {
    id: 4,
    name: 'Discrete-Time Signals and Systems (CE 3303)',
    schedules: [
      { tutor: 'Jayne', times: ['Mon 1:30PM-2:30PM', 'Thu 1PM-2PM'] },
    ],
  },
  {
    id: 5,
    name: 'Electronic Devices (EE/CE 3310)',
    schedules: [
      { tutor: 'Dyanada', times: ['Mon 11:30AM-1:30PM'] },
      { tutor: 'Avinash', times: ['Wed 10AM-12PM'] },
    ],
  },
  {
    id: 6,
    name: 'Electronic Circuits (EE/CE 3311)',
    schedules: [
      { tutor: 'Sebastian', times: ['Mon 4:30PM-5:30PM', 'Wed 4:30PM-5:30PM'] },
      { tutor: 'Jenny', times: ['Tue 3PM-5PM'] },
    ],
  },
  {
    id: 7,
    name: 'Digital Circuits (EE/CE 3320)',
    schedules: [
      { tutor: 'Rushil', times: ['Tue 11AM-1PM'] },
      { tutor: 'Onyeze', times: ['Tue 1PM-2PM', 'Wed 2:30PM-3:30PM'] },
      { tutor: 'Karla', times: ['Wed 10:30AM-12:30PM'] },
    ],
  },
  {
    id: 8,
    name: 'Electromagnetic Engineering I (EE 4301)',
    schedules: [
      { tutor: 'Aarnav', times: ['Mon 11:30AM-1:30PM'] },
    ],
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