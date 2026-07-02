import React from 'react';
import { Users, GraduationCap, BookOpen, Activity, Calendar as CalendarIcon, MessageSquare, Clock, MapPin, CheckCircle, XCircle } from 'lucide-react';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';

const recentEvents = [
  { id: 1, title: 'Science Fair 2026', date: '28 Jun', time: '11:00 AM' },
  { id: 2, title: 'Mid-Term Exams Begin', date: '15 Jun', time: '08:00 AM' },
];

const upcomingMeetings = [
  { id: 1, title: 'Parent-Teacher Meeting', time: '09:00 AM', location: 'Virtual' },
  { id: 2, title: 'Dept Head Sync', time: '02:00 PM', location: 'Room 101' },
];

const recentChats = [
  { id: 1, name: 'Michael Chen', message: 'Can we move the Grade 10 exam?', time: '11:02 AM', unread: true },
  { id: 2, name: 'Sarah Jenkins', message: 'Got the new schedule, thanks!', time: '09:15 AM', unread: false },
  { id: 3, name: 'Emily Roberts', message: 'Syllabus updated in system.', time: 'Yesterday', unread: false },
];

const teacherAttendance = {
  present: 135,
  absent: 7,
  total: 142
};

const studentAttendance = {
  present: 4500,
  absent: 321,
  total: 4821
};

export default function Dashboard() {
  return (
    <div className="dashboard-container" style={{ padding: '20px' }}>
      <h1 className="text-gradient">Admin Dashboard</h1>
      <p style={{ marginBottom: '30px' }}>Platform overview and daily operations.</p>



      {/* Bottom Grid: 4 New Sections */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
        
        {/* Recent Events */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <CalendarIcon size={20} color="var(--accent-cyan)" />
            <h3 style={{ margin: 0 }}>Recent & Upcoming Events</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentEvents.map(ev => (
              <div key={ev.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid var(--accent-cyan)' }}>
                <div>
                  <div style={{ color: '#fff', fontWeight: 500, marginBottom: '4px' }}>{ev.title}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '12px', display: 'flex', gap: '8px' }}>
                    <span><CalendarIcon size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '2px' }}/> {ev.date}</span>
                    <span><Clock size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '2px' }}/> {ev.time}</span>
                  </div>
                </div>
                <button className="btn btn-ghost" style={{ padding: '4px 8px', fontSize: '12px' }}>View</button>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Meetings */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <Users size={20} color="var(--accent-purple)" />
            <h3 style={{ margin: 0 }}>Upcoming Meetings</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {upcomingMeetings.map(meeting => (
              <div key={meeting.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid var(--accent-purple)' }}>
                <div>
                  <div style={{ color: '#fff', fontWeight: 500, marginBottom: '4px' }}>{meeting.title}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '12px', display: 'flex', gap: '8px' }}>
                    <span><Clock size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '2px' }}/> {meeting.time}</span>
                    <span><MapPin size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '2px' }}/> {meeting.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Chat */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <MessageSquare size={20} color="var(--accent-blue)" />
            <h3 style={{ margin: 0 }}>Recent Communications</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentChats.map(chat => (
              <div key={chat.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ color: chat.unread ? '#fff' : 'var(--text-secondary)', fontWeight: chat.unread ? 600 : 400 }}>{chat.name}</span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>{chat.time}</span>
                  </div>
                  <div style={{ color: chat.unread ? '#fff' : 'var(--text-secondary)', fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '280px' }}>
                    {chat.message}
                  </div>
                </div>
                {chat.unread && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-cyan)', marginTop: '6px', marginLeft: '10px' }}></div>}
              </div>
            ))}
          </div>
        </div>

        {/* Attendance Overview */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <CheckCircle size={20} color="#10B981" />
            <h3 style={{ margin: 0 }}>Attendance Overview Today</h3>
          </div>
          
          {/* Faculty */}
          <div style={{ marginBottom: '25px', paddingBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'flex-end' }}>
              <span style={{ color: '#fff', fontSize: '15px', fontWeight: 'bold' }}>Faculty</span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                <span style={{ color: '#10B981', fontWeight: 'bold' }}>{teacherAttendance.present} Present</span> | <span style={{ color: '#EF4444' }}>{teacherAttendance.absent} Absent</span>
              </span>
            </div>
            <ProgressBar progress={Math.round((teacherAttendance.present / teacherAttendance.total) * 100)} color="#10B981" />
          </div>

          {/* Students */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'flex-end' }}>
              <span style={{ color: '#fff', fontSize: '15px', fontWeight: 'bold' }}>Students</span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                <span style={{ color: 'var(--accent-cyan)', fontWeight: 'bold' }}>{studentAttendance.present} Present</span> | <span style={{ color: '#EF4444' }}>{studentAttendance.absent} Absent</span>
              </span>
            </div>
            <ProgressBar progress={Math.round((studentAttendance.present / studentAttendance.total) * 100)} color="var(--accent-cyan)" />
          </div>
        </div>

      </div>
    </div>
  );
}
