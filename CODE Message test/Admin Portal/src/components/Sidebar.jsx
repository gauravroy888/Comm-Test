import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Calendar, Users, BookOpen, BarChart2, Settings, Bell, CalendarDays, MessageSquare } from 'lucide-react';
import { useTheme } from '../ThemeContext';
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
  // Using ThemeContext assuming we updated it, or we can hardcode for now
  // For Admin Portal, let's hardcode the profile for simplicity or provide default Admin details
  return (
    <aside className="sidebar glass-panel">
      <div className="profile-section">
        <div className="avatar-wrapper">
          <img src="https://i.pravatar.cc/150?img=11" alt="Admin Profile" className="avatar" />
          <span className="status-dot" style={{ backgroundColor: '#10B981' }}></span>
        </div>
        <h3 className="profile-name">Admin Portal</h3>
        <p className="profile-role">Super Administrator</p>
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
              <Icon size={20} className="nav-icon" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
      
      <div className="sidebar-footer">
        <NavLink to="/notifications" className={({ isActive }) => `nav-link notification-btn ${isActive ? 'active' : ''}`}>
          <div className="icon-wrapper">
            <Bell size={20} className="nav-icon" />
            <span className="badge">2</span>
          </div>
          <span>Notifications</span>
        </NavLink>
      </div>
    </aside>
  );
}
