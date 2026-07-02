import React, { useState } from 'react';
import Card from './Card';
import { PlusCircle, Trash2, Save, X } from 'lucide-react';

export default function CreateQATest({ onCancel }) {
  const [testInfo, setTestInfo] = useState({ title: '', assignedClass: '', duration: '' });
  const [questions, setQuestions] = useState([
    { id: 1, text: '', points: 5 }
  ]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { id: Date.now(), text: '', points: 5 }
    ]);
  };

  const removeQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const updateQuestionFields = (id, field, value) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, [field]: value } : q));
  };

  const handleSave = () => {
    console.log("Saving Q/A Test:", { testInfo, questions });
    // In a real app, this would be an API call.
    onCancel();
  };

  const inputStyle = {
    width: '100%', padding: '10px', borderRadius: '8px', 
    background: 'rgba(255,255,255,0.05)', border: '1px solid var(--panel-border)', 
    color: 'white', marginBottom: '15px'
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '50px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Create Q/A Test</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-ghost" onClick={onCancel}><X size={16} /> Cancel</button>
          <button className="btn btn-primary" onClick={handleSave}><Save size={16} /> Save Test</button>
        </div>
      </div>

      <Card title="Test Details" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px', color: 'var(--text-secondary)' }}>Test Title</label>
            <input type="text" style={inputStyle} placeholder="e.g., Physics Essay Exam" 
                   value={testInfo.title} onChange={e => setTestInfo({...testInfo, title: e.target.value})} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px', color: 'var(--text-secondary)' }}>Assigned Class</label>
            <input type="text" style={inputStyle} placeholder="e.g., 9-B" 
                   value={testInfo.assignedClass} onChange={e => setTestInfo({...testInfo, assignedClass: e.target.value})} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px', color: 'var(--text-secondary)' }}>Duration (Mins)</label>
            <input type="number" style={inputStyle} placeholder="e.g., 60" 
                   value={testInfo.duration} onChange={e => setTestInfo({...testInfo, duration: e.target.value})} />
          </div>
        </div>
      </Card>

      {questions.map((q, qIndex) => (
        <Card key={q.id} style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h4 style={{ margin: 0, color: 'var(--accent-purple)' }}>Question {qIndex + 1}</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Points:</span>
                <input type="number" style={{ ...inputStyle, width: '60px', marginBottom: 0, padding: '5px' }} 
                       value={q.points} onChange={e => updateQuestionFields(q.id, 'points', e.target.value)} />
              </div>
              <button className="btn btn-ghost" style={{ padding: '5px' }} onClick={() => removeQuestion(q.id)}>
                <Trash2 size={16} color="var(--text-secondary)" />
              </button>
            </div>
          </div>
          
          <textarea style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} placeholder="Enter your detailed question here..." 
                 value={q.text} onChange={e => updateQuestionFields(q.id, 'text', e.target.value)} />
        </Card>
      ))}

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <button className="btn btn-ghost" onClick={addQuestion} style={{ padding: '10px 20px', border: '1px dashed var(--accent-purple)', width: '100%' }}>
          <PlusCircle size={20} color="var(--accent-purple)" style={{ marginRight: '8px' }} /> Add Another Question
        </button>
      </div>
    </div>
  );
}
