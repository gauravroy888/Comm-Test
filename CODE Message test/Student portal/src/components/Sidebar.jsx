import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BookOpen, Users, MessageSquare, BarChart2, Settings, Bell } from 'lucide-react';
import { useTheme } from '../ThemeContext';
import './Sidebar.css';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/' },
  { id: 'courses', label: 'Courses', icon: BookOpen, path: '/courses' },
  { id: 'mentors', label: 'Mentors', icon: Users, path: '/mentors' },
  { id: 'chats', label: 'Inbox', icon: MessageSquare, path: '/chats' },
  { id: 'progress', label: 'Progress', icon: BarChart2, path: '/progress' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' }
];

export default function Sidebar({ isOpen, closeMenu }) {
  const { profileImage, profileName, profileDesignation } = useTheme();

  return (
    <aside className={`sidebar glass-panel ${isOpen ? 'open' : ''}`}>
      <div className="profile-section">
        <div className="avatar-wrapper">
          <img src={profileImage} alt={profileName} className="avatar" />
          <span className="status-dot"></span>
        </div>
        <h3 className="profile-name">{profileName}</h3>
        <p className="profile-role">{profileDesignation}</p>
      </div>
      
      <nav className="nav-menu">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink 
              key={item.id} 
              to={item.path} 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMenu}
            >
              <Icon size={20} className="nav-icon" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
      
      <div className="sidebar-footer">
        <NavLink 
          to="/notifications" 
          className={({ isActive }) => `nav-link notification-btn ${isActive ? 'active' : ''}`}
          onClick={closeMenu}
        >
          <div className="icon-wrapper">
            <Bell size={20} className="nav-icon" />
            <span className="badge">3</span>
          </div>
          <span>Notifications</span>
        </NavLink>
      </div>
    </aside>
  );
}
