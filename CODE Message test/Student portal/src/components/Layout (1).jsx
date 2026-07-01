import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import './Layout.css';
import Sidebar from './Sidebar';
import { useTheme } from '../ThemeContext';

export default function Layout({ children }) {
  const { backgroundImage, profileName } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="app-container">
      <div className="bg-overlay" style={{ backgroundImage: `url(${backgroundImage})` }}></div>
      <div className="bg-gradient"></div>
      
      {/* Mobile overlay backdrop */}
      {isMobileMenuOpen && (
        <div className="mobile-backdrop" onClick={toggleMobileMenu}></div>
      )}

      <Sidebar isOpen={isMobileMenuOpen} closeMenu={() => setIsMobileMenuOpen(false)} />
      
      <main className="main-content">
        <header className="top-header">
          <div className="header-left">
            <button className="mobile-menu-btn icon-btn" onClick={toggleMobileMenu}>
              <Menu size={24} />
            </button>
            <div className="header-brand">
              <h2>STUDENT PORTAL</h2>
              <p>Welcome back, {profileName.split(' ')[0]}!</p>
            </div>
          </div>
          <div className="header-actions">
            {/* Any global actions could go here */}
          </div>
        </header>
        
        <div className="page-content">
          {children}
        </div>
      </main>
    </div>
  );
}
