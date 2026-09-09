import React, { useMemo, useState } from "react";
import styles from "./calendar.module.css";
import { CalendarEvent, useCalendarEvents } from "./use-calendar-events";

interface CalendarProps {
  config?: {
    startTime?: string;
    endTime?: string;
    rowHeight?: number;
  };
}

interface EventLayout extends CalendarEvent {
  top: number;
  height: string;
  left: number;
  width: number;
  zIndex: number;
  hasOverlappingLonger: boolean;
  tutorGradient: string;
}

const parseDurationToMinutes = (duration: string): number => {
  const matches = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  const hours = matches && matches[1] ? parseInt(matches[1], 10) : 0;
  const minutes = matches && matches[2] ? parseInt(matches[2], 10) : 0;
  return hours * 60 + minutes;
};

const extractTutorName = (title: string): string => {
  const normalized = title.replace(/\s+/g, " ").trim();
  return normalized.split(/\s*\(/)[0].trim();
};

const TUTOR_COLOR_PALETTE = [
  "#b0e2ff", // light sky blue
  "#87ceff", // sky blue
  "#6495ed", // cornflower blue
  "#246bce", // celtic blue
  "#2e2d88", // cobalt
  "#27408b", // royal blue
  "#000f89", // phthalo blue
];

const hexToHsl = (hex: string): [number, number, number] => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return [h * 360, s * 100, l * 100];
};

// Deterministic per-tutor gradient keyed by that tutor's position in the
// full, sorted tutor roster. Each tutor is assigned one of the named colors
// in TUTOR_COLOR_PALETTE, then a light/dark pair of that same hue is used
// as the gradient stops so the gradient stays clearly visible.
const getTutorGradient = (tutorIndex: number): string => {
  const baseColor =
    TUTOR_COLOR_PALETTE[tutorIndex % TUTOR_COLOR_PALETTE.length];
  const [hue, saturation, lightness] = hexToHsl(baseColor);
  const lightnessStart = Math.max(0, lightness - 10);
  const lightnessEnd = Math.min(100, lightness + 10);
  return `linear-gradient(135deg, hsl(${hue}, ${saturation}%, ${lightnessStart}%) 0%, hsl(${hue}, ${saturation}%, ${lightnessEnd}%) 100%)`;
};

const Calendar: React.FC<CalendarProps> = ({ config = {} }) => {
  const { startTime = "10:00", endTime = "18:00", rowHeight = 50 } = config;
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);
  const totalMinutes =
    endHour * 60 + endMinute - (startHour * 60 + startMinute);
  const [activeDay, setActiveDay] = useState("mon");
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null,
  );
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);
  const { events, loading, error, rateLimited, refetch } = useCalendarEvents();

  const tutorIndexByName = useMemo(() => {
    const uniqueTutors = Array.from(
      new Set(events.map((event) => extractTutorName(event.title))),
    ).sort();
    return new Map(uniqueTutors.map((tutor, index) => [tutor, index]));
  }, [events]);

  const convertTo12HourFormat = (hour: number, minute: number): string => {
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    const displayMinute = minute.toString().padStart(2, "0");
    return `${displayHour}:${displayMinute} ${period}`;
  };

  const timeSlots = Array.from(
    { length: Math.ceil(totalMinutes / 30) },
    (_, i) => {
      const minutes = startHour * 60 + startMinute + i * 30;
      const hour = Math.floor(minutes / 60);
      const minute = minutes % 60;
      return convertTo12HourFormat(hour, minute);
    },
  );

  const processDayEvents = (events: CalendarEvent[]): EventLayout[] => {
    const parseTime = (time: string) => {
      const [h, m] = time.split(":").map(Number);
      return (h - startHour) * 60 + (m - startMinute);
    };

    const sorted = [...events].sort(
      (a, b) => parseTime(a.startTime) - parseTime(b.startTime),
    );
    const clusters: CalendarEvent[][] = [];
    let currentCluster: CalendarEvent[] = [];
    let clusterEnd = 0;

    for (const event of sorted) {
      const start = parseTime(event.startTime);
      const end = start + parseDurationToMinutes(event.duration);
      if (currentCluster.length === 0) {
        currentCluster.push(event);
        clusterEnd = end;
      } else if (start < clusterEnd) {
        currentCluster.push(event);
        clusterEnd = Math.max(clusterEnd, end);
      } else {
        clusters.push(currentCluster);
        currentCluster = [event];
        clusterEnd = end;
      }
    }

    if (currentCluster.length > 0) clusters.push(currentCluster);

    return clusters.flatMap((cluster) => {
      const eventsWithOverlapInfo = cluster.map((event) => {
        const eventStart = parseTime(event.startTime);
        const eventDuration = parseDurationToMinutes(event.duration);
        const eventEnd = eventStart + eventDuration;
        let hasOverlappingLonger = false;

        for (const otherEvent of cluster) {
          if (otherEvent === event) continue;
          const otherStart = parseTime(otherEvent.startTime);
          const otherDuration = parseDurationToMinutes(otherEvent.duration);
          const otherEnd = otherStart + otherDuration;
          if (
            eventEnd > otherStart &&
            eventStart < otherEnd &&
            otherDuration > eventDuration
          ) {
            hasOverlappingLonger = true;
            break;
          }
        }

        const foundTutorIndex = tutorIndexByName.get(
          extractTutorName(event.title),
        );
        const tutorGradient = getTutorGradient(
          foundTutorIndex !== undefined ? foundTutorIndex : 0,
        );

        return { ...event, hasOverlappingLonger, tutorGradient };
      });

      const columns: (CalendarEvent & {
        hasOverlappingLonger: boolean;
        tutorGradient: string;
      })[][] = [];
      const endTimes: number[] = [];

      for (const event of eventsWithOverlapInfo) {
        const start = parseTime(event.startTime);
        const end = start + parseDurationToMinutes(event.duration);
        let colIndex = endTimes.findIndex((et) => et <= start);
        if (colIndex === -1) {
          colIndex = columns.length;
          columns.push([]);
          endTimes.push(end);
        } else {
          endTimes[colIndex] = end;
        }
        columns[colIndex].push(event);
      }

      const totalCols = columns.length;

      return columns.flatMap((col, colIndex) =>
        col.map((event) => {
          const start = parseTime(event.startTime);
          const duration = parseDurationToMinutes(event.duration);
          let zIndex = 1000 - parseDurationToMinutes(event.startTime);
          if (event.id === hoveredEventId) {
            zIndex = 1001;
          }
          return {
            ...event,
            top: (start / 15) * (rowHeight / 2),
            height: `${(duration / 15 + 2) * (rowHeight / 2)}px`,
            left: (colIndex / totalCols) * 100,
            width: 100 / totalCols,
            zIndex,
            hasOverlappingLonger: event.hasOverlappingLonger || false,
            tutorGradient: event.tutorGradient,
          };
        }),
      );
    });
  };

  const convertEventTimeTo12HourFormat = (time: string): string => {
    const [hour, minute] = time.split(":").map(Number);
    return convertTo12HourFormat(hour, minute);
  };

  const days = [
    { id: "mon", label: "Monday" },
    { id: "tue", label: "Tuesday" },
    { id: "wed", label: "Wednesday" },
    { id: "thu", label: "Thursday" },
    { id: "fri", label: "Friday" },
  ];

  const lastIndex = timeSlots.length;

  return (
    <div className={styles.schedule}>
      {loading && (
        <div style={{ padding: "20px", textAlign: "center" }}>
          Loading calendar events...
        </div>
      )}
      {error && (
        <div style={{ padding: "20px", color: "red", textAlign: "center" }}>
          Error: {error}
          <button
            onClick={refetch}
            disabled={rateLimited}
            style={{ marginLeft: "10px" }}
          >
            {rateLimited ? "Try again shortly" : "Retry"}
          </button>
        </div>
      )}
      {!loading && !error && (
        <>
          <div className={styles.timeline}>
            <div className={styles.timeSlot}></div>
            {timeSlots.map((time, index) => (
              <div key={index} className={styles.timeSlot}>
                {time}
              </div>
            ))}
          </div>
          <div className={styles.daysWrapper}>
            <div className={styles.daysHeader}>
              {days.map((day) => (
                <button
                  key={day.id}
                  className={`${styles.dayTab} ${activeDay === day.id ? styles.active : ""}`}
                  onClick={() => setActiveDay(day.id)}
                >
                  {day.label}
                </button>
              ))}
            </div>
            <div className={styles.daysGrid}>
              <div className={styles.dayHeaderRow}>
                {days.map((day) => (
                  <div
                    key={`header-${day.id}`}
                    className={styles.dayHeaderCell}
                  >
                    {day.label.substring(0, 3)}
                  </div>
                ))}
              </div>
              {days.map((day) => (
                <div
                  key={day.id}
                  className={`${styles.dayColumn} ${activeDay === day.id ? styles.active : ""}`}
                >
                  {processDayEvents(
                    events.filter((e) => e.id.startsWith(day.id)),
                  ).map((event) => {
                    return (
                      <div
                        key={event.id}
                        className={`${styles.event} ${
                          event.hasOverlappingLonger ? styles.hasOutline : ""
                        }`}
                        style={{
                          top: `${event.top}px`,
                          height: event.height,
                          left: `calc(${event.left}% - 2px)`,
                          width: `calc(${event.width}% - 2px)`,
                          zIndex: event.zIndex,
                          backgroundImage: event.tutorGradient,
                        }}
                        onClick={() => setSelectedEvent(event)}
                        onMouseEnter={() => setHoveredEventId(event.id)}
                        onMouseLeave={() => setHoveredEventId(null)}
                      >
                        <div className={styles.eventTime}>
                          {convertEventTimeTo12HourFormat(event.startTime)}
                        </div>
                        <div className={styles.eventTitle}>{event.title}</div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
            <div className={styles.gridLines}>
              {timeSlots.map((_, index) => (
                <div
                  key={`grid-line-${index}`}
                  className={styles.gridLine}
                  style={{ top: `${index * 50 + 50 - 1}px` }}
                />
              ))}
              <div
                key={`grid-line-${lastIndex}`}
                className={styles.gridLine}
                style={{ top: `${lastIndex * 50 + 50 - 1}px` }}
              />
            </div>
          </div>
        </>
      )}
      {selectedEvent && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <button
              className={styles.modalClose}
              onClick={() => setSelectedEvent(null)}
            >
              ×
            </button>
            <h3>{selectedEvent.title}</h3>
            <div dangerouslySetInnerHTML={{ __html: selectedEvent.content }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
