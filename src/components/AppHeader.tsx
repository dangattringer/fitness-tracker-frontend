import React from 'react';
import { Link } from 'react-router-dom';
import './AppHeader.css';

interface AppHeaderProps {
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ theme, onThemeToggle }) => {
  return (
    <header className="app-header-bar" role="banner">
      <Link to="/dashboard" className="app-logo-link" aria-label="FitnessTrack Home">
        <div className="app-logo">
          FitnessTrack
        </div>
      </Link>
      <div className="header-actions">
        <button
          className="theme-toggle-button"
          onClick={onThemeToggle}
          aria-label={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} theme`}
          aria-pressed={theme === 'dark'}
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} theme`}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        <Link to="/profile" className="user-profile-link" aria-label="User Profile" title="User Profile">
          <button
            className="user-profile-button"
          >
            👤
          </button>
        </Link>
      </div>
    </header>
  );
};

export default AppHeader;