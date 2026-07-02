import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

export function useUnreadMessages() {
  const [totalUnread, setTotalUnread] = useState(0);

  useEffect(() => {
    let subscription;
    let currentUser = null;
    
    try {
      const userStr = localStorage.getItem('edtech_user');
      if (userStr) currentUser = JSON.parse(userStr);
    } catch (e) {
      console.error(e);
    }

    if (!currentUser || !currentUser.email) return;

    const fetchUnreadCount = async () => {
      try {
        // 1. Get all conversations for this user
        const { data: convData, error: convError } = await supabase
          .from('conversations')
          .select('id')
          .or(`participant1_email.eq.${currentUser.email},participant2_email.eq.${currentUser.email}`);
          
        if (convError || !convData || convData.length === 0) return;
        
        const convIds = convData.map(c => c.id);
        
        // 2. Get all unread messages sent by OTHERS in these conversations
        const { data: unreadMsgs, error: msgError } = await supabase
          .from('messages')
          .select('senderEmail')
          .in('conversationId', convIds)
          .eq('is_read', false);
          
        if (!msgError && unreadMsgs) {
          const count = unreadMsgs.filter(m => m.senderEmail !== currentUser.email).length;
          setTotalUnread(count);
        }
      } catch (err) {
        console.error("Error fetching unread count:", err);
      }
    };

    fetchUnreadCount();

    // 3. Listen for changes in messages
    subscription = supabase.channel('global_unread_messages')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, fetchUnreadCount)
      .subscribe();

    return () => {
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }, []);

  return totalUnread;
}
