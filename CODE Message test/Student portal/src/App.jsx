import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './views/Dashboard';
import Courses from './views/Courses';
import Mentors from './views/Mentors';
import Chats from './views/Chats';
import Progress from './views/Progress';
import Settings from './views/Settings';
import Notifications from './views/Notifications';
import { ThemeProvider } from './ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/mentors" element={<Mentors />} />
            <Route path="/chats" element={<Chats />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}
