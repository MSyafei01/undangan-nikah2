    // ===== WEDDING INVITATION MAIN SCRIPT =====
    // Author: Wedding Invitation System
    // Version: 1.0.0

    class WeddingInvitation {
        constructor() {
            this.init();
        }

        // ===== INITIALIZATION =====
        init() {
            console.log('🎉 Wedding Invitation Initialized!');
            
            // Initialize all components
            this.initTheme();
            this.initCountdown();
            this.initScrollAnimations();
            this.initNavigation();
            this.initRSVPForm();
            this.initPerformanceOptimizations();
            this.initErrorHandling();
            
            // Add event listeners
            this.addEventListeners();
            
            // Start animations
            this.startEntranceAnimations();
        }

        // ===== THEME MANAGEMENT =====
        initTheme() {
            // Load saved theme or detect system preference
            const savedTheme = localStorage.getItem('wedding-theme');
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            
            if (savedTheme) {
                this.applyTheme(savedTheme);
            } else if (systemPrefersDark) {
                this.applyTheme('dark');
            }
            
            // Listen for system theme changes
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (!localStorage.getItem('wedding-theme')) {
                    this.applyTheme(e.matches ? 'dark' : 'light');
                }
            });
        }

        applyTheme(theme) {
            const body = document.body;
            const toggleBtn = document.querySelector('.theme-toggle');
            
            // Add transition class for smooth theme switch
            body.classList.add('theme-switching');
            
            if (theme === 'dark') {
                body.setAttribute('data-theme', 'dark');
                toggleBtn.innerHTML = '☀️';
                localStorage.setItem('wedding-theme', 'dark');
            } else {
                body.removeAttribute('data-theme');
                toggleBtn.innerHTML = '🌙';
                localStorage.setItem('wedding-theme', 'light');
            }
            
            // Remove transition class after animation
            setTimeout(() => {
                body.classList.remove('theme-switching');
            }, 600);
        }

        toggleTheme() {
            const currentTheme = document.body.getAttribute('data-theme');
            this.applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
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
                // Wedding day has arrived!
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

        // ===== SCROLL ANIMATIONS =====
        initScrollAnimations() {
            // Create Intersection Observer for scroll animations
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

            // Observe all animatable elements
            this.observeAnimatableElements();
        }

        observeAnimatableElements() {
            const elementsToObserve = [
                '.story-paragraph',
                '.event-card',
                '.section-title',
                '.vows-content',
                '.gallery-container',
                '.rsvp-form',
                '.gratitude-content'
            ];

            elementsToObserve.forEach(selector => {
                document.querySelectorAll(selector).forEach(element => {
                    this.observer.observe(element);
                });
            });
        }

        handleElementInView(element) {
            if (element.classList.contains('story-paragraph')) {
                element.classList.add('visible');
            } else if (element.classList.contains('event-card')) {
                element.classList.add('fade-in-scale');
            } else if (element.classList.contains('section-title')) {
                element.classList.add('slide-in-left');
            } else {
                element.classList.add('fade-in-up');
            }
        }

        // ===== NAVIGATION =====
        initNavigation() {
            // Smooth scroll for navigation
            this.setupSmoothScroll();
            
            // Add scroll progress indicator
            this.setupScrollProgress();
        }

        setupSmoothScroll() {
            const links = document.querySelectorAll('a[href^="#"]');
            
            links.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = link.getAttribute('href');
                    const targetElement = document.querySelector(targetId);
                    
                    if (targetElement) {
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            });
        }

        setupScrollProgress() {
            // Optional: Add scroll progress bar if needed
            window.addEventListener('scroll', () => {
                this.throttle(this.updateScrollProgress, 100)();
            });
        }

        updateScrollProgress() {
            // Implementation for scroll progress bar
            const winHeight = window.innerHeight;
            const docHeight = document.documentElement.scrollHeight;
            const scrollTop = window.pageYOffset;
            const scrollPercent = (scrollTop / (docHeight - winHeight)) * 100;
            
            // Update progress bar if exists
            const progressBar = document.querySelector('.scroll-progress');
            if (progressBar) {
                progressBar.style.width = scrollPercent + '%';
            }
        }

        // ===== RSVP FORM HANDLING =====
        initRSVPForm() {
            const form = document.getElementById('rsvpForm');
            if (form) {
                form.addEventListener('submit', (e) => this.handleRSVPSubmit(e));
                this.setupFormValidation(form);
            }
        }

        setupFormValidation(form) {
            const inputs = form.querySelectorAll('input, select, textarea');
            
            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.clearFieldError(input));
            });
        }

        validateField(field) {
            const value = field.value.trim();
            let isValid = true;
            let errorMessage = '';

            switch (field.type) {
                case 'text':
                    if (!value) {
                        isValid = false;
                        errorMessage = 'Nama lengkap harus diisi';
                    } else if (value.length < 2) {
                        isValid = false;
                        errorMessage = 'Nama terlalu pendek';
                    }
                    break;
                    
                case 'select-one':
                    if (!value) {
                        isValid = false;
                        errorMessage = 'Silakan pilih konfirmasi kehadiran';
                    }
                    break;
                    
                case 'number':
                    if (field.id === 'guests' && value && (value < 1 || value > 5)) {
                        isValid = false;
                        errorMessage = 'Jumlah tamu antara 1-5 orang';
                    }
                    break;
            }

            this.displayFieldValidation(field, isValid, errorMessage);
            return isValid;
        }

        displayFieldValidation(field, isValid, message) {
            this.clearFieldError(field);
            
            if (!isValid) {
                field.classList.add('error');
                
                const errorElement = document.createElement('div');
                errorElement.className = 'error-message';
                errorElement.textContent = message;
                errorElement.style.cssText = `
                    color: #ef4444;
                    font-size: 0.8rem;
                    margin-top: 0.25rem;
                `;
                
                field.parentNode.appendChild(errorElement);
            } else {
                field.classList.add('valid');
            }
        }

        clearFieldError(field) {
            field.classList.remove('error', 'valid');
            const existingError = field.parentNode.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }
        }

        async handleRSVPSubmit(e) {
            e.preventDefault();
            
            const form = e.target;
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Validate all fields
            let isFormValid = true;
            const fields = form.querySelectorAll('input, select, textarea');
            
            fields.forEach(field => {
                if (!this.validateField(field)) {
                    isFormValid = false;
                }
            });
            
            if (!isFormValid) {
                this.showNotification('Harap perbaiki data yang masih salah', 'error');
                return;
            }
            
            // Show loading state
            const submitBtn = form.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Mengirim...';
            submitBtn.disabled = true;
            
            try {
                await this.submitRSVPData(data);
                this.showNotification('Konfirmasi kehadiran berhasil dikirim!', 'success');
                form.reset();
            } catch (error) {
                console.error('RSVP Submission Error:', error);
                this.showNotification('Gagal mengirim konfirmasi. Silakan coba lagi.', 'error');
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        }

        async submitRSVPData(data) {
            // Simulate API call - replace with actual endpoint
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    // For demo purposes, we'll simulate both success and random failure
                    if (Math.random() > 0.2) { // 80% success rate for demo
                        console.log('RSVP Data Submitted:', data);
                        resolve(data);
                    } else {
                        reject(new Error('Network error'));
                    }
                }, 1500);
            });
        }

        // ===== PERFORMANCE OPTIMIZATIONS =====
        initPerformanceOptimizations() {
            // Throttle scroll events
            this.throttleScrollEvents();
            
            // Lazy load images
            this.setupLazyLoading();
            
            // Preload critical resources
            this.preloadResources();
        }

        throttleScrollEvents() {
            // Scroll events are already handled by Intersection Observer
            // This is just for additional scroll-related functionality
        }

        setupLazyLoading() {
            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            img.src = img.dataset.src;
                            img.classList.remove('lazy');
                            imageObserver.unobserve(img);
                        }
                    });
                });

                document.querySelectorAll('img[data-src]').forEach(img => {
                    imageObserver.observe(img);
                });
            }
        }

        preloadResources() {
            // Preload critical resources
            const preloadLinks = [
                // Add any critical resources to preload
            ];

            preloadLinks.forEach(href => {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.href = href;
                link.as = 'image';
                document.head.appendChild(link);
            });
        }

        // ===== ERROR HANDLING =====
        initErrorHandling() {
            window.addEventListener('error', (e) => {
                console.error('Global Error:', e.error);
            });

            window.addEventListener('unhandledrejection', (e) => {
                console.error('Unhandled Promise Rejection:', e.reason);
            });
        }

        // ===== ENTRANCE ANIMATIONS =====
        startEntranceAnimations() {
            // Add initial animations when page loads
            document.querySelectorAll('.section-title').forEach((title, index) => {
                title.style.animationDelay = `${index * 0.2}s`;
            });
        }

        // ===== EVENT LISTENERS =====
        addEventListeners() {
            // Theme toggle
            const themeToggle = document.querySelector('.theme-toggle');
            if (themeToggle) {
                themeToggle.addEventListener('click', () => this.toggleTheme());
            }
            
            // Open invitation button
            const openBtn = document.querySelector('.open-btn');
            if (openBtn) {
                openBtn.addEventListener('click', () => this.openInvitation());
            }
            
            // Window load event
            window.addEventListener('load', () => this.onWindowLoad());
            
            // Resize event (throttled)
            window.addEventListener('resize', () => this.throttle(this.onWindowResize, 250));
        }

        openInvitation() {
            // Scroll to blessing section
            const blessingSection = document.getElementById('blessing');
            if (blessingSection) {
                blessingSection.scrollIntoView({ behavior: 'smooth' });
            }
            
            // Trigger audio play (handled in audio-player.js)
            if (window.audioPlayer) {
                window.audioPlayer.play();
            }
            
            // Add celebration effects
            this.createCelebrationEffects();
        }

        createCelebrationEffects() {
            // Add some celebration particles
            for (let i = 0; i < 15; i++) {
                this.createParticle();
            }
        }

        createParticle() {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: fixed;
                width: 6px;
                height: 6px;
                background: var(--accent-gold);
                border-radius: 50%;
                pointer-events: none;
                z-index: 10000;
                top: 50%;
                left: 50%;
                animation: float 2s ease-out forwards;
            `;
            
            document.body.appendChild(particle);
            
            // Random direction
            const angle = Math.random() * Math.PI * 2;
            const distance = 100 + Math.random() * 100;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            
            particle.style.setProperty('--end-x', `${x}px`);
            particle.style.setProperty('--end-y', `${y}px`);
            
            // Remove particle after animation
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 2000);
        }

        onWindowLoad() {
            console.log('🚀 Wedding invitation fully loaded!');
            document.body.classList.add('loaded');
        }

        onWindowResize() {
            // Handle responsive adjustments
            this.handleResponsiveAdjustments();
        }

        handleResponsiveAdjustments() {
            // Add any responsive adjustments here
        }

        // ===== UTILITY FUNCTIONS =====
        throttle(func, limit) {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            }
        }

        showNotification(message, type = 'info') {
            // Create notification element
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.textContent = message;
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                color: white;
                z-index: 10000;
                transform: translateX(100%);
                transition: transform 0.3s ease;
                max-width: 300px;
            `;
            
            // Set background color based on type
            const colors = {
                success: '#10b981',
                error: '#ef4444',
                info: '#3b82f6'
            };
            
            notification.style.background = colors[type] || colors.info;
            
            document.body.appendChild(notification);
            
            // Animate in
            setTimeout(() => {
                notification.style.transform = 'translateX(0)';
            }, 100);
            
            // Auto remove after 5 seconds
            setTimeout(() => {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }, 5000);
        }
    }

    // ===== INITIALIZE APPLICATION =====
    document.addEventListener('DOMContentLoaded', () => {
        window.weddingApp = new WeddingInvitation();
    });

    // ===== GLOBAL FUNCTIONS FOR HTML ONCLICK =====
    function toggleTheme() {
        if (window.weddingApp) {
            window.weddingApp.toggleTheme();
        }
    }

    function openInvitation() {
        if (window.weddingApp) {
            window.weddingApp.openInvitation();
        }
    }

    function toggleMusic() {
        if (window.audioPlayer) {
            window.audioPlayer.toggle();
        }
    }