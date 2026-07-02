import React, { useState } from 'react';
import { Search, MoreVertical, BookOpen, User, Activity, Edit3 } from 'lucide-react';
import ProgressBar from '../components/ProgressBar';
import Modal from '../components/Modal';

const initialTeachersData = [
  { id: 1, name: 'Sarah Jenkins', dept: 'Science', classes: ['Grade 10-A', 'Grade 11-B'], progress: 75, tests: 12, performance: 'Excellent' },
  { id: 2, name: 'Michael Chen', dept: 'Mathematics', classes: ['Grade 9-A', 'Grade 10-A', 'Grade 12-C'], progress: 60, tests: 8, performance: 'Good' },
  { id: 3, name: 'Emily Roberts', dept: 'English', classes: ['Grade 11-A', 'Grade 11-C'], progress: 90, tests: 15, performance: 'Outstanding' },
  { id: 4, name: 'David Thompson', dept: 'History', classes: ['Grade 10-B', 'Grade 12-A'], progress: 45, tests: 5, performance: 'Average' },
];

export default function Teachers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [teachers, setTeachers] = useState(initialTeachersData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', dept: '', classes: '' });

  const [assignModalData, setAssignModalData] = useState(null);
  const [assignFormData, setAssignFormData] = useState({ dept: '', classes: '', timetable: '' });

  const handleAddTeacher = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.dept) return;

    setTeachers([...teachers, {
      id: Date.now(),
      name: formData.name,
      dept: formData.dept,
      classes: formData.classes ? formData.classes.split(',').map(c => c.trim()) : [],
      progress: 0,
      tests: 0,
      performance: 'New'
    }]);

    setFormData({ name: '', dept: '', classes: '' });
    setIsModalOpen(false);
  };

  const openAssignModal = (teacher) => {
    setAssignModalData(teacher);
    setAssignFormData({
      dept: teacher.dept,
      classes: teacher.classes.join(', '),
      timetable: '' // For mock purposes, just a free-text note or slot string
    });
  };

  const handleAssignTeacher = (e) => {
    e.preventDefault();
    if (!assignModalData) return;

    setTeachers(teachers.map(t => {
      if (t.id === assignModalData.id) {
        return {
          ...t,
          dept: assignFormData.dept,
          classes: assignFormData.classes ? assignFormData.classes.split(',').map(c => c.trim()) : []
        };
      }
      return t;
    }));

    setAssignModalData(null);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 className="text-gradient">Teacher Directory & Performance</h1>
      <p style={{ marginBottom: '30px' }}>Monitor teacher assignments, syllabus progress, and test performance.</p>

      <div className="glass-panel" style={{ padding: '20px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            placeholder="Search teachers..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              width: '100%', 
              background: 'rgba(0,0,0,0.3)', 
              border: '1px solid var(--panel-border)', 
              color: '#fff', 
              padding: '10px 10px 10px 40px', 
              borderRadius: '8px',
              outline: 'none'
            }}
          />
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>+ Add New Teacher</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {teachers.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase())).map(teacher => (
          <div key={teacher.id} className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flex: 1 }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold' }}>
                {teacher.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 style={{ color: '#fff', margin: 0 }}>{teacher.name}</h3>
                <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{teacher.dept}</span>
              </div>
            </div>
            
            <div style={{ flex: 1 }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '4px' }}>Assigned Classes</div>
              <div style={{ color: '#fff', fontSize: '14px' }}>{teacher.classes.join(', ') || 'None'}</div>
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '4px' }}>Syllabus Progress</div>
              <ProgressBar progress={teacher.progress} label={`${teacher.progress}%`} />
            </div>

            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '4px' }}>Tests Conducted</div>
              <div style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold' }}>{teacher.tests}</div>
            </div>

            <div style={{ flex: 1, textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
              <span style={{ 
                padding: '4px 10px', 
                borderRadius: '12px', 
                fontSize: '12px', 
                background: teacher.progress >= 75 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                color: teacher.progress >= 75 ? '#10B981' : '#F59E0B'
              }}>
                {teacher.performance}
              </span>
              <button 
                className="btn btn-ghost" 
                style={{ padding: '6px 12px', fontSize: '13px' }}
                onClick={() => openAssignModal(teacher)}
              >
                <Edit3 size={14} style={{ marginRight: '4px' }}/> Assign
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Teacher">
        <form onSubmit={handleAddTeacher}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" className="form-control" placeholder="e.g. John Doe" required
              value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Department / Subject</label>
            <input type="text" className="form-control" placeholder="e.g. Physics" required
              value={formData.dept} onChange={e => setFormData({...formData, dept: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Assigned Classes (comma separated)</label>
            <input type="text" className="form-control" placeholder="e.g. Grade 10-A, Grade 9-B" 
              value={formData.classes} onChange={e => setFormData({...formData, classes: e.target.value})} />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Add Teacher</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!assignModalData} onClose={() => setAssignModalData(null)} title={`Assign Work: ${assignModalData?.name}`}>
        <form onSubmit={handleAssignTeacher}>
          <div className="form-group">
            <label>Department / Subject</label>
            <input type="text" className="form-control" required
              value={assignFormData.dept} onChange={e => setAssignFormData({...assignFormData, dept: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Assigned Classes (comma separated)</label>
            <input type="text" className="form-control" placeholder="e.g. Grade 10-A, Grade 9-B" 
              value={assignFormData.classes} onChange={e => setAssignFormData({...assignFormData, classes: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Timetable Slot Updates</label>
            <textarea className="form-control" rows="3" placeholder="Add specific times/days..."
              value={assignFormData.timetable} onChange={e => setAssignFormData({...assignFormData, timetable: e.target.value})}></textarea>
            <small style={{ color: 'var(--text-secondary)' }}>Note: This will notify the teacher of their new schedule.</small>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={() => setAssignModalData(null)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Assignments</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
