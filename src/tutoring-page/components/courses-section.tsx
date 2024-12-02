import React, { useState } from 'react';
import styles from './courses-section.module.css';

interface Course {
  id: number;
  name: string;
  dayTime: string;
  tutors: string[];
  playlist?: string;
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

  // Course data - hardcoded for now
  const courses: Course[] = [
    {
      id: 1,
      name: 'Introduction to Programming',
      dayTime: 'Mon 10AM, Mon 12PM, Tues 2PM, Thur 3PM',
      tutors: ['Steven Nguyen', 'James Odebiyi'],
      playlist: '',
    },
    {
      id: 2,
      name: 'Introduction to Programming',
      dayTime: 'Mon 10AM, Mon 12PM, Tues 2PM, Thur 3PM',
      tutors: ['Steven Nguyen', 'James Odebiyi'],
      playlist: '',
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
              <div className={styles.course_time_section}>
                <span className={styles.time_label}>Day/Time:</span>
                <span className={styles.time_value}>{course.dayTime}</span>
                <button
                  className={`${styles.expand_button} ${
                    expandedCourses.includes(course.id) ? styles.expanded : ''
                  }`}
                >
                  ▼
                </button>
              </div>
            </div>
            {expandedCourses.includes(course.id) && (
              <div className={styles.course_details}>
                <div className={styles.tutors_section}>
                  <span className={styles.detail_label}>Tutors:</span>
                  <span className={styles.detail_value}>
                    {course.tutors.join(', ')}
                  </span>
                </div>
                <div className={styles.playlist_section}>
                  <span className={styles.detail_label}>Playlist:</span>
                  <span className={styles.detail_value}>
                    {course.playlist || 'N/A'}
                  </span>
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
