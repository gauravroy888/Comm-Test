import React, { useRef } from 'react';
import { Lock, LogOut, Upload } from 'lucide-react';
import Card from '../components/Card';
import { useTheme } from '../ThemeContext';
import './Settings.css';

export default function Settings() {
  const { backgroundImage, setBackgroundImage, profileImage, setProfileImage } = useTheme();
  const fileInputRef = useRef(null);
  const avatarInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        try {
          setBackgroundImage(base64String);
        } catch (e) {
          alert('Image is too large to save to local storage. Please try a smaller image.');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        try {
          setProfileImage(base64String);
        } catch (e) {
          alert('Image is too large to save to local storage. Please try a smaller image.');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="view-container">
      <Card className="full-height-card">
        <div className="settings-header">
          <div className="tabs">
            <button className="tab active">Account</button>
            <button className="tab">Notifications</button>
            <button className="tab">Privacy</button>
            <button className="tab">Appearance</button>
          </div>
        </div>
        
        <div className="settings-content-grid">
          {/* Profile Section */}
          <div className="settings-section profile-edit-section">
            <h4 className="section-title">Profile Information</h4>
            
            <div className="profile-edit-layout">
              <div className="profile-photo-col">
                <div className="avatar-preview">
                  <img src={profileImage} alt="Alex K." />
                </div>
                <input 
                  type="file" 
                  accept="image/*" 
                  ref={avatarInputRef} 
                  style={{ display: 'none' }} 
                  onChange={handleAvatarUpload} 
                />
                <button 
                  className="btn btn-ghost text-cyan text-sm"
                  onClick={() => avatarInputRef.current.click()}
                >
                  Change Photo
                </button>
              </div>
              
              <div className="profile-form-col">
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" className="form-input" defaultValue="Alex K." />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" className="form-input" defaultValue="alex.k@email.com" />
                </div>
                <div className="form-group">
                  <label>Grade</label>
                  <select className="form-input">
                    <option>Grade 6</option>
                    <option>Grade 7</option>
                    <option>Grade 8</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="form-group mt-20">
              <label>Bio</label>
              <textarea className="form-input textarea" rows={4} defaultValue="Passionate learner exploring the wonders of science and the universe."></textarea>
            </div>
            
            <button className="btn btn-primary mt-20">Save Changes</button>
          </div>
          
          {/* Preferences & Account Section */}
          <div className="settings-right-col">
            <div className="settings-section">
              <h4 className="section-title">Preferences</h4>
              <div className="form-group">
                <label>Language</label>
                <select className="form-input">
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                </select>
              </div>
              <div className="form-group">
                <label>Timezone</label>
                <select className="form-input">
                  <option>(GMT+05:30) Asia/Kolkata</option>
                  <option>(GMT+00:00) London</option>
                  <option>(GMT-05:00) Eastern Time</option>
                </select>
              </div>
              <div className="form-group">
                <label>Theme</label>
                <select className="form-input">
                  <option>🌙 Dark</option>
                  <option>☀️ Light</option>
                  <option>💻 System</option>
                </select>
              </div>
              <div className="form-group">
                <label>Background Image URL</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={backgroundImage} 
                  onChange={(e) => setBackgroundImage(e.target.value)}
                  placeholder="Enter image URL..."
                />
              </div>
              <div className="form-group">
                <label>Preset Backgrounds</label>
                <select 
                  className="form-input" 
                  onChange={(e) => {
                    if (e.target.value) setBackgroundImage(e.target.value);
                  }}
                  value={backgroundImage}
                >
                  <option value="/src/assets/milky-way-starry-sky2k.jpg">Milky Way Starry Sky</option>
                  <option value="/src/assets/bg.png">Futuristic Floating City</option>
                  <option value="https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=2000&auto=format&fit=crop">Deep Space Nebula</option>
                  <option value="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000&auto=format&fit=crop">Earth from Space</option>
                </select>
              </div>
              <div className="form-group">
                <label>Custom Background Upload</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  ref={fileInputRef} 
                  style={{ display: 'none' }} 
                  onChange={handleFileUpload} 
                />
                <button 
                  className="btn btn-ghost" 
                  style={{ justifyContent: 'flex-start', border: '1px solid var(--panel-border)', padding: '10px 14px' }}
                  onClick={() => fileInputRef.current.click()}
                >
                  <Upload size={16} /> Choose Image from Device
                </button>
              </div>
            </div>
            
            <div className="settings-section">
              <h4 className="section-title">Account</h4>
              <div className="account-actions">
                <button className="btn btn-ghost action-btn-link text-cyan">
                  <Lock size={16} /> Change Password
                </button>
                <button className="btn btn-ghost action-btn-link text-danger">
                  <LogOut size={16} /> Log Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
