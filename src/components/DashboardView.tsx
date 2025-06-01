/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import SummaryCard from './SummaryCard';
import type { Activity, BestEffort } from '../data/types';
import { formatDistance, formatDuration, formatPace } from '../utils/formatters';
import './DashboardView.css';

interface DashboardViewProps {
  activities: Activity[];
}

interface PersonalBest {
  name: string; // e.g., "1K", "5K"
  time: number | null; // elapsed_time in seconds, or null if not found
}

// Function to calculate Personal Bests
function calculatePersonalBests(activities: Activity[]): PersonalBest[] {
  const targetDistances = ["400m", "1/2 mile", "1K", "1 mile", "2 mile", "5K", "10K", "15K", "20K", "Half-Marathon", "Marathon"];
  const pbs: { [key: string]: number } = {};

  activities.forEach(activity => {
    if (activity.best_efforts && Array.isArray(activity.best_efforts)) {
      activity.best_efforts.forEach((effort: BestEffort) => { // Ensure effort is typed
        if (targetDistances.includes(effort.name) && typeof effort.elapsed_time === 'number') {
          const effortTime = effort.elapsed_time;
          if (pbs[effort.name] === undefined || effortTime < pbs[effort.name]) {
            pbs[effort.name] = effortTime;
          }
        }
      });
    }
  });

  return targetDistances.map(distName => ({
    name: distName,
    time: pbs[distName] !== undefined ? pbs[distName] : null,
  }));
}


const DashboardView: React.FC<DashboardViewProps> = ({ activities }) => {
  // Calculate summary statistics
  const totalActivities = activities.length;
  const totalDistanceMeters = activities.reduce((sum, activity) => sum + (activity.distance || 0), 0);
  const totalDurationSeconds = activities.reduce((sum, activity) => sum + (activity.moving_time || 0), 0);

  let averagePace = 'N/A';
  if (totalDistanceMeters > 0 && totalDurationSeconds > 0) {
    const averageSpeedMps = totalDistanceMeters / totalDurationSeconds;
    averagePace = formatPace(averageSpeedMps);
  } else if (totalActivities > 0 && totalDistanceMeters === 0) { 
    averagePace = '0:00 /km';
  }

  const summaryStats = [
    {
      id: 'dist',
      label: 'Total Distance',
      value: formatDistance(totalDistanceMeters).split(' ')[0],
      unit: formatDistance(totalDistanceMeters).split(' ')[1] || 'km',
    },
    {
      id: 'dura',
      label: 'Total Duration',
      value: formatDuration(totalDurationSeconds),
      unit: '', 
    },
    {
      id: 'acts',
      label: 'Total Activities',
      value: totalActivities.toString(),
      unit: '',
    },
    {
      id: 'pace',
      label: 'Avg. Pace',
      value: averagePace.split(' ')[0],
      unit: averagePace.split(' ')[1] ? `/${averagePace.split(' ')[1]}` : (averagePace !== 'N/A' ? '/km' : ''),
    },
  ];

  const personalBests = calculatePersonalBests(activities);
  const hasPBsToShow = personalBests.some(pb => pb.time !== null);

  return (
    <>
      <section className="summary-section" aria-labelledby="summary-heading">
        <h2 id="summary-heading" className="section-title">Activity Summary</h2>
        {activities.length === 0 ? (
          <p>No activity data available to calculate summary.</p>
        ) : (
          <div className="summary-grid">
            {summaryStats.map(stat => (
              <SummaryCard key={stat.id} label={stat.label} value={stat.value} unit={stat.unit} />
            ))}
          </div>
        )}
      </section>

      <section className="personal-bests-section" aria-labelledby="pb-heading">
        <h2 id="pb-heading" className="section-title">Personal Bests</h2>
        {activities.length === 0 || !hasPBsToShow ? (
          <p>No personal bests recorded yet.</p>
        ) : (
          <ul className="personal-bests-list">
            {personalBests.map(pb => (
              <li key={pb.name} className="pb-item">
                <span className="pb-distance-name">{pb.name}</span>
                {pb.time !== null ? (
                  <span className="pb-time">{formatDuration(pb.time)}</span>
                ) : (
                  <span className="pb-time-na">N/A</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
};

export default DashboardView;
