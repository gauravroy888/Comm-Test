import React, { useState, useEffect, useRef } from 'react';
import { Search, Send, ArrowLeft, UserPlus, Trash2, MoreVertical } from 'lucide-react';
import { supabase } from '../supabase';
import './ChatInterface.css'; // We will create this

export default function ChatInterface({ currentUser, activeTab, isManager, onUnreadCountChange }) {
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [activeChatUser, setActiveChatUser] = useState(null);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [unreadCounts, setUnreadCounts] = useState({});
  
  const [showManageModal, setShowManageModal] = useState(false);
  const [manageEmail, setManageEmail] = useState("");
  const [manageName, setManageName] = useState("");
  const [manageRole, setManageRole] = useState("student");
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 1. Fetch Profiles
  const fetchProfiles = async () => {
    const { data, error } = await supabase.from('profiles').select('*').order('name');
    if (data) {
      setProfiles(data);
    } else {
      console.error("Error fetching profiles", error);
    }
  };

  useEffect(() => {
    fetchProfiles();
    
    // Subscribe to profile changes
    const profilesSub = supabase.channel('public:profiles')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, fetchProfiles)
      .subscribe();
      
    return () => { supabase.removeChannel(profilesSub); };
  }, []);

  // Fetch unread messages
  const fetchUnreadCounts = async () => {
    if (!currentUser) return;
    
    const { data: myConvs } = await supabase.from('conversations')
      .select('id')
      .or(`participant1_email.eq.${currentUser.email},participant2_email.eq.${currentUser.email}`);
      
    if (!myConvs || myConvs.length === 0) return;
    const convIds = myConvs.map(c => c.id);
    
    const { data: unreadMsgs } = await supabase.from('messages')
      .select('senderEmail')
      .in('conversationId', convIds)
      .eq('is_read', false)
      .neq('senderEmail', currentUser.email);
      
    if (unreadMsgs) {
      const counts = {};
      unreadMsgs.forEach(msg => {
        counts[msg.senderEmail] = (counts[msg.senderEmail] || 0) + 1;
      });
      setUnreadCounts(counts);
    }
  };

  useEffect(() => {
    fetchUnreadCounts();
    
    const unreadSub = supabase.channel('public:messages:unread')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        if (payload.new.senderEmail !== currentUser?.email) {
          fetchUnreadCounts();
        }
      })
      .subscribe();
      
    return () => { supabase.removeChannel(unreadSub); };
  }, [currentUser]);
  
  useEffect(() => {
    if (onUnreadCountChange && profiles.length > 0) {
      let studentsCount = 0;
      let staffCount = 0;
      let teachersCount = 0;
      
      profiles.forEach(p => {
        const count = unreadCounts[p.email] || 0;
        if (count > 0) {
          if (p.role === 'student') studentsCount += count;
          if (p.role === 'teacher' || p.role === 'admin') staffCount += count;
          if (p.role === 'teacher') teachersCount += count;
        }
      });
      
      const total = Object.values(unreadCounts).reduce((a, b) => a + b, 0);
      
      onUnreadCountChange({
        total,
        students: studentsCount,
        staff: staffCount,
        teachers: teachersCount,
        direct: total, // direct shows all chats
        chat: total // admin chat shows all chats
      });
    }
  }, [unreadCounts, profiles, onUnreadCountChange]);

  // Filter profiles based on activeTab and searchQuery
  useEffect(() => {
    if (!profiles || !currentUser) return;
    
    // Filter out the current user
    let filtered = profiles.filter(p => p.email !== currentUser.email);
    
    // Filter by tab
    if (activeTab === 'students') {
      filtered = filtered.filter(p => p.role === 'student');
    } else if (activeTab === 'staff') {
      filtered = filtered.filter(p => p.role === 'teacher' || p.role === 'admin');
    } else if (activeTab === 'teachers') {
      filtered = filtered.filter(p => p.role === 'teacher');
    } else if (activeTab === 'direct' || activeTab === 'chat') {
      // show all profiles except current user (already filtered)
    } else if (activeTab === 'group' || activeTab === 'class') {
      // Not implemented yet - returning empty array for now
      filtered = [];
    }
    
    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.email.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    
    setFilteredProfiles(filtered);
  }, [profiles, activeTab, searchQuery, currentUser]);

  // 2. Fetch or Create Conversation when a user is clicked
  useEffect(() => {
    if (!activeChatUser || !currentUser) return;

    const fetchOrCreateConversation = async () => {
      // Find existing conversation between these two emails
      const { data, error } = await supabase.from('conversations')
        .select('*')
        .or(`and(participant1_email.eq.${currentUser.email},participant2_email.eq.${activeChatUser.email}),and(participant1_email.eq.${activeChatUser.email},participant2_email.eq.${currentUser.email})`)
        .single();
        
      if (data) {
        setCurrentConversation(data);
      } else if (error?.code === 'PGRST116') {
        // No conversation found, create one
        const { data: newConv, error: createErr } = await supabase.from('conversations')
          .insert({
            participant1_email: currentUser.email,
            participant2_email: activeChatUser.email,
          })
          .select()
          .single();
          
        if (newConv) setCurrentConversation(newConv);
        if (createErr) console.error("Error creating conv:", createErr);
      }
    };
    
    fetchOrCreateConversation();
  }, [activeChatUser, currentUser]);

  // 3. Fetch Messages for Current Conversation
  const fetchMessages = async () => {
    if (!currentConversation) return;
    const { data } = await supabase.from('messages')
      .select('*')
      .eq('conversationId', currentConversation.id)
      .order('createdAt', { ascending: true });
    
    if (data) {
      setMessages(data);
      setTimeout(scrollToBottom, 100);
    }
  };

  useEffect(() => {
    fetchMessages();
    
    if (!currentConversation) return;
    
    const messagesSub = supabase.channel(`public:messages:${currentConversation.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversationId=eq.${currentConversation.id}` }, (payload) => {
        setMessages(prev => [...prev, payload.new]);
        setTimeout(scrollToBottom, 100);
        
        // If we receive a message from the other person while chat is open, mark it read
        if (payload.new.senderEmail === activeChatUser?.email) {
          supabase.from('messages')
            .update({ is_read: true })
            .eq('id', payload.new.id)
            .then(() => fetchUnreadCounts());
        }
      })
      .subscribe();
      
    return () => { supabase.removeChannel(messagesSub); };
  }, [currentConversation]);

  // Mark conversation as read when opened
  useEffect(() => {
    if (!currentConversation || !activeChatUser || !currentUser) return;
    
    const markAsRead = async () => {
      await supabase.from('messages')
        .update({ is_read: true })
        .eq('conversationId', currentConversation.id)
        .eq('senderEmail', activeChatUser.email)
        .eq('is_read', false);
        
      setUnreadCounts(prev => ({ ...prev, [activeChatUser.email]: 0 }));
    };
    
    markAsRead();
  }, [currentConversation, activeChatUser, currentUser]);

  // 4. Send Message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentConversation || !currentUser) return;
    
    const msgText = newMessage;
    setNewMessage(""); // optimistic clear
    
    await supabase.from('messages').insert({
      conversationId: currentConversation.id,
      senderEmail: currentUser.email,
      senderName: currentUser.name,
      text: msgText
    });
    
    await supabase.from('conversations').update({ 
      lastMessage: msgText, 
      updatedAt: new Date() 
    }).eq('id', currentConversation.id);
  };
  
  // 5. Manage Users (Add/Remove)
  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!manageEmail || !manageName) return;
    
    const { error } = await supabase.from('profiles').insert({
      email: manageEmail.toLowerCase(),
      name: manageName,
      role: manageRole
    });
    
    if (error) {
      alert("Error adding user: " + error.message);
    } else {
      setManageEmail("");
      setManageName("");
      setShowManageModal(false);
      alert("User added! They will appear in the chat list and automatically link on their first login.");
    }
  };
  
  const handleRemoveUser = async (email) => {
    if (window.confirm(`Are you sure you want to remove ${email}? They will no longer appear in chat.`)) {
      await supabase.from('profiles').delete().eq('email', email);
    }
  };

  return (
    <div className="chat-interface-container">
      {/* Left Pane: Users List */}
      <div className={`chat-sidebar ${activeChatUser ? 'hidden-mobile' : ''}`}>
        
        {/* Search & Actions */}
        <div className="chat-sidebar-header">
          <div className="chat-search-wrapper">
            <Search size={16} className="chat-search-icon" />
            <input 
              type="text" 
              placeholder="Search contacts..." 
              className="chat-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {isManager && (
            <button className="chat-action-btn" onClick={() => setShowManageModal(true)} title="Add User">
              <UserPlus size={18} />
            </button>
          )}
        </div>
        
        {/* Contacts List */}
        <div className="chat-contacts-list">
          {filteredProfiles.length > 0 ? filteredProfiles.map(profile => (
            <div 
              key={profile.id} 
              className={`chat-contact-item ${activeChatUser?.id === profile.id ? 'active' : ''}`}
              onClick={() => setActiveChatUser(profile)}
            >
              <div className="chat-contact-avatar">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt={profile.name} />
                ) : (
                  <div className="avatar-placeholder">{profile.name.charAt(0).toUpperCase()}</div>
                )}
              </div>
              <div className="chat-contact-info">
                <div className="chat-contact-name-row">
                  <span className="chat-contact-name">{profile.name}</span>
                  {unreadCounts[profile.email] > 0 && (
                    <span className="unread-badge">{unreadCounts[profile.email]}</span>
                  )}
                  <span className="chat-contact-role">{profile.role}</span>
                </div>
                <span className="chat-contact-email">{profile.email}</span>
              </div>
              {isManager && (
                <button 
                  className="chat-remove-btn" 
                  onClick={(e) => { e.stopPropagation(); handleRemoveUser(profile.email); }}
                  title="Remove User"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          )) : (
            <div className="chat-empty-state">
              No users found. {isManager ? "Click the + button to add someone!" : ""}
            </div>
          )}
        </div>
      </div>
      
      {/* Right Pane: Chat Area */}
      <div className={`chat-main-area ${!activeChatUser ? 'hidden-mobile' : ''}`}>
        {activeChatUser ? (
          <>
            {/* Chat Header */}
            <div className="chat-main-header">
              <button className="chat-back-btn" onClick={() => setActiveChatUser(null)}>
                <ArrowLeft size={20} />
              </button>
              <div className="chat-header-avatar">
                {activeChatUser.avatar_url ? (
                  <img src={activeChatUser.avatar_url} alt={activeChatUser.name} />
                ) : (
                  <div className="avatar-placeholder">{activeChatUser.name.charAt(0).toUpperCase()}</div>
                )}
              </div>
              <div className="chat-header-info">
                <h4>{activeChatUser.name}</h4>
                <span>{activeChatUser.email}</span>
              </div>
              <div className="chat-header-actions">
                <MoreVertical size={20} />
              </div>
            </div>
            
            {/* Messages Area */}
            <div className="chat-messages-area">
              {messages.length === 0 ? (
                <div className="chat-messages-empty">
                  Say hi to {activeChatUser.name}!
                </div>
              ) : (
                messages.map((msg, idx) => {
                  const isMe = msg.senderEmail === currentUser.email;
                  // Simple check for date grouping could go here
                  return (
                    <div key={msg.id || idx} className={`chat-bubble-wrapper ${isMe ? 'is-me' : 'is-them'}`}>
                      <div className="chat-bubble">
                        <div className="chat-bubble-text">{msg.text}</div>
                        <div className="chat-bubble-time">
                          {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '...'}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input Area */}
            <form className="chat-input-area" onSubmit={handleSendMessage}>
              <input 
                type="text" 
                placeholder="Type a message..." 
                className="chat-input"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button type="submit" className="chat-send-btn" disabled={!newMessage.trim()}>
                <Send size={18} />
              </button>
            </form>
          </>
        ) : (
          <div className="chat-placeholder-area">
            <div className="chat-placeholder-content">
              <div className="chat-placeholder-icon">💬</div>
              <h3>Select a conversation</h3>
              <p>Choose a contact from the left menu to start messaging.</p>
            </div>
          </div>
        )}
      </div>

      {/* Manage Users Modal */}
      {showManageModal && (
        <div className="chat-modal-overlay">
          <div className="chat-modal">
            <h3>Add New User</h3>
            <p>Add a user to the directory so they appear in the chat list. They will automatically sync on their first login.</p>
            <form onSubmit={handleAddUser}>
              <input 
                type="text" 
                placeholder="Full Name" 
                required 
                value={manageName}
                onChange={(e) => setManageName(e.target.value)}
              />
              <input 
                type="email" 
                placeholder="Email Address" 
                required 
                value={manageEmail}
                onChange={(e) => setManageEmail(e.target.value)}
              />
              <select value={manageRole} onChange={(e) => setManageRole(e.target.value)}>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
              <div className="chat-modal-actions">
                <button type="button" className="btn-ghost" onClick={() => setShowManageModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Add User</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
