// ===== WEDDING AUDIO PLAYER =====
// Author: Wedding Invitation System
// Version: 1.0.0

class WeddingAudioPlayer {
    constructor() {
        this.audio = null;
        this.isPlaying = false;
        this.isUserInteracted = false;
        this.volume = 0.7;
        this.fadeDuration = 2000;
        this.audioContext = null;
        this.analyser = null;
        this.source = null;
        this.gainNode = null;
        
        this.init();
    }

    // ===== INITIALIZATION =====
    init() {
        console.log('🎵 Wedding Audio Player Initialized');
        
        this.createAudioElement();
        this.setupAudioContext();
        this.addEventListeners();
        this.setupVisibilityHandler();
        this.createVisualizer();
    }

    // ===== AUDIO ELEMENT SETUP =====
    createAudioElement() {
        // Create audio element
        this.audio = document.getElementById('weddingMusic');
        
        if (!this.audio) {
            this.audio = document.createElement('audio');
            this.audio.id = 'weddingMusic';
            this.audio.loop = true;
            this.audio.preload = 'auto';
            document.body.appendChild(this.audio);
        }

        // SET OFFLINE AUDIO FILE - PAKAI FILE LOKAL
        this.setAudioSource('assets/audio/SaxophoneWedding.mp3');
        
        // Set initial volume
        this.audio.volume = this.volume;
        
        // Add audio event listeners
        this.setupAudioEvents();
    }

    setAudioSource(url) {
        console.log('🎵 Setting audio source:', url);
        
        // Langsung set source ke file lokal
        this.audio.src = url;
        
        // Add error handling for audio source
        this.audio.addEventListener('error', (e) => {
            console.error('Audio loading error:', e);
            console.log('Error details:', {
                error: e,
                src: this.audio.src,
                networkState: this.audio.networkState,
                readyState: this.audio.readyState
            });
            this.handleAudioError();
        });

        // Success handler
        this.audio.addEventListener('loadeddata', () => {
            console.log('✅ Audio loaded successfully');
            this.updateAudioControl();
        });

        this.audio.addEventListener('canplaythrough', () => {
            console.log('🎵 Audio ready to play');
        });
    }

    setupAudioEvents() {
        this.audio.addEventListener('loadeddata', () => {
            console.log('✅ Audio loaded successfully');
            this.updateAudioControl();
        });

        this.audio.addEventListener('canplaythrough', () => {
            console.log('🎵 Audio ready to play');
        });

        this.audio.addEventListener('ended', () => {
            console.log('🔚 Audio ended');
            this.isPlaying = false;
            this.updateAudioControl();
        });

        this.audio.addEventListener('timeupdate', () => {
            this.updateProgress();
        });

        this.audio.addEventListener('volumechange', () => {
            this.updateVolumeDisplay();
        });
    }

    // ===== WEB AUDIO API SETUP =====
    setupAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioContext.createAnalyser();
            this.gainNode = this.audioContext.createGain();
            
            // Configure analyser
            this.analyser.fftSize = 256;
            this.analyser.smoothingTimeConstant = 0.8;
            
            // Connect nodes
            this.gainNode.connect(this.analyser);
            this.analyser.connect(this.audioContext.destination);
            
            console.log('🔊 Web Audio API initialized');
        } catch (error) {
            console.warn('Web Audio API not supported:', error);
        }
    }

    connectAudioSource() {
        if (!this.audioContext || !this.audio) return;
        
        try {
            this.source = this.audioContext.createMediaElementSource(this.audio);
            this.source.connect(this.gainNode);
            console.log('🔗 Audio source connected to Web Audio API');
        } catch (error) {
            console.warn('Could not connect audio source:', error);
        }
    }

    // ===== PLAYBACK CONTROLS =====
    async play() {
        if (!this.audio) return;
        
        try {
            // Check if audio is ready
            if (this.audio.readyState < 2) {
                console.log('🔄 Audio not ready, waiting...');
                this.showNotification('Memuat musik...', 'info');
                return;
            }
            
            // Resume AudioContext if suspended
            if (this.audioContext && this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }
            
            // Connect audio source if not connected
            if (!this.source) {
                this.connectAudioSource();
            }
            
            // Fade in audio
            await this.fadeIn();
            
            // Update state
            this.isPlaying = true;
            this.isUserInteracted = true;
            this.updateAudioControl();
            
            console.log('▶️ Audio playback started');
            
        } catch (error) {
            console.error('Playback error:', error);
            this.handlePlaybackError(error);
        }
    }

    pause() {
        if (!this.audio || !this.isPlaying) return;
        
        this.fadeOut().then(() => {
            this.audio.pause();
            this.isPlaying = false;
            this.updateAudioControl();
            console.log('⏸️ Audio paused');
        });
    }

    toggle() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    stop() {
        if (!this.audio) return;
        
        this.fadeOut().then(() => {
            this.audio.pause();
            this.audio.currentTime = 0;
            this.isPlaying = false;
            this.updateAudioControl();
            console.log('⏹️ Audio stopped');
        });
    }

    // ===== VOLUME CONTROL =====
    setVolume(volume) {
        if (!this.audio) return;
        
        const newVolume = Math.max(0, Math.min(1, volume));
        this.volume = newVolume;
        
        if (this.gainNode) {
            this.gainNode.gain.setValueAtTime(newVolume, this.audioContext.currentTime);
        } else {
            this.audio.volume = newVolume;
        }
        
        this.updateVolumeDisplay();
    }

    increaseVolume() {
        this.setVolume(this.volume + 0.1);
    }

    decreaseVolume() {
        this.setVolume(this.volume - 0.1);
    }

    mute() {
        if (this.gainNode) {
            this.gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        } else {
            this.audio.volume = 0;
        }
        this.updateVolumeDisplay();
    }

    unmute() {
        this.setVolume(this.volume);
    }

    // ===== FADE EFFECTS =====
    async fadeIn() {
        return new Promise((resolve) => {
            if (this.gainNode) {
                this.gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
                this.gainNode.gain.linearRampToValueAtTime(
                    this.volume, 
                    this.audioContext.currentTime + this.fadeDuration / 1000
                );
            } else {
                this.audio.volume = 0;
                this.audio.play();
                this.fadeVolume(0, this.volume, this.fadeDuration);
            }
            
            setTimeout(resolve, this.fadeDuration);
        });
    }

    async fadeOut() {
        return new Promise((resolve) => {
            if (this.gainNode) {
                this.gainNode.gain.linearRampToValueAtTime(
                    0, 
                    this.audioContext.currentTime + this.fadeDuration / 1000
                );
            } else {
                this.fadeVolume(this.volume, 0, this.fadeDuration);
            }
            
            setTimeout(resolve, this.fadeDuration);
        });
    }

    fadeVolume(startVolume, endVolume, duration) {
        const startTime = performance.now();
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            this.audio.volume = startVolume + (endVolume - startVolume) * progress;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    // ===== VISUALIZER =====
    createVisualizer() {
        if (!this.analyser) return;
        
        const canvas = document.createElement('canvas');
        canvas.id = 'audioVisualizer';
        canvas.style.cssText = `
            position: fixed;
            bottom: 80px;
            left: 20px;
            width: 100px;
            height: 30px;
            border-radius: 15px;
            background: var(--glass-bg);
            backdrop-filter: blur(10px);
            border: 1px solid var(--glass-border);
            z-index: 999;
            opacity: 0.7;
            transition: opacity 0.3s ease;
        `;
        
        document.body.appendChild(canvas);
        
        this.visualizerCanvas = canvas;
        this.visualizerContext = canvas.getContext('2d');
        
        // Start visualization
        this.animateVisualizer();
    }

    animateVisualizer() {
        if (!this.analyser || !this.visualizerCanvas || !this.isPlaying) {
            requestAnimationFrame(() => this.animateVisualizer());
            return;
        }
        
        const bufferLength = this.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        this.analyser.getByteFrequencyData(dataArray);
        
        const ctx = this.visualizerContext;
        const width = this.visualizerCanvas.width;
        const height = this.visualizerCanvas.height;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Draw waveform
        const barWidth = (width / bufferLength) * 2.5;
        let barHeight;
        let x = 0;
        
        for (let i = 0; i < bufferLength; i++) {
            barHeight = (dataArray[i] / 255) * height;
            
            // Create gradient
            const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
            gradient.addColorStop(0, 'var(--accent-gold)');
            gradient.addColorStop(1, 'var(--accent-blue)');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(x, height - barHeight, barWidth, barHeight);
            
            x += barWidth + 1;
        }
        
        requestAnimationFrame(() => this.animateVisualizer());
    }

    // ===== PROGRESS & UI UPDATES =====
    updateProgress() {
        const progress = (this.audio.currentTime / this.audio.duration) * 100;
        
        const event = new CustomEvent('audioProgress', {
            detail: { progress, currentTime: this.audio.currentTime, duration: this.audio.duration }
        });
        document.dispatchEvent(event);
    }

    updateVolumeDisplay() {
        const audioControl = document.querySelector('.audio-control');
        if (!audioControl) return;
        
        if (!this.isPlaying) {
            audioControl.innerHTML = '🔇';
        } else if (this.volume === 0) {
            audioControl.innerHTML = '🔈';
        } else if (this.volume < 0.5) {
            audioControl.innerHTML = '🔉';
        } else {
            audioControl.innerHTML = '🔊';
        }
    }

    updateAudioControl() {
        const audioControl = document.querySelector('.audio-control');
        if (!audioControl) return;
        
        const state = this.isPlaying ? 'Playing' : 'Paused';
        const volumePercent = Math.round(this.volume * 100);
        audioControl.title = `${state} - Volume: ${volumePercent}%`;
        
        this.updateVolumeDisplay();
    }

    // ===== VISIBILITY & PERFORMANCE =====
    setupVisibilityHandler() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.handleVisibilityChange(false);
            } else {
                this.handleVisibilityChange(true);
            }
        });
    }

    handleVisibilityChange(visible) {
        if (visible) {
            if (this.isPlaying && this.audio.paused) {
                this.audio.play().catch(console.error);
            }
        }
    }

    // ===== EVENT LISTENERS =====
    addEventListeners() {
        const audioControl = document.querySelector('.audio-control');
        if (audioControl) {
            audioControl.addEventListener('click', () => this.toggle());
            audioControl.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                this.showVolumeControls();
            });
        }
        
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            
            switch (e.code) {
                case 'Space':
                    e.preventDefault();
                    this.toggle();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    this.increaseVolume();
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    this.decreaseVolume();
                    break;
                case 'KeyM':
                    e.preventDefault();
                    this.volume === 0 ? this.unmute() : this.mute();
                    break;
            }
        });
    }

    // ===== VOLUME CONTROL UI =====
    showVolumeControls() {
        const existingSlider = document.getElementById('volumeSlider');
        if (existingSlider) existingSlider.remove();
        
        const slider = document.createElement('div');
        slider.id = 'volumeSlider';
        slider.innerHTML = `
            <div class="volume-popup">
                <input type="range" min="0" max="100" value="${this.volume * 100}" 
                    class="volume-slider" orient="vertical">
                <div class="volume-value">${Math.round(this.volume * 100)}%</div>
            </div>
        `;
        
        slider.style.cssText = `
            position: fixed;
            bottom: 80px;
            left: 20px;
            z-index: 1001;
            background: var(--glass-bg);
            backdrop-filter: blur(20px);
            border: 1px solid var(--glass-border);
            border-radius: 10px;
            padding: 1rem;
        `;
        
        document.body.appendChild(slider);
        
        const style = document.createElement('style');
        style.textContent = `
            .volume-popup { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; }
            .volume-slider { width: 100px; height: 20px; transform: rotate(-90deg); 
                        background: var(--glass-bg); border-radius: 10px; outline: none; }
            .volume-slider::-webkit-slider-thumb { appearance: none; width: 20px; height: 20px; 
                        border-radius: 50%; background: var(--accent-gold); cursor: pointer; }
            .volume-value { color: var(--text-primary); font-size: 0.9rem; }
        `;
        document.head.appendChild(style);
        
        const volumeSlider = slider.querySelector('.volume-slider');
        volumeSlider.addEventListener('input', (e) => {
            const volume = e.target.value / 100;
            this.setVolume(volume);
            slider.querySelector('.volume-value').textContent = e.target.value + '%';
        });
        
        let timeout;
        const resetTimeout = () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                slider.remove();
                style.remove();
            }, 3000);
        };
        
        slider.addEventListener('mousemove', resetTimeout);
        volumeSlider.addEventListener('input', resetTimeout);
        resetTimeout();
    }

    // ===== ERROR HANDLING =====
    handleAudioError() {
        console.error('❌ Audio loading failed');
        
        this.showNotification('Musik tidak dapat dimuat. Pastikan file SaxophoneWedding.mp3 ada di folder assets/audio/', 'error');
        
        const audioControl = document.querySelector('.audio-control');
        if (audioControl) {
            audioControl.innerHTML = '❌';
            audioControl.title = 'Audio loading failed';
        }
    }

    handlePlaybackError(error) {
        console.error('Playback failed:', error);
        
        if (error.name === 'NotAllowedError') {
            this.showNotification('Klik tombol unmute untuk memulai musik', 'info');
            this.isUserInteracted = false;
        }
    }

    showNotification(message, type = 'info') {
        if (window.weddingApp && window.weddingApp.showNotification) {
            window.weddingApp.showNotification(message, type);
        } else {
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }

    // ===== PUBLIC METHODS =====
    getPlaybackState() {
        return {
            isPlaying: this.isPlaying,
            currentTime: this.audio ? this.audio.currentTime : 0,
            duration: this.audio ? this.audio.duration : 0,
            volume: this.volume,
            isUserInteracted: this.isUserInteracted
        };
    }

    seekTo(time) {
        if (!this.audio) return;
        
        const validTime = Math.max(0, Math.min(time, this.audio.duration));
        this.audio.currentTime = validTime;
    }

    // ===== CLEANUP =====
    destroy() {
        if (this.audio) {
            this.audio.pause();
            this.audio.src = '';
            this.audio.load();
        }
        
        if (this.audioContext) {
            this.audioContext.close();
        }
        
        if (this.visualizerCanvas) {
            this.visualizerCanvas.remove();
        }
        
        console.log('🔇 Audio player destroyed');
    }
}

// ===== INITIALIZE AUDIO PLAYER =====
document.addEventListener('DOMContentLoaded', () => {
    window.audioPlayer = new WeddingAudioPlayer();
});

// ===== GLOBAL FUNCTION FOR HTML ONCLICK =====
function toggleMusic() {
    if (window.audioPlayer) {
        window.audioPlayer.toggle();
    }
}