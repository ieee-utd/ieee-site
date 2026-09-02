import { useCallback, useEffect, useRef, useState } from 'react';

export interface CalendarEvent {
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

const MAX_REQUESTS_PER_WINDOW = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
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

const transformGoogleEvents = (googleEvents: GoogleCalendarEvent[]): CalendarEvent[] => {
  return googleEvents
    .map((event, index) => {
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
        content: event.description ? `<p>${event.description.replace(/\n/g, '<br>')}</p>` : startTime,
        date: dateStr,
      };
    })
    .filter(Boolean) as CalendarEvent[];
};

export const useCalendarEvents = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rateLimited, setRateLimited] = useState(false);
  const requestTimestampsRef = useRef<number[]>([]);

  const fetchCalendarEvents = useCallback(async () => {
    const now = Date.now();
    requestTimestampsRef.current = requestTimestampsRef.current.filter(
      (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS
    );

    if (requestTimestampsRef.current.length >= MAX_REQUESTS_PER_WINDOW) {
      setRateLimited(true);
      setError('Too many requests — please wait a minute and try again.');
      setLoading(false);
      return;
    }

    requestTimestampsRef.current.push(now);
    setRateLimited(false);

    try {
      setLoading(true);
      setError(null);

      const { monday, friday } = getCurrentWeekBounds();
      const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
        CALENDAR_ID
      )}/events?key=${API_KEY}&timeMin=${monday.toISOString()}&timeMax=${friday.toISOString()}&singleEvents=true&orderBy=startTime`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.statusText}`);
      }

      const data = await response.json();
      setEvents(transformGoogleEvents(data.items || []));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load calendar events');
      console.error('Error fetching calendar events:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCalendarEvents();
  }, [fetchCalendarEvents]);

  return { events, loading, error, rateLimited, refetch: fetchCalendarEvents };
};
