import React, { useState } from 'react';
import Card from '../components/Card';
import { Users, CheckCircle, TrendingUp, AlertCircle } from 'lucide-react';
import ProgressBar from '../components/ProgressBar';
import Modal from '../components/Modal';

const initialClassesData = [
  { id: '10A', name: 'Grade 10 - Section A', students: 35, avgAttendance: 92, avgScore: 84, status: 'On Track' },
  { id: '10B', name: 'Grade 10 - Section B', students: 32, avgAttendance: 88, avgScore: 76, status: 'Needs Attention' },
  { id: '11A', name: 'Grade 11 - Science', students: 28, avgAttendance: 95, avgScore: 89, status: 'Excellent' },
  { id: '12C', name: 'Grade 12 - Commerce', students: 40, avgAttendance: 90, avgScore: 81, status: 'On Track' },
];

const mockStudentsList = [
  { id: 'S001', name: 'Alice Johnson', attendance: '95%', grade: 'A' },
  { id: 'S002', name: 'Bob Smith', attendance: '88%', grade: 'B+' },
  { id: 'S003', name: 'Charlie Davis', attendance: '92%', grade: 'A-' },
  { id: 'S004', name: 'Diana Prince', attendance: '100%', grade: 'A+' },
  { id: 'S005', name: 'Evan Wright', attendance: '75%', grade: 'C' },
];

export default function Classes() {
  const [classes, setClasses] = useState(initialClassesData);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', students: '' });

  const [studentModalData, setStudentModalData] = useState(null); // holds class object when viewing students
  const [reportModalData, setReportModalData] = useState(null); // holds class object when viewing report

  const handleCreateClass = (e) => {
    e.preventDefault();
    if (!formData.name) return;

    setClasses([...classes, {
      id: Date.now().toString(),
      name: formData.name,
      students: parseInt(formData.students) || 0,
      avgAttendance: 0,
      avgScore: 0,
      status: 'New'
    }]);

    setFormData({ name: '', students: '' });
    setIsCreateModalOpen(false);
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 className="text-gradient">Class Performance & Monitoring</h1>
          <p>Overview of all active classes, attendance, and average scores.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsCreateModalOpen(true)}>+ Create New Class</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {classes.map(cls => (
          <div key={cls.id} className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <h3 style={{ color: '#fff', fontSize: '18px', marginBottom: '4px' }}>{cls.name}</h3>
                <span style={{ color: 'var(--text-secondary)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Users size={14} /> {cls.students} Students Enrolled
                </span>
              </div>
              {cls.status === 'Needs Attention' ? (
                <AlertCircle size={20} color="#EF4444" />
              ) : cls.status === 'Excellent' ? (
                <CheckCircle size={20} color="#10B981" />
              ) : (
                <TrendingUp size={20} color="var(--accent-cyan)" />
              )}
            </div>

            <div style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                <span>Average Attendance</span>
                <span>{cls.avgAttendance}%</span>
              </div>
              <ProgressBar progress={cls.avgAttendance} />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                <span>Average Class Score</span>
                <span>{cls.avgScore}%</span>
              </div>
              <ProgressBar progress={cls.avgScore} color="var(--accent-purple)" />
            </div>

            <div style={{ borderTop: '1px solid var(--panel-border)', paddingTop: '15px', display: 'flex', justifyContent: 'space-between' }}>
              <button className="btn btn-ghost" style={{ fontSize: '13px', padding: '6px 12px' }} onClick={() => setStudentModalData(cls)}>View Students</button>
              <button className="btn btn-primary" style={{ fontSize: '13px', padding: '6px 12px' }} onClick={() => setReportModalData(cls)}>Full Report</button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Class Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Class">
        <form onSubmit={handleCreateClass}>
          <div className="form-group">
            <label>Class Name</label>
            <input type="text" className="form-control" placeholder="e.g. Grade 9 - Section C" required
              value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Number of Students (Initial)</label>
            <input type="number" className="form-control" placeholder="0" required
              value={formData.students} onChange={e => setFormData({...formData, students: e.target.value})} />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={() => setIsCreateModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Create Class</button>
          </div>
        </form>
      </Modal>

      {/* View Students Modal */}
      <Modal isOpen={!!studentModalData} onClose={() => setStudentModalData(null)} title={`Students in ${studentModalData?.name}`}>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>Showing a sample of enrolled students.</p>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--panel-border)', color: 'var(--accent-cyan)' }}>
                <th style={{ padding: '10px' }}>ID</th>
                <th style={{ padding: '10px' }}>Name</th>
                <th style={{ padding: '10px' }}>Attendance</th>
                <th style={{ padding: '10px' }}>Grade</th>
              </tr>
            </thead>
            <tbody>
              {mockStudentsList.map(student => (
                <tr key={student.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '10px', color: 'var(--text-secondary)' }}>{student.id}</td>
                  <td style={{ padding: '10px', color: '#fff' }}>{student.name}</td>
                  <td style={{ padding: '10px', color: '#fff' }}>{student.attendance}</td>
                  <td style={{ padding: '10px', color: '#fff' }}>{student.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={() => setStudentModalData(null)}>Close</button>
        </div>
      </Modal>

      {/* Full Report Modal */}
      <Modal isOpen={!!reportModalData} onClose={() => setReportModalData(null)} title={`Full Report: ${reportModalData?.name}`}>
        <div style={{ display: 'grid', gap: '20px' }}>
          <div className="glass-panel" style={{ padding: '15px' }}>
            <h4 style={{ color: 'var(--text-secondary)', marginBottom: '5px' }}>Overall Status</h4>
            <div style={{ fontSize: '20px', color: '#fff', fontWeight: 'bold' }}>{reportModalData?.status}</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className="glass-panel" style={{ padding: '15px' }}>
              <h4 style={{ color: 'var(--text-secondary)', marginBottom: '5px' }}>Attendance</h4>
              <div style={{ fontSize: '24px', color: 'var(--accent-cyan)' }}>{reportModalData?.avgAttendance}%</div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>Top 10% in school</p>
            </div>
            <div className="glass-panel" style={{ padding: '15px' }}>
              <h4 style={{ color: 'var(--text-secondary)', marginBottom: '5px' }}>Test Averages</h4>
              <div style={{ fontSize: '24px', color: 'var(--accent-purple)' }}>{reportModalData?.avgScore}%</div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>Requires improvement</p>
            </div>
          </div>
          <div className="glass-panel" style={{ padding: '15px' }}>
            <h4 style={{ color: 'var(--text-secondary)', marginBottom: '10px' }}>Recent Assessments</h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--panel-border)', paddingBottom: '8px', marginBottom: '8px' }}>
              <span style={{ color: '#fff' }}>Mid-term Math</span>
              <span style={{ color: '#10B981' }}>88% Avg</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--panel-border)', paddingBottom: '8px', marginBottom: '8px' }}>
              <span style={{ color: '#fff' }}>Science Quiz</span>
              <span style={{ color: '#F59E0B' }}>72% Avg</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#fff' }}>English Essay</span>
              <span style={{ color: '#10B981' }}>85% Avg</span>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost">Download PDF</button>
          <button className="btn btn-primary" onClick={() => setReportModalData(null)}>Close</button>
        </div>
      </Modal>

    </div>
  );
}
