import React, { useState, useEffect } from 'react';
import styles from './calendar.module.css';

interface CalendarEvent {
  id: string;
  title: string;
  startTime: string;
  duration: string;
  colorClass: number;
  content: string;
  hasOverlappingLonger?: boolean;
  date: string;
}

interface GoogleCalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
}

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
}

const parseDurationToMinutes = (duration: string): number => {
  const matches = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  const hours = matches && matches[1] ? parseInt(matches[1], 10) : 0;
  const minutes = matches && matches[2] ? parseInt(matches[2], 10) : 0;
  return hours * 60 + minutes;
};

const Calendar: React.FC<CalendarProps> = ({ config = {} }) => {
  const { startTime = '10:00', endTime = '18:00', rowHeight = 50 } = config;
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  const totalMinutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
  const [activeDay, setActiveDay] = useState('mon');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const CALENDAR_ID = 'cfe917af9f13b486cd7fb60a5ce55a091b2999b87a265a7b8e4523d96764d082@group.calendar.google.com';
  const API_KEY = 'AIzaSyAGGIRAwgSowT72FRQ4CaIvtWwELFBhtws';

  const getCurrentWeekBounds = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const monday = new Date(now);
    monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    monday.setHours(0, 0, 0, 0);
    
    const friday = new Date(monday);
    friday.setDate(monday.getDate() + 4);
    friday.setHours(23, 59, 59, 999);
    
    return { monday, friday };
  };

  const fetchCalendarEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { monday, friday } = getCurrentWeekBounds();
      const timeMin = monday.toISOString();
      const timeMax = friday.toISOString();
      
      const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events?key=${API_KEY}&timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.statusText}`);
      }
      
      const data = await response.json();
      const transformedEvents = transformGoogleEvents(data.items || []);
      setEvents(transformedEvents);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load calendar events');
      console.error('Error fetching calendar events:', err);
    } finally {
      setLoading(false);
    }
  };

  const transformGoogleEvents = (googleEvents: GoogleCalendarEvent[]): CalendarEvent[] => {
    return googleEvents.map((event, index) => {
      const startDateTime = event.start.dateTime || event.start.date;
      const endDateTime = event.end.dateTime || event.end.date;
      
      if (!startDateTime || !endDateTime) return null;
      
      const start = new Date(startDateTime);
      const end = new Date(endDateTime);
      
      const dayMap = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
      const dayOfWeek = dayMap[start.getDay()];
      
      const hours = start.getHours().toString().padStart(2, '0');
      const minutes = start.getMinutes().toString().padStart(2, '0');
      const startTime = `${hours}:${minutes}`;
      
      const durationMs = end.getTime() - start.getTime();
      const durationMinutes = Math.floor(durationMs / (1000 * 60));
      const durationHours = Math.floor(durationMinutes / 60);
      const remainingMinutes = durationMinutes % 60;
      const duration = `PT${durationHours > 0 ? `${durationHours}H` : ''}${remainingMinutes > 0 ? `${remainingMinutes}M` : ''}`;
      
      const dateStr = start.toISOString().split('T')[0];
      
      return {
        id: `${dayOfWeek}-${event.id}-${index}`,
        title: event.summary || 'Untitled Event',
        startTime,
        duration: duration || 'PT1H',
        colorClass: 0,
        content: event.description ? `<p>${event.description.replace(/\n/g, '<br>')}</p>` : '<p>No description</p>',
        date: dateStr,
      };
    }).filter(Boolean) as CalendarEvent[];
  };

  useEffect(() => {
    fetchCalendarEvents();
  }, []);

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
      {loading && (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          Loading calendar events...
        </div>
      )}
      {error && (
        <div style={{ padding: '20px', color: 'red', textAlign: 'center' }}>
          Error: {error}
          <button onClick={fetchCalendarEvents} style={{ marginLeft: '10px' }}>
            Retry
          </button>
        </div>
      )}
      {!loading && !error && (
        <>
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
            <div className={styles.gridLines}>
              {timeSlots.map((_, index) => (
                <div
                  key={`grid-line-${index}`}
                  className={styles.gridLine}
                  style={{ top: `${index * 50 - 1}px` }}
                />
              ))}
            </div>
          </div>
        </>
      )}
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