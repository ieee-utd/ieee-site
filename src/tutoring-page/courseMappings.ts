export interface TutorSchedule {
  tutor: string;
  times: string[];
}

export interface CourseCard {
  id: number;
  name: string;
  code: string;
}

export const COURSES: CourseCard[] = [
  { id: 1, name: 'Introduction to Electrical and Computer Engineering II', code: 'EE/CE 1202' },
  { id: 2, name: 'Electrical Network Analysis', code: 'EE/CE 2301' },
  { id: 3, name: 'Introduction to Digital Systems', code: 'EE/CE 2310' },
  { id: 4, name: 'Advance Engineering Math', code: 'EE/CE 3300' },
  { id: 5, name: 'Electronic Devices', code: 'EE/CE 3310' },
  { id: 6, name: 'Electronic Circuits', code: 'EE/CE 3311' },
  { id: 7, name: 'Digital Circuits', code: 'EE/CE 3320' },
  { id: 8, name: 'Electromagnetic Engineering I', code: 'EE 4301' },
  { id: 9, name: 'Analog Integrated Circuit Analysis and Design', code: 'EE 4340' },
  { id: 10, name: 'Signals and Systems', code: 'EE 3302' },
  { id: 11, name: 'Discrete-time Signals and Systems', code: 'CE 3303' },
  { id: 12, name: 'System and Controls', code: 'EE 4310' },
  { id: 13, name: 'Computer Architecture', code: 'CE 4304' },
  { id: 14, name: 'Embedded Systems', code: 'EE/CE 4370' },
  { id: 15, name: 'Operating Systems Concepts', code: 'CE 4348' },
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
  { code: 'EE 3302', pattern: /\bEE\s*3302\b/i },
  { code: 'CE 3303', pattern: /\bCE\s*3303\b/i },
  { code: 'EE 4310', pattern: /\bEE\s*4310\b/i },
  { code: 'CE 4304', pattern: /\bCE\s*4304\b/i },
  { code: 'EE/CE 4370', pattern: /\bEE\/?CE\s*4370\b/i },
  { code: 'CE 4348', pattern: /\bCE\s*4348\b/i },
];

export const normalizeCourseTitle = (title: string): string => title.replace(/\s+/g, ' ').trim();
