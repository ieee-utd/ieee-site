import React, { useState } from 'react';
import styles from './calendar.module.css';

interface CalendarEvent {
  id: string;
  title: string;
  startTime: string;
  duration: string;
  colorClass: number;
  content: string;
  hasOverlappingLonger?: boolean;
}

interface CalendarProps {
  events: CalendarEvent[];
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
}

const parseDurationToMinutes = (duration: string): number => {
  const matches = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  const hours = matches && matches[1] ? parseInt(matches[1], 10) : 0;
  const minutes = matches && matches[2] ? parseInt(matches[2], 10) : 0;
  return hours * 60 + minutes;
};

const Calendar: React.FC<CalendarProps> = ({ events, config = {} }) => {
  const { startTime = '10:00', endTime = '18:00', rowHeight = 50 } = config;
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  const totalMinutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
  const [activeDay, setActiveDay] = useState('mon');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);

  const courseColorMap: { [key: string]: number } = {
    '1202': 1,
    '2301': 2,
    '2310': 3,
    '3320': 4,
    '3303': 5,
    '3325': 6,
    '3910': 7,
    '3345': 8,
    '1325': 9,
    '3310': 10,
  };

  const convertTo12HourFormat = (hour: number, minute: number): string => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    const displayMinute = minute.toString().padStart(2, '0');
    return `${displayHour}:${displayMinute} ${period}`;
  };

  const timeSlots = Array.from({ length: Math.ceil(totalMinutes / 30) }, (_, i) => {
    const minutes = startHour * 60 + startMinute + i * 30;
    const hour = Math.floor(minutes / 60);
    const minute = minutes % 60;
    return convertTo12HourFormat(hour, minute);
  });

  const processDayEvents = (events: CalendarEvent[]): EventLayout[] => {
    const parseTime = (time: string) => {
      const [h, m] = time.split(':').map(Number);
      return (h - startHour) * 60 + (m - startMinute);
    };

    const sorted = [...events].sort((a, b) => parseTime(a.startTime) - parseTime(b.startTime));
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

    return clusters.flatMap(cluster => {
      const eventsWithOverlapInfo = cluster.map(event => {
        const eventStart = parseTime(event.startTime);
        const eventDuration = parseDurationToMinutes(event.duration);
        const eventEnd = eventStart + eventDuration;
        let hasOverlappingLonger = false;

        for (const otherEvent of cluster) {
          if (otherEvent === event) continue;
          const otherStart = parseTime(otherEvent.startTime);
          const otherDuration = parseDurationToMinutes(otherEvent.duration);
          const otherEnd = otherStart + otherDuration;
          if (eventEnd > otherStart && eventStart < otherEnd && otherDuration > eventDuration) {
            hasOverlappingLonger = true;
            break;
          }
        }

        let colorClass = 0;
        for (const prefix in courseColorMap) {
          if (event.title.includes(prefix)) {
            colorClass = courseColorMap[prefix];
            break;
          }
        }
        if (colorClass === 0) {
          colorClass = 5;
        }

        return { ...event, hasOverlappingLonger, colorClass };
      });

      const columns: CalendarEvent[][] = [];
      const endTimes: number[] = [];

      for (const event of eventsWithOverlapInfo) {
        const start = parseTime(event.startTime);
        const end = start + parseDurationToMinutes(event.duration);
        let colIndex = endTimes.findIndex(et => et <= start);
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
        col.map(event => {
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
            colorClass: event.colorClass,
          };
        })
      );
    });
  };

  const convertEventTimeTo12HourFormat = (time: string): string => {
    const [hour, minute] = time.split(':').map(Number);
    return convertTo12HourFormat(hour, minute);
  };

  const days = [
    { id: 'mon', label: 'Monday' },
    { id: 'tue', label: 'Tuesday' },
    { id: 'wed', label: 'Wednesday' },
    { id: 'thu', label: 'Thursday' },
    { id: 'fri', label: 'Friday' },
  ];

  return (
    <div className={styles.schedule}>
      <div className={styles.timeline}>
        {timeSlots.map((time, index) => (
          <div key={index} className={styles.timeSlot}>{time}</div>
        ))}
      </div>
      <div className={styles.daysWrapper}>
        <div className={styles.daysHeader}>
          {days.map(day => (
            <button
              key={day.id}
              className={`${styles.dayTab} ${activeDay === day.id ? styles.active : ''}`}
              onClick={() => setActiveDay(day.id)}
            >
              {day.label}
            </button>
          ))}
        </div>
        <div className={styles.daysGrid}>
          {days.map(day => (
            <div
              key={day.id}
              className={`${styles.dayColumn} ${activeDay === day.id ? styles.active : ''}`}
            >
              {/* Add Day Label */}
              <div className={styles.dayLabel}>{day.label}</div>

              {processDayEvents(events.filter(e => e.id.startsWith(day.id))).map(event => {
                const eventColorClass =
                  event.colorClass <= 16 && event.colorClass >= 1 ? event.colorClass : 1;

                return (
                  <div
                    key={event.id}
                    className={`${styles.event} ${styles[`event--${eventColorClass}`]} ${
                      event.hasOverlappingLonger ? styles.hasOutline : ''
                    }`}
                    style={{
                      top: `${event.top}px`,
                      height: event.height,
                      left: `calc(${event.left}% - 2px)`,
                      width: `calc(${event.width}% - 2px)`,
                      zIndex: event.zIndex,
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
        {/* Grid lines here */}
        <div className={styles.gridLines}>
          {timeSlots.map((_, index) => (
            <div
              key={`grid-line-${index}`}
              className={styles.gridLine}
              style={{ top: `${index * 50}px` }}
            />
          ))}
        </div>
      </div>
      {selectedEvent && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <button className={styles.modalClose} onClick={() => setSelectedEvent(null)}>
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