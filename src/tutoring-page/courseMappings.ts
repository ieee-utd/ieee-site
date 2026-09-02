export interface TutorSchedule {
  tutor: string;
  times: string[];
}

export interface CourseCard {
  id: number;
  name: string;
  code: string;
  schedules: TutorSchedule[];
}

export const COURSES: CourseCard[] = [
  { id: 1, name: 'Introduction to Electrical and Computer Engineering II', code: 'EE/CE 1202', schedules: [] },
  { id: 2, name: 'Electrical Network Analysis', code: 'EE/CE 2301', schedules: [] },
  { id: 3, name: 'Introduction to Digital Systems', code: 'EE/CE 2310', schedules: [] },
  { id: 4, name: 'Advance Engineering Math', code: 'EE/CE 3300', schedules: [] },
  { id: 5, name: 'Electronic Devices', code: 'EE/CE 3310', schedules: [] },
  { id: 6, name: 'Electronic Circuits', code: 'EE/CE 3311', schedules: [] },
  { id: 7, name: 'Digital Circuits', code: 'EE/CE 3320', schedules: [] },
  { id: 8, name: 'Electromagnetic Engineering I', code: 'EE 4301', schedules: [] },
  { id: 9, name: 'Analog Integrated Circuit Analysis and Design', code: 'EE 4340', schedules: [] },
];

export const courseCodePatterns: Array<{ code: string; pattern: RegExp }> = [
  { code: 'EE/CE 1202', pattern: /\bEE\/?CE\s*1202\b/i },
  { code: 'EE/CE 2301', pattern: /\bEE\/?CE\s*2301\b/i },
  { code: 'EE/CE 2310', pattern: /\bEE\/?CE\s*2310\b/i },
  { code: 'EE/CE 3300', pattern: /\bEE\/?CE\s*3300\b/i },
  { code: 'EE/CE 3310', pattern: /\bEE\/?CE\s*3310\b/i },
  { code: 'EE/CE 3311', pattern: /\bEE\/?CE\s*3311\b/i },
  { code: 'EE/CE 3320', pattern: /\bEE\/?CE\s*3320\b/i },
  { code: 'EE 4301', pattern: /\bEE\s*4301\b/i },
  { code: 'EE 4340', pattern: /\bEE\s*4340\b/i },
];

export const normalizeCourseTitle = (title: string): string => title.replace(/\s+/g, ' ').trim();
