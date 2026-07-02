import React from 'react';
import Card from '../components/Card';
import { Users, BookOpen } from 'lucide-react';

export default function Classes() {
  const classes = [
    { id: '1st', name: 'Class 1st', subject: 'Basic Math', students: 30, performance: '80%' },
    { id: '2nd', name: 'Class 2nd', subject: 'Basic English', students: 28, performance: '82%' },
    { id: '3rd', name: 'Class 3rd', subject: 'Environmental Studies', students: 32, performance: '85%' },
    { id: '4th', name: 'Class 4th', subject: 'Social Science', students: 35, performance: '81%' },
    { id: '5th', name: 'Class 5th', subject: 'General Knowledge', students: 29, performance: '88%' },
    { id: '6th', name: 'Class 6th', subject: 'General Science', students: 30, performance: '82%' }
  ];

  return (
    <div className="view-container animate-fade-in">
      <div className="view-header">
        <h1>Assigned Classes</h1>
        <p>Manage your subjects, student rosters, and class groups.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {classes.map(cls => (
          <Card key={cls.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
              <div>
                <h3 style={{ margin: 0, color: 'var(--accent-cyan)' }}>{cls.name}</h3>
                <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>{cls.subject}</p>
              </div>
              <div style={{ padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                <BookOpen size={20} color="var(--accent-blue)" />
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '20px', marginTop: '20px', paddingTop: '15px', borderTop: '1px solid var(--panel-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={16} color="var(--text-secondary)" />
                <span style={{ fontSize: '14px' }}>{cls.students} Students</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Avg:</span>
                <span style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--accent-gold)' }}>{cls.performance}</span>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button className="btn btn-ghost" style={{ flex: 1 }}>View Roster</button>
              <button className="btn btn-primary" onClick={() => window.location.hash = '#/inbox'} style={{ flex: 1 }}>Manage Groups</button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
