import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell, LineChart, Line, ComposedChart, Area } from 'recharts';

const revenueData = [
  { month: 'Jan', collected: 45000, pending: 12000 },
  { month: 'Feb', collected: 52000, pending: 8000 },
  { month: 'Mar', collected: 48000, pending: 15000 },
  { month: 'Apr', collected: 61000, pending: 5000 },
  { month: 'May', collected: 59000, pending: 7000 },
  { month: 'Jun', collected: 65000, pending: 4000 },
];

const distributionData = [
  { name: 'Science', value: 400 },
  { name: 'Commerce', value: 300 },
  { name: 'Arts', value: 300 },
];

const academicTrendsData = [
  { month: 'Jan', science: 82, math: 78, english: 85 },
  { month: 'Feb', science: 84, math: 80, english: 86 },
  { month: 'Mar', science: 83, math: 85, english: 84 },
  { month: 'Apr', science: 88, math: 87, english: 89 },
  { month: 'May', science: 89, math: 86, english: 88 },
  { month: 'Jun', science: 92, math: 89, english: 90 },
];

const teacherEffectivenessData = [
  { name: 'Sarah J.', progress: 75, avgScore: 88 },
  { name: 'Michael C.', progress: 60, avgScore: 76 },
  { name: 'Emily R.', progress: 90, avgScore: 92 },
  { name: 'David T.', progress: 45, avgScore: 65 },
  { name: 'John D.', progress: 85, avgScore: 84 },
];

const COLORS = ['#00E5FF', '#8A2BE2', '#0A84FF'];

const teacherAbsenceData = [
  { month: 'Jan', absences: 12 },
  { month: 'Feb', absences: 18 },
  { month: 'Mar', absences: 14 },
  { month: 'Apr', absences: 8 },
  { month: 'May', absences: 22 },
  { month: 'Jun', absences: 5 },
];

const topStudentsData = [
  { name: 'Diana P.', score: 98 },
  { name: 'Alice J.', score: 96 },
  { name: 'Evan W.', score: 94 },
  { name: 'Charlie D.', score: 92 },
  { name: 'Bob S.', score: 89 },
];

export default function Analytics() {
  return (
    <div style={{ padding: '20px' }}>
      <h1 className="text-gradient">System Analytics</h1>
      <p style={{ marginBottom: '30px' }}>Comprehensive overview of institutional, academic, and faculty performance.</p>

      {/* Row 1: Teacher Absences & Top Students */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '20px' }}>
        <div className="glass-panel" style={{ flex: 1, minWidth: '400px', padding: '20px', height: '350px' }}>
          <h3 style={{ marginBottom: '20px' }}>Faculty Absences (Last 6 Months)</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={teacherAbsenceData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="month" stroke="var(--text-secondary)" />
              <YAxis stroke="var(--text-secondary)" />
              <Tooltip contentStyle={{ backgroundColor: 'var(--bg-dark)', border: '1px solid var(--panel-border)' }} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              <Bar dataKey="absences" name="Total Absences" fill="#EF4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-panel" style={{ flex: 1, minWidth: '400px', padding: '20px', height: '350px' }}>
          <h3 style={{ marginBottom: '20px' }}>Top Performing Students</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topStudentsData} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" horizontal={false} />
              <XAxis type="number" stroke="var(--text-secondary)" domain={[0, 100]} />
              <YAxis dataKey="name" type="category" stroke="var(--text-secondary)" />
              <Tooltip contentStyle={{ backgroundColor: 'var(--bg-dark)', border: '1px solid var(--panel-border)' }} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              <Bar dataKey="score" name="Average Score (%)" fill="var(--accent-gold)" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2: Academic Trends & Faculty Effectiveness */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <div className="glass-panel" style={{ flex: 1, minWidth: '400px', padding: '20px', height: '350px' }}>
          <h3 style={{ marginBottom: '20px' }}>School-Wide Academic Trends (Avg Scores)</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={academicTrendsData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="month" stroke="var(--text-secondary)" />
              <YAxis stroke="var(--text-secondary)" domain={[60, 100]} />
              <Tooltip contentStyle={{ backgroundColor: 'var(--bg-dark)', border: '1px solid var(--panel-border)' }} />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              <Line type="monotone" dataKey="science" name="Science" stroke="var(--accent-cyan)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="math" name="Math" stroke="var(--accent-purple)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="english" name="English" stroke="var(--accent-gold)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-panel" style={{ flex: 1, minWidth: '400px', padding: '20px', height: '350px' }}>
          <h3 style={{ marginBottom: '20px' }}>Faculty & Teacher Effectiveness</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '10px' }}>Comparing Syllabus Progress vs Class Average Score</p>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={teacherEffectivenessData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="var(--text-secondary)" />
              <YAxis yAxisId="left" stroke="var(--text-secondary)" label={{ value: 'Progress %', angle: -90, position: 'insideLeft', fill: 'var(--text-secondary)' }} />
              <YAxis yAxisId="right" orientation="right" stroke="var(--text-secondary)" domain={[0, 100]} label={{ value: 'Avg Score %', angle: 90, position: 'insideRight', fill: 'var(--text-secondary)' }} />
              <Tooltip contentStyle={{ backgroundColor: 'var(--bg-dark)', border: '1px solid var(--panel-border)' }} />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              <Bar yAxisId="left" dataKey="progress" name="Syllabus Progress (%)" fill="rgba(0, 229, 255, 0.4)" barSize={40} radius={[4, 4, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="avgScore" name="Class Avg Score (%)" stroke="var(--accent-blue)" strokeWidth={4} dot={{ r: 6 }} activeDot={{ r: 8 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
