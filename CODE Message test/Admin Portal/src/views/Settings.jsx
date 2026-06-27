import React from 'react';

export default function Settings() {
  return (
    <div style={{ padding: '20px' }}>
      <h1 className="text-gradient">Admin Settings</h1>
      <p style={{ marginBottom: '30px' }}>Configure global platform settings.</p>

      <div className="glass-panel" style={{ padding: '30px', maxWidth: '600px' }}>
        <h3 style={{ marginBottom: '20px', borderBottom: '1px solid var(--panel-border)', paddingBottom: '10px' }}>Institution Profile</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '8px', fontSize: '14px' }}>Institution Name</label>
            <input type="text" defaultValue="Edtech Island High School" style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--panel-border)', color: '#fff', borderRadius: '8px' }} />
          </div>
          <div>
            <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '8px', fontSize: '14px' }}>Academic Year</label>
            <select style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--panel-border)', color: '#fff', borderRadius: '8px' }}>
              <option>2026 - 2027</option>
              <option>2025 - 2026</option>
            </select>
          </div>
          
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button className="btn btn-primary">Save Changes</button>
            <button className="btn btn-ghost">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}
