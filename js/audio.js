/**
 * 🔊 SYSTÈME AUDIO - Shiba Rush
 * Optimisé pour bornes d'arcade (mono/stéréo, faible latence)
 */

class AudioManager {
    constructor() {
        this.audioContext = null;
        this.masterVolume = 0.7;
        this.sfxVolume = 0.8;
        this.musicVolume = 0.6;
        this.isEnabled = true;
        
        // Cache des sons générés
        this.soundCache = new Map();
        
        // Patterns musicaux japonais
        this.musicPatterns = {
            tokyo: {
                tempo: 120,
                scale: [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88], // C Major
                rhythm: [1, 0, 1, 0, 1, 1, 0, 1]
            },
            temple: {
                tempo: 80,
                scale: [220.00, 246.94, 277.18, 293.66, 329.63, 369.99, 415.30], // A Minor (Pentatonic)
                rhythm: [1, 0, 0, 1, 0, 1, 0, 0]
            },
            forest: {
                tempo: 90,
                scale: [174.61, 196.00, 220.00, 246.94, 277.18, 311.13, 349.23], // F Major
                rhythm: [1, 0, 1, 0, 0, 1, 0, 1]
            },
            festival: {
                tempo: 140,
                scale: [293.66, 329.63, 369.99, 392.00, 440.00, 493.88, 554.37], // D Major
                rhythm: [1, 1, 0, 1, 1, 0, 1, 1]
            }
        };
        
        this.currentMusic = null;
        this.musicInterval = null;
        this.musicBeat = 0;
        
        this.init();
    }
    
    async init() {
        try {
            // Initialisation du contexte audio
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Création du nœud de volume principal
            this.masterGain = this.audioContext.createGain();
            this.masterGain.gain.value = this.masterVolume;
            this.masterGain.connect(this.audioContext.destination);
            
            // Nœuds séparés pour SFX et musique
            this.sfxGain = this.audioContext.createGain();
            this.sfxGain.gain.value = this.sfxVolume;
            this.sfxGain.connect(this.masterGain);
            
            this.musicGain = this.audioContext.createGain();
            this.musicGain.gain.value = this.musicVolume;
            this.musicGain.connect(this.masterGain);
            
            console.log('🔊 Système audio initialisé');
        } catch (error) {
            console.warn('Audio non supporté:', error);
            this.isEnabled = false;
        }
    }
    
    // Génération de sons 8-bit pour arcade
    generateTone(frequency, duration, type = 'square', envelope = null) {
        if (!this.isEnabled || !this.audioContext) return null;
        
        // Créer de nouveaux oscillateurs à chaque fois (pas de cache pour éviter l'erreur start())
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        
        // Enveloppe ADSR simplifiée
        const attack = envelope?.attack || 0.01;
        const decay = envelope?.decay || 0.1;
        const sustain = envelope?.sustain || 0.3;
        const release = envelope?.release || 0.2;
        
        const now = this.audioContext.currentTime;
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(1, now + attack);
        gainNode.gain.linearRampToValueAtTime(sustain, now + attack + decay);
        gainNode.gain.setValueAtTime(sustain, now + duration - release);
        gainNode.gain.linearRampToValueAtTime(0, now + duration);
        
        oscillator.connect(gainNode);
        
        return { oscillator, gainNode, duration };
    }
    
    // Sons d'effets spéciaux
    playSFX(type, options = {}) {
        if (!this.isEnabled) return;
        
        const sounds = {
            jump: () => {
                const sound = this.generateTone(440, 0.15, 'square', {
                    attack: 0.01,
                    decay: 0.05,
                    sustain: 0.3,
                    release: 0.1
                });
                
                if (sound) {
                    sound.gainNode.connect(this.sfxGain);
                    sound.oscillator.frequency.exponentialRampToValueAtTime(
                        880, this.audioContext.currentTime + 0.1
                    );
                    sound.oscillator.start();
                    sound.oscillator.stop(this.audioContext.currentTime + sound.duration);
                }
            },
            
            dash: () => {
                // Son de dash avec effet de swoosh
                for (let i = 0; i < 3; i++) {
                    setTimeout(() => {
                        const freq = 220 + i * 110;
                        const sound = this.generateTone(freq, 0.1, 'sawtooth');
                        
                        if (sound) {
                            sound.gainNode.connect(this.sfxGain);
                            sound.oscillator.start();
                            sound.oscillator.stop(this.audioContext.currentTime + sound.duration);
                        }
                    }, i * 30);
                }
            },
            
            collect: () => {
                const sound = this.generateTone(660, 0.2, 'sine', {
                    attack: 0.01,
                    decay: 0.05,
                    sustain: 0.8,
                    release: 0.14
                });
                
                if (sound) {
                    sound.gainNode.connect(this.sfxGain);
                    sound.oscillator.frequency.exponentialRampToValueAtTime(
                        1320, this.audioContext.currentTime + 0.1
                    );
                    sound.oscillator.start();
                    sound.oscillator.stop(this.audioContext.currentTime + sound.duration);
                }
            },
            
            powerup: () => {
                // Arpège ascendant
                const notes = [261.63, 329.63, 392.00, 523.25]; // C-E-G-C
                notes.forEach((freq, i) => {
                    setTimeout(() => {
                        const sound = this.generateTone(freq, 0.15, 'triangle');
                        if (sound) {
                            sound.gainNode.connect(this.sfxGain);
                            sound.oscillator.start();
                            sound.oscillator.stop(this.audioContext.currentTime + sound.duration);
                        }
                    }, i * 80);
                });
            },
            
            gameOver: () => {
                // Séquence descendante dramatique
                const notes = [440, 415.30, 369.99, 329.63, 293.66];
                notes.forEach((freq, i) => {
                    setTimeout(() => {
                        const sound = this.generateTone(freq, 0.3, 'square', {
                            attack: 0.02,
                            decay: 0.1,
                            sustain: 0.5,
                            release: 0.18
                        });
                        if (sound) {
                            sound.gainNode.connect(this.sfxGain);
                            sound.oscillator.start();
                            sound.oscillator.stop(this.audioContext.currentTime + sound.duration);
                        }
                    }, i * 200);
                });
            },
            
            slide: () => {
                const sound = this.generateTone(330, 0.2, 'sawtooth');
                if (sound) {
                    sound.gainNode.connect(this.sfxGain);
                    sound.oscillator.frequency.exponentialRampToValueAtTime(
                        220, this.audioContext.currentTime + 0.15
                    );
                    sound.oscillator.start();
                    sound.oscillator.stop(this.audioContext.currentTime + sound.duration);
                }
            },
            
            environmentChange: () => {
                // Transition harmonique
                const chord = [261.63, 329.63, 392.00]; // C Major
                chord.forEach((freq, i) => {
                    const sound = this.generateTone(freq, 0.5, 'sine');
                    if (sound) {
                        sound.gainNode.gain.value = 0.3;
                        sound.gainNode.connect(this.sfxGain);
                        sound.oscillator.start(this.audioContext.currentTime + i * 0.1);
                        sound.oscillator.stop(this.audioContext.currentTime + 0.5 + i * 0.1);
                    }
                });
            }
        };
        
        if (sounds[type]) {
            sounds[type]();
        }
    }
    
    // Musique d'ambiance procédurale
    startMusic(environment) {
        this.stopMusic();
        
        if (!this.isEnabled || !this.musicPatterns[environment]) return;
        
        this.currentMusic = environment;
        const pattern = this.musicPatterns[environment];
        const beatDuration = 60000 / pattern.tempo; // ms par beat
        
        this.musicBeat = 0;
        
        this.musicInterval = setInterval(() => {
            const beatIndex = this.musicBeat % pattern.rhythm.length;
            
            if (pattern.rhythm[beatIndex]) {
                // Jouer une note de la gamme
                const noteIndex = Math.floor(Math.random() * pattern.scale.length);
                const frequency = pattern.scale[noteIndex];
                
                const sound = this.generateTone(frequency, beatDuration / 1000 * 0.8, 'triangle', {
                    attack: 0.05,
                    decay: 0.1,
                    sustain: 0.4,
                    release: 0.3
                });
                
                if (sound) {
                    sound.gainNode.gain.value = 0.3;
                    sound.gainNode.connect(this.musicGain);
                    sound.oscillator.start();
                    sound.oscillator.stop(this.audioContext.currentTime + sound.duration);
                }
                
                // Harmonie occasionnelle
                if (Math.random() < 0.3) {
                    const harmonyIndex = (noteIndex + 2) % pattern.scale.length;
                    const harmonyFreq = pattern.scale[harmonyIndex];
                    
                    const harmony = this.generateTone(harmonyFreq, beatDuration / 1000 * 0.6, 'sine');
                    if (harmony) {
                        harmony.gainNode.gain.value = 0.15;
                        harmony.gainNode.connect(this.musicGain);
                        harmony.oscillator.start(this.audioContext.currentTime + 0.1);
                        harmony.oscillator.stop(this.audioContext.currentTime + harmony.duration + 0.1);
                    }
                }
            }
            
            this.musicBeat++;
        }, beatDuration);
    }
    
    stopMusic() {
        if (this.musicInterval) {
            clearInterval(this.musicInterval);
            this.musicInterval = null;
        }
        this.currentMusic = null;
        this.musicBeat = 0;
    }
    
    // Méthodes d'alias pour compatibilité avec le jeu
    playSound(type, options = {}) {
        this.playSFX(type, options);
    }
    
    startBackgroundMusic(environment = 'tokyo') {
        this.startMusic(environment);
    }
    
    stopBackgroundMusic() {
        this.stopMusic();
    }
    
    update() {
        // Mise à jour du système audio (placeholder)
    }
    
    // Contrôles de volume
    setMasterVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
        if (this.masterGain) {
            this.masterGain.gain.value = this.masterVolume;
        }
    }
    
    setSFXVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
        if (this.sfxGain) {
            this.sfxGain.gain.value = this.sfxVolume;
        }
    }
    
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        if (this.musicGain) {
            this.musicGain.gain.value = this.musicVolume;
        }
    }
    
    // Activation/désactivation
    enable() {
        this.isEnabled = true;
        if (!this.audioContext) {
            this.init();
        }
    }
    
    disable() {
        this.isEnabled = false;
        this.stopMusic();
    }
    
    // Gestion de l'état du contexte audio (requis par certains navigateurs)
    resume() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }
    
    // Nettoyage
    destroy() {
        this.stopMusic();
        this.soundCache.clear();
        
        if (this.audioContext) {
            this.audioContext.close();
        }
    }
    
    // Sauvegarde des préférences
    saveSettings() {
        try {
            const settings = {
                masterVolume: this.masterVolume,
                sfxVolume: this.sfxVolume,
                musicVolume: this.musicVolume,
                isEnabled: this.isEnabled
            };
            localStorage.setItem('shibaRushAudio', JSON.stringify(settings));
        } catch (e) {
            console.log('Impossible de sauvegarder les paramètres audio');
        }
    }
    
    loadSettings() {
        try {
            const saved = localStorage.getItem('shibaRushAudio');
            if (saved) {
                const settings = JSON.parse(saved);
                this.setMasterVolume(settings.masterVolume || 0.7);
                this.setSFXVolume(settings.sfxVolume || 0.8);
                this.setMusicVolume(settings.musicVolume || 0.6);
                this.isEnabled = settings.isEnabled !== false;
            }
        } catch (e) {
            console.log('Impossible de charger les paramètres audio');
        }
    }
}

// Export pour utilisation dans le jeu principal
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AudioManager;
}