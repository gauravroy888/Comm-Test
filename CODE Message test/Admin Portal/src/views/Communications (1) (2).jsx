import React, { useState, useEffect } from 'react';
import { Users, Shield, Megaphone, MessageSquare } from 'lucide-react';
import { supabase } from '../supabase';
import ChatInterface from '../components/ChatInterface';

export default function Communications() {
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'announcements'
  const [currentUser, setCurrentUser] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({ chat: 0 });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userParam = params.get('user');
    if (userParam) {
      localStorage.setItem('edtech_user', userParam);
      setCurrentUser(JSON.parse(userParam));
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      const userStr = localStorage.getItem('edtech_user');
      if (userStr) setCurrentUser(JSON.parse(userStr));
    }
  }, []);
  
  // Announcement state
  const [announcements, setAnnouncements] = useState([]);
  const [announceTitle, setAnnounceTitle] = useState('');
  const [announceText, setAnnounceText] = useState('');

  // Fetch Announcements
  useEffect(() => {
    const fetchAnnouncements = async () => {
      const { data } = await supabase.from('announcements').select('*').order('createdAt', { ascending: false });
      if (data) setAnnouncements(data);
    };
    
    fetchAnnouncements();
    
    const subscription = supabase.channel('announcements_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'announcements' }, fetchAnnouncements)
      .subscribe();
      
    return () => { supabase.removeChannel(subscription); };
  }, []);

  const handlePostAnnouncement = async (e) => {
    e.preventDefault();
    if (!announceTitle || !announceText) {
      alert("Please enter a title and message.");
      return;
    }
    if (!currentUser) {
      alert("Error: You are not logged in. Please return to the Landing Page and sign in again.");
      return;
    }
    try {
      const { error } = await supabase.from('announcements').insert({
        title: announceTitle,
        text: announceText,
        author: currentUser.name || "Admin",
      });
      if (error) throw error;
      
      setAnnounceTitle('');
      setAnnounceText('');
      alert("Announcement posted successfully!");
    } catch (error) {
      console.error("Error posting announcement:", error);
      alert("Failed to post announcement: " + error.message);
    }
  };

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 100px)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h1 className="text-gradient">Communications Hub</h1>
          <p>Chat with teachers/students and broadcast global announcements.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '10px', background: 'rgba(0,0,0,0.3)', padding: '5px', borderRadius: '12px' }}>
          <button 
            className={`btn ${activeTab === 'chat' ? 'btn-primary' : 'btn-ghost'}`} 
            style={{ border: 'none' }}
            onClick={() => setActiveTab('chat')}
          >
            <MessageSquare size={16} /> Chat
            {unreadCounts.chat > 0 && (
              <span style={{ background: '#25D366', color: '#000', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', marginLeft: '5px' }}>
                {unreadCounts.chat}
              </span>
            )}
          </button>
          <button 
            className={`btn ${activeTab === 'announcements' ? 'btn-primary' : 'btn-ghost'}`} 
            style={{ border: 'none' }}
            onClick={() => setActiveTab('announcements')}
          >
            <Megaphone size={16} /> Announcements
          </button>
        </div>
      </div>

      <div className="glass-panel" style={{ flex: 1, display: 'flex', overflow: 'hidden', padding: 0 }}>
        {activeTab === 'announcements' ? (
          <div style={{ flex: 1, display: 'flex', padding: '20px', gap: '30px', overflowY: 'auto' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ marginBottom: '20px' }}>Recent Announcements</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {announcements.length > 0 ? announcements.map(ann => (
                  <div key={ann.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--panel-border)', padding: '20px', borderRadius: '12px', borderLeft: '4px solid var(--accent-purple)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <h4 style={{ color: '#fff', margin: 0 }}>{ann.title}</h4>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                        {ann.createdAt ? new Date(ann.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : 'Just now'}
                      </span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '14px', lineHeight: '1.5' }}>{ann.text}</p>
                  </div>
                )) : (
                  <div style={{ color: 'var(--text-secondary)' }}>No announcements yet.</div>
                )}
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--panel-border)', padding: '20px', borderRadius: '12px' }}>
                <h3 style={{ marginBottom: '20px' }}>Broadcast New Announcement</h3>
                <form onSubmit={handlePostAnnouncement}>
                  <div className="form-group" style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '8px', fontSize: '14px' }}>Title</label>
                    <input type="text" value={announceTitle} onChange={e => setAnnounceTitle(e.target.value)} placeholder="Enter title" required
                      style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--panel-border)', color: '#fff', borderRadius: '8px', outline: 'none' }} />
                  </div>
                  <div className="form-group" style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '8px', fontSize: '14px' }}>Message Body</label>
                    <textarea value={announceText} onChange={e => setAnnounceText(e.target.value)} rows="5" placeholder="Write your announcement..." required
                      style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--panel-border)', color: '#fff', borderRadius: '8px', outline: 'none', resize: 'vertical' }}></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Post Announcement</button>
                </form>
              </div>
            </div>
          </div>
        ) : (
          <ChatInterface 
            currentUser={currentUser} 
            activeTab={activeTab} 
            isManager={true} 
            onUnreadCountChange={setUnreadCounts}
          />
        )}
      </div>
    </div>
  );
}
