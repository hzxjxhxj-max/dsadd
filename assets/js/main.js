/* ==========================================================================
   FART UA — SUMMER EDITION JAVASCRIPT & PROTECTION / LOGGING SYSTEM
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initSiteProtection();
    initThemePreferences();
    initNavbar();
    initMobileMenu();
    initScrollReveal();
    initSummerParticles();
    initServerStatus();
    initLightbox();
    initAccordions();
    initCabinetTabs();
    initThemeCustomizer();
    initSoundEffects();
});

/* Send Security Violation Event to Server Logger API */
function reportSecurityViolation(eventType, details) {
    try {
        fetch('api/log-event.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                event_type: eventType,
                details: details,
                url: window.location.href
            })
        }).catch(err => {});
    } catch(e) {}
}

/* Anti-F12, Anti-DevTools & Anti-Copy Protection System */
function initSiteProtection() {
    // 1. Disable Context Menu (Right Click)
    document.addEventListener('contextmenu', (e) => {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
            showToast('Контекстне меню та копіювання заборонено!');
            reportSecurityViolation('RIGHT_CLICK', 'Спроба відкриття контекстного меню (правій клік миші)');
            return false;
        }
    });

    // 2. Disable Image & Text Dragging
    document.addEventListener('dragstart', (e) => {
        e.preventDefault();
        reportSecurityViolation('IMAGE_DRAG', 'Спроба перетягування зображення/тексту');
        return false;
    });

    // 3. Disable Text Selection & Copy Shortcuts
    document.addEventListener('copy', (e) => {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
            showToast('Копіювати контент сайту FART UA заборонено!');
            reportSecurityViolation('TEXT_COPY', 'Спроба скопіювати текст сторінки');
            return false;
        }
    });

    document.addEventListener('cut', (e) => {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
            reportSecurityViolation('TEXT_CUT', 'Спроба вирізати текст сторінки');
            return false;
        }
    });

    // 4. Block F12, DevTools & Source View Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
        const isInput = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA';

        // Block F12
        if (e.key === 'F12' || e.keyCode === 123) {
            e.preventDefault();
            e.stopPropagation();
            showToast('Клавішу F12 та розробницьке меню заблоковано!');
            reportSecurityViolation('F12_PRESS', 'Натиснуто клавішу F12 для розробницького меню');
            return false;
        }

        // Block Ctrl+Shift+I (DevTools), Ctrl+Shift+J (Console), Ctrl+Shift+C (Inspect)
        if (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67 || e.key === 'I' || e.key === 'J' || e.key === 'C')) {
            e.preventDefault();
            e.stopPropagation();
            showToast('Інспектор коду заблоковано!');
            reportSecurityViolation('DEVTOOLS_INSPECT', 'Спроба відкриття інспектора коду (Ctrl+Shift+I/J/C)');
            return false;
        }

        // Block Ctrl+U (View Source)
        if (e.ctrlKey && (e.keyCode === 85 || e.key === 'u' || e.key === 'U')) {
            e.preventDefault();
            e.stopPropagation();
            showToast('Перегляд вихідного коду заблоковано!');
            reportSecurityViolation('VIEW_SOURCE', 'Спроба перегляду вихідного коду (Ctrl+U)');
            return false;
        }

        // Block Ctrl+S (Save Page) & Ctrl+P (Print)
        if (e.ctrlKey && (e.keyCode === 83 || e.keyCode === 80 || e.key === 's' || e.key === 'p')) {
            e.preventDefault();
            e.stopPropagation();
            showToast('Збереження сторінки заборонено!');
            reportSecurityViolation('SAVE_PAGE', 'Спроба збереження/друку сторінки (Ctrl+S / Ctrl+P)');
            return false;
        }

        // Block Ctrl+C and Ctrl+A when outside inputs
        if (!isInput && e.ctrlKey && (e.keyCode === 67 || e.keyCode === 65 || e.key === 'c' || e.key === 'a')) {
            e.preventDefault();
            e.stopPropagation();
            showToast('Виділення та копіювання тексту заблоковано!');
            reportSecurityViolation('TEXT_COPY_SHORTCUT', 'Спроба гарячих клавіш копіювання (Ctrl+C / Ctrl+A)');
            return false;
        }
    });
}

/* Theme Customizer & User Preferences */
function initThemePreferences() {
    const root = document.documentElement;

    const savedFont = localStorage.getItem('fartua_font');
    if (savedFont) {
        applyFontFamily(savedFont);
    }

    const savedColor = localStorage.getItem('fartua_theme_color');
    if (savedColor) {
        applyThemeColor(savedColor);
    }

    const customHex = localStorage.getItem('fartua_custom_color');
    if (customHex) {
        root.style.setProperty('--summer-gold', customHex);
        root.style.setProperty('--summer-sun', customHex);
    }

    const animSpeed = localStorage.getItem('fartua_anim_speed');
    if (animSpeed) {
        root.style.setProperty('--transition-smooth', animSpeed + 's cubic-bezier(0.16, 1, 0.3, 1)');
    }

    if (localStorage.getItem('fartua_compact') === 'enabled') {
        document.body.classList.add('compact-mode');
    }

    const savedParticles = localStorage.getItem('fartua_particles');
    if (savedParticles === 'disabled') {
        const canvas = document.getElementById('particle-canvas');
        if (canvas) canvas.style.display = 'none';
    }
}

function applyFontFamily(fontKey) {
    const root = document.documentElement;
    if (fontKey === 'orbitron') {
        root.style.setProperty('--font-heading', "'Orbitron', 'Rajdhani', sans-serif");
    } else if (fontKey === 'montserrat') {
        root.style.setProperty('--font-heading', "'Montserrat', 'Inter', sans-serif");
    } else if (fontKey === 'oswald') {
        root.style.setProperty('--font-heading', "'Oswald', 'Rajdhani', sans-serif");
    } else if (fontKey === 'exo') {
        root.style.setProperty('--font-heading', "'Exo 2', 'Rajdhani', sans-serif");
    } else {
        root.style.setProperty('--font-heading', "'Rajdhani', 'Montserrat', sans-serif");
    }
}

function applyThemeColor(color) {
    const root = document.documentElement;
    if (color === 'gold') {
        root.style.setProperty('--summer-gold', '#ff9a00');
        root.style.setProperty('--summer-sun', '#ffd000');
    } else if (color === 'cyan') {
        root.style.setProperty('--summer-gold', '#00e5ff');
        root.style.setProperty('--summer-sun', '#0088ff');
    } else if (color === 'emerald') {
        root.style.setProperty('--summer-gold', '#00ff88');
        root.style.setProperty('--summer-sun', '#00cc66');
    } else if (color === 'pink') {
        root.style.setProperty('--summer-gold', '#ff2a74');
        root.style.setProperty('--summer-sun', '#ff70a6');
    } else if (color === 'purple') {
        root.style.setProperty('--summer-gold', '#a855f7');
        root.style.setProperty('--summer-sun', '#c084fc');
    }
}

function initThemeCustomizer() {
    const colorBtns = document.querySelectorAll('.theme-color-btn');
    colorBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const color = btn.getAttribute('data-color');
            applyThemeColor(color);
            localStorage.setItem('fartua_theme_color', color);
            localStorage.removeItem('fartua_custom_color');
            showToast('Акцентний колір успішно оновлено!');
        });
    });

    const colorPicker = document.getElementById('custom-color-picker');
    if (colorPicker) {
        const savedCustom = localStorage.getItem('fartua_custom_color');
        if (savedCustom) colorPicker.value = savedCustom;

        colorPicker.addEventListener('input', (e) => {
            const hex = e.target.value;
            document.documentElement.style.setProperty('--summer-gold', hex);
            document.documentElement.style.setProperty('--summer-sun', hex);
            localStorage.setItem('fartua_custom_color', hex);
        });
    }

    const fontSelect = document.getElementById('select-font-family');
    if (fontSelect) {
        const savedFont = localStorage.getItem('fartua_font') || 'default';
        fontSelect.value = savedFont;

        fontSelect.addEventListener('change', (e) => {
            const selectedFont = e.target.value;
            applyFontFamily(selectedFont);
            localStorage.setItem('fartua_font', selectedFont);
            showToast('Шрифт сайту оновлено!');
        });
    }

    const speedSelect = document.getElementById('select-anim-speed');
    if (speedSelect) {
        const savedSpeed = localStorage.getItem('fartua_anim_speed') || '0.4';
        speedSelect.value = savedSpeed;

        speedSelect.addEventListener('change', (e) => {
            const val = e.target.value;
            document.documentElement.style.setProperty('--transition-smooth', val + 's cubic-bezier(0.16, 1, 0.3, 1)');
            localStorage.setItem('fartua_anim_speed', val);
            showToast('Швидкість анімацій оновлено!');
        });
    }

    const compactToggle = document.getElementById('toggle-compact');
    if (compactToggle) {
        compactToggle.checked = localStorage.getItem('fartua_compact') === 'enabled';
        compactToggle.addEventListener('change', () => {
            if (compactToggle.checked) {
                document.body.classList.add('compact-mode');
                localStorage.setItem('fartua_compact', 'enabled');
            } else {
                document.body.classList.remove('compact-mode');
                localStorage.setItem('fartua_compact', 'disabled');
            }
        });
    }

    const particlesToggle = document.getElementById('toggle-particles');
    if (particlesToggle) {
        particlesToggle.checked = localStorage.getItem('fartua_particles') !== 'disabled';
        particlesToggle.addEventListener('change', () => {
            const canvas = document.getElementById('particle-canvas');
            if (particlesToggle.checked) {
                localStorage.setItem('fartua_particles', 'enabled');
                if (canvas) canvas.style.display = 'block';
            } else {
                localStorage.setItem('fartua_particles', 'disabled');
                if (canvas) canvas.style.display = 'none';
            }
        });
    }

    const animToggle = document.getElementById('toggle-animations');
    if (animToggle) {
        animToggle.checked = localStorage.getItem('fartua_anim') !== 'disabled';
        animToggle.addEventListener('change', () => {
            if (animToggle.checked) {
                localStorage.setItem('fartua_anim', 'enabled');
            } else {
                localStorage.setItem('fartua_anim', 'disabled');
                document.querySelectorAll('.reveal-up, .reveal-fade, .reveal-zoom').forEach(e => e.classList.add('active'));
            }
        });
    }
}

/* Synthesized UI Click Sound Effects */
function initSoundEffects() {
    const soundToggle = document.getElementById('toggle-sound');
    let soundEnabled = localStorage.getItem('fartua_sound') === 'enabled';
    
    if (soundToggle) {
        soundToggle.checked = soundEnabled;
        soundToggle.addEventListener('change', () => {
            soundEnabled = soundToggle.checked;
            localStorage.setItem('fartua_sound', soundEnabled ? 'enabled' : 'disabled');
        });
    }

    let audioCtx = null;
    function playClickSound() {
        if (!soundEnabled) return;
        try {
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (audioCtx.state === 'suspended') audioCtx.resume();
            
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 0.05);
            
            gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
            
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            
            osc.start();
            osc.stop(audioCtx.currentTime + 0.05);
        } catch(e) {}
    }

    document.querySelectorAll('.btn, .nav-link, .cabinet-tab-btn, .theme-color-btn').forEach(btn => {
        btn.addEventListener('click', playClickSound);
    });
}

/* Navbar Scroll Effect */
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

/* Mobile Navigation Toggle */
function initMobileMenu() {
    const toggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (!toggle || !navLinks) return;

    toggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = toggle.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-xmark');
        }
    });
}

/* Scroll-Reveal Animation System (IntersectionObserver) */
function initScrollReveal() {
    if (localStorage.getItem('fartua_anim') === 'disabled') {
        document.querySelectorAll('.reveal-up, .reveal-fade, .reveal-zoom').forEach(el => el.classList.add('active'));
        return;
    }

    const reveals = document.querySelectorAll('.reveal-up, .reveal-fade, .reveal-zoom');
    
    if (!('IntersectionObserver' in window)) {
        reveals.forEach(el => el.classList.add('active'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(el => observer.observe(el));
}

/* Summer Sun Sparks Particle Canvas */
function initSummerParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });
    
    const particles = [];
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const isGold = Math.random() > 0.45;
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 2.4 + 0.8,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5 - 0.3,
            color: isGold ? 'rgba(255, 154, 0, ' : 'rgba(0, 229, 255, ',
            alpha: Math.random() * 0.55 + 0.2
        });
    }
    
    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            
            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color + p.alpha + ')';
            ctx.fill();
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

/* Toast Notifications */
function showToast(message) {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color: var(--neon-green)"></i> ${message}`;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 3000);
}

/* Live Server Status Polling */
function initServerStatus() {
    const onlineEl = document.getElementById('online-count');
    const maxEl = document.getElementById('max-count');
    const pingEl = document.getElementById('ping-count');
    const progressBar = document.getElementById('online-progress');
    
    if (!onlineEl) return;
    
    async function updateStatus() {
        try {
            const res = await fetch('api/server-status.php');
            if (res.ok) {
                const data = await res.json();
                if (onlineEl) onlineEl.textContent = data.players;
                if (maxEl) maxEl.textContent = data.max_players;
                if (pingEl) pingEl.textContent = data.ping + ' ms';
                
                if (progressBar) {
                    const pct = Math.round((data.players / data.max_players) * 100);
                    progressBar.style.width = pct + '%';
                }
            }
        } catch (e) {
            console.log('Status polling active');
        }
    }
    
    updateStatus();
    setInterval(updateStatus, 10000);
}

/* Lightbox Modal */
function initLightbox() {
    const modal = document.getElementById('gallery-modal');
    const modalImg = document.getElementById('modal-img');
    const closeBtn = document.querySelector('.modal-close');
    const galleryItems = document.querySelectorAll('[data-lightbox]');
    
    if (!modal || !modalImg) return;
    
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const src = item.getAttribute('data-lightbox');
            modalImg.src = src;
            modal.classList.add('active');
        });
    });
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
}

/* Accordions */
function initAccordions() {
    const ruleHeaders = document.querySelectorAll('.rule-header');
    
    ruleHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const body = header.nextElementSibling;
            const icon = header.querySelector('.accordion-icon');
            
            if (body.style.display === 'block') {
                body.style.display = 'none';
                if (icon) icon.style.transform = 'rotate(0deg)';
            } else {
                body.style.display = 'block';
                if (icon) icon.style.transform = 'rotate(180deg)';
            }
        });
    });
}

/* Personal Cabinet Tabs System */
function initCabinetTabs() {
    const tabBtns = document.querySelectorAll('.cabinet-tab-btn');
    const tabPanes = document.querySelectorAll('.cabinet-tab-pane');
    
    if (!tabBtns.length) return;
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-tab');
            
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            btn.classList.add('active');
            const targetPane = document.getElementById(targetId);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });
}
