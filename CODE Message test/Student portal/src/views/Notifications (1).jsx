import React from 'react';
import Card from '../components/Card';
import { Bell, BookOpen, MessageSquare, Star, CheckCircle } from 'lucide-react';
import './Notifications.css';

const notificationsData = [
  { id: 1, type: 'assignment', icon: BookOpen, color: '#00E5FF', title: 'New Assignment Posted', message: 'Dr. Anya Sharma posted "Quantum Mechanics Worksheet 3". Due in 2 days.', time: '10 mins ago', unread: true },
  { id: 2, type: 'message', icon: MessageSquare, color: '#8A2BE2', title: 'New Message', message: 'You have a new message from Ms. Sarah Johnson.', time: '1 hour ago', unread: true },
  { id: 3, type: 'system', icon: Bell, color: '#0A84FF', title: 'System Update', message: 'Scheduled maintenance this weekend. The portal will be down for 2 hours.', time: '5 hours ago', unread: true },
  { id: 4, type: 'achievement', icon: Star, color: '#FFD700', title: 'Achievement Unlocked!', message: 'You completed a 15-day study streak. Keep it up!', time: '1 day ago', unread: false },
  { id: 5, type: 'grade', icon: CheckCircle, color: '#10B981', title: 'Grade Updated', message: 'Your grade for "History Project: Ancient Civilizations" has been posted.', time: '2 days ago', unread: false }
];

export default function Notifications() {
  return (
    <div className="view-container">
      <Card className="full-height-card">
        <div className="notifications-header">
          <div className="tabs">
            <button className="tab active">All Notifications</button>
            <button className="tab">Unread</button>
          </div>
          <button className="btn btn-ghost text-sm">Mark all as read</button>
        </div>
        
        <div className="notifications-list">
          {notificationsData.map(notif => {
            const Icon = notif.icon;
            return (
              <div key={notif.id} className={`notification-item ${notif.unread ? 'unread' : ''}`}>
                <div className="notif-icon-wrapper" style={{ backgroundColor: `${notif.color}20`, color: notif.color }}>
                  <Icon size={20} />
                </div>
                <div className="notif-content">
                  <h4 className="notif-title">{notif.title}</h4>
                  <p className="notif-message">{notif.message}</p>
                  <span className="notif-time">{notif.time}</span>
                </div>
                {notif.unread && <div className="unread-dot"></div>}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
