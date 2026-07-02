import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Calendar, Users, BookOpen, BarChart2, Settings, Bell, CalendarDays, MessageSquare } from 'lucide-react';
import { useTheme } from '../ThemeContext';
import { useUnreadMessages } from '../hooks/useUnreadMessages';
import './Sidebar.css';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/' },
  { id: 'events', label: 'Events', icon: CalendarDays, path: '/events' },
  { id: 'timetable', label: 'Time Table', icon: Calendar, path: '/timetable' },
  { id: 'teachers', label: 'Teachers', icon: Users, path: '/teachers' },
  { id: 'classes', label: 'Classes', icon: BookOpen, path: '/classes' },
  { id: 'communications', label: 'Communications', icon: MessageSquare, path: '/communications' },
  { id: 'analytics', label: 'Analytics', icon: BarChart2, path: '/analytics' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' }
];

export default function Sidebar() {
  const { profileImage, profileName, profileDesignation } = useTheme();
  const unreadCount = useUnreadMessages();
  return (
    <aside className="sidebar glass-panel">
      <div className="profile-section">
        <div className="avatar-wrapper">
          <img src={profileImage} alt={profileName} className="avatar" />
          <span className="status-dot" style={{ backgroundColor: '#10B981' }}></span>
        </div>
        <h3 className="profile-name">{profileName}</h3>
        <p className="profile-role">{profileDesignation}</p>
      </div>
      
      <nav className="nav-menu">
        {navItems.map(item => {
          const Icon = item.icon;
          return (
            <NavLink 
              key={item.id} 
              to={item.path}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              {item.id === 'communications' ? (
                <div className="icon-wrapper">
                  <Icon size={20} className="nav-icon" />
                  {unreadCount > 0 && (
                    <span className="badge" style={{ background: 'var(--accent-cyan)', color: '#000' }}>
                      {unreadCount}
                    </span>
                  )}
                </div>
              ) : (
                <Icon size={20} className="nav-icon" />
              )}
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
      
      <div className="sidebar-footer">
        <NavLink to="/notifications" className={({ isActive }) => `nav-link notification-btn ${isActive ? 'active' : ''}`}>
          <div className="icon-wrapper">
            <Bell size={20} className="nav-icon" />
          </div>
          <span>Notifications</span>
        </NavLink>
      </div>
    </aside>
  );
}
