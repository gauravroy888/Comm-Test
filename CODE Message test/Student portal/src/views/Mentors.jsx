import React, { useState } from 'react';
import { Search, Star, MessageCircle } from 'lucide-react';
import Card from '../components/Card';
import './Mentors.css';

const mentorsList = [
  { id: 1, name: 'Dr. Anya Sharma', title: 'Ph.D. in Physics, MIT', subject: 'Physics', rating: 4.9, status: 'Online', avatar: 'https://ui-avatars.com/api/?name=Anya+Sharma&background=0D8ABC&color=fff', active: true, isMyMentor: true },
  { id: 2, name: 'Prof. Michael Chen', title: 'Ph.D. in History, Stanford', subject: 'History', rating: 4.8, status: 'Online', avatar: 'https://ui-avatars.com/api/?name=Michael+Chen&background=D69E2E&color=fff', active: true, isMyMentor: true },
  { id: 3, name: 'Ms. Sarah Johnson', title: 'M.Sc. in Mathematics, Oxford', subject: 'Mathematics', rating: 4.9, status: 'Online', avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=805AD5&color=fff', active: true, isMyMentor: false },
  { id: 4, name: 'Dr. Ravi Patel', title: 'Ph.D. in Computer Science, CMU', subject: 'Computer Science', rating: 4.6, status: 'Online', avatar: 'https://ui-avatars.com/api/?name=Ravi+Patel&background=38A169&color=fff', active: true, isMyMentor: false },
  { id: 5, name: 'Ms. Emma Wilson', title: 'M.A. in Literature, Cambridge', subject: 'Literature', rating: 4.7, status: 'Away', avatar: 'https://ui-avatars.com/api/?name=Emma+Wilson&background=DD6B20&color=fff', active: false, isMyMentor: true }
];

export default function Mentors() {
  const [activeTab, setActiveTab] = useState('all');

  const displayedMentors = activeTab === 'all' 
    ? mentorsList 
    : mentorsList.filter(m => m.isMyMentor);

  return (
    <div className="view-container">
      <Card className="full-height-card">
        <div className="mentors-header">
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All Mentors
            </button>
            <button 
              className={`tab ${activeTab === 'my' ? 'active' : ''}`}
              onClick={() => setActiveTab('my')}
            >
              My Mentors
            </button>
          </div>
          
          <div className="mentors-actions">
            <div className="search-box">
              <Search size={16} />
              <input type="text" placeholder="Search mentors..." />
            </div>
            <div className="sort-box">
              <span className="sort-label">Filter by:</span>
              <select className="sort-select">
                <option>All Subjects</option>
                <option>Science</option>
                <option>Math</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="mentors-list">
          {displayedMentors.map(mentor => (
            <div key={mentor.id} className="mentor-row">
              <div className="mentor-info-block">
                <div className="mentor-avatar large">
                  <img src={mentor.avatar} alt={mentor.name} />
                  <span className={`status-dot ${mentor.active ? 'online' : 'away'}`}></span>
                </div>
                <div>
                  <h4 className="mentor-name">{mentor.name}</h4>
                  <p className="mentor-title">{mentor.title}</p>
                  <span className={`status-text ${mentor.active ? 'online' : 'away'}`}>{mentor.status}</span>
                </div>
              </div>
              
              <div className="mentor-subject">
                <span className="subject-badge">{mentor.subject}</span>
              </div>
              
              <div className="mentor-rating">
                <span className="rating-val">{mentor.rating}</span>
                <Star size={14} className="star-icon" fill="var(--accent-gold)" color="var(--accent-gold)" />
              </div>
              
              <div className="mentor-row-actions">
                <button className="btn btn-ghost">View Profile</button>
                <button className="icon-btn"><MessageCircle size={18} /></button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
