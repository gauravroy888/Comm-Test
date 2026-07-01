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
import { supabase } from './supabase';

export default function App() {
  const [user, setUser] = React.useState(() => {
    const userStr = localStorage.getItem('edtech_user');
    if (userStr) {
      try { return JSON.parse(userStr); } catch (e) { return null; }
    }
    return null;
  });

  React.useEffect(() => {
    const verifySession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        localStorage.removeItem('edtech_user');
        setUser(null);
        return;
      }
      const userStr = localStorage.getItem('edtech_user');
      if (userStr) {
        try {
          const u = JSON.parse(userStr);
          if (u.email === session.user.email) {
            setUser(u);
          } else {
            localStorage.removeItem('edtech_user');
            setUser(null);
          }
        } catch (e) { setUser(null); }
      }
    };
    verifySession();
  }, []);

  if (!user || user.role !== 'student') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0a0f1d', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
        <h1 style={{ color: '#FF6B6B', marginBottom: '10px' }}>Access Denied</h1>
        <p style={{ color: '#8b9bb4', marginBottom: '30px' }}>You do not have permission to access the Student Portal.</p>
        <a href="https://gauravroy888.github.io/Comm-Test/" style={{ padding: '12px 24px', background: 'var(--accent-cyan, #00f0ff)', color: '#000', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold' }}>Return to Login</a>
      </div>
    );
  }
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
