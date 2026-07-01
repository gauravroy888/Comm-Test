import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import Modal from '../components/Modal';

const initialScheduleData = [
  { id: 1, time: '08:00 AM - 09:00 AM', monday: 'Physics (Grade 10)', tuesday: 'Maths (Grade 10)', wednesday: 'Chemistry (Grade 10)', thursday: 'English (Grade 10)', friday: 'Biology (Grade 10)' },
  { id: 2, time: '09:00 AM - 10:00 AM', monday: 'Maths (Grade 10)', tuesday: 'Physics (Grade 10)', wednesday: 'English (Grade 10)', thursday: 'Chemistry (Grade 10)', friday: 'History (Grade 10)' },
  { id: 3, time: '10:00 AM - 10:30 AM', monday: 'Break', tuesday: 'Break', wednesday: 'Break', thursday: 'Break', friday: 'Break' },
  { id: 4, time: '10:30 AM - 11:30 AM', monday: 'History (Grade 10)', tuesday: 'Computer Sci (Grade 10)', wednesday: 'Maths (Grade 10)', thursday: 'Physics (Grade 10)', friday: 'English (Grade 10)' },
];

export default function TimeTable() {
  const [selectedClass, setSelectedClass] = useState('Grade 10 - Section A');
  const [scheduleData, setScheduleData] = useState(initialScheduleData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ time: '', monday: '', tuesday: '', wednesday: '', thursday: '', friday: '' });

  const handleEditSchedule = (e) => {
    e.preventDefault();
    if (!formData.time) return;

    setScheduleData([...scheduleData, {
      id: Date.now(),
      ...formData
    }]);

    setFormData({ time: '', monday: '', tuesday: '', wednesday: '', thursday: '', friday: '' });
    setIsModalOpen(false);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 className="text-gradient">Time Table Management</h1>
      <p style={{ marginBottom: '30px' }}>View and modify schedules for all classes.</p>

      <div className="glass-panel" style={{ padding: '20px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Viewing:</span>
          <select 
            value={selectedClass} 
            onChange={(e) => setSelectedClass(e.target.value)}
            style={{ 
              background: 'rgba(0,0,0,0.3)', 
              color: '#fff', 
              border: '1px solid var(--panel-border)', 
              padding: '8px 12px', 
              borderRadius: '8px',
              outline: 'none'
            }}
          >
            <option>Grade 9 - Section A</option>
            <option>Grade 10 - Section A</option>
            <option>Grade 11 - Science</option>
            <option>Grade 12 - Commerce</option>
          </select>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-ghost"><Filter size={16} /> Filter</button>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>Edit Schedule</button>
        </div>
      </div>

      <div className="glass-panel" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--panel-border)', background: 'rgba(255,255,255,0.02)' }}>
              <th style={{ padding: '16px', color: 'var(--accent-cyan)' }}>Time</th>
              <th style={{ padding: '16px', color: '#fff' }}>Monday</th>
              <th style={{ padding: '16px', color: '#fff' }}>Tuesday</th>
              <th style={{ padding: '16px', color: '#fff' }}>Wednesday</th>
              <th style={{ padding: '16px', color: '#fff' }}>Thursday</th>
              <th style={{ padding: '16px', color: '#fff' }}>Friday</th>
            </tr>
          </thead>
          <tbody>
            {scheduleData.map((row) => (
              <tr key={row.id} style={{ borderBottom: '1px solid var(--panel-border)' }}>
                <td style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: 500 }}>{row.time}</td>
                <td style={{ padding: '16px', color: row.monday === 'Break' ? 'var(--text-secondary)' : '#fff' }}>{row.monday}</td>
                <td style={{ padding: '16px', color: row.tuesday === 'Break' ? 'var(--text-secondary)' : '#fff' }}>{row.tuesday}</td>
                <td style={{ padding: '16px', color: row.wednesday === 'Break' ? 'var(--text-secondary)' : '#fff' }}>{row.wednesday}</td>
                <td style={{ padding: '16px', color: row.thursday === 'Break' ? 'var(--text-secondary)' : '#fff' }}>{row.thursday}</td>
                <td style={{ padding: '16px', color: row.friday === 'Break' ? 'var(--text-secondary)' : '#fff' }}>{row.friday}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Schedule Slot">
        <form onSubmit={handleEditSchedule}>
          <div className="form-group">
            <label>Time Slot</label>
            <input type="text" className="form-control" placeholder="e.g. 11:30 AM - 12:30 PM" required
              value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div className="form-group">
              <label>Monday</label>
              <input type="text" className="form-control" placeholder="Subject" 
                value={formData.monday} onChange={e => setFormData({...formData, monday: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Tuesday</label>
              <input type="text" className="form-control" placeholder="Subject" 
                value={formData.tuesday} onChange={e => setFormData({...formData, tuesday: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Wednesday</label>
              <input type="text" className="form-control" placeholder="Subject" 
                value={formData.wednesday} onChange={e => setFormData({...formData, wednesday: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Thursday</label>
              <input type="text" className="form-control" placeholder="Subject" 
                value={formData.thursday} onChange={e => setFormData({...formData, thursday: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Friday</label>
              <input type="text" className="form-control" placeholder="Subject" 
                value={formData.friday} onChange={e => setFormData({...formData, friday: e.target.value})} />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Add Slot</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
