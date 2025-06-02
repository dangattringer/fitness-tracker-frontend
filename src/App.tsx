import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import './App.css'
import AppHeader from './components/AppHeader';
import DashboardPage from './pages/DashboardPage';
import ActivitiesListPage from './pages/ActivitiesListPage';
import ActivityDetailPage from './pages/ActivityDetailPage';
import type { Activity } from './types/types';
import MapsPage from './pages/MapsPage';
import CalendarPage from './pages/CalendarPage';
import SettingsPage from './pages/SettingsPage';
import UserProfilePage from './pages/UserProfilePage';

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (storedTheme) return storedTheme;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(`${theme}-theme`);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('./activities.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Activity[] = await response.json();
        setActivities(data);
        setError(null);
      } catch (e) {
        console.error("Failed to fetch activities:", e);
        setError(e instanceof Error ? e : new Error('Failed to load activities'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const handleThemeToggle = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  if (isLoading) {
    return <div className="loading-message" role="status" aria-live="polite">Loading application...</div>;
  }
  if (error) {
    return <div className="error-message" role="alert">Error loading application data: {error.message}</div>;
  }

  return (
    <BrowserRouter>
      <AppHeader onThemeToggle={handleThemeToggle} theme={theme} />
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <main role="main">
            <Routes>
              <Route path="/" element={<Navigate replace to="/dashboard" />} />
              <Route path="/dashboard" element={<DashboardPage activities={activities} />} />
              <Route path="/activities" element={<ActivitiesListPage activities={activities} />} />
              <Route path="/activity/:activityId" element={<ActivityDetailPage activities={activities} />} />
              <Route path="/maps" element={<MapsPage activities={activities} />} />
              <Route path="/calendar" element={<CalendarPage activities={activities} />} />
              <Route path="/settings" element={<SettingsPage theme={theme} />} />
              <Route path="/profile" element={<UserProfilePage activities={activities} />} />
              <Route path="*" element={
                <div className="error-message" role="alert">
                  <h2>404 - Page Not Found</h2>
                  <p>The page you are looking for does not exist.</p>
                  <Navigate replace to="/dashboard" />
                </div>
              } />
            </Routes>
          </main>
          <footer className="dashboard-footer">
            <p>&copy; {new Date().getFullYear()} Fitness Tracker. Track your progress!</p>
          </footer>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App
