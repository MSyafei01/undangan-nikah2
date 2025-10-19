// ===== SIMPLE WEDDING AUDIO PLAYER =====
class SimpleAudioPlayer {
    constructor() {
        this.audio = document.getElementById('weddingMusic');
        this.audioControl = document.getElementById('audioControl');
        this.musicIcon = document.getElementById('musicIcon');
        this.isPlaying = false;
        this.userHasInteracted = false;
        
        console.log('🎵 Audio Player Initialized');
        console.log('🔊 Audio element:', this.audio);
        
        this.init();
    }

    init() {
        // Set volume
        this.audio.volume = 0.7;
        
        // Event listeners untuk audio control
        this.audioControl.addEventListener('click', () => this.toggleMusic());
        
        // Handle audio events
        this.audio.addEventListener('loadeddata', () => {
            console.log('✅ Audio loaded successfully');
        });
        
        this.audio.addEventListener('canplaythrough', () => {
            console.log('🎵 Audio ready to play');
        });
        
        this.audio.addEventListener('error', (e) => {
            console.error('❌ Audio error:', e);
            this.handleAudioError();
        });
        
        this.audio.addEventListener('play', () => {
            console.log('▶️ Audio playback started');
            this.isPlaying = true;
            this.musicIcon.textContent = '🔊';
        });
        
        this.audio.addEventListener('pause', () => {
            console.log('⏸️ Audio paused');
            this.isPlaying = false;
            this.musicIcon.textContent = '🔇';
        });
    }

    // Method untuk play dari button "Buka Undangan"
    playFromButton() {
        console.log('🎵 Playing music from button...');
        this.userHasInteracted = true;
        this.playMusic();
    }

    playMusic() {
        if (!this.audio) {
            console.error('❌ No audio element found');
            return;
        }
        
        console.log('🔊 Attempting to play audio...');
        
        const playPromise = this.audio.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log('✅ Audio play successful');
                this.isPlaying = true;
                this.musicIcon.textContent = '🔊';
            }).catch(error => {
                console.error('❌ Audio play failed:', error);
                this.handlePlayError(error);
            });
        }
    }

    pauseMusic() {
        if (!this.audio) return;
        
        this.audio.pause();
        this.isPlaying = false;
        this.musicIcon.textContent = '🔇';
        console.log('⏸️ Music paused');
    }

    toggleMusic() {
        console.log('🎵 Toggle music clicked');
        if (!this.userHasInteracted) {
            // First interaction
            this.userHasInteracted = true;
            this.playMusic();
        } else {
            if (this.isPlaying) {
                this.pauseMusic();
            } else {
                this.playMusic();
            }
        }
    }

    handleAudioError() {
        console.error('❌ Audio file not found or corrupted');
        this.musicIcon.textContent = '❌';
        this.audioControl.title = 'File musik tidak ditemukan';
        
        // Show alert to user
        setTimeout(() => {
            alert('File musik tidak dapat dimuat. Pastikan file SaxophoneWedding.mp3 ada di folder assets/audio/');
        }, 1000);
    }

    handlePlayError(error) {
        console.error('Playback error:', error);
        
        if (error.name === 'NotAllowedError') {
            console.log('ℹ️ Autoplay blocked, need user interaction');
            this.musicIcon.textContent = '🔇';
            this.audioControl.title = 'Klik untuk memutar musik';
        }
    }
}

// ===== INITIALIZE AUDIO PLAYER =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔊 Initializing audio player...');
    window.audioPlayer = new SimpleAudioPlayer();
    console.log('✅ Audio player ready:', window.audioPlayer);
});

// ===== GLOBAL FUNCTION FOR BUTTON =====
function startWeddingExperience() {
    console.log('🎊 Wedding experience started');
    
    // 1. Scroll ke bawah
    scrollToContent();
    
    // 2. Play musik
    playWeddingMusic();
}

function scrollToContent() {
    console.log('📍 Scrolling to content...');
    
    // Scroll ke blessing section
    const blessingSection = document.getElementById('blessing');
    if (blessingSection) {
        blessingSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
        console.log('✅ Scrolled to blessing section');
    } else {
        // Fallback: scroll biasa
        window.scrollTo({
            top: window.innerHeight,
            behavior: 'smooth'
        });
        console.log('✅ Scrolled down');
    }
}

function playWeddingMusic() {
    console.log('🎵 Starting wedding music...');
    
    if (window.audioPlayer) {
        console.log('✅ Audio player found, playing music...');
        window.audioPlayer.playFromButton();
    } else {
        console.error('❌ Audio player not found, trying direct play...');
        
        // Fallback: coba play langsung
        const audioElement = document.getElementById('weddingMusic');
        if (audioElement) {
            audioElement.play().then(() => {
                console.log('✅ Direct audio play successful');
            }).catch(error => {
                console.error('❌ Direct audio play failed:', error);
            });
        }
    }
}

// Function untuk toggle manual dari audio control
function toggleMusic() {
    if (window.audioPlayer) {
        window.audioPlayer.toggleMusic();
    }
}