import React from 'react';
import './Layout.css';
import Sidebar from './Sidebar';
import { useTheme } from '../ThemeContext';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  // Using the same background from ThemeContext but ensuring it's available
  // The context should have been copied from Teacher Portal
  const { backgroundImage } = useTheme();

  return (
    <div className="app-container">
      <div className="bg-overlay" style={{ backgroundImage: `url(${backgroundImage})` }}></div>
      <div className="bg-gradient"></div>
      
      <Sidebar />
      
      <main className="main-content">
        <header className="top-header">
          <div className="header-brand">
            <h2>ADMIN PORTAL</h2>
            <p>Welcome back, Administrator!</p>
          </div>
          <div className="header-actions">
            {/* Any global actions could go here */}
          </div>
        </header>
        
        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
