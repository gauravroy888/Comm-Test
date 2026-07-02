import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://qmyrxvtbzlbnvzxypnus.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFteXJ4dnRiemxibnZ6eHlwbnVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4MjA4OTcsImV4cCI6MjA5NTM5Njg5N30.ABvW_oBzXC2Ffxm5ToLh6t4WmdKPdtg9SyfeAE76iJo';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Listen for auth state changes (e.g. after OAuth redirect)
supabase.auth.onAuthStateChange((event, session) => {
    if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session) {
        const user = session.user;
        const edtechUser = {
            uid: user.id,
            email: user.email,
            name: user.user_metadata?.full_name || user.email?.split('@')[0] || "User"
        };
        localStorage.setItem('edtech_user', JSON.stringify(edtechUser));
        
        // Handle redirect based on whether we are running locally or on GitHub Pages
        const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const basePath = isLocal ? '' : '/Comm-Test';
        
        // Determine user role based on email
        let targetPortal = '/student/'; // Default fallback
        const userEmail = user.email?.toLowerCase() || '';
        
        if (userEmail === 'immersionlabsindia@gmail.com') {
            targetPortal = '/admin/';
        } else if (userEmail === 'gauravroy476@gmail.com') {
            targetPortal = '/teacher/';
        } else if (userEmail === 'thorroy888@gmail.com' || userEmail === 'sauravroy469@gmail.com') {
            targetPortal = '/student/';
        }

        if (window.location.pathname.includes('login.html') || window.location.pathname === '/' || window.location.pathname.endsWith('B2B-landing-page-main/')) {
            window.location.href = window.location.origin + basePath + targetPortal;
        }
    }
});

export const signInWithGoogle = async () => {
    // Construct the exact redirect URL to ensure Supabase accepts it
    const redirectUrl = window.location.origin + window.location.pathname;
    
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: redirectUrl
        }
    });
    
    if (error) {
        console.error("Error signing in with Google:", error.message);
        alert("Login failed: " + error.message);
    }
};
