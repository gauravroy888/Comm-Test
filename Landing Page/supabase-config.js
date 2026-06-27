import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://qmyrxvtbzlbnvzxypnus.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFteXJ4dnRiemxibnZ6eHlwbnVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4MjA4OTcsImV4cCI6MjA5NTM5Njg5N30.ABvW_oBzXC2Ffxm5ToLh6t4WmdKPdtg9SyfeAE76iJo';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Listen for auth state changes (e.g. after OAuth redirect)
supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT') {
        localStorage.removeItem('blockRedirect');
        localStorage.removeItem('edtech_user');
        return;
    }

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
        let actualRole = 'student'; // Default fallback
        const userEmail = user.email?.toLowerCase() || '';
        
        if (userEmail === 'immersionlabsindia@gmail.com' || userEmail === 'rathorehps@gmail.com') {
            actualRole = 'admin';
        } else if (userEmail === 'gauravroy476@gmail.com' || userEmail === 'hps.sunghrathore@gmail.com') {
            actualRole = 'teacher';
        } else if (userEmail === 'thorroy888@gmail.com' || userEmail === 'sauravroy469@gmail.com' || userEmail === 'apsrathore47@gmail.com') {
            actualRole = 'student';
        }

        const selectedPortal = localStorage.getItem('selectedPortal') || 'student';
        const isLoggingIn = localStorage.getItem('isLoggingIn');

        if (window.location.pathname.includes('login.html') || window.location.pathname === '/' || window.location.pathname.endsWith('B2B-landing-page-main/')) {
            if (isLoggingIn === 'true') {
                if (actualRole !== selectedPortal) {
                    localStorage.removeItem('isLoggingIn');
                    localStorage.setItem('blockRedirect', 'true');
                    alert("Not registered to this portal. You selected " + selectedPortal + " but your email belongs to the " + actualRole + " portal.");
                    supabase.auth.signOut();
                    return;
                }
                localStorage.removeItem('isLoggingIn');
            }

            if (localStorage.getItem('blockRedirect') === 'true') {
                return;
            }

            window.location.href = window.location.origin + basePath + '/' + actualRole + '/';
        }
    }
});

export const signInWithGoogle = async () => {
    // Set flag so the callback knows this is a manual login attempt
    localStorage.setItem('isLoggingIn', 'true');

    // Construct the exact redirect URL to ensure Supabase accepts it
    const redirectUrl = window.location.origin + window.location.pathname;
    
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: redirectUrl,
            queryParams: {
                prompt: 'select_account'
            }
        }
    });
    
    if (error) {
        localStorage.removeItem('isLoggingIn');
        console.error("Error signing in with Google:", error.message);
        alert("Login failed: " + error.message);
    }
};
