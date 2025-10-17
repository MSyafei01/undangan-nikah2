// ===== SIMPLE WEDDING AUDIO PLAYER =====
class SimpleAudioPlayer {
    constructor() {
        this.audio = document.getElementById('weddingMusic');
        this.audioControl = document.getElementById('audioControl');
        this.musicIcon = document.getElementById('musicIcon');
        this.isPlaying = false;
        this.userHasInteracted = false;
        
        this.init();
    }

    init() {
        console.log('🎵 Simple Audio Player Initialized');
        
        // Set volume
        this.audio.volume = 0.7;
        
        // Event listeners
        this.audioControl.addEventListener('click', () => this.toggleMusic());
        
        // Handle audio events
        this.audio.addEventListener('loadeddata', () => {
            console.log('✅ Audio loaded successfully');
        });
        
        this.audio.addEventListener('error', (e) => {
            console.error('Audio error:', e);
            this.handleAudioError();
        });
    }

    toggleMusic() {
        if (!this.userHasInteracted) {
            // First interaction - mulai musik
            this.userHasInteracted = true;
            this.playMusic();
        } else {
            // Subsequent interactions - toggle play/pause
            if (this.isPlaying) {
                this.pauseMusic();
            } else {
                this.playMusic();
            }
        }
    }

    playMusic() {
        if (!this.audio) return;
        
        const playPromise = this.audio.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                this.isPlaying = true;
                this.musicIcon.textContent = '🔊';
                console.log('▶️ Music started');
            }).catch(error => {
                console.error('Play failed:', error);
                this.handlePlayError();
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

    handleAudioError() {
        console.error('❌ Audio file not found or corrupted');
        this.musicIcon.textContent = '❌';
        this.audioControl.title = 'File musik tidak ditemukan';
        
        // Show alert to user
        setTimeout(() => {
            alert('File musik tidak dapat dimuat. Pastikan file SaxophoneWedding.mp3 ada di folder assets/audio/');
        }, 1000);
    }

    handlePlayError() {
        // Jika autoplay diblokir, minta user untuk klik manual
        this.musicIcon.textContent = '🔇';
        this.audioControl.title = 'Klik untuk memutar musik';
    }
}

// ===== INITIALIZE WHEN DOCUMENT LOADS =====
document.addEventListener('DOMContentLoaded', () => {
    window.audioPlayer = new SimpleAudioPlayer();
});

// ===== GLOBAL FUNCTION FOR "BUKA UNDANGAN" BUTTON =====
function startWeddingExperience() {
    console.log('🎊 Wedding experience started');
    
    // Trigger audio play when user clicks "Buka Undangan"
    if (window.audioPlayer) {
        window.audioPlayer.userHasInteracted = true;
        window.audioPlayer.playMusic();
    }
}

// Function untuk toggle manual (jika masih ingin pakai)
function toggleMusic() {
    if (window.audioPlayer) {
        window.audioPlayer.toggleMusic();
    }
}