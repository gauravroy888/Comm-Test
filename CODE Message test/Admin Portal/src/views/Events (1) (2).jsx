import React, { useState } from 'react';
import Card from '../components/Card';
import { Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react';
import Modal from '../components/Modal';

const initialEvents = [
  { id: 1, title: 'Mid-Term Exams Begin', date: '15 Jun', time: '08:00 AM', location: 'All Campuses', type: 'exam' },
  { id: 2, title: 'Teacher Training Workshop', date: '18 Jun', time: '10:00 AM', location: 'Main Auditorium', type: 'meeting' },
  { id: 3, title: 'Parent-Teacher Meeting', date: '22 Jun', time: '09:00 AM', location: 'Virtual', type: 'event' },
  { id: 4, title: 'Science Fair 2026', date: '28 Jun', time: '11:00 AM', location: 'Exhibition Hall', type: 'event' },
];

export default function Events() {
  const [events, setEvents] = useState(initialEvents);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', date: '', time: '', location: '' });

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.date) return;
    
    setEvents([...events, {
      id: Date.now(),
      title: formData.title,
      date: formData.date,
      time: formData.time || 'TBD',
      location: formData.location || 'TBD',
      type: 'event'
    }]);
    
    setFormData({ title: '', date: '', time: '', location: '' });
    setIsModalOpen(false);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 className="text-gradient">Important Events</h1>
      <p style={{ marginBottom: '30px' }}>Manage academic calendar and school-wide events.</p>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <div className="glass-panel" style={{ flex: 2, minWidth: '300px', padding: '20px' }}>
          <h3>Calendar Overview</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px', marginTop: '20px' }}>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} style={{ textAlign: 'center', color: 'var(--text-secondary)', fontWeight: 500 }}>{day}</div>
            ))}
            {Array.from({ length: 30 }).map((_, i) => (
              <div key={i} style={{ 
                height: '80px', 
                border: '1px solid var(--panel-border)', 
                borderRadius: '8px', 
                padding: '8px',
                background: [14, 17, 21, 27].includes(i) ? 'rgba(0, 229, 255, 0.1)' : 'transparent'
              }}>
                <span style={{ color: 'var(--text-secondary)' }}>{i + 1}</span>
                {[14, 17, 21, 27].includes(i) && (
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-cyan)', marginTop: '4px' }}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <h3>Upcoming Events</h3>
          {events.map(ev => (
            <div key={ev.id} className="glass-panel" style={{ padding: '15px', borderLeft: `4px solid var(--accent-cyan)` }}>
              <h4 style={{ color: '#fff', marginBottom: '8px' }}>{ev.title}</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '4px' }}>
                <CalendarIcon size={14} /> {ev.date}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '4px' }}>
                <Clock size={14} /> {ev.time}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                <MapPin size={14} /> {ev.location}
              </div>
            </div>
          ))}
          <button className="btn btn-primary" style={{ marginTop: '10px' }} onClick={() => setIsModalOpen(true)}>
            + Create New Event
          </button>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Event">
        <form onSubmit={handleAddEvent}>
          <div className="form-group">
            <label>Event Title</label>
            <input type="text" className="form-control" placeholder="e.g. Science Fair" required
              value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Date</label>
            <input type="text" className="form-control" placeholder="e.g. 28 Jun" required
              value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Time</label>
            <input type="text" className="form-control" placeholder="e.g. 11:00 AM" 
              value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input type="text" className="form-control" placeholder="e.g. Main Auditorium" 
              value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Create Event</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
