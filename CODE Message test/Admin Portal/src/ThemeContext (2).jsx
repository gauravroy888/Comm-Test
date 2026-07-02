import React, { createContext, useContext, useState, useEffect } from 'react';
import defaultBg from './assets/milky-way-starry-sky2k.jpg';
import defaultAvatar from './assets/avatar.png';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Use 'admin_portal_bg' key to avoid conflict with Teacher portal
  const [backgroundImage, setBackgroundImage] = useState(() => {
    return localStorage.getItem('admin_portal_bg') || defaultBg;
  });

  const [profileImage, setProfileImage] = useState(() => {
    return localStorage.getItem('admin_portal_avatar') || defaultAvatar;
  });

  // Load admin name from the logged-in user stored in localStorage
  const [profileName, setProfileName] = useState(() => {
    try {
      const u = JSON.parse(localStorage.getItem('edtech_user') || '{}');
      return u.name || localStorage.getItem('admin_portal_name') || 'Admin';
    } catch {
      return localStorage.getItem('admin_portal_name') || 'Admin';
    }
  });

  const [profileDesignation, setProfileDesignation] = useState(() => {
    return localStorage.getItem('admin_portal_designation') || 'Administrator';
  });

  useEffect(() => {
    localStorage.setItem('admin_portal_bg', backgroundImage);
  }, [backgroundImage]);

  useEffect(() => {
    localStorage.setItem('admin_portal_avatar', profileImage);
  }, [profileImage]);

  useEffect(() => {
    localStorage.setItem('admin_portal_name', profileName);
  }, [profileName]);

  useEffect(() => {
    localStorage.setItem('admin_portal_designation', profileDesignation);
  }, [profileDesignation]);

  return (
    <ThemeContext.Provider value={{ 
      backgroundImage, setBackgroundImage, 
      profileImage, setProfileImage,
      profileName, setProfileName,
      profileDesignation, setProfileDesignation
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
