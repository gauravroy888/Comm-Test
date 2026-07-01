import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://qmyrxvtbzlbnvzxypnus.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFteXJ4dnRiemxibnZ6eHlwbnVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4MjA4OTcsImV4cCI6MjA5NTM5Njg5N30.ABvW_oBzXC2Ffxm5ToLh6t4WmdKPdtg9SyfeAE76iJo';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Listen for auth state changes (e.g. after OAuth redirect)
supabase.auth.onAuthStateChange(async (event, session) => {
    if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session) {
        const user = session.user;
        const userEmail = user.email?.toLowerCase() || '';

        // Query the users table to get the REAL role from the database
        let role = 'student'; // Default
        try {
            const { data: userData } = await supabase
                .from('users')
                .select('role, full_name')
                .eq('email', userEmail)
                .single();
            if (userData) {
                role = userData.role;
            }
        } catch (err) {
            // User not found in users table — default to student
        }

        // Auto-sync profile on first login (upsert so no duplicates)
        try {
            await supabase.from('profiles').upsert({
                email: userEmail,
                name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
                role: role,
                auth_id: user.id,
                avatar_url: user.user_metadata?.avatar_url || null
            }, { onConflict: 'email', ignoreDuplicates: false });
        } catch (err) {
            // Profile sync failed silently — chat will still work
        }

        const edtechUser = {
            uid: user.id,
            email: userEmail,
            name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
            role: role
        };
        localStorage.setItem('edtech_user', JSON.stringify(edtechUser));

        // Determine target portal based on DB role
        const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const basePath = isLocal ? '' : '/Comm-Test';

        let targetPortal = '/student/';
        if (role === 'admin') targetPortal = '/admin/';
        else if (role === 'teacher') targetPortal = '/teacher/';

        const isOnLoginPage = window.location.pathname.includes('login.html') ||
            window.location.pathname === '/' ||
            window.location.pathname.endsWith('/Comm-Test/') ||
            window.location.pathname.endsWith('Landing Page/');

        if (isOnLoginPage) {
            window.location.href = window.location.origin + basePath + targetPortal;
        }
    }
});

export const signInWithGoogle = async () => {
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const basePath = isLocal ? '' : '/Comm-Test';
    const redirectUrl = window.location.origin + basePath + '/Landing Page/login.html';

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: redirectUrl
        }
    });

    if (error) {
        console.error('Error signing in with Google:', error.message);
        alert('Login failed: ' + error.message);
    }
};
