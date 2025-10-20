// ===== WEDDING INVITATION MAIN SCRIPT =====
class WeddingInvitation {
    constructor() {
        this.init();
    }

    init() {
        console.log('🎉 Wedding Invitation Initialized!');
        
        this.initLoadingScreen();
        this.initCountdown();
        this.initScrollAnimations();
        this.initMagneticButtons();
        this.initRSVPForm();
        this.initPerformanceOptimizations();
        this.initErrorHandling();
        
        this.addEventListeners();
        this.startEntranceAnimations();
    }

    // ===== COUNTDOWN TIMER =====
    initCountdown() {
        this.updateCountdown();
        setInterval(() => this.updateCountdown(), 1000);
    }

    updateCountdown() {
        const weddingDate = new Date('November 20, 2025 00:00:00').getTime();
        const now = new Date().getTime();
        const distance = weddingDate - now;

        if (distance < 0) {
            this.handleWeddingDay();
            return;
        }

        const time = this.calculateTimeUnits(distance);
        this.displayCountdown(time);
    }

    calculateTimeUnits(distance) {
        return {
            days: Math.floor(distance / (1000 * 60 * 60 * 24)),
            hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((distance % (1000 * 60)) / 1000)
        };
    }

    displayCountdown(time) {
        const elements = {
            days: document.getElementById('days'),
            hours: document.getElementById('hours'),
            minutes: document.getElementById('minutes'),
            seconds: document.getElementById('seconds')
        };

        Object.keys(time).forEach(unit => {
            if (elements[unit]) {
                const currentValue = elements[unit].textContent;
                const newValue = time[unit].toString().padStart(2, '0');
                
                if (currentValue !== newValue) {
                    this.animateCountdownChange(elements[unit], newValue);
                }
            }
        });
    }

    animateCountdownChange(element, newValue) {
        element.classList.add('changing');
        element.textContent = newValue;
        
        setTimeout(() => {
            element.classList.remove('changing');
        }, 600);
    }

    handleWeddingDay() {
        const countdownElement = document.getElementById('countdown');
        if (countdownElement) {
            countdownElement.innerHTML = `
                <div class="wedding-day-message">
                    <h3>🎉 Hari Bahagia Telah Tiba! 🎉</h3>
                    <p>Selamat datang di hari pernikahan Bima & Putri!</p>
                </div>
            `;
        }
    }


    // ===== LOADING SCREEN =====
    initLoadingScreen() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const loadingScreen = document.getElementById('loadingScreen');
                if (loadingScreen) {
                    loadingScreen.classList.add('fade-out');
                    setTimeout(() => {
                        loadingScreen.remove();
                    }, 800);
                }
            }, 2000);
        });
    }

    // ===== MAGNETIC BUTTONS =====
    initMagneticButtons() {
        const magneticBtns = document.querySelectorAll('.magnetic-btn');
        
        magneticBtns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const moveX = (x - centerX) * 0.1;
                const moveY = (y - centerY) * 0.1;
                
                btn.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0, 0)';
            });
        });
    }

    // ===== SCROLL ANIMATIONS =====
    initScrollAnimations() {
        this.observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.handleElementInView(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );

        this.observeAnimatableElements();
    }

    observeAnimatableElements() {
        const elementsToObserve = [
            '.blessing-paragraph',
            '.timeline-item',
            '.events-content',
            '.vows-content',
            '.gallery-container',
            '.rsvp-form'
        ];

        elementsToObserve.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                this.observer.observe(element);
            });
        });
    }

    handleElementInView(element) {
        element.classList.add('animate-in');
    }


    // ===== RSVP FORM =====
    initRSVPForm() {
        const form = document.getElementById('rsvpForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handleRSVPSubmit(e));
        }
    }

    async handleRSVPSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Mengirim...';
        submitBtn.disabled = true;
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            console.log('RSVP Data:', data);
            this.showNotification('Konfirmasi kehadiran berhasil dikirim!', 'success');
            form.reset();
        } catch (error) {
            console.error('RSVP Error:', error);
            this.showNotification('Gagal mengirim konfirmasi. Silakan coba lagi.', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    // ===== PERFORMANCE & ERROR HANDLING =====
    initPerformanceOptimizations() {
        // Optimizations here
    }

    initErrorHandling() {
        window.addEventListener('error', (e) => {
            console.error('Global Error:', e.error);
        });
    }

    // ===== EVENT LISTENERS =====
    addEventListeners() {
        // Window load event
        window.addEventListener('load', () => this.onWindowLoad());
    }

    onWindowLoad() {
        console.log('🚀 Website fully loaded!');
        document.body.classList.add('loaded');
    }





    // ===== ENHANCED COUNTDOWN =====
    updateCountdown() {
        const weddingDate = new Date('November 20, 2025 00:00:00').getTime();
        const now = new Date().getTime();
        const distance = weddingDate - now;

        if (distance < 0) {
            this.handleWeddingDay();
            return;
        }

        const time = this.calculateTimeUnits(distance);
        this.displayCountdown(time);
    }

    displayCountdown(time) {
        const elements = {
            days: document.getElementById('days'),
            hours: document.getElementById('hours'),
            minutes: document.getElementById('minutes'),
            seconds: document.getElementById('seconds')
        };

        Object.keys(time).forEach(unit => {
            if (elements[unit]) {
                const currentValue = elements[unit].textContent;
                const newValue = time[unit].toString().padStart(2, '0');
                
                if (currentValue !== newValue) {
                    this.animateCountdownChange(elements[unit], newValue);
                }
            }
        });
    }

    animateCountdownChange(element, newValue) {
        element.classList.add('changing');
        element.textContent = newValue;
        
        // Add particle effect
        this.createCountdownParticles(element);
        
        setTimeout(() => {
            element.classList.remove('changing');
        }, 600);
    }

    createCountdownParticles(element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < 5; i++) {
            this.createParticle(centerX, centerY);
        }
    }

    // ===== ENHANCED PARTICLE SYSTEM =====
    createParticle(x, y) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: fixed;
            width: 8px;
            height: 8px;
            background: var(--accent-gold);
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
            top: ${y}px;
            left: ${x}px;
        `;
        
        document.body.appendChild(particle);
        
        const angle = Math.random() * Math.PI * 2;
        const distance = 50 + Math.random() * 50;
        const endX = Math.cos(angle) * distance;
        const endY = Math.sin(angle) * distance;
        
        particle.style.setProperty('--end-x', `${endX}px`);
        particle.style.setProperty('--end-y', `${endY}px`);
        
        particle.style.animation = `particle-explosion 1s ease-out forwards`;
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 1000);
    }

    // ===== ENHANCED SCROLL ANIMATIONS =====
    initScrollAnimations() {
        this.observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.handleEnhancedElementInView(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );

        this.observeEnhancedElements();
    }

    observeEnhancedElements() {
        const elementsToObserve = [
            '.story-paragraph',
            '.events-content',
            '.vows-content',
            '.section-title',
            '.gallery-container',
            '.rsvp-form',
            '.gratitude-content',
            '.countdown-item',
            '.events-detail',
            '.vows-detail'
        ];

        elementsToObserve.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                this.observer.observe(element);
            });
        });
    }

    handleEnhancedElementInView(element) {
        element.classList.add('animate-in');
        
        if (element.classList.contains('story-paragraph')) {
            element.classList.add('visible');
        }
        
        if (element.classList.contains('events-detail') || 
            element.classList.contains('vows-detail')) {
            this.animateStaggeredChildren(element.parentElement);
        }
    }

    animateStaggeredChildren(parent) {
        const children = Array.from(parent.children);
        children.forEach((child, index) => {
            setTimeout(() => {
                child.classList.add('stagger-item');
            }, index * 100);
        });
    }

    // ===== ENHANCED UTILITIES =====
    showEnhancedNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `enhanced-notification ${type}`;
        
        const icons = {
            success: '✅',
            error: '❌',
            info: '💝'
        };
        
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${icons[type]}</span>
                <span class="notification-message">${message}</span>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 15px;
            color: white;
            z-index: 10000;
            transform: translateX(400px);
            transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            max-width: 350px;
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255,255,255,0.2);
        `;
        
        const colors = {
            success: 'rgba(16, 185, 129, 0.9)',
            error: 'rgba(239, 68, 68, 0.9)',
            info: 'rgba(212, 175, 55, 0.9)'
        };
        
        notification.style.background = colors[type] || colors.info;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 500);
        }, 4000);
    }
}



// ===== INITIALIZE ENHANCED APPLICATION =====
document.addEventListener('DOMContentLoaded', () => {
    window.weddingApp = new WeddingInvitation();
});

