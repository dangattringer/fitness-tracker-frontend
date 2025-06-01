import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

interface NavItem {
  name: string;
  path: string;
  icon: string;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', path: '/dashboard', icon: '📊' },
  { name: 'Activities', path: '/activities', icon: '🏃‍♂️' },
  { name: 'Maps', path: '/maps', icon: '🗺️' },
  { name: 'Calendar', path: '/calendar', icon: '📅' },
  { name: 'Settings', path: '/settings', icon: '⚙️' },
];

const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <aside className="sidebar" role="navigation" aria-label="Main Navigation">
      <nav className="sidebar-nav">
        <ul>
          {navItems.map(item => {
            const isActive = location.pathname === item.path || (item.path === '/dashboard' && location.pathname === '/');
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={isActive ? 'active' : ''}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span className="nav-icon" aria-hidden="true">{item.icon}</span>
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;