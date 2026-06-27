import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './views/Dashboard';
import Events from './views/Events';
import TimeTable from './views/TimeTable';
import Teachers from './views/Teachers';
import Classes from './views/Classes';
import Analytics from './views/Analytics';
import Settings from './views/Settings';
import Communications from './views/Communications';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="events" element={<Events />} />
        <Route path="timetable" element={<TimeTable />} />
        <Route path="teachers" element={<Teachers />} />
        <Route path="classes" element={<Classes />} />
        <Route path="communications" element={<Communications />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;
