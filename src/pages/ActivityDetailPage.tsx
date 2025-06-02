import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Activity, Lap, SplitMetric } from '../types/types';
import {
  formatDate,
  formatDistance,
  formatDuration,
  formatPace,
  formatSpeed,
  formatElevation,
  getActivityEmoji,
  decodePolyline
} from '../utils/formatters';
import MapView from '../components/MapView';
import BasicGraph from '../components/BasicGraph';
import './ActivityDetailPage.css';

interface ActivityDetailPageProps {
  activities: Activity[];
}

const ActivityDetailPage: React.FC<ActivityDetailPageProps> = ({ activities }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const { activityId } = useParams<{ activityId: string }>();
  const navigate = useNavigate();
  const activity = activities.find(act => act.id.toString() === activityId);

  if (!activity) {
    return <div className="error-message" role="alert">Activity not found.</div>;
  }

  const activityType = activity.sport_type || activity.type;
  const emoji = getActivityEmoji(activityType);

  const polylineCoordinates = activity.map?.summary_polyline
    ? decodePolyline(activity.map.summary_polyline)
    : [];

  const splits = activity.splits_metric;
  const hasSplitsData = splits && splits.length > 1;

  let elevationGraphData: { x: number; y: number }[] = [];
  let heartRateGraphData: { x: number; y: number }[] = [];
  let paceGraphData: { x: number; y: number }[] = [];

  const showElevationGraph = hasSplitsData && splits.some(s => typeof s.elevation_difference === 'number');
  const showHeartRateGraph = activity.has_heartrate && hasSplitsData && splits.some(s => typeof s.average_heartrate === 'number');
  const showPaceGraph = hasSplitsData && splits.some(s => typeof s.average_speed === 'number' && s.average_speed > 0);

  if (hasSplitsData) {
    let cumulativeDistanceMeters = 0;

    if (showElevationGraph) {
      cumulativeDistanceMeters = 0;
      elevationGraphData = splits.map(split => {
        cumulativeDistanceMeters += split.distance;
        return { x: cumulativeDistanceMeters / 1000, y: split.elevation_difference || 0 };
      });
    }

    if (showHeartRateGraph) {
      cumulativeDistanceMeters = 0;
      heartRateGraphData = splits.map(split => {
        cumulativeDistanceMeters += split.distance;
        return { x: cumulativeDistanceMeters / 1000, y: split.average_heartrate || 0 };
      });
    }

    if (showPaceGraph) {
      cumulativeDistanceMeters = 0;
      paceGraphData = splits.map(split => {
        cumulativeDistanceMeters += split.distance;
        const paceSecondsPerKm = split.average_speed > 0 ? 1000 / split.average_speed : 0;
        return { x: cumulativeDistanceMeters / 1000, y: paceSecondsPerKm };
      });
    }
  }

  const handleClose = () => {
    navigate(-1); // Go back to the previous page
  };


  return (
    <div className="activity-detail-view-container">
      <button onClick={handleClose} className="detail-view-close-button" aria-label="Go back to previous page">
        &larr; Back
      </button>

      <header className="activity-detail-header">
        <span className="activity-detail-icon" aria-hidden="true">{emoji}</span>
        <div>
          <h2 id="activity-detail-name" className="activity-detail-name">{activity.name}</h2>
          <p className="activity-detail-meta">
            {activityType} - {formatDate(activity.start_date_local || activity.date, { hour: 'numeric', minute: '2-digit' })}
          </p>
        </div>
      </header>

      {polylineCoordinates.length > 0 ? (
        <MapView coordinates={polylineCoordinates} />
      ) : activity.mapPreviewUrl ? (
        <img
          src={activity.mapPreviewUrl}
          alt={`Map preview of ${activity.name}`}
          className="activity-detail-map-placeholder"
          loading="lazy"
        />
      ) : (
        <div className="activity-detail-map-placeholder">
          <p>Map data not available for this activity.</p>
        </div>
      )}

      <section className="activity-detail-section" aria-labelledby="stats-heading">
        <h3 id="stats-heading" className="activity-detail-section-title">Key Statistics</h3>
        <div className="activity-detail-stats-grid">
          <div className="stat-item">
            <span className="stat-label">Distance</span>
            <span className="stat-value">{formatDistance(activity.distance)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Moving Time</span>
            <span className="stat-value">{formatDuration(activity.moving_time)}</span>
          </div>
          {activity.elapsed_time !== undefined && (
            <div className="stat-item">
              <span className="stat-label">Elapsed Time</span>
              <span className="stat-value">{formatDuration(activity.elapsed_time)}</span>
            </div>
          )}
          {activity.total_elevation_gain !== undefined && (
            <div className="stat-item">
              <span className="stat-label">Elevation Gain</span>
              <span className="stat-value">{formatElevation(activity.total_elevation_gain)}</span>
            </div>
          )}
          <div className="stat-item">
            <span className="stat-label">Avg Pace</span>
            <span className="stat-value">{formatPace(activity.average_speed)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Avg Speed</span>
            <span className="stat-value">{formatSpeed(activity.average_speed)}</span>
          </div>
          {activity.max_speed !== undefined && (
            <div className="stat-item">
              <span className="stat-label">Max Speed</span>
              <span className="stat-value">{formatSpeed(activity.max_speed)}</span>
            </div>
          )}
          {activity.calories !== undefined && (
            <div className="stat-item">
              <span className="stat-label">Calories</span>
              <span className="stat-value">{activity.calories.toFixed(0)} kcal</span>
            </div>
          )}
          {activity.has_heartrate && activity.average_heartrate !== undefined && (
            <div className="stat-item">
              <span className="stat-label">Avg Heart Rate</span>
              <span className="stat-value">{activity.average_heartrate.toFixed(1)} bpm</span>
            </div>
          )}
          {activity.has_heartrate && activity.max_heartrate !== undefined && (
            <div className="stat-item">
              <span className="stat-label">Max Heart Rate</span>
              <span className="stat-value">{activity.max_heartrate.toFixed(0)} bpm</span>
            </div>
          )}
          {activity.average_cadence !== undefined && (
            <div className="stat-item">
              <span className="stat-label">Avg Cadence</span>
              <span className="stat-value">{activity.average_cadence.toFixed(1)} rpm</span>
            </div>
          )}
        </div>
      </section>

      <section className="activity-detail-section" aria-labelledby="graphs-heading">
        <h3 id="graphs-heading" className="activity-detail-section-title">Activity Graphs</h3>
        <div className="activity-graphs-grid">
          <div className="graph-placeholder-container">
            <h4>Elevation Profile</h4>
            {showElevationGraph ? (
              <BasicGraph
                data={elevationGraphData}
                color="#2980b9"
                xAxisLabel="Distance (km)"
                yAxisLabel="Elevation Diff."
                yAxisUnit="m"
              />
            ) : (
              <p className="data-na-message">Elevation data not available or insufficient for graph.</p>
            )}
          </div>

          <div className="graph-placeholder-container">
            <h4>Heart Rate Over Distance</h4>
            {showHeartRateGraph ? (
              <BasicGraph
                data={heartRateGraphData}
                color="#c0392b"
                xAxisLabel="Distance (km)"
                yAxisLabel="Heart Rate"
                yAxisUnit="bpm"
              />
            ) : (
              <p className="data-na-message">Heart rate data not available or insufficient for graph.</p>
            )}
          </div>

          <div className="graph-placeholder-container">
            <h4>Pace Over Distance</h4>
            {showPaceGraph ? (
              <BasicGraph
                data={paceGraphData}
                color="#27ae60"
                xAxisLabel="Distance (km)"
                yAxisLabel="Pace"
                yAxisUnit="s/km"
              />
            ) : (
              <p className="data-na-message">Pace data not available or insufficient for graph.</p>
            )}
          </div>
        </div>
      </section>


      {activity.laps && activity.laps.length > 0 && (
        <section className="activity-detail-section" aria-labelledby="laps-heading">
          <h3 id="laps-heading" className="activity-detail-section-title">Laps</h3>
          <div className="table-responsive">
            <table className="data-table laps-table">
              <thead>
                <tr>
                  <th>Lap</th>
                  <th>Distance</th>
                  <th>Time</th>
                  <th>Pace</th>
                  <th>Speed</th>
                  {activity.laps.some(lap => lap.average_heartrate !== undefined) && <th>Avg HR</th>}
                  {activity.laps.some(lap => lap.total_elevation_gain !== undefined) && <th>Elev Gain</th>}
                </tr>
              </thead>
              <tbody>
                {activity.laps.map((lap: Lap) => (
                  <tr key={lap.id}>
                    <td>{lap.lap_index}</td>
                    <td>{formatDistance(lap.distance)}</td>
                    <td>{formatDuration(lap.moving_time)}</td>
                    <td>{formatPace(lap.average_speed)}</td>
                    <td>{formatSpeed(lap.average_speed)}</td>
                    {activity.laps && activity.laps.some(l => l.average_heartrate !== undefined) && <td>{lap.average_heartrate ? `${lap.average_heartrate.toFixed(1)} bpm` : 'N/A'}</td>}
                    {activity.laps && activity.laps.some(l => l.total_elevation_gain !== undefined) && <td>{lap.total_elevation_gain ? formatElevation(lap.total_elevation_gain) : 'N/A'}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* {activity.splits_metric && activity.splits_metric.length > 0 && (
        <section className="activity-detail-section" aria-labelledby="splits-heading">
          <h3 id="splits-heading" className="activity-detail-section-title">Splits (Metric)</h3>
          <div className="table-responsive">
            <table className="data-table splits-table">
              <thead>
                <tr>
                  <th>Split</th>
                  <th>Distance</th>
                  <th>Time</th>
                  <th>Pace</th>
                  <th>Speed</th>
                  {activity.splits_metric.some(split => split.average_heartrate !== undefined) && <th>Avg HR</th>}
                  {activity.splits_metric.some(split => split.elevation_difference !== undefined) && <th>Elev Diff</th>}
                </tr>
              </thead>
              <tbody>
                {activity.splits_metric.map((split: SplitMetric) => (
                  <tr key={split.split}>
                    <td>{split.split}</td>
                    <td>{formatDistance(split.distance)}</td>
                    <td>{formatDuration(split.moving_time)}</td>
                    <td>{formatPace(split.average_speed)}</td>
                    <td>{formatSpeed(split.average_speed)}</td>
                    {activity.splits_metric && activity.splits_metric.some(s => s.average_heartrate !== undefined) && <td>{split.average_heartrate ? `${split.average_heartrate.toFixed(1)} bpm` : 'N/A'}</td>}
                    {activity.splits_metric && activity.splits_metric.some(s => s.elevation_difference !== undefined) && <td>{split.elevation_difference ? formatElevation(split.elevation_difference) : 'N/A'}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )} */}
    </div>
  );
};

export default ActivityDetailPage;