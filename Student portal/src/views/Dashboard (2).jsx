import React from 'react';
import { Mail, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';
import './Dashboard.css';

const learningHubData = [
  { id: 1, title: 'Quantum Physics - Lesson 4', category: 'Science', progress: 82, icon: '💡' },
  { id: 2, title: 'Ancient Civilizations', category: 'History', progress: 92, icon: '🏛️' },
  { id: 3, title: 'Skeletal System', category: 'Biology', progress: 92, icon: '🦴' }
];

const mentorsData = [
  { id: 1, name: 'Dr. Anya Sharma', status: 'Online', avatar: 'https://ui-avatars.com/api/?name=Anya+Sharma&background=0D8ABC&color=fff', active: true },
  { id: 2, name: 'Mr. Lee', status: 'Away', avatar: 'https://ui-avatars.com/api/?name=Mr+Lee&background=E53E3E&color=fff', active: false },
  { id: 3, name: 'Dr. Ravi Patel', status: 'Online', avatar: 'https://ui-avatars.com/api/?name=Ravi+Patel&background=38A169&color=fff', active: true },
  { id: 4, name: 'Prof. Michael Chen', status: 'Online', avatar: 'https://ui-avatars.com/api/?name=Michael+Chen&background=D69E2E&color=fff', active: true },
  { id: 5, name: 'Ms. Sarah Johnson', status: 'Online', avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=805AD5&color=fff', active: true },
  { id: 6, name: 'Ms. Emma Wilson', status: 'Away', avatar: 'https://ui-avatars.com/api/?name=Emma+Wilson&background=DD6B20&color=fff', active: false }
];

export default function Dashboard() {
  return (
    <div className="dashboard-grid">
      {/* Left Column */}
      <div className="dash-col dash-left">
        <Card title="MY STATUS & GUIDES" className="status-card">
          <div className="circle-progress-wrapper">
            <svg viewBox="0 0 100 100" className="circle-svg">
              <circle cx="50" cy="50" r="40" className="circle-bg" />
              <circle cx="50" cy="50" r="40" className="circle-fill" strokeDasharray="251" strokeDashoffset="52" />
            </svg>
            <div className="circle-text">
              <span className="circle-label">Overall Progress</span>
              <span className="circle-value">79%</span>
            </div>
          </div>
          
          <div className="subjects-list">
            <h4 className="subjects-title">SUBJECTS</h4>
            <div className="subject-item">
              <span className="subject-icon">💡</span>
              <span className="subject-name">Science</span>
              <div className="subject-bar"><ProgressBar progress={79} color="#00E5FF" showLabel={false} /></div>
              <span className="subject-pct">79%</span>
            </div>
            <div className="subject-item">
              <span className="subject-icon">⚛️</span>
              <span className="subject-name">History</span>
              <div className="subject-bar"><ProgressBar progress={85} color="#8A2BE2" showLabel={false} /></div>
              <span className="subject-pct">85%</span>
            </div>
            <div className="subject-item">
              <span className="subject-icon">📏</span>
              <span className="subject-name">Math</span>
              <div className="subject-bar"><ProgressBar progress={85} color="#0A84FF" showLabel={false} /></div>
              <span className="subject-pct">85%</span>
            </div>
            <div className="subject-item">
              <span className="subject-icon">🦴</span>
              <span className="subject-name">Geography</span>
              <div className="subject-bar"><ProgressBar progress={75} color="#00E5FF" showLabel={false} /></div>
              <span className="subject-pct">75%</span>
            </div>
            <div className="subject-item">
              <span className="subject-icon">🌸</span>
              <span className="subject-name">Art</span>
              <div className="subject-bar"><ProgressBar progress={60} color="#FF1493" showLabel={false} /></div>
              <span className="subject-pct">60%</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Middle Column */}
      <div className="dash-col dash-main">
        <Card 
          title="MY LEARNING HUB" 
          headerAction={
            <div className="hub-nav">
              <button className="icon-btn"><ChevronLeft size={18} /></button>
              <button className="icon-btn"><ChevronRight size={18} /></button>
            </div>
          }
        >
          <div className="learning-cards">
            {learningHubData.map(item => (
              <div key={item.id} className="learning-card">
                <div className="learning-icon flex-center">{item.icon}</div>
                <div className="learning-info">
                  <p className="learning-category">{item.category}:</p>
                  <h4 className="learning-title">{item.title}</h4>
                </div>
                <ProgressBar progress={item.progress} />
                <button className="btn btn-primary w-100">Resume</button>
              </div>
            ))}
          </div>
        </Card>

        <Card title="MY MENTORS">
          <div className="mentors-grid">
            {mentorsData.map(mentor => (
              <div key={mentor.id} className="mentor-item">
                <div className="mentor-avatar">
                  <img src={mentor.avatar} alt={mentor.name} />
                  <span className={`status-dot ${mentor.active ? 'online' : 'away'}`}></span>
                </div>
                <div className="mentor-info">
                  <h5>{mentor.name}</h5>
                  <span className={`status-text ${mentor.active ? 'online' : 'away'}`}>{mentor.status}</span>
                </div>
                <div className="mentor-actions">
                  <button className="action-btn"><Mail size={16} /></button>
                  <button className="action-btn"><MessageCircle size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Right Column */}
      <div className="dash-col dash-right">
        <Card title="COMMUNICATION HUB" className="comm-hub">
          <div className="quick-contacts">
            {mentorsData.slice(0,2).map(mentor => (
              <div key={mentor.id} className="contact-item">
                <div className="mentor-avatar">
                  <img src={mentor.avatar} alt={mentor.name} />
                  <span className={`status-dot ${mentor.active ? 'online' : 'away'}`}></span>
                </div>
                <div className="mentor-info">
                  <h5>{mentor.name}</h5>
                  <span className={`status-text ${mentor.active ? 'online' : 'away'}`}>{mentor.status}</span>
                </div>
                <div className="mentor-actions">
                  <button className="action-btn"><Mail size={16} /></button>
                  <button className="action-btn"><MessageCircle size={16} /></button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="chat-widget">
            <div className="chat-tabs">
              <span className="chat-tab active">Recent Chats</span>
            </div>
            <div className="chat-messages">
              <div className="message-item">
                <img src={mentorsData[2].avatar} alt="Me" className="msg-avatar" />
                <div className="msg-content">
                  <div className="msg-header"><span>Me</span> <span className="msg-time">10:56 AM</span></div>
                  <div className="msg-bubble">Hello, this contics and awent your student?</div>
                </div>
              </div>
              <div className="message-item">
                <img src={mentorsData[4].avatar} alt="Sara" className="msg-avatar" />
                <div className="msg-content">
                  <div className="msg-header"><span>Sara</span> <span className="msg-time">12:28 AM</span></div>
                  <div className="msg-bubble">Sara, message for mertra sonrvwhed?</div>
                </div>
              </div>
            </div>
            <div className="chat-input-area">
              <input type="text" placeholder="Type a message..." className="chat-input" />
              <button className="send-btn"><MessageCircle size={18} /></button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
