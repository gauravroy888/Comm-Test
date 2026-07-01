document.addEventListener('DOMContentLoaded', () => {
    
    // Interactive Dot Background Mouse Tracking
    document.addEventListener('mousemove', (e) => {
        document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
        document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    });

    // Navbar scroll effect
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.style.background = 'rgba(3, 7, 18, 0.9)';
            nav.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.5)';
        } else {
            nav.style.background = 'var(--surface-color)';
            nav.style.boxShadow = 'none';
        }
    });

    // Glass Card Hover 3D effect (Optional micro-animation)
    const cards = document.querySelectorAll('.glass-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;
            let baseTransform = card.classList.contains('discovery-widget') 
                ? 'translateY(-50%) scale(1.02)' 
                : 'translateY(-8px)';
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) ${baseTransform}`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // B2B Form Submission simulation
    const b2bForm = document.getElementById('b2bForm');
    if (b2bForm) {
        b2bForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = b2bForm.querySelector('button[type="submit"]');
            const originalText = btn.innerText;
            
            btn.innerText = 'Sending...';
            btn.disabled = true;
            btn.style.opacity = '0.7';
            
            setTimeout(() => {
                btn.innerText = 'Demo Requested!';
                btn.style.background = 'linear-gradient(90deg, #10b981, #34d399)';
                b2bForm.reset();
                
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.disabled = false;
                    btn.style.opacity = '1';
                    btn.style.background = '';
                }, 3000);
            }, 1500);
        });
        });
    }

    // Pricing Calculator Logic
    const studentCount = document.getElementById('studentCount');
    const teacherCount = document.getElementById('teacherCount');
    const studentVal = document.getElementById('studentVal');
    const teacherVal = document.getElementById('teacherVal');
    const calcFeatures = document.querySelectorAll('.calc-feature');
    const totalPriceEl = document.getElementById('totalPrice');

    function calculatePrice() {
        if (!studentCount || !teacherCount || !totalPriceEl) return;
        
        let students = parseInt(studentCount.value);
        let teachers = parseInt(teacherCount.value);
        
        studentVal.innerText = students;
        teacherVal.innerText = teachers;
        
        // Base Setup Fee
        let total = 500;
        
        // Per student / teacher cost
        total += students * 12; // $12 per student per year
        total += teachers * 50; // $50 per teacher per year
        
        // Add-ons
        calcFeatures.forEach(feature => {
            if (feature.checked) {
                total += parseInt(feature.value);
            }
        });
        
        // Animate counter effect (simple update for now)
        totalPriceEl.innerText = total.toLocaleString();
    }

    if (studentCount && teacherCount) {
        studentCount.addEventListener('input', calculatePrice);
        teacherCount.addEventListener('input', calculatePrice);
        calcFeatures.forEach(feature => {
            feature.addEventListener('change', calculatePrice);
        });
        
        // Initial calculation
        calculatePrice();
    }
});
