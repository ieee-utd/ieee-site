import styles from '../styles/tutoring.module.css';
import timeGridPlugin from '@fullcalendar/timegrid';
import scrollGridPlugin from '@fullcalendar/scrollgrid';
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import React, { useEffect, useState } from 'react';
import { TUTORING_COLORS } from '../styles/tutoring-colors';
import FullCalendar from '@fullcalendar/react';

// TutoringCalendar component for displaying tutoring schedule
const TutoringCalendar: React.FC = () => {
  const [renderCalendar, setRenderCalendar] = useState(false);
  const calendarComponentRef = React.createRef<FullCalendar>();

  useEffect(() => {
    setRenderCalendar(true);
  }, []);

  // environment variables for API key and calendar ID
  const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
  const calendarId = process.env.REACT_APP_TUTORING_CALENDAR_ID;

  const colors = [
    TUTORING_COLORS.eventColorOne,
    TUTORING_COLORS.eventColorTwo,
    TUTORING_COLORS.eventColorThree,
    TUTORING_COLORS.eventColorFour,
    TUTORING_COLORS.eventColorFive,
  ]; //temp colors

  // handler for event mounting - sets the color of each event
  const handleEventDidMount = (eventInfo: any) => {
    // Assuming you have a unique identifier for each event
    const eventId = eventInfo.event.id;
    // Use the unique identifier for color determination
    const eventColor = colors[parseInt(eventId) % colors.length];
    eventInfo.el.style.backgroundColor = eventColor;
    eventInfo.el.style.borderColor = eventColor;
  };

  return (
    <div className={styles['tutoring-calendar-wrapper']}>
      <p className={styles['tutoring-hours-title']}>Tutoring Calendar</p>
      <div className={styles['calendar-container']}>
        <FullCalendar
          ref={calendarComponentRef}
          schedulerLicenseKey="GPL-My-Project-Is-Open-Source"
          plugins={[timeGridPlugin, googleCalendarPlugin, scrollGridPlugin]}
          googleCalendarApiKey={apiKey}
          events={{ googleCalendarId: calendarId }}
          eventDidMount={handleEventDidMount} // set colors for events
          initialDate={'2024-01-01'} //Start date for the week
          slotDuration="00:15:00"
          slotMinTime="10:00"
          slotMaxTime="17:30"
          dayHeaderFormat={{ weekday: 'long' }}
          slotEventOverlap={false}
          height={'44rem'}
          weekends={false}
          allDaySlot={false}
          contentHeight="auto"
          dayMinWidth={215}
          stickyFooterScrollbar={true}
          // custom event content rendering
          eventContent={(eventInfo) => (
            <div className={styles.calendarEvent}>
              <div className={styles.calendarText}>{eventInfo.timeText}</div>
              <div className={styles.calendarText}>{eventInfo.event.title}</div>
            </div>
          )}
          // remove default header toolbar
          headerToolbar={{
            left: '',
            center: '',
            right: '',
          }}
          eventClick={(event) => {
            // Prevent redirect to Google Calendar on event click
            event.jsEvent.preventDefault();
          }}
        />
      </div>
    </div>
  );
};

export default TutoringCalendar;
