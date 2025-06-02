import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Activity } from '../types/types';
import {
  formatDistance,
  formatDuration,
  formatPace,
  getActivityEmoji,
  formatDate
} from '../utils/formatters';
import './ActivitiesListPage.css';

interface ActivitiesListPageProps {
  activities: Activity[];
}

const ActivitiesListPage: React.FC<ActivitiesListPageProps> = ({ activities }) => {
  const navigate = useNavigate();
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState<boolean>(false);

  const [selectedType, setSelectedType] = useState<string>("All Types");
  const [minDistance, setMinDistance] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const filterPanelRef = useRef<HTMLDivElement>(null);
  const filterButtonRef = useRef<HTMLButtonElement>(null);


  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFilterPanelOpen) {
        setIsFilterPanelOpen(false);
        filterButtonRef.current?.focus();
      }
    };

    if (isFilterPanelOpen && filterPanelRef.current) {
      const focusableElements = filterPanelRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      (focusableElements[0] as HTMLElement)?.focus();
      document.addEventListener('keydown', handleEscKey);
    } else {
      document.removeEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isFilterPanelOpen]);

  const activityTypes = useMemo(() => {
    const types = new Set<string>();
    activities.forEach(activity => {
      if (activity.sport_type) {
        types.add(activity.sport_type);
      } else if (activity.type) {
        types.add(activity.type);
      }
    });
    return ["All Types", ...Array.from(types).sort()];
  }, [activities]);

  const filteredAndSortedActivities = useMemo(() => {
    let processedActivities = [...activities];

    if (selectedType !== "All Types") {
      processedActivities = processedActivities.filter(activity => (activity.sport_type || activity.type) === selectedType);
    }

    const numMinDistance = parseFloat(minDistance);
    if (!isNaN(numMinDistance) && numMinDistance > 0) {
      processedActivities = processedActivities.filter(activity => (activity.distance / 1000) >= numMinDistance);
    }

    if (startDate) {
      const filterStartDate = new Date(startDate);
      filterStartDate.setUTCHours(0, 0, 0, 0);
      processedActivities = processedActivities.filter(activity => {
        const activityDateOnly = new Date(activity.start_date_local || activity.date);
        activityDateOnly.setUTCHours(0, 0, 0, 0);
        return activityDateOnly >= filterStartDate;
      });
    }

    if (endDate) {
      const filterEndDate = new Date(endDate);
      filterEndDate.setUTCHours(23, 59, 59, 999);
      processedActivities = processedActivities.filter(activity => {
        const activityDateOnly = new Date(activity.start_date_local || activity.date);
        activityDateOnly.setUTCHours(0, 0, 0, 0);
        return activityDateOnly <= filterEndDate;
      });
    }

    processedActivities.sort((a, b) => {
      const dateB = new Date(b.start_date_local || b.date).getTime();
      const dateA = new Date(a.start_date_local || a.date).getTime();
      return dateB - dateA;
    });

    return processedActivities;
  }, [activities, selectedType, minDistance, startDate, endDate]);

  const handleClearFilters = () => {
    setSelectedType("All Types");
    setMinDistance("");
    setStartDate("");
    setEndDate("");
  };

  const handleToggleFilterPanel = () => {
    setIsFilterPanelOpen(!isFilterPanelOpen);
  };

  const closeFilterPanel = () => {
    setIsFilterPanelOpen(false);
    filterButtonRef.current?.focus();
  }

  const handleActivityCardClick = (activityId: number) => {
    navigate(`/activity/${activityId}`);
  };

  return (
    <div className="activities-list-container">
      <div className="activities-list-header">
        <h2 id="activities-list-heading" className="section-title">All Activities</h2>
        <button
          ref={filterButtonRef}
          className="filter-toggle-button"
          onClick={handleToggleFilterPanel}
          aria-expanded={isFilterPanelOpen}
          aria-controls="filter-panel"
        >
          Filter
        </button>
      </div>

      {isFilterPanelOpen && (
        <div
          className="filter-panel-overlay open"
          onClick={closeFilterPanel}
          role="button"
          tabIndex={-1}
          aria-label="Close filter panel"
        />
      )}

      <div
        id="filter-panel"
        ref={filterPanelRef}
        className={`filter-panel ${isFilterPanelOpen ? 'open' : ''}`}
        role="search"
        aria-labelledby="filter-panel-title"
        tabIndex={isFilterPanelOpen ? 0 : -1}
      >
        <div className="filter-panel-header">
          <h3 id="filter-panel-title">Filters</h3>
          <button onClick={closeFilterPanel} className="close-panel-button" aria-label="Close filter panel">&times;</button>
        </div>

        <div className="filter-panel-body">
          <div className="filter-group">
            <label htmlFor="type-filter">Filter by Type:</label>
            <select
              id="type-filter"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              {activityTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="start-date-filter">Start Date:</label>
            <input
              type="date"
              id="start-date-filter"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              max={endDate || undefined}
            />
          </div>

          <div className="filter-group">
            <label htmlFor="end-date-filter">End Date:</label>
            <input
              type="date"
              id="end-date-filter"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate || undefined}
            />
          </div>

          <div className="filter-group">
            <label htmlFor="min-distance-filter">Min Distance (km):</label>
            <input
              type="number"
              id="min-distance-filter"
              value={minDistance}
              onChange={(e) => setMinDistance(e.target.value)}
              placeholder="e.g., 5"
              min="0"
              step="0.1"
            />
          </div>
        </div>
        <div className="filter-panel-footer">
          <button
            onClick={handleClearFilters}
            className="clear-filters-button"
          >
            Clear Filters
          </button>
          <button
            onClick={closeFilterPanel}
            className="apply-filters-button"
          >
            Done
          </button>
        </div>
      </div>

      {filteredAndSortedActivities.length === 0 ? (
        <p className="no-activities-message">
          {activities.length === 0
            ? "No activities logged yet. Go out and get active, or check if 'activities.json' is loaded correctly!"
            : "No activities match your current filters."}
        </p>
      ) : (
        <ul id="activities-list-ul" className="detailed-activity-list" aria-labelledby="activities-list-heading">
          {filteredAndSortedActivities.map(activity => {
            const emoji = getActivityEmoji(activity.sport_type || activity.type);
            const activityCardId = `activity-card-${activity.id}`;
            return (
              <li
                key={activity.id}
                className="detailed-activity-card"
                aria-labelledby={`${activityCardId}-name`}
                onClick={() => handleActivityCardClick(activity.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleActivityCardClick(activity.id); }}
              >
                <header className="detailed-activity-header">
                  <span className="activity-list-icon" aria-hidden="true">{emoji}</span>
                  <div className="detailed-activity-title-group">
                    <h3 id={`${activityCardId}-name`} className="detailed-activity-name">{activity.name}</h3>
                    <p className="detailed-activity-date">
                      {formatDate(activity.start_date_local || activity.date, { month: 'short', day: 'numeric', year: 'numeric' })} - {activity.sport_type || activity.type}
                    </p>
                  </div>
                </header>

                {activity.mapPreviewUrl ? (
                  <img
                    src={activity.mapPreviewUrl}
                    alt={`Map preview of ${activity.name}`}
                    className="map-preview-img"
                    loading="lazy"
                  />
                ) : (
                  <div className="map-preview-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#e0e0e0', color: '#555', border: '1px solid #d1d1d1' }}>
                    Map preview not available
                  </div>
                )}


                <div className="detailed-activity-stats">
                  <div className="stat-item">
                    <span className="stat-label">Distance</span>
                    <span className="stat-value">{formatDistance(activity.distance)}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Duration</span>
                    <span className="stat-value">{formatDuration(activity.moving_time)}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Pace</span>
                    <span className="stat-value">{formatPace(activity.average_speed)}</span>
                  </div>
                  {activity.calories !== undefined && (
                    <div className="stat-item">
                      <span className="stat-label">Calories</span>
                      <span className="stat-value">{activity.calories.toFixed(0)} kcal</span>
                    </div>
                  )}
                  {activity.has_heartrate && activity.average_heartrate !== undefined && (
                    <div className="stat-item">
                      <span className="stat-label">Avg HR</span>
                      <span className="stat-value">{activity.average_heartrate.toFixed(1)} bpm</span>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ActivitiesListPage;