import React from 'react';
import type { Activity } from '../types/types';
import { formatDistance, formatDuration } from '../utils/formatters';
import './UserProfilePage.css';


interface UserProfilePageProps {
  activities: Activity[];
}

const UserProfilePage: React.FC<UserProfilePageProps> = ({ activities }) => {
  const mockUser = {
    name: 'Alex Doe',
    email: 'alex.doe@example.com',
    joinDate: '2023-01-15T10:00:00Z',
    profilePictureUrl: '',
  };

  const totalActivities = activities.length;
  const totalDistance = activities.reduce((sum, act) => sum + (act.distance || 0), 0);
  const totalDuration = activities.reduce((sum, act) => sum + (act.moving_time || 0), 0);


  return (
    <div className="profile-view-container">
      <h2 id="profile-heading" className="section-title">User Profile</h2>

      <section className="profile-header card-style" aria-labelledby="profile-main-info-heading">
        <h3 id="profile-main-info-heading" className="sr-only">Main Profile Information</h3>
        <div className="profile-picture-container">
          {mockUser.profilePictureUrl ? (
            <img src={mockUser.profilePictureUrl} alt="User profile" className="profile-picture" />
          ) : (
            <div className="profile-picture-placeholder" aria-label="Profile picture placeholder">
              {mockUser.name.substring(0, 1)}
            </div>
          )}
        </div>
        <div className="profile-info">
          <p className="profile-name">{mockUser.name}</p>
          <p className="profile-email">{mockUser.email}</p>
          <p className="profile-joined">Joined: {new Date(mockUser.joinDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <button className="edit-profile-button" onClick={() => alert('Edit profile functionality to be implemented.')}>
          Edit Profile
        </button>
      </section>

      <section className="profile-stats card-style" aria-labelledby="profile-stats-heading">
        <h3 id="profile-stats-heading" className="profile-section-title">Activity Summary</h3>
        <div className="profile-stats-grid">
          <div className="profile-stat-item">
            <span className="stat-label">Total Activities</span>
            <span className="stat-value">{totalActivities}</span>
          </div>
          <div className="profile-stat-item">
            <span className="stat-label">Total Distance</span>
            <span className="stat-value">{formatDistance(totalDistance)}</span>
          </div>
          <div className="profile-stat-item">
            <span className="stat-label">Total Duration</span>
            <span className="stat-value">{formatDuration(totalDuration)}</span>
          </div>
        </div>
      </section>

      <section className="profile-goals card-style" aria-labelledby="profile-goals-heading">
        <h3 id="profile-goals-heading" className="profile-section-title">Activity Goals</h3>
        <p>Set and track your fitness goals here.</p>
        <button className="set-goals-button" onClick={() => alert('Goal setting functionality to be implemented.')}>
          Set New Goal
        </button>
      </section>
    </div>
  );
};

export default UserProfilePage;