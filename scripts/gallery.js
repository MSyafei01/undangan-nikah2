    // ===== WEDDING GALLERY SLIDER =====
    // Author: Wedding Invitation System
    // Version: 1.0.0

    class WeddingGallery {
        constructor() {
            this.currentSlide = 0;
            this.slides = [];
            this.totalSlides = 0;
            this.isAnimating = false;
            this.autoPlayInterval = null;
            this.autoPlayDelay = 4000; // 4 seconds
            this.isAutoPlaying = true;
            this.touchStartX = 0;
            this.touchEndX = 0;
            this.swipeThreshold = 50;
            
            this.init();
        }

        // ===== INITIALIZATION =====
        init() {
            console.log('🖼️ Wedding Gallery Initialized');
            
            this.cacheElements();
            this.setupGallery();
            this.createNavigation();
            this.addEventListeners();
            this.startAutoPlay();
            
            // Preload images for better performance
            this.preloadImages();
        }

        cacheElements() {
            this.galleryContainer = document.querySelector('.gallery-container');
            this.slider = document.querySelector('.gallery-slider');
            this.slides = document.querySelectorAll('.slide');
            this.totalSlides = this.slides.length;
            
            console.log(`📸 Found ${this.totalSlides} slides`);
        }

        setupGallery() {
            if (this.totalSlides === 0) return;
            
            // Set first slide as active
            this.slides[0].classList.add('active');
            
            // Add transition styles dynamically
            this.addGalleryStyles();
            
            // Create dots container if it doesn't exist
            this.createDots();
        }

        addGalleryStyles() {
            const style = document.createElement('style');
            style.textContent = `
                .gallery-slider {
                    position: relative;
                    height: 500px;
                    border-radius: 15px;
                    overflow: hidden;
                    box-shadow: var(--shadow);
                }
                
                .slide {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    opacity: 0;
                    transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1),
                                transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
                    transform: scale(1.05);
                }
                
                .slide.active {
                    opacity: 1;
                    transform: scale(1);
                    z-index: 2;
                }
                
                .slide.next {
                    transform: translateX(100%);
                }
                
                .slide.prev {
                    transform: translateX(-100%);
                }
                
                .slide img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.3s ease;
                }
                
                .slide.active img:hover {
                    transform: scale(1.02);
                }
                
                /* Loading state */
                .slide.loading img {
                    filter: blur(10px);
                }
                
                .slide.loaded img {
                    filter: blur(0);
                    transition: filter 0.5s ease;
                }
                
                /* Fullscreen styles */
                .gallery-fullscreen {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: rgba(0, 0, 0, 0.95);
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    backdrop-filter: blur(20px);
                }
                
                .fullscreen-slide {
                    max-width: 90vw;
                    max-height: 90vh;
                    object-fit: contain;
                    border-radius: 10px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                }
                
                .fullscreen-nav {
                    position: absolute;
                    top: 50%;
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    padding: 0 2rem;
                    transform: translateY(-50%);
                    z-index: 10001;
                }
                
                .fullscreen-close {
                    position: absolute;
                    top: 2rem;
                    right: 2rem;
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 50%;
                    width: 50px;
                    height: 50px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    font-size: 1.5rem;
                    color: white;
                    z-index: 10002;
                    transition: all 0.3s ease;
                }
                
                .fullscreen-close:hover {
                    background: rgba(255, 255, 255, 0.2);
                    transform: scale(1.1);
                }
                
                .fullscreen-counter {
                    position: absolute;
                    top: 2rem;
                    left: 2rem;
                    color: white;
                    font-size: 1.1rem;
                    background: rgba(0, 0, 0, 0.5);
                    padding: 0.5rem 1rem;
                    border-radius: 20px;
                    backdrop-filter: blur(10px);
                }
            `;
            document.head.appendChild(style);
        }

        // ===== NAVIGATION CREATION =====
        createNavigation() {
            // Create dots container
            const dotsContainer = document.querySelector('.gallery-dots');
            if (!dotsContainer) return;
            
            dotsContainer.innerHTML = '';
            
            for (let i = 0; i < this.totalSlides; i++) {
                const dot = document.createElement('div');
                dot.className = `dot ${i === 0 ? 'active' : ''}`;
                dot.dataset.index = i;
                dot.addEventListener('click', () => this.goToSlide(i));
                dotsContainer.appendChild(dot);
            }
            
            // Add navigation buttons event listeners
            const prevBtn = document.querySelector('.nav-btn.prev');
            const nextBtn = document.querySelector('.nav-btn.next');
            
            if (prevBtn) {
                prevBtn.addEventListener('click', () => this.previousSlide());
            }
            
            if (nextBtn) {
                nextBtn.addEventListener('click', () => this.nextSlide());
            }
        }

        createDots() {
            let dotsContainer = document.querySelector('.gallery-dots');
            if (!dotsContainer) {
                dotsContainer = document.createElement('div');
                dotsContainer.className = 'gallery-dots';
                document.querySelector('.gallery-nav')?.appendChild(dotsContainer);
            }
        }

        // ===== SLIDE NAVIGATION =====
        async goToSlide(index, direction = 'auto') {
            if (this.isAnimating || index === this.currentSlide) return;
            
            this.isAnimating = true;
            
            // Calculate direction for animation
            const slideDirection = direction === 'auto' 
                ? (index > this.currentSlide ? 'next' : 'prev')
                : direction;
            
            // Reset auto-play timer
            this.resetAutoPlay();
            
            // Update current slide
            const oldSlide = this.currentSlide;
            this.currentSlide = index;
            
            // Add transition classes
            this.slides[oldSlide].classList.remove('active');
            this.slides[oldSlide].classList.add(slideDirection === 'next' ? 'prev' : 'next');
            
            this.slides[this.currentSlide].classList.add('active', slideDirection);
            
            // Wait for transition to complete
            await this.waitForTransition();
            
            // Clean up classes
            this.slides[oldSlide].classList.remove('prev', 'next');
            this.slides[this.currentSlide].classList.remove('next', 'prev');
            
            // Update dots
            this.updateDots();
            
            // Update URL hash for deep linking
            this.updateURLHash();
            
            this.isAnimating = false;
            
            console.log(`🖼️ Navigated to slide ${this.currentSlide + 1}/${this.totalSlides}`);
        }

        nextSlide() {
            const nextIndex = (this.currentSlide + 1) % this.totalSlides;
            this.goToSlide(nextIndex, 'next');
        }

        previousSlide() {
            const prevIndex = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
            this.goToSlide(prevIndex, 'prev');
        }

        waitForTransition() {
            return new Promise(resolve => {
                setTimeout(resolve, 800); // Match CSS transition duration
            });
        }

        // ===== AUTO-PLAY FUNCTIONALITY =====
        startAutoPlay() {
            if (!this.isAutoPlaying || this.totalSlides <= 1) return;
            
            this.autoPlayInterval = setInterval(() => {
                this.nextSlide();
            }, this.autoPlayDelay);
            
            console.log('🔄 Auto-play started');
        }

        stopAutoPlay() {
            if (this.autoPlayInterval) {
                clearInterval(this.autoPlayInterval);
                this.autoPlayInterval = null;
                console.log('⏹️ Auto-play stopped');
            }
        }

        resetAutoPlay() {
            if (this.isAutoPlaying) {
                this.stopAutoPlay();
                this.startAutoPlay();
            }
        }

        toggleAutoPlay() {
            this.isAutoPlaying = !this.isAutoPlaying;
            
            if (this.isAutoPlaying) {
                this.startAutoPlay();
            } else {
                this.stopAutoPlay();
            }
            
            return this.isAutoPlaying;
        }

        // ===== TOUCH/GESTURE SUPPORT =====
        setupTouchEvents() {
            this.galleryContainer?.addEventListener('touchstart', (e) => {
                this.touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            this.galleryContainer?.addEventListener('touchend', (e) => {
                this.touchEndX = e.changedTouches[0].screenX;
                this.handleSwipe();
            }, { passive: true });
        }

        handleSwipe() {
            const diff = this.touchStartX - this.touchEndX;
            
            if (Math.abs(diff) > this.swipeThreshold) {
                if (diff > 0) {
                    this.nextSlide(); // Swipe left
                } else {
                    this.previousSlide(); // Swipe right
                }
            }
        }

        // ===== FULLSCREEN FUNCTIONALITY =====
        openFullscreen(index = this.currentSlide) {
            // Create fullscreen overlay
            const fullscreenOverlay = document.createElement('div');
            fullscreenOverlay.className = 'gallery-fullscreen';
            fullscreenOverlay.innerHTML = `
                <div class="fullscreen-close" onclick="window.gallery.closeFullscreen()">×</div>
                <div class="fullscreen-counter">${index + 1} / ${this.totalSlides}</div>
                <div class="fullscreen-nav">
                    <button class="nav-btn prev" onclick="window.gallery.fullscreenPrevious()">‹</button>
                    <button class="nav-btn next" onclick="window.gallery.fullscreenNext()">›</button>
                </div>
                <img src="${this.slides[index].querySelector('img').src}" 
                    alt="Gallery image ${index + 1}" 
                    class="fullscreen-slide">
            `;
            
            document.body.appendChild(fullscreenOverlay);
            document.body.style.overflow = 'hidden';
            
            // Add keyboard navigation for fullscreen
            this.setupFullscreenKeyboard();
            
            console.log('🔍 Fullscreen mode opened');
        }

        closeFullscreen() {
            const fullscreenOverlay = document.querySelector('.gallery-fullscreen');
            if (fullscreenOverlay) {
                fullscreenOverlay.remove();
                document.body.style.overflow = '';
                console.log('🔍 Fullscreen mode closed');
            }
        }

        fullscreenNext() {
            const nextIndex = (this.currentSlide + 1) % this.totalSlides;
            this.updateFullscreenView(nextIndex);
        }

        fullscreenPrevious() {
            const prevIndex = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
            this.updateFullscreenView(prevIndex);
        }

        updateFullscreenView(index) {
            const fullscreenImg = document.querySelector('.fullscreen-slide');
            const counter = document.querySelector('.fullscreen-counter');
            
            if (fullscreenImg && counter) {
                fullscreenImg.src = this.slides[index].querySelector('img').src;
                fullscreenImg.alt = `Gallery image ${index + 1}`;
                counter.textContent = `${index + 1} / ${this.totalSlides}`;
                this.currentSlide = index;
                this.updateDots();
            }
        }

        setupFullscreenKeyboard() {
            const keyHandler = (e) => {
                if (!document.querySelector('.gallery-fullscreen')) return;
                
                switch(e.key) {
                    case 'ArrowLeft':
                        e.preventDefault();
                        this.fullscreenPrevious();
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        this.fullscreenNext();
                        break;
                    case 'Escape':
                        e.preventDefault();
                        this.closeFullscreen();
                        break;
                    case ' ':
                        e.preventDefault();
                        this.toggleAutoPlay();
                        break;
                }
            };
            
            document.addEventListener('keydown', keyHandler);
            
            // Store reference for cleanup
            this.fullscreenKeyHandler = keyHandler;
        }

        // ===== DOT NAVIGATION =====
        updateDots() {
            const dots = document.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === this.currentSlide);
            });
        }

        // ===== EVENT LISTENERS =====
        addEventListeners() {
            // Slide click for fullscreen
            this.slides.forEach((slide, index) => {
                slide.addEventListener('click', () => this.openFullscreen(index));
            });
            
            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
                
                if (document.querySelector('.gallery-fullscreen')) return; // Handled in fullscreen
                
                switch(e.key) {
                    case 'ArrowLeft':
                        e.preventDefault();
                        this.previousSlide();
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        this.nextSlide();
                        break;
                    case ' ':
                        e.preventDefault();
                        this.toggleAutoPlay();
                        break;
                    case 'Home':
                        e.preventDefault();
                        this.goToSlide(0);
                        break;
                    case 'End':
                        e.preventDefault();
                        this.goToSlide(this.totalSlides - 1);
                        break;
                }
            });
            
            // Visibility change - pause auto-play when not visible
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    this.stopAutoPlay();
                } else if (this.isAutoPlaying) {
                    this.startAutoPlay();
                }
            });
            
            // Touch events for mobile
            this.setupTouchEvents();
            
            // Mouse wheel navigation
            this.galleryContainer?.addEventListener('wheel', (e) => {
                e.preventDefault();
                if (e.deltaY > 0) {
                    this.nextSlide();
                } else {
                    this.previousSlide();
                }
            }, { passive: false });
        }

        // ===== PERFORMANCE OPTIMIZATIONS =====
        preloadImages() {
            // Preload next and previous images for smooth transitions
            const preloadIndices = [
                (this.currentSlide + 1) % this.totalSlides,
                (this.currentSlide - 1 + this.totalSlides) % this.totalSlides
            ];
            
            preloadIndices.forEach(index => {
                const img = new Image();
                img.src = this.slides[index].querySelector('img').src;
            });
        }

        lazyLoadImages() {
            // Mark images as loaded when they become visible
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target.querySelector('img');
                        if (img && !img.classList.contains('loaded')) {
                            img.classList.add('loaded');
                        }
                    }
                });
            });
            
            this.slides.forEach(slide => {
                observer.observe(slide);
            });
        }

        // ===== URL HASH MANAGEMENT =====
        updateURLHash() {
            // Update URL hash for deep linking to specific slide
            const newHash = `gallery-${this.currentSlide + 1}`;
            if (window.location.hash !== `#${newHash}`) {
                window.history.replaceState(null, null, `#${newHash}`);
            }
        }

        checkURLHash() {
            // Check if URL has gallery hash and navigate to that slide
            const hash = window.location.hash;
            const match = hash.match(/gallery-(\d+)/);
            
            if (match) {
                const slideIndex = parseInt(match[1]) - 1;
                if (slideIndex >= 0 && slideIndex < this.totalSlides) {
                    this.goToSlide(slideIndex);
                }
            }
        }

        // ===== PUBLIC METHODS =====
        getCurrentSlide() {
            return {
                index: this.currentSlide,
                total: this.totalSlides,
                isAutoPlaying: this.isAutoPlaying,
                isAnimating: this.isAnimating
            };
        }

        addSlide(imageSrc, altText = 'Gallery image') {
            // Dynamically add new slide (useful for future enhancements)
            const slide = document.createElement('div');
            slide.className = 'slide';
            slide.innerHTML = `<img src="${imageSrc}" alt="${altText}" loading="lazy">`;
            
            this.slider.appendChild(slide);
            this.slides = document.querySelectorAll('.slide');
            this.totalSlides = this.slides.length;
            
            // Update navigation
            this.createNavigation();
            
            console.log(`➕ Added new slide: ${altText}`);
        }

        // ===== ERROR HANDLING =====
        handleImageError(imgElement) {
            console.error('🖼️ Image failed to load:', imgElement.src);
            imgElement.style.backgroundColor = 'var(--bg-secondary)';
            imgElement.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; 
                        height: 100%; color: var(--text-secondary);">
                    <span>📸 Image unavailable</span>
                </div>
            `;
        }

        // ===== CLEANUP =====
        destroy() {
            this.stopAutoPlay();
            
            // Remove event listeners
            if (this.fullscreenKeyHandler) {
                document.removeEventListener('keydown', this.fullscreenKeyHandler);
            }
            
            console.log('🖼️ Gallery destroyed');
        }
    }

    // ===== INITIALIZE GALLERY =====
    document.addEventListener('DOMContentLoaded', () => {
        window.gallery = new WeddingGallery();
        
        // Check URL hash on load
        setTimeout(() => {
            window.gallery.checkURLHash();
        }, 1000);
    });

    // ===== GLOBAL FUNCTIONS FOR HTML ONCLICK =====
    function nextGallerySlide() {
        if (window.gallery) {
            window.gallery.nextSlide();
        }
    }

    function prevGallerySlide() {
        if (window.gallery) {
            window.gallery.previousSlide();
        }
    }

    function openGalleryFullscreen(index) {
        if (window.gallery) {
            window.gallery.openFullscreen(index);
        }
    }