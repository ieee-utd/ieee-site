interface CalendarEvent {
  id: string;
  title: string;
  startTime: string;
  duration: string;
  colorClass: number;
  content: string;
}
const tutoringSchedule: CalendarEvent[] = [
  {
    id: "mon-1",
    title: "EE/CE 3320 - Aurawyn",
    startTime: "11:30",
    duration: "PT1H",
    colorClass: 1, // EE/CE 3320
    content:
      "<p>Class session for EE/CE 3320 with Aurawyn. (11:30 AM - 12:30 PM)</p>",
  },
  {
    id: "mon-2",
    title: "EE 3202 - Miguel",
    startTime: "12:00",
    duration: "PT2H",
    colorClass: 2, // EE 3202
    content:
      "<p>Class session for EE 3202 with Miguel. (12:00 PM - 2:00 PM)</p>",
  },
  {
    id: "mon-3",
    title: "EE/CE 1202 - David",
    startTime: "14:00",
    duration: "PT1H30M",
    colorClass: 3, // EE/CE 1202
    content:
      "<p>Class session for EE/CE 1202 with David. (2:00 PM - 3:30 PM)</p>",
  },
  {
    id: "mon-4",
    title: "EE 3310 - Avinash",
    startTime: "14:15",
    duration: "PT1H",
    colorClass: 4, // EE 3310
    content:
      "<p>Class session for EE 3310 with Avinash. (2:15 PM - 3:15 PM)</p>",
  },
  {
    id: "mon-5",
    title: "CS 3345 - Minh",
    startTime: "14:30",
    duration: "PT1H",
    colorClass: 5, // CS 3345
    content: "<p>Class session for CS 3345 with Minh. (2:30 PM - 3:30 PM)</p>",
  },
  {
    id: "mon-6",
    title: "EE/CE 2301 - Avinash",
    startTime: "15:15",
    duration: "PT45M",
    colorClass: 6, // EE/CE 2301
    content:
      "<p>Class session for EE/CE 2301 with Avinash. (3:15 PM - 4:00 PM)</p>",
  },
  {
    id: "tue-1",
    title: "CE 3303 - Rushil",
    startTime: "10:30",
    duration: "PT2H15M",
    colorClass: 7, // CE 3303
    content:
      "<p>Class session for CE 3303 with Rushil. (10:30 AM - 12:45 PM)</p>",
  },
  {
    id: "tue-2",
    title: "CS 3345 - Rushil",
    startTime: "10:30",
    duration: "PT2H15M",
    colorClass: 5, // CS 3345 (same as above)
    content:
      "<p>Class session for CS 3345 with Rushil. (10:30 AM - 12:45 PM)</p>",
  },
  {
    id: "tue-3",
    title: "EE/CE 1202 - Jenny",
    startTime: "11:00",
    duration: "PT2H",
    colorClass: 3, // EE/CE 1202 (same as above)
    content:
      "<p>Class session for EE/CE 1202 with Jenny. (11:00 AM - 1:00 PM)</p>",
  },
  {
    id: "tue-4",
    title: "EE/CE 2310 - Alicia",
    startTime: "12:50",
    duration: "PT1H30M",
    colorClass: 8, // EE/CE 2310
    content:
      "<p>Class session for EE/CE 2310 with Alicia. (12:50 PM - 2:20 PM)</p>",
  },
  {
    id: "tue-5",
    title: "EE/CE 3320 - Aurawyn",
    startTime: "13:00",
    duration: "PT1H",
    colorClass: 1, // EE/CE 3320 (same as above)
    content:
      "<p>Class session for EE/CE 3320 with Aurawyn. (1:00 PM - 2:00 PM)</p>",
  },
  {
    id: "tue-6",
    title: "EE/CE 2301 - Dyanada",
    startTime: "14:00",
    duration: "PT1H",
    colorClass: 6, // EE/CE 2301 (same as above)
    content:
      "<p>Class session for EE/CE 2301 with Dyanada. (2:00 PM - 3:00 PM)</p>",
  },
  {
    id: "tue-7",
    title: "EE/CE 2301 - Avinash",
    startTime: "16:00",
    duration: "PT1H",
    colorClass: 6, // EE/CE 2301 (same as above)
    content:
      "<p>Class session for EE/CE 2301 with Avinash. (4:00 PM - 5:00 PM)</p>",
  },
  {
    id: "tue-8",
    title: "EE/CE 1202 - David",
    startTime: "17:00",
    duration: "PT1H",
    colorClass: 3, // EE/CE 1202 (same as above)
    content:
      "<p>Class session for EE/CE 1202 with David. (5:00 PM - 6:00 PM)</p>",
  },
  {
    id: "wed-1",
    title: "EE/CE 1202 - Nermin",
    startTime: "10:00",
    duration: "PT2H",
    colorClass: 3, // EE/CE 1202 (same as above)
    content:
      "<p>Class session for EE/CE 1202 with Nermin. (10:00 AM - 12:00 PM)</p>",
  },
  {
    id: "wed-2",
    title: "EE/CE 1202 - Oliver",
    startTime: "13:15",
    duration: "PT2H",
    colorClass: 3, // EE/CE 1202 (same as above)
    content:
      "<p>Class session for EE/CE 1202 with Oliver. (1:15 PM - 3:15 PM)</p>",
  },
  {
    id: "wed-3",
    title: "EE 3310 - Avinash",
    startTime: "14:15",
    duration: "PT1H",
    colorClass: 4, // EE 3310 (same as above)
    content:
      "<p>Class session for EE 3310 with Avinash. (2:15 PM - 3:15 PM)</p>",
  },
  {
    id: "wed-4",
    title: "CS 3345 - Minh",
    startTime: "14:30",
    duration: "PT1H",
    colorClass: 5, // CS 3345 (same as above)
    content: "<p>Class session for CS 3345 with Minh. (2:30 PM - 3:30 PM)</p>",
  },
  {
    id: "wed-5",
    title: "EE/CE 2310 - Ugonna",
    startTime: "15:00",
    duration: "PT2H",
    colorClass: 8, // EE/CE 2310 (same as above)
    content:
      "<p>Class session for EE/CE 2310 with Ugonna. (3:00 PM - 5:00 PM)</p>",
  },
  {
    id: "wed-6",
    title: "EE/CE 2301 - Avinash",
    startTime: "15:15",
    duration: "PT45M",
    colorClass: 6, // EE/CE 2301 (same as above)
    content:
      "<p>Class session for EE/CE 2301 with Avinash. (3:15 PM - 4:00 PM)</p>",
  },
  {
    id: "wed-7",
    title: "EE/CE 2310 - Sai",
    startTime: "16:00",
    duration: "PT2H",
    colorClass: 8, // EE/CE 2310 (same as above)
    content:
      "<p>Class session for EE/CE 2310 with Sai. (4:00 PM - 6:00 PM)</p>",
  },
  {
    id: "thu-1",
    title: "EE/CE 1202 - Areebah",
    startTime: "12:00",
    duration: "PT2H",
    colorClass: 3, // EE/CE 1202 (same as above)
    content:
      "<p>Class session for EE/CE 1202 with Areebah. (12:00 PM - 2:00 PM)</p>",
  },
  {
    id: "thu-2",
    title: "EE/CE 1202 - Shreya",
    startTime: "12:00",
    duration: "PT2H",
    colorClass: 3, // EE/CE 1202 (same as above)
    content:
      "<p>Class session for EE/CE 1202 with Shreya. (12:00 PM - 2:00 PM)</p>",
  },
  {
    id: "thu-3",
    title: "EE/CE 2310 - Alicia",
    startTime: "13:50",
    duration: "PT30M",
    colorClass: 8, // EE/CE 2310 (same as above)
    content:
      "<p>Class session for EE/CE 2310 with Alicia. (1:50 PM - 2:20 PM)</p>",
  },
  {
    id: "thu-4",
    title: "EE/CE 2301 - Dyanada",
    startTime: "14:00",
    duration: "PT1H",
    colorClass: 6, // EE/CE 2301 (same as above)
    content:
      "<p>Class session for EE/CE 2301 with Dyanada. (2:00 PM - 3:00 PM)</p>",
  },
  {
    id: "thu-5",
    title: "EE/CE 2310 - Vishal",
    startTime: "16:00",
    duration: "PT1H",
    colorClass: 8, // EE/CE 2310 (same as above)
    content:
      "<p>Class session for EE/CE 2310 with Vishal. (4:00 PM - 5:00 PM)</p>",
  },
  {
    id: "thu-6",
    title: "EE/CE 1202 - David",
    startTime: "17:00",
    duration: "PT1H",
    colorClass: 3, // EE/CE 1202 (same as above)
    content:
      "<p>Class session for EE/CE 1202 with David. (5:00 PM - 6:00 PM)</p>",
  },
  {
    id: "fri-1",
    title: "CS 1325 - Minh",
    startTime: "10:00",
    duration: "PT2H",
    colorClass: 9, // CS 1325
    content:
      "<p>Class session for CS 1325 with Minh. (10:00 AM - 12:00 PM)</p>",
  },
  {
    id: "fri-2",
    title: "EE/CE 2310 - Deeksha",
    startTime: "11:00",
    duration: "PT2H",
    colorClass: 8, // EE/CE 2310 (same as above)
    content:
      "<p>Class session for EE/CE 2310 with Deeksha. (11:00 AM - 1:00 PM)</p>",
  },
  {
    id: "fri-3",
    title: "EE/CE 3320 - Rushil",
    startTime: "12:30",
    duration: "PT1H45M",
    colorClass: 1, // EE/CE 3320 (same as above)
    content:
      "<p>Class session for EE/CE 3320 with Rushil. (12:30 PM - 2:15 PM)</p>",
  },
  {
    id: "fri-4",
    title: "EE/CE 1202 - Josphin",
    startTime: "15:00",
    duration: "PT2H",
    colorClass: 3, // EE/CE 1202 (same as above)
    content:
      "<p>Class session for EE/CE 1202 with Josphin. (3:00 PM - 5:00 PM)</p>",
  },
  {
    id: "fri-5",
    title: "EE/CE 2310 - Vishal",
    startTime: "16:00",
    duration: "PT1H",
    colorClass: 8, // EE/CE 2310 (same as above)
    content:
      "<p>Class session for EE/CE 2310 with Vishal. (4:00 PM - 5:00 PM)</p>",
  },
];

export default tutoringSchedule;
