import React, { useState, useEffect, useRef } from 'react';
import { Search, Send, ArrowLeft, UserPlus, Trash2, MoreVertical, Users } from 'lucide-react';
import { supabase } from '../supabase';
import './ChatInterface.css';

export default function ChatInterface({ currentUser, activeTab, selectedClass, isManager, onUnreadCountChange }) {
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [groups, setGroups] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [activeContact, setActiveContact] = useState(null); // { isGroup, id, name, email, participants }
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [unreadCounts, setUnreadCounts] = useState({});
  
  const [showManageModal, setShowManageModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [manageEmail, setManageEmail] = useState("");
  const [manageName, setManageName] = useState("");
  const [manageRole, setManageRole] = useState("student");
  
  const [newGroupName, setNewGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 1. Fetch Profiles & Groups
  const fetchProfiles = async () => {
    const { data, error } = await supabase.from('profiles').select('id,name,email,role,avatar_url').order('name');
    if (data) setProfiles(data);
  };
  
  const fetchGroups = async () => {
    if (!currentUser) return;
    const { data } = await supabase.from('conversations')
      .select('*')
      .eq('type', 'group')
      .contains('participants', [currentUser.email]);
    if (data) setGroups(data);
  };

  useEffect(() => {
    fetchProfiles();
    fetchGroups();
    
    const profilesSub = supabase.channel('public:profiles')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, fetchProfiles)
      .subscribe();
      
    const groupsSub = supabase.channel('public:conversations:groups')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations', filter: "type=eq.group" }, fetchGroups)
      .subscribe();
      
    return () => { 
      supabase.removeChannel(profilesSub); 
      supabase.removeChannel(groupsSub);
    };
  }, [currentUser]);

  // Fetch unread messages
  const fetchUnreadCounts = async () => {
    if (!currentUser) return;
    
    const { data: myConvs } = await supabase.from('conversations')
      .select('id')
      .or(`participant1_email.eq.${currentUser.email},participant2_email.eq.${currentUser.email},participants.cs.["${currentUser.email}"]`);
      
    if (!myConvs || myConvs.length === 0) return;
    const convIds = myConvs.map(c => c.id);
    
    const { data: unreadMsgs } = await supabase.from('messages')
      .select('senderEmail, conversationId')
      .in('conversationId', convIds)
      .eq('is_read', false)
      .neq('senderEmail', currentUser.email);
      
    if (unreadMsgs) {
      const counts = {};
      unreadMsgs.forEach(msg => {
        // Find if this is a group msg
        const grp = groups.find(g => g.id === msg.conversationId);
        const key = grp ? grp.id : msg.senderEmail;
        counts[key] = (counts[key] || 0) + 1;
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
  }, [currentUser, groups]);
  
  useEffect(() => {
    if (onUnreadCountChange && profiles.length > 0) {
      let studentsCount = 0;
      let staffCount = 0;
      let teachersCount = 0;
      let groupsCount = 0;
      
      profiles.forEach(p => {
        const count = unreadCounts[p.email] || 0;
        if (count > 0) {
          if (p.role === 'student') studentsCount += count;
          if (p.role === 'teacher' || p.role === 'admin') staffCount += count;
          if (p.role === 'teacher') teachersCount += count;
        }
      });
      
      groups.forEach(g => {
        groupsCount += (unreadCounts[g.id] || 0);
      });
      
      const total = Object.values(unreadCounts).reduce((a, b) => a + b, 0);
      
      onUnreadCountChange({
        total,
        students: studentsCount,
        staff: staffCount,
        teachers: teachersCount,
        groups: groupsCount,
        direct: total, 
        chat: total 
      });
    }
  }, [unreadCounts, profiles, groups, onUnreadCountChange]);

  // Filter contacts based on activeTab
  useEffect(() => {
    if (!profiles || !currentUser) return;
    
    let filtered = [];
    
    if (activeTab === 'group') {
      filtered = groups.map(g => ({ ...g, isGroup: true }));
    } else {
      filtered = profiles.filter(p => p.email !== currentUser.email);
      if (activeTab === 'students') {
        filtered = filtered.filter(p => p.role === 'student');
      } else if (activeTab === 'staff') {
        filtered = filtered.filter(p => p.role === 'teacher' || p.role === 'admin');
      } else if (activeTab === 'teachers') {
        filtered = filtered.filter(p => p.role === 'teacher');
      } else if (activeTab === 'groups') {
        filtered = groups.map(g => ({ ...g, isGroup: true }));
      } else if (activeTab === 'class_view' || activeTab === 'classes') {
        // Teacher portal: show both students and groups
        let classStudents = [];
        
        // Mock specific students for Class 6th if they aren't already in the DB
        if (selectedClass === 'Class 6th') {
          classStudents = filtered.filter(p => p.role === 'student');
          
          const class6thStudents = [
            { id: 'mock-1', name: 'Thor Roy', email: 'thorroy888@gmail.com', role: 'student', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=thor' },
            { id: 'mock-2', name: 'Saurav Roy', email: 'sauravroy469@gmail.com', role: 'student', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=saurav' },
            { id: 'mock-3', name: 'APS Rathore', email: 'apsrathore47@gmail.com', role: 'student', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=aps' },
            { id: 'mock-4', name: 'Aman Sharma', email: 'aman@edtech.edu', role: 'student', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aman' },
            { id: 'mock-5', name: 'Priya Patel', email: 'priya@edtech.edu', role: 'student', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya' },
            { id: 'mock-6', name: 'Rahul Singh', email: 'rahul@edtech.edu', role: 'student', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul' },
            { id: 'mock-7', name: 'Neha Gupta', email: 'neha@edtech.edu', role: 'student', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Neha' },
            { id: 'mock-8', name: 'Karan Malhotra', email: 'karan@edtech.edu', role: 'student', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Karan' }
          ];
          
          // Merge mock students ensuring no duplicates by email
          class6thStudents.forEach(ms => {
            if (!classStudents.some(cs => cs.email === ms.email)) {
              classStudents.push(ms);
            }
          });
        }
        
        const classGroups = groups
          .filter(g => !selectedClass || g.class_name === selectedClass)
          .map(g => ({ ...g, isGroup: true }));
        filtered = [...classGroups, ...classStudents];
      }
    }
    
    if (searchQuery) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || (p.email && p.email.toLowerCase().includes(searchQuery.toLowerCase())));
    }
    
    setFilteredProfiles(filtered);
  }, [profiles, groups, activeTab, searchQuery, currentUser]);

  // 2. Fetch or Create Conversation
  useEffect(() => {
    if (!activeContact || !currentUser) return;

    const fetchOrCreateConversation = async () => {
      if (activeContact.isGroup) {
        // It's a group, the conversation ID is the group ID
        const { data } = await supabase.from('conversations').select('*').eq('id', activeContact.id).single();
        if (data) setCurrentConversation(data);
      } else {
        // It's a 1-on-1 user chat
        const { data, error } = await supabase.from('conversations')
          .select('*')
          .or(`and(participant1_email.eq.${currentUser.email},participant2_email.eq.${activeContact.email}),and(participant1_email.eq.${activeContact.email},participant2_email.eq.${currentUser.email})`)
          .single();
          
        if (data) {
          setCurrentConversation(data);
        } else if (error?.code === 'PGRST116') {
          const { data: newConv, error: createErr } = await supabase.from('conversations')
            .insert({ participant1_email: currentUser.email, participant2_email: activeContact.email })
            .select().single();
          if (newConv) setCurrentConversation(newConv);
        }
      }
    };
    fetchOrCreateConversation();
  }, [activeContact, currentUser]);

  // 3. Fetch Messages
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
        setMessages(prev => {
          if (prev.some(m => m.id === payload.new.id)) return prev;
          return [...prev, payload.new];
        });
        setTimeout(scrollToBottom, 100);
        
        // Mark read if chat is open
        if (payload.new.senderEmail !== currentUser?.email) {
          supabase.from('messages').update({ is_read: true }).eq('id', payload.new.id).then(() => fetchUnreadCounts());
        }
      })
      .subscribe();
      
    return () => { supabase.removeChannel(messagesSub); };
  }, [currentConversation]);

  // Mark conversation as read when opened
  useEffect(() => {
    if (!currentConversation || !activeContact || !currentUser) return;
    const markAsRead = async () => {
      await supabase.from('messages')
        .update({ is_read: true })
        .eq('conversationId', currentConversation.id)
        .neq('senderEmail', currentUser.email)
        .eq('is_read', false);
        
      setUnreadCounts(prev => ({ ...prev, [activeContact.isGroup ? activeContact.id : activeContact.email]: 0 }));
    };
    markAsRead();
  }, [currentConversation, activeContact, currentUser]);

  // 4. Send Message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentConversation || !currentUser) return;
    
    const msgText = newMessage;
    setNewMessage('');
    
    try {
      const { data: insertedMsg, error: msgError } = await supabase.from('messages').insert({
        conversationId: currentConversation.id,
        senderEmail: currentUser.email,
        senderName: currentUser.name,
        text: msgText
      }).select().single();
      
      if (msgError) throw msgError;

      setMessages(prev => {
        if (prev.some(m => m.id === insertedMsg.id)) return prev;
        return [...prev, insertedMsg];
      });
      setTimeout(scrollToBottom, 100);

      await supabase.from('conversations').update({ lastMessage: msgText, updatedAt: new Date() }).eq('id', currentConversation.id);
    } catch (err) {
      setNewMessage(msgText);
      alert('Message failed to send.');
    }
  };

  // 5. Create Group
  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!newGroupName.trim() || selectedMembers.length === 0) {
      alert("Please enter a group name and select at least one student.");
      return;
    }
    
    const participants = [currentUser.email, ...selectedMembers];
    
    const { error } = await supabase.from('conversations').insert({
      name: newGroupName,
      type: 'group',
      participants: participants,
      class_name: selectedClass || null,
      lastMessage: 'Group created'
    });
    
    if (error) {
      alert("Error creating group: " + error.message);
    } else {
      setNewGroupName("");
      setSelectedMembers([]);
      setShowGroupModal(false);
      alert("Group created successfully!");
    }
  };

  const toggleMemberSelection = (email) => {
    setSelectedMembers(prev => prev.includes(email) ? prev.filter(e => e !== email) : [...prev, email]);
  };
  
  return (
    <div className="chat-interface-container">
      {/* Left Pane */}
      <div className={`chat-sidebar ${activeContact ? 'hidden-mobile' : ''}`}>
        <div className="chat-sidebar-header">
          <div className="chat-search-wrapper">
            <Search size={16} className="chat-search-icon" />
            <input type="text" placeholder="Search contacts..." className="chat-search-input" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          {isManager && (activeTab === 'class_view' || activeTab === 'classes') && (
            <button className="chat-action-btn" onClick={() => setShowGroupModal(true)} title="Create Group">
              <Users size={18} />
            </button>
          )}
        </div>
        
        <div className="chat-contacts-list">
          {filteredProfiles.length > 0 ? filteredProfiles.map(contact => {
            const key = contact.isGroup ? contact.id : contact.email;
            const unread = unreadCounts[key] || 0;
            const contactNameStr = contact.name || contact.group_name || 'Group';
            const hasColor = contact.isGroup && contactNameStr.includes('|');
            const bgColor = hasColor ? contactNameStr.split('|')[0] : 'var(--accent-purple)';
            const displayName = hasColor ? contactNameStr.split('|')[1] : contactNameStr;
            return (
              <div key={contact.id} className={`chat-contact-item ${activeContact?.id === contact.id ? 'active' : ''}`} onClick={() => setActiveContact(contact)}>
                <div className="chat-contact-avatar">
                  {contact.isGroup ? (
                    <div className="avatar-placeholder" style={{ background: bgColor }}><Users size={20} /></div>
                  ) : contact.avatar_url ? (
                    <img src={contact.avatar_url} alt={displayName} />
                  ) : (
                    <div className="avatar-placeholder">{displayName.charAt(0).toUpperCase()}</div>
                  )}
                </div>
                <div className="chat-contact-info">
                  <div className="chat-contact-name-row">
                    <span className="chat-contact-name">{displayName}</span>
                    {unread > 0 && <span className="unread-badge">{unread}</span>}
                    {contact.isGroup && <span className="chat-contact-role">Group</span>}
                    {!contact.isGroup && <span className="chat-contact-role">{contact.role}</span>}
                  </div>
                  {!contact.isGroup && <span className="chat-contact-email">{contact.email}</span>}
                  {contact.isGroup && <span className="chat-contact-email">{contact.participants?.length || 0} members</span>}
                </div>
              </div>
            );
          }) : (
            <div className="chat-empty-state">No contacts found.</div>
          )}
        </div>
      </div>
      
      {/* Right Pane */}
      <div className={`chat-main-area ${!activeContact ? 'hidden-mobile' : ''}`}>
        {activeContact ? (
          <>
            <div className="chat-main-header">
              <button className="chat-back-btn" onClick={() => setActiveContact(null)}><ArrowLeft size={20} /></button>
              <div className="chat-header-avatar">
                {activeContact.isGroup ? (
                   <div className="avatar-placeholder" style={{ background: 'var(--accent-purple)' }}><Users size={20} /></div>
                ) : activeContact.avatar_url ? (
                  <img src={activeContact.avatar_url} alt={activeContact.name} />
                ) : (
                  <div className="avatar-placeholder">{activeContact.name.charAt(0).toUpperCase()}</div>
                )}
              </div>
              <div className="chat-header-info">
                <h4>{activeContact.name}</h4>
                <span>{activeContact.isGroup ? `Group Chat (${activeContact.participants?.length || 0} members)` : activeContact.email}</span>
              </div>
              <div className="chat-header-actions"><MoreVertical size={20} /></div>
            </div>
            
            <div className="chat-messages-area">
              {messages.length === 0 ? (
                <div className="chat-messages-empty">Say hi to {activeContact.name}!</div>
              ) : (
                messages.map((msg, idx) => {
                  const isMe = msg.senderEmail === currentUser.email;
                  return (
                    <div key={msg.id || idx} className={`chat-bubble-wrapper ${isMe ? 'is-me' : 'is-them'}`}>
                      {activeContact.isGroup && !isMe && (
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px', marginLeft: '4px' }}>
                          {msg.senderName}
                        </div>
                      )}
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
            
            <form className="chat-input-area" onSubmit={handleSendMessage}>
              <input type="text" placeholder="Type a message..." className="chat-input" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
              <button type="submit" className="chat-send-btn" disabled={!newMessage.trim()}><Send size={18} /></button>
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

      {/* Group Creation Modal */}
      {showGroupModal && (
        <div className="chat-modal-overlay">
          <div className="chat-modal" style={{ maxWidth: '500px' }}>
            <h3>Create a New Group</h3>
            <p>Select students to assign to this group activity.</p>
            <form onSubmit={handleCreateGroup}>
              <input type="text" placeholder="Group Name (e.g., Team Alpha)" required value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} />
              
              <div style={{ maxHeight: '200px', overflowY: 'auto', background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '10px', margin: '15px 0' }}>
                {profiles.filter(p => p.role === 'student').map(student => (
                  <label key={student.email} style={{ display: 'flex', alignItems: 'center', padding: '8px', cursor: 'pointer', gap: '10px' }}>
                    <input 
                      type="checkbox" 
                      checked={selectedMembers.includes(student.email)}
                      onChange={() => toggleMemberSelection(student.email)}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ color: '#fff' }}>{student.name}</span>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{student.email}</span>
                    </div>
                  </label>
                ))}
              </div>
              
              <div className="chat-modal-actions">
                <button type="button" className="btn-ghost" onClick={() => setShowGroupModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Create Group</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
