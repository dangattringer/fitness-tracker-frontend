/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { formatDistance, formatDuration, getActivityEmoji, formatDate } from '../utils/formatters';
import './ActivityItem.css';

export interface ActivityItemProps {
  name: string;
  /** ISO date string or pre-formatted date string */
  date: string; 
  /** Distance in meters */
  distance: number;
  /** Duration in seconds */
  duration: number; 
  type: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ name, date, distance, duration, type }) => {
  const emoji = getActivityEmoji(type);
  const activityId = `activity-${name.replace(/\s+/g, '-').toLowerCase()}-${Math.random().toString(36).substring(7)}`;

  // Attempt to format if it's an ISO string, otherwise use as is
  let displayDate = date;
  if (date.includes('T') && date.includes('Z')) { // Basic check for ISO-like string
      displayDate = formatDate(date, { month: 'short', day: 'numeric', year: 'numeric' });
  }


  return (
    <li className="activity-item" aria-labelledby={`${activityId}-name`}>
      <div className="activity-header">
        <div className="activity-icon" aria-hidden="true">{emoji}</div>
        <div className="activity-details">
          <h4 id={`${activityId}-name`} className="activity-name">{name}</h4>
          <p className="activity-meta">{displayDate} - Type: {type}</p>
        </div>
      </div>
      <div className="activity-stats">
        <p><span className="stat-label">Distance:</span> {formatDistance(distance)}</p>
        <p><span className="stat-label">Duration:</span> {formatDuration(duration)}</p>
      </div>
    </li>
  );
};

export default ActivityItem;
