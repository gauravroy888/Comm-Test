import React, { useState } from 'react';
import Card from '../components/Card';
import { Users, BookOpen, X, Check, Search, Palette, UserPlus } from 'lucide-react';
import { supabase } from '../supabase';

export default function Classes() {
  const [activeModal, setActiveModal] = useState(null); // 'roster' | 'manageGroups' | null
  const [selectedClass, setSelectedClass] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Group creation state
  const [groupName, setGroupName] = useState('');
  const [groupColor, setGroupColor] = useState('#FF6B6B');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#D4A5A5', '#9B59B6', '#F39C12'];

  const classes = [
    { id: '1st', name: 'Class 1st', subject: 'Basic Math', students: 30, performance: '80%' },
    { id: '2nd', name: 'Class 2nd', subject: 'Basic English', students: 28, performance: '82%' },
    { id: '3rd', name: 'Class 3rd', subject: 'Environmental Studies', students: 32, performance: '85%' },
    { id: '4th', name: 'Class 4th', subject: 'Social Science', students: 35, performance: '81%' },
    { id: '5th', name: 'Class 5th', subject: 'General Knowledge', students: 29, performance: '88%' },
    { id: '6th', name: 'Class 6th', subject: 'General Science', students: 30, performance: '82%' }
  ];

  const class6thStudents = [
    { id: '1', name: 'Thor Roy', email: 'thorroy888@gmail.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=thor' },
    { id: '2', name: 'Saurav Roy', email: 'sauravroy469@gmail.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=saurav' },
    { id: '3', name: 'Aman Sharma', email: 'aman@edtech.edu', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aman' },
    { id: '4', name: 'Priya Patel', email: 'priya@edtech.edu', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya' },
    { id: '5', name: 'Rahul Singh', email: 'rahul@edtech.edu', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul' },
    { id: '6', name: 'Neha Gupta', email: 'neha@edtech.edu', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Neha' },
    { id: '7', name: 'Karan Malhotra', email: 'karan@edtech.edu', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Karan' }
  ];

  const filteredStudents = class6thStudents.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openModal = (modalType, cls) => {
    setSelectedClass(cls);
    setActiveModal(modalType);
    setSelectedStudents([]);
    setGroupName('');
    setSearchQuery('');
    setShowSuccess(false);
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedClass(null);
  };

  const toggleStudentSelection = (email) => {
    if (selectedStudents.includes(email)) {
      setSelectedStudents(selectedStudents.filter(e => e !== email));
    } else {
      setSelectedStudents([...selectedStudents, email]);
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim() || selectedStudents.length === 0) return;
    
    setIsCreating(true);
    try {
      const userStr = localStorage.getItem('edtech_user');
      let currentUser = { email: 'teacher@edtech.edu', name: 'Teacher' };
      if (userStr) {
        try { currentUser = JSON.parse(userStr); } catch (e) {}
      }

      // Add teacher to participants
      const participants = [...selectedStudents, currentUser.email];
      
      const newGroup = {
        type: 'group',
        group_name: groupName,
        group_color: groupColor,
        class_name: selectedClass.name,
        participants: participants,
        created_at: new Date().toISOString()
      };
      
      await supabase.from('conversations').insert([newGroup]);
      
      setShowSuccess(true);
      setTimeout(() => {
        closeModal();
      }, 1500);
    } catch (err) {
      console.error("Error creating group:", err);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="view-container animate-fade-in" style={{ position: 'relative' }}>
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
              <button className="btn btn-ghost" onClick={() => openModal('roster', cls)} style={{ flex: 1 }}>View Roster</button>
              <button className="btn btn-primary" onClick={() => openModal('manageGroups', cls)} style={{ flex: 1 }}>Manage Groups</button>
            </div>
          </Card>
        ))}
      </div>

      {/* Roster Modal */}
      {activeModal === 'roster' && selectedClass && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="animate-scale-in" style={{ background: '#1a1f2b', borderRadius: '16px', width: '100%', maxWidth: '600px', maxHeight: '80vh', display: 'flex', flexDirection: 'column', border: '1px solid var(--panel-border)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
            <div style={{ padding: '20px 25px', borderBottom: '1px solid var(--panel-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ margin: 0, color: '#fff' }}>Student Roster</h2>
                <p style={{ margin: '5px 0 0 0', color: 'var(--text-secondary)', fontSize: '14px' }}>{selectedClass.name} - {selectedClass.subject}</p>
              </div>
              <button onClick={closeModal} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>
            <div style={{ padding: '15px 25px', borderBottom: '1px solid var(--panel-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '10px 15px', border: '1px solid var(--panel-border)' }}>
                <Search size={18} color="var(--text-secondary)" style={{ marginRight: '10px' }} />
                <input 
                  type="text" 
                  placeholder="Search students by name or email..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ background: 'transparent', border: 'none', color: '#fff', flex: 1, outline: 'none' }}
                />
              </div>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '10px 25px 25px 25px' }}>
              {filteredStudents.length > 0 ? filteredStudents.map(student => (
                <div key={student.id} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s', borderRadius: '8px' }}>
                  <img src={student.avatar} alt={student.name} style={{ width: '45px', height: '45px', borderRadius: '50%', background: '#fff' }} />
                  <div>
                    <h4 style={{ margin: 0, color: '#fff', fontSize: '15px' }}>{student.name}</h4>
                    <p style={{ margin: '2px 0 0 0', color: 'var(--text-secondary)', fontSize: '13px' }}>{student.email}</p>
                  </div>
                </div>
              )) : (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)' }}>
                  No students found matching your search.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Manage Groups Modal */}
      {activeModal === 'manageGroups' && selectedClass && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="animate-scale-in" style={{ background: '#1a1f2b', borderRadius: '16px', width: '100%', maxWidth: '800px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', border: '1px solid var(--panel-border)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
            <div style={{ padding: '20px 25px', borderBottom: '1px solid var(--panel-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ margin: 0, color: '#fff' }}>Create Learning Group</h2>
                <p style={{ margin: '5px 0 0 0', color: 'var(--text-secondary)', fontSize: '14px' }}>Assign students from {selectedClass.name} to a new group.</p>
              </div>
              <button onClick={closeModal} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>
            
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
              {/* Left sidebar: Group Details */}
              <div style={{ width: '300px', borderRight: '1px solid var(--panel-border)', padding: '25px', display: 'flex', flexDirection: 'column', gap: '25px', background: 'rgba(0,0,0,0.1)' }}>
                <div>
                  <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '8px', fontSize: '14px' }}>Group Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Science Project Team A"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--panel-border)', color: '#fff', padding: '12px 15px', borderRadius: '8px', outline: 'none' }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '12px', fontSize: '14px' }}>Color Code</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {colors.map(color => (
                      <button
                        key={color}
                        onClick={() => setGroupColor(color)}
                        style={{
                          width: '36px', height: '36px', borderRadius: '50%', background: color,
                          border: groupColor === color ? '3px solid #fff' : '3px solid transparent',
                          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          boxShadow: groupColor === color ? `0 0 10px ${color}` : 'none',
                          transition: 'all 0.2s'
                        }}
                      >
                        {groupColor === color && <Check size={16} color="#000" />}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '8px', marginTop: 'auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Selected Students</span>
                    <span style={{ color: '#fff', fontWeight: 'bold' }}>{selectedStudents.length}</span>
                  </div>
                  <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(selectedStudents.length / class6thStudents.length) * 100}%`, background: groupColor, transition: 'all 0.3s' }}></div>
                  </div>
                </div>
                
                {showSuccess ? (
                  <button style={{ background: '#25D366', color: '#000', border: 'none', padding: '15px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <Check size={18} /> Group Created!
                  </button>
                ) : (
                  <button 
                    onClick={handleCreateGroup}
                    disabled={!groupName.trim() || selectedStudents.length === 0 || isCreating}
                    style={{ 
                      background: !groupName.trim() || selectedStudents.length === 0 ? 'rgba(255,255,255,0.1)' : 'var(--accent-cyan)', 
                      color: !groupName.trim() || selectedStudents.length === 0 ? 'var(--text-secondary)' : '#000', 
                      border: 'none', padding: '15px', borderRadius: '8px', fontWeight: 'bold', cursor: !groupName.trim() || selectedStudents.length === 0 ? 'not-allowed' : 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.3s'
                    }}
                  >
                    <UserPlus size={18} />
                    {isCreating ? 'Creating...' : 'Create Group'}
                  </button>
                )}
              </div>
              
              {/* Right side: Student Selection */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '20px', borderBottom: '1px solid var(--panel-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '10px 15px', border: '1px solid var(--panel-border)' }}>
                    <Search size={18} color="var(--text-secondary)" style={{ marginRight: '10px' }} />
                    <input 
                      type="text" 
                      placeholder="Search students to add..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{ background: 'transparent', border: 'none', color: '#fff', flex: 1, outline: 'none' }}
                    />
                  </div>
                </div>
                <div style={{ flex: 1, overflowY: 'auto', padding: '10px 20px 20px 20px' }}>
                  {filteredStudents.length > 0 ? filteredStudents.map(student => {
                    const isSelected = selectedStudents.includes(student.email);
                    return (
                      <div 
                        key={student.id} 
                        onClick={() => toggleStudentSelection(student.email)}
                        style={{ 
                          display: 'flex', alignItems: 'center', gap: '15px', padding: '12px 15px', 
                          border: `1px solid ${isSelected ? groupColor : 'rgba(255,255,255,0.05)'}`, 
                          background: isSelected ? `${groupColor}15` : 'transparent',
                          marginBottom: '10px', transition: 'all 0.2s', borderRadius: '8px', cursor: 'pointer' 
                        }}
                      >
                        <div style={{ 
                          width: '24px', height: '24px', borderRadius: '4px', border: `2px solid ${isSelected ? groupColor : 'var(--text-secondary)'}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', background: isSelected ? groupColor : 'transparent'
                        }}>
                          {isSelected && <Check size={14} color="#000" strokeWidth={3} />}
                        </div>
                        <img src={student.avatar} alt={student.name} style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#fff' }} />
                        <div>
                          <h4 style={{ margin: 0, color: '#fff', fontSize: '15px' }}>{student.name}</h4>
                          <p style={{ margin: '2px 0 0 0', color: 'var(--text-secondary)', fontSize: '13px' }}>{student.email}</p>
                        </div>
                      </div>
                    );
                  }) : (
                    <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)' }}>
                      No students found matching your search.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
