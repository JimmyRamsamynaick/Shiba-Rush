/**
 * 🕹️ CONFIGURATION ARCADE - Shiba Rush
 * Optimisations spécifiques pour bornes d'arcade japonaises
 * Compatible JAMMA, résolutions 480p/720p
 */

class ArcadeConfig {
    constructor() {
        // Configuration matérielle arcade
        this.hardware = {
            // Résolutions supportées
            resolutions: {
                '480p': { width: 720, height: 480, scale: 1.0 },
                '720p': { width: 1280, height: 720, scale: 1.5 },
                'custom': { width: 800, height: 600, scale: 1.1 }
            },
            
            // Limites de performance
            performance: {
                maxFPS: 60,
                maxSprites: 100,
                maxParticles: 50,
                memoryLimit: 64, // MB
                audioChannels: 8
            },
            
            // Configuration JAMMA
            jamma: {
                player1: {
                    up: 'P1_UP',
                    down: 'P1_DOWN',
                    left: 'P1_LEFT',
                    right: 'P1_RIGHT',
                    button1: 'P1_BUTTON1',
                    button2: 'P1_BUTTON2',
                    button3: 'P1_BUTTON3',
                    button4: 'P1_BUTTON4',
                    start: 'P1_START'
                },
                
                system: {
                    coin1: 'COIN1',
                    coin2: 'COIN2',
                    service: 'SERVICE',
                    test: 'TEST'
                }
            }
        };
        
        // Mapping des contrôles arcade vers clavier (pour développement)
        this.keyMapping = {
            // Joystick
            'ArrowUp': 'P1_UP',
            'ArrowDown': 'P1_DOWN',
            'ArrowLeft': 'P1_LEFT',
            'ArrowRight': 'P1_RIGHT',
            'KeyW': 'P1_UP',
            'KeyS': 'P1_DOWN',
            'KeyA': 'P1_LEFT',
            'KeyD': 'P1_RIGHT',
            
            // Boutons
            'Space': 'P1_BUTTON1',
            'KeyX': 'P1_BUTTON1',
            'KeyZ': 'P1_BUTTON2',
            'KeyC': 'P1_BUTTON2',
            'KeyV': 'P1_BUTTON3',
            'KeyB': 'P1_BUTTON4',
            
            // Système
            'Enter': 'P1_START',
            'Digit5': 'COIN1',
            'Digit6': 'COIN2',
            'F1': 'SERVICE',
            'F2': 'TEST'
        };
        
        // État des contrôles
        this.inputState = {};
        this.inputBuffer = [];
        this.inputHistory = [];
        
        // Optimisations de rendu
        this.renderOptimizations = {
            useOffscreenCanvas: true,
            enableImageSmoothing: false,
            pixelPerfect: true,
            culling: true,
            batchRendering: true
        };
        
        // Configuration audio arcade
        this.audioConfig = {
            sampleRate: 44100,
            channels: 2, // Stéréo par défaut, mono si nécessaire
            bitDepth: 16,
            latency: 'interactive', // Faible latence pour arcade
            maxPolyphony: 8
        };
        
        // Paramètres de jeu arcade
        this.gameConfig = {
            attractMode: {
                enabled: true,
                timeout: 30000, // 30 secondes
                demoLength: 60000, // 1 minute
                showHighScores: true
            },
            
            difficulty: {
                adaptive: true,
                baseSpeed: 3,
                maxSpeed: 12,
                speedIncrease: 0.001,
                obstacleFrequency: 0.02
            },
            
            scoring: {
                basePoints: 10,
                comboMultiplier: 1.5,
                distancePoints: 1,
                coinValue: 100,
                perfectBonus: 500
            },
            
            lives: {
                enabled: false, // Endless runner
                startingLives: 3,
                extraLifeScore: 10000
            }
        };
        
        this.init();
    }
    
    init() {
        this.detectHardware();
        this.setupInputSystem();
        this.optimizeCanvas();
        this.loadArcadeSettings();
    }
    
    detectHardware() {
        // Détection automatique de la résolution optimale
        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;
        
        if (screenWidth <= 800 && screenHeight <= 600) {
            this.currentResolution = '480p';
        } else if (screenWidth <= 1280 && screenHeight <= 720) {
            this.currentResolution = '720p';
        } else {
            this.currentResolution = 'custom';
        }
        
        // Détection des capacités du navigateur
        this.capabilities = {
            webGL: !!window.WebGLRenderingContext,
            audioContext: !!(window.AudioContext || window.webkitAudioContext),
            gamepad: !!navigator.getGamepads,
            fullscreen: !!(document.fullscreenEnabled || document.webkitFullscreenEnabled),
            pixelRatio: window.devicePixelRatio || 1
        };
        
        console.log('🕹️ Hardware détecté:', {
            resolution: this.currentResolution,
            capabilities: this.capabilities
        });
    }
    
    setupInputSystem() {
        // Système d'input unifié pour arcade
        document.addEventListener('keydown', (e) => {
            const arcadeInput = this.keyMapping[e.code];
            if (arcadeInput) {
                e.preventDefault();
                this.handleInput(arcadeInput, true);
            }
        });
        
        document.addEventListener('keyup', (e) => {
            const arcadeInput = this.keyMapping[e.code];
            if (arcadeInput) {
                e.preventDefault();
                this.handleInput(arcadeInput, false);
            }
        });
        
        // Support gamepad (pour vrais contrôleurs arcade)
        if (this.capabilities.gamepad) {
            this.setupGamepadSupport();
        }
        
        // Buffer d'input pour combos et séquences
        setInterval(() => {
            this.updateInputBuffer();
        }, 16); // 60fps
    }
    
    handleInput(input, pressed) {
        const timestamp = performance.now();
        
        // Mise à jour de l'état
        this.inputState[input] = pressed;
        
        // Ajout au buffer pour les combos
        if (pressed) {
            this.inputBuffer.push({ input, timestamp });
            this.inputHistory.push({ input, timestamp, type: 'press' });
            
            // Limite de l'historique
            if (this.inputHistory.length > 100) {
                this.inputHistory.shift();
            }
        }
        
        // Appel du callback si défini
        if (this.inputCallback) {
            this.inputCallback(input, pressed);
        }
        
        // Événement personnalisé pour le jeu
        window.dispatchEvent(new CustomEvent('arcadeInput', {
            detail: { input, pressed, timestamp }
        }));
    }
    
    updateInputBuffer() {
        const now = performance.now();
        // Nettoie les inputs anciens (>500ms)
        this.inputBuffer = this.inputBuffer.filter(input => 
            now - input.timestamp < 500
        );
    }
    
    setupGamepadSupport() {
        const pollGamepads = () => {
            const gamepads = navigator.getGamepads();
            
            for (let i = 0; i < gamepads.length; i++) {
                const gamepad = gamepads[i];
                if (gamepad) {
                    this.processGamepad(gamepad);
                }
            }
            
            requestAnimationFrame(pollGamepads);
        };
        
        pollGamepads();
    }
    
    processGamepad(gamepad) {
        // Mapping des boutons gamepad vers inputs arcade
        const buttonMapping = {
            0: 'P1_BUTTON1', // A
            1: 'P1_BUTTON2', // B
            2: 'P1_BUTTON3', // X
            3: 'P1_BUTTON4', // Y
            9: 'P1_START'    // Start
        };
        
        // Traitement des boutons
        gamepad.buttons.forEach((button, index) => {
            const arcadeInput = buttonMapping[index];
            if (arcadeInput) {
                const pressed = button.pressed;
                const wasPressed = this.inputState[arcadeInput];
                
                if (pressed !== wasPressed) {
                    this.handleInput(arcadeInput, pressed);
                }
            }
        });
        
        // Traitement du D-pad/joystick
        const axes = gamepad.axes;
        if (axes.length >= 2) {
            const deadzone = 0.3;
            
            // Axe horizontal
            if (axes[0] < -deadzone) {
                this.handleInput('P1_LEFT', true);
                this.handleInput('P1_RIGHT', false);
            } else if (axes[0] > deadzone) {
                this.handleInput('P1_RIGHT', true);
                this.handleInput('P1_LEFT', false);
            } else {
                this.handleInput('P1_LEFT', false);
                this.handleInput('P1_RIGHT', false);
            }
            
            // Axe vertical
            if (axes[1] < -deadzone) {
                this.handleInput('P1_UP', true);
                this.handleInput('P1_DOWN', false);
            } else if (axes[1] > deadzone) {
                this.handleInput('P1_DOWN', true);
                this.handleInput('P1_UP', false);
            } else {
                this.handleInput('P1_UP', false);
                this.handleInput('P1_DOWN', false);
            }
        }
    }
    
    optimizeCanvas() {
        const canvas = document.getElementById('gameCanvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        // Optimisations de rendu
        if (this.renderOptimizations.enableImageSmoothing === false) {
            ctx.imageSmoothingEnabled = false;
            ctx.webkitImageSmoothingEnabled = false;
            ctx.mozImageSmoothingEnabled = false;
            ctx.msImageSmoothingEnabled = false;
        }
        
        // Pixel perfect rendering
        if (this.renderOptimizations.pixelPerfect) {
            canvas.style.imageRendering = 'pixelated';
            canvas.style.imageRendering = 'crisp-edges';
        }
        
        // Configuration de la résolution
        const resolution = this.hardware.resolutions[this.currentResolution];
        canvas.width = resolution.width;
        canvas.height = resolution.height;
        
        console.log('🎮 Canvas optimisé:', resolution);
    }
    
    // Système de monitoring des performances
    startPerformanceMonitoring() {
        this.performanceStats = {
            fps: 0,
            frameTime: 0,
            memoryUsage: 0,
            renderCalls: 0,
            audioLatency: 0
        };
        
        let lastTime = performance.now();
        let frameCount = 0;
        
        const monitor = () => {
            const now = performance.now();
            const deltaTime = now - lastTime;
            
            frameCount++;
            
            // Calcul FPS toutes les secondes
            if (deltaTime >= 1000) {
                this.performanceStats.fps = Math.round((frameCount * 1000) / deltaTime);
                this.performanceStats.frameTime = deltaTime / frameCount;
                
                frameCount = 0;
                lastTime = now;
                
                // Monitoring mémoire
                if (performance.memory) {
                    this.performanceStats.memoryUsage = 
                        Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
                }
                
                // Alerte si performance dégradée
                if (this.performanceStats.fps < 50) {
                    console.warn('⚠️ Performance dégradée:', this.performanceStats);
                    this.applyPerformanceOptimizations();
                }
            }
            
            requestAnimationFrame(monitor);
        };
        
        monitor();
    }
    
    applyPerformanceOptimizations() {
        // Réduction automatique de la qualité si nécessaire
        if (this.performanceStats.fps < 45) {
            this.hardware.performance.maxParticles = Math.max(10, 
                this.hardware.performance.maxParticles * 0.8);
            
            this.hardware.performance.maxSprites = Math.max(50, 
                this.hardware.performance.maxSprites * 0.9);
            
            console.log('🔧 Optimisations appliquées automatiquement');
        }
    }
    
    // Gestion du mode plein écran arcade
    enterArcadeMode() {
        const canvas = document.getElementById('gameCanvas');
        
        if (this.capabilities.fullscreen && canvas) {
            if (canvas.requestFullscreen) {
                canvas.requestFullscreen();
            } else if (canvas.webkitRequestFullscreen) {
                canvas.webkitRequestFullscreen();
            }
        }
        
        // Masquer le curseur
        document.body.style.cursor = 'none';
        
        // Empêcher le menu contextuel
        document.addEventListener('contextmenu', (e) => e.preventDefault());
        
        console.log('🕹️ Mode arcade activé');
    }
    
    exitArcadeMode() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
        
        document.body.style.cursor = 'default';
    }
    
    // Sauvegarde des paramètres arcade
    saveArcadeSettings() {
        try {
            const settings = {
                resolution: this.currentResolution,
                renderOptimizations: this.renderOptimizations,
                audioConfig: this.audioConfig,
                gameConfig: this.gameConfig,
                keyMapping: this.keyMapping
            };
            
            localStorage.setItem('shibaRushArcade', JSON.stringify(settings));
        } catch (e) {
            console.log('Impossible de sauvegarder les paramètres arcade');
        }
    }
    
    loadArcadeSettings() {
        try {
            const saved = localStorage.getItem('shibaRushArcade');
            if (saved) {
                const settings = JSON.parse(saved);
                
                this.currentResolution = settings.resolution || this.currentResolution;
                this.renderOptimizations = { ...this.renderOptimizations, ...settings.renderOptimizations };
                this.audioConfig = { ...this.audioConfig, ...settings.audioConfig };
                this.gameConfig = { ...this.gameConfig, ...settings.gameConfig };
                this.keyMapping = { ...this.keyMapping, ...settings.keyMapping };
            }
        } catch (e) {
            console.log('Impossible de charger les paramètres arcade');
        }
    }
    
    // Utilitaires
    isInputPressed(input) {
        return !!this.inputState[input];
    }
    
    wasInputJustPressed(input, timeWindow = 100) {
        const now = performance.now();
        return this.inputHistory.some(entry => 
            entry.input === input && 
            entry.type === 'press' && 
            now - entry.timestamp <= timeWindow
        );
    }
    
    getPerformanceStats() {
        return { ...this.performanceStats };
    }
    
    getCurrentResolution() {
        return this.hardware.resolutions[this.currentResolution];
    }
    
    // Méthode d'alias pour compatibilité
    setupInputHandlers(callback) {
        this.inputCallback = callback;
        this.setupInputSystem();
    }
    
    updatePerformanceMetrics() {
        // Mise à jour des métriques de performance
        if (this.performanceStats) {
            this.performanceStats.frameCount++;
            this.performanceStats.lastUpdate = Date.now();
        }
    }
}

// Export pour utilisation dans le jeu principal
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ArcadeConfig;
}