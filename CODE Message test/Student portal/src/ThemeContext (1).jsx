import React, { createContext, useContext, useState, useEffect } from 'react';
import defaultBg from './assets/milky-way-starry-sky2k.jpg';
import defaultAvatar from './assets/avatar.png';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Try to load from localStorage, otherwise default to the milky way image
  const [backgroundImage, setBackgroundImage] = useState(() => {
    return localStorage.getItem('student_portal_bg') || defaultBg;
  });

  const [profileImage, setProfileImage] = useState(() => {
    return localStorage.getItem('student_portal_avatar') || defaultAvatar;
  });

  const [profileName, setProfileName] = useState(() => {
    return localStorage.getItem('student_portal_name') || 'Alex K.';
  });

  const [profileDesignation, setProfileDesignation] = useState(() => {
    return localStorage.getItem('student_portal_designation') || 'Student';
  });

  // Update localStorage when it changes
  useEffect(() => {
    localStorage.setItem('student_portal_bg', backgroundImage);
  }, [backgroundImage]);

  useEffect(() => {
    localStorage.setItem('student_portal_avatar', profileImage);
  }, [profileImage]);

  useEffect(() => {
    localStorage.setItem('student_portal_name', profileName);
  }, [profileName]);

  useEffect(() => {
    localStorage.setItem('student_portal_designation', profileDesignation);
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
