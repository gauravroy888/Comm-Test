import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';
import { Calendar, Flame, Clock } from 'lucide-react';
import './Progress.css';

const chartData = [
  { name: 'Apr 9', value: 30 },
  { name: 'Apr 10', value: 45 },
  { name: 'Apr 11', value: 65 },
  { name: 'Apr 12', value: 85 },
  { name: 'Apr 13', value: 70 },
  { name: 'Apr 14', value: 80 },
  { name: 'Apr 15', value: 100 }
];

export default function Progress() {
  return (
    <div className="view-container">
      <Card className="full-height-card">
        <div className="progress-header-row">
          <div className="tabs">
            <button className="tab active">Overview</button>
            <button className="tab">Subjects</button>
            <button className="tab">Achievements</button>
          </div>
          <div className="sort-box">
            <select className="sort-select">
              <option>This Month</option>
              <option>Last Month</option>
              <option>All Time</option>
            </select>
          </div>
        </div>
        
        <div className="stats-cards">
          <div className="stat-card">
            <div className="circle-progress-wrapper mini">
              <svg viewBox="0 0 100 100" className="circle-svg">
                <circle cx="50" cy="50" r="40" className="circle-bg" />
                <circle cx="50" cy="50" r="40" className="circle-fill" strokeDasharray="251" strokeDashoffset="52" />
              </svg>
            </div>
            <div className="stat-info">
              <span className="stat-label">Overall Progress</span>
              <span className="stat-value">79%</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon-wrapper"><Calendar size={24} color="var(--accent-cyan)" /></div>
            <div className="stat-info">
              <span className="stat-label">Courses Completed</span>
              <span className="stat-value">12</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon-wrapper"><Flame size={24} color="#DD6B20" /></div>
            <div className="stat-info">
              <span className="stat-label">Study Streak</span>
              <span className="stat-value">15 Days</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon-wrapper"><Clock size={24} color="#805AD5" /></div>
            <div className="stat-info">
              <span className="stat-label">Total Study Time</span>
              <span className="stat-value">24h 30m</span>
            </div>
          </div>
        </div>
        
        <div className="charts-container">
          <div className="main-chart-area">
            <h4 className="chart-title">Progress Overview</h4>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 20, right: 20, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--text-secondary)" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text-secondary)" tick={{fontSize: 12}} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}%`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--panel-border)', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Line type="monotone" dataKey="value" stroke="var(--accent-cyan)" strokeWidth={3} dot={{ r: 4, fill: 'var(--accent-cyan)' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="subject-progress-area">
            <h4 className="chart-title">Subject Progress</h4>
            <div className="subjects-list-large">
              <div className="subject-item-large">
                <span className="subject-icon-large">💡</span>
                <span className="subject-name-large">Science</span>
                <div className="subject-bar-large"><ProgressBar progress={79} color="#00E5FF" showLabel={false} /></div>
                <span className="subject-pct-large">79%</span>
              </div>
              <div className="subject-item-large">
                <span className="subject-icon-large">⚛️</span>
                <span className="subject-name-large">History</span>
                <div className="subject-bar-large"><ProgressBar progress={85} color="#8A2BE2" showLabel={false} /></div>
                <span className="subject-pct-large">85%</span>
              </div>
              <div className="subject-item-large">
                <span className="subject-icon-large">📏</span>
                <span className="subject-name-large">Math</span>
                <div className="subject-bar-large"><ProgressBar progress={85} color="#0A84FF" showLabel={false} /></div>
                <span className="subject-pct-large">85%</span>
              </div>
              <div className="subject-item-large">
                <span className="subject-icon-large">🦴</span>
                <span className="subject-name-large">Geography</span>
                <div className="subject-bar-large"><ProgressBar progress={75} color="#00E5FF" showLabel={false} /></div>
                <span className="subject-pct-large">75%</span>
              </div>
              <div className="subject-item-large">
                <span className="subject-icon-large">🌸</span>
                <span className="subject-name-large">Art</span>
                <div className="subject-bar-large"><ProgressBar progress={60} color="#FF1493" showLabel={false} /></div>
                <span className="subject-pct-large">60%</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
