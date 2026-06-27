import React, { useState } from 'react';
import Card from './Card';
import { PlusCircle, Trash2, Save, X } from 'lucide-react';

export default function CreateMCQTest({ onCancel }) {
  const [testInfo, setTestInfo] = useState({ title: '', assignedClass: '', duration: '' });
  const [questions, setQuestions] = useState([
    { id: 1, text: '', options: [{ id: 1, text: '', isCorrect: false }, { id: 2, text: '', isCorrect: false }] }
  ]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { id: Date.now(), text: '', options: [{ id: 1, text: '', isCorrect: false }, { id: 2, text: '', isCorrect: false }] }
    ]);
  };

  const removeQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const updateQuestionText = (id, text) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, text } : q));
  };

  const addOption = (qId) => {
    setQuestions(questions.map(q => {
      if (q.id === qId) {
        return { ...q, options: [...q.options, { id: Date.now(), text: '', isCorrect: false }] };
      }
      return q;
    }));
  };

  const removeOption = (qId, optId) => {
    setQuestions(questions.map(q => {
      if (q.id === qId) {
        return { ...q, options: q.options.filter(o => o.id !== optId) };
      }
      return q;
    }));
  };

  const updateOptionText = (qId, optId, text) => {
    setQuestions(questions.map(q => {
      if (q.id === qId) {
        return { ...q, options: q.options.map(o => o.id === optId ? { ...o, text } : o) };
      }
      return q;
    }));
  };

  const setCorrectOption = (qId, optId) => {
    setQuestions(questions.map(q => {
      if (q.id === qId) {
        return {
          ...q,
          options: q.options.map(o => ({ ...o, isCorrect: o.id === optId }))
        };
      }
      return q;
    }));
  };

  const handleSave = () => {
    console.log("Saving MCQ Test:", { testInfo, questions });
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
        <h2>Create MCQ Test</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-ghost" onClick={onCancel}><X size={16} /> Cancel</button>
          <button className="btn btn-primary" onClick={handleSave}><Save size={16} /> Save Test</button>
        </div>
      </div>

      <Card title="Test Details" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px', color: 'var(--text-secondary)' }}>Test Title</label>
            <input type="text" style={inputStyle} placeholder="e.g., Physics Chapter 3 Quiz" 
                   value={testInfo.title} onChange={e => setTestInfo({...testInfo, title: e.target.value})} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px', color: 'var(--text-secondary)' }}>Assigned Class</label>
            <input type="text" style={inputStyle} placeholder="e.g., 9-B" 
                   value={testInfo.assignedClass} onChange={e => setTestInfo({...testInfo, assignedClass: e.target.value})} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px', color: 'var(--text-secondary)' }}>Duration (Mins)</label>
            <input type="number" style={inputStyle} placeholder="e.g., 30" 
                   value={testInfo.duration} onChange={e => setTestInfo({...testInfo, duration: e.target.value})} />
          </div>
        </div>
      </Card>

      {questions.map((q, qIndex) => (
        <Card key={q.id} style={{ marginBottom: '20px', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h4 style={{ margin: 0, color: 'var(--accent-cyan)' }}>Question {qIndex + 1}</h4>
            <button className="btn btn-ghost" style={{ padding: '5px' }} onClick={() => removeQuestion(q.id)}>
              <Trash2 size={16} color="var(--text-secondary)" />
            </button>
          </div>
          
          <input type="text" style={inputStyle} placeholder="Enter your question here..." 
                 value={q.text} onChange={e => updateQuestionText(q.id, e.target.value)} />
          
          <div style={{ marginLeft: '20px' }}>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '10px' }}>Options (Select the correct one):</p>
            {q.options.map((opt, optIndex) => (
              <div key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <input 
                  type="radio" 
                  name={`correct-${q.id}`} 
                  checked={opt.isCorrect} 
                  onChange={() => setCorrectOption(q.id, opt.id)}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--accent-cyan)' }}
                />
                <input type="text" style={{...inputStyle, marginBottom: 0, flex: 1}} placeholder={`Option ${optIndex + 1}`} 
                       value={opt.text} onChange={e => updateOptionText(q.id, opt.id, e.target.value)} />
                <button className="btn btn-ghost" style={{ padding: '5px', border: 'none' }} onClick={() => removeOption(q.id, opt.id)}>
                  <X size={16} color="var(--text-secondary)" />
                </button>
              </div>
            ))}
            <button className="btn btn-ghost" style={{ marginTop: '10px', padding: '5px 10px', fontSize: '12px' }} onClick={() => addOption(q.id)}>
              <PlusCircle size={14} /> Add Option
            </button>
          </div>
        </Card>
      ))}

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <button className="btn btn-ghost" onClick={addQuestion} style={{ padding: '10px 20px', border: '1px dashed var(--accent-cyan)', width: '100%' }}>
          <PlusCircle size={20} color="var(--accent-cyan)" style={{ marginRight: '8px' }} /> Add Another Question
        </button>
      </div>
    </div>
  );
}
