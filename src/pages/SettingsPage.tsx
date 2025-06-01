import React, { useState, useEffect } from 'react';
import './SettingsPage.css';

interface SettingsPageProps {
  theme: 'light' | 'dark';
}

const SettingsPage: React.FC<SettingsPageProps> = ({ theme }) => {
  // Theme state and toggle are now managed by App component
  const [units, setUnits] = useState<'metric' | 'imperial'>(() =>
    (localStorage.getItem('units') as 'metric' | 'imperial' | null) || 'metric'
  );
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(() =>
    localStorage.getItem('notificationsEnabled') === 'true'
  );

  useEffect(() => {
    localStorage.setItem('units', units);
  }, [units]);

  useEffect(() => {
    localStorage.setItem('notificationsEnabled', String(notificationsEnabled));
  }, [notificationsEnabled]);

  const handleUnitsToggle = () => {
    setUnits(prevUnits => {
      const newUnits = prevUnits === 'metric' ? 'imperial' : 'metric';
      alert(`Units switched to ${newUnits}. This is a mock-up; data display will not change yet.`);
      return newUnits;
    });
  };

  const handleNotificationsToggle = () => {
    setNotificationsEnabled(prev => {
      alert(`Notifications ${!prev ? 'enabled' : 'disabled'}.`);
      return !prev;
    });
  };

  const handleExportData = () => {
    alert('Exporting your data... (Mock functionality)');
  };

  const handleImportData = () => {
    alert('Importing data... (Mock functionality - this would typically open a file dialog)');
  };

  return (
    <div className="settings-view-container">
      <h2 id="settings-heading" className="section-title">Settings</h2>

      <section className={`settings-section card-style ${theme === 'dark' ? 'dark-theme' : ''}`} aria-labelledby="user-prefs-heading">
        <h3 id="user-prefs-heading" className="settings-section-title">User Preferences</h3>


        <div className="setting-item">
          <span className="setting-item-label" id="units-label">Measurement Units</span>
          <div className="toggle-switch-container" role="group" aria-labelledby="units-label">
            <button
              role="switch"
              aria-checked={units === 'imperial'}
              onClick={handleUnitsToggle}
              className="toggle-switch"
              aria-label={`Switch to ${units === 'metric' ? 'Imperial' : 'Metric'} units`}
            >
              <span className="toggle-switch-label">{units === 'metric' ? 'Metric (km, kg)' : 'Imperial (miles, lbs)'}</span>
              <span className="toggle-switch-handle" />
            </button>
          </div>
        </div>

        <div className="setting-item">
          <span className="setting-item-label" id="notifications-label">Email Notifications</span>
          <div className="toggle-switch-container" role="group" aria-labelledby="notifications-label">
            <button
              role="switch"
              aria-checked={notificationsEnabled}
              onClick={handleNotificationsToggle}
              className="toggle-switch"
              aria-label={`Switch to ${notificationsEnabled ? 'Disable' : 'Enable'} email notifications`}
            >
              <span className="toggle-switch-label">{notificationsEnabled ? 'Enabled' : 'Disabled'}</span>
              <span className="toggle-switch-handle" />
            </button>
          </div>
        </div>
      </section>

      <section className={`settings-section card-style ${theme === 'dark' ? 'dark-theme' : ''}`} aria-labelledby="data-management-heading">
        <h3 id="data-management-heading" className="settings-section-title">Data Management</h3>
        <div className="setting-item">
          <button onClick={handleExportData} className="settings-button">Export Data</button>
        </div>
        <div className="setting-item">
          <button onClick={handleImportData} className="settings-button">Import Data</button>
        </div>
      </section>
    </div>
  );
};

export default SettingsPage;