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

    }

    // ===== COUNTDOWN TIMER =====
    initCountdown() {
        this.updateCountdown();
        setInterval(() => this.updateCountdown(), 1000);
    }

    updateCountdown() {
        // PERBAIKAN: Format tanggal yang benar untuk 7 Desember 2025
        const weddingDate = new Date('December 7, 2025 00:00:00').getTime();
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
        
        // Add particle effect
        this.createCountdownParticles(element);
        
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

    createCountdownParticles(element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < 5; i++) {
            this.createParticle(centerX, centerY);
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
        const magneticBtns = document.querySelectorAll('.open-btn');
        
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

    // ===== RSVP FORM =====
    initRSVPForm() {
        const form = document.getElementById('rsvpForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handleRSVPSubmit(e));
            console.log('✅ RSVP form initialized');
        } else {
            console.error('❌ RSVP form not found');
        }
    }

    async handleRSVPSubmit(e) {
        e.preventDefault();
        console.log('📝 RSVP form submitted');
        
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        console.log('📊 Form data:', data);
        
        // Validasi form
        if (!this.validateRSVPForm(data)) {
            console.log('❌ Form validation failed');
            return;
        }
        
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        const originalHTML = submitBtn.innerHTML;
        
        // Update button state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
        submitBtn.disabled = true;
        
        try {
            console.log('🔄 Simulating API call...');
            
            // Simulate API call dengan delay
            await new Promise((resolve, reject) => {
                setTimeout(() => {
                    // Simulate random success (90% success rate)
                    if (Math.random() > 0.1) {
                        resolve(data);
                    } else {
                        reject(new Error('Network error'));
                    }
                }, 2000);
            });
            
            console.log('✅ RSVP submitted successfully');
            
            // Show success notification
            this.showNotification('🎉 Konfirmasi kehadiran berhasil dikirim! Terima kasih atas doa dan restunya.', 'success');
            
            // Reset form
            form.reset();
            console.log('✅ Form reset successfully');
            
            // Add celebration effect
            this.createRsvpSuccessEffect();
            
        } catch (error) {
            console.error('❌ RSVP submission failed:', error);
            this.showNotification('❌ Gagal mengirim konfirmasi. Silakan coba lagi dalam beberapa saat.', 'error');
        } finally {
            // Restore button state
            submitBtn.innerHTML = originalHTML;
            submitBtn.disabled = false;
            console.log('🔄 Button state restored');
        }
    }

    validateRSVPForm(data) {
        console.log('🔍 Validating form data...');
        
        // Check required fields
        if (!data.name || data.name.trim() === '') {
            this.showNotification('❌ Harap isi nama lengkap', 'error');
            return false;
        }
        
        if (!data.attendance) {
            this.showNotification('❌ Harap pilih konfirmasi kehadiran', 'error');
            return false;
        }
        
        // Validate guests count if attending
        if (data.attendance === 'hadir') {
            const guests = parseInt(data.guests) || 0;
            if (guests < 1 || guests > 6) {
                this.showNotification('❌ Jumlah tamu harus antara 1-6 orang', 'error');
                return false;
            }
        }
        
        console.log('✅ Form validation passed');
        return true;
    }

    createRsvpSuccessEffect() {
        // Create celebration effect for RSVP success
        const form = document.getElementById('rsvpForm');
        if (form) {
            form.classList.add('success-animation');
            setTimeout(() => {
                form.classList.remove('success-animation');
            }, 2000);
        }
        
        // Create some hearts animation
        for (let i = 0; i < 8; i++) {
            setTimeout(() => this.createFloatingHeart(), i * 200);
        }
    }

    createFloatingHeart() {
        const heart = document.createElement('div');
        heart.innerHTML = '💖';
        heart.style.cssText = `
            position: fixed;
            font-size: 1.5rem;
            z-index: 10000;
            pointer-events: none;
            animation: floatUp 2s ease-in forwards;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
        `;
        
        document.body.appendChild(heart);
        
        setTimeout(() => {
            if (heart.parentNode) {
                heart.parentNode.removeChild(heart);
            }
        }, 2000);
    }

    // ===== NOTIFICATION SYSTEM =====
    showNotification(message, type = 'info') {
        console.log(`📢 Notification [${type}]: ${message}`);
        
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notif => notif.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icons = {
            success: '✅',
            error: '❌',
            info: '💝',
            warning: '⚠️'
        };
        
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${icons[type] || '💝'}</span>
                <span class="notification-message">${message}</span>
            </div>
        `;
        
        // Styling untuk notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            color: white;
            z-index: 10000;
            transform: translateX(400px);
            transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            max-width: 400px;
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255,255,255,0.2);
            font-family: var(--font-secondary);
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        `;
        
        const colors = {
            success: 'linear-gradient(135deg, #10b981, #059669)',
            error: 'linear-gradient(135deg, #ef4444, #dc2626)',
            info: 'linear-gradient(135deg, var(--accent-gold), var(--accent-blue))',
            warning: 'linear-gradient(135deg, #f59e0b, #d97706)'
        };
        
        notification.style.background = colors[type] || colors.info;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 500);
        }, 5000);
        
        // Click to dismiss
        notification.addEventListener('click', () => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        });
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
}

// ===== INITIALIZE ENHANCED APPLICATION =====
document.addEventListener('DOMContentLoaded', () => {
    window.weddingApp = new WeddingInvitation();
});