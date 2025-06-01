import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Activity } from '../types/types';
import { formatDate, getActivityEmoji } from '../utils/formatters';
import './CalendarPage.css';

interface CalendarPageProps {
  activities: Activity[];
}

const CalendarPage: React.FC<CalendarPageProps> = ({ activities }) => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed (0 for January, 11 for December)

  const activitiesByDate = useMemo(() => {
    const grouped: { [key: string]: Activity[] } = {};
    activities.forEach(activity => {
      const activityDate = new Date(activity.start_date_local || activity.date);
      const dateKey = `${activityDate.getFullYear()}-${activityDate.getMonth()}-${activityDate.getDate()}`;
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(activity);
    });
    return grouped;
  }, [activities]);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 for Sunday, 1 for Monday, ...

  const calendarDays = useMemo(() => {
    const days: (Date | null)[] = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    return days;
  }, [year, month, daysInMonth, firstDayOfMonth]);

  const today = new Date();
  const todayKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleActivityClick = (activityId: number) => {
    navigate(`/activity/${activityId}`);
  };

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="calendar-view" role="application" aria-label="Monthly activities calendar">
      <header className="calendar-header">
        <h2 className="section-title" id="calendar-heading">Calendar</h2>
        <div className="calendar-nav">
          <button onClick={handlePrevMonth} aria-label="Previous month">&larr;</button>
          <h3 aria-live="polite">{formatDate(currentDate.toISOString(), { month: 'long', year: 'numeric' })}</h3>
          <button onClick={handleNextMonth} aria-label="Next month">&rarr;</button>
        </div>
      </header>

      <div className="calendar-grid" role="grid" aria-labelledby="calendar-heading">
        <div className="calendar-grid-header" role="row">
          {daysOfWeek.map(day => (
            <div key={day} className="calendar-day-header" role="columnheader">{day}</div>
          ))}
        </div>
        <div className="calendar-grid-body">
          {calendarDays.map((day, index) => {
            if (!day) {
              return <div key={`blank-${index}`} className="calendar-day-cell blank" role="gridcell" aria-disabled="true"></div>;
            }
            const dayKey = `${day.getFullYear()}-${day.getMonth()}-${day.getDate()}`;
            const dayActivities = activitiesByDate[dayKey] || [];
            const isToday = dayKey === todayKey;
            const formattedDayLabel = formatDate(day.toISOString(), { weekday: 'long', month: 'long', day: 'numeric' });

            return (
              <div
                key={day.toISOString()}
                className={`calendar-day-cell ${isToday ? 'today' : ''}`}
                role="gridcell"
                aria-label={formattedDayLabel}
              >
                <div className="day-number">{day.getDate()}</div>
                {dayActivities.length > 0 && (
                  <ul className="calendar-activities-list" aria-label={`Activities for ${formattedDayLabel}`}>
                    {dayActivities.map(activity => (
                      <li
                        key={activity.id}
                        className="calendar-activity-item"
                        role="button"
                        tabIndex={0}
                        onClick={() => handleActivityClick(activity.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleActivityClick(activity.id);
                          }
                        }}
                        aria-label={`View details for ${activity.name} on ${formattedDayLabel}`}
                      >
                        <span className="calendar-activity-emoji" aria-hidden="true">{getActivityEmoji(activity.sport_type || activity.type)}</span>
                        <span className="calendar-activity-name">{activity.name}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;