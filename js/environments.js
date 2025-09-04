/**
 * 🏯 ENVIRONNEMENTS JAPONAIS - Shiba Rush
 * Système de gestion des décors et ambiances
 */

class EnvironmentManager {
    constructor() {
        this.currentEnvironment = 'tokyo';
        this.transitionTimer = 0;
        this.isTransitioning = false;
        this.environmentOrder = ['tokyo', 'temple', 'forest', 'festival'];
        this.currentIndex = 0;
        
        this.environments = {
            tokyo: {
                name: 'Tokyo Moderne',
                colors: {
                    sky: ['#1a1a2e', '#16213e', '#0f3460'],
                    ground: '#2c2c54',
                    accent: '#ff6b6b'
                },
                sprites: {
                    background: ['🏙️', '🌆', '🗼', '🏢', '🚇'],
                    obstacles: ['🚧', '🚗', '🛵', '🚲', '📦'],
                    collectibles: ['🪙', '💴', '🎫', '📱', '⚡'],
                    decorations: ['💡', '🚦', '🏪', '🏬', '🌃']
                },
                music: 'tokyo_beats',
                difficulty: 1.0
            },
            
            temple: {
                name: 'Temple Ancien',
                colors: {
                    sky: ['#2d1b69', '#11998e', '#38ada9'],
                    ground: '#8b4513',
                    accent: '#ffd700'
                },
                sprites: {
                    background: ['⛩️', '🏯', '🌸', '🗾', '🏔️'],
                    obstacles: ['🪨', '⛩️', '🌸', '🦌', '🐍'],
                    collectibles: ['🪙', '🍡', '🎋', '📿', '🔔'],
                    decorations: ['🌸', '🍃', '🦋', '🕯️', '🏮']
                },
                music: 'temple_zen',
                difficulty: 1.2
            },
            
            forest: {
                name: 'Forêt Mystique',
                colors: {
                    sky: ['#0f3460', '#006266', '#065a60'],
                    ground: '#2d5016',
                    accent: '#4ecdc4'
                },
                sprites: {
                    background: ['🌲', '🌳', '🍃', '🦌', '🏔️'],
                    obstacles: ['🌲', '🪨', '🕷️', '🐍', '🦔'],
                    collectibles: ['🪙', '🍄', '🌰', '🦋', '💎'],
                    decorations: ['🍃', '🌿', '🦋', '🐛', '🌺']
                },
                music: 'forest_ambient',
                difficulty: 1.5
            },
            
            festival: {
                name: 'Festival Matsuri',
                colors: {
                    sky: ['#533483', '#7209b7', '#a663cc'],
                    ground: '#4a148c',
                    accent: '#ff9800'
                },
                sprites: {
                    background: ['🏮', '🎆', '🎊', '🎭', '🎪'],
                    obstacles: ['🏮', '🎪', '🎭', '🎨', '🎯'],
                    collectibles: ['🪙', '🍡', '🍱', '🎌', '🎁'],
                    decorations: ['🎊', '🎉', '✨', '🎈', '🎀']
                },
                music: 'festival_energy',
                difficulty: 2.0
            }
        };
        
        this.currentEnvironment = 'tokyo';
        this.transitionProgress = 0;
        this.isTransitioning = false;
    }
    
    init() {
        // Initialisation du gestionnaire d'environnements
        this.currentEnvironment = 'tokyo';
        this.currentIndex = 0;
        this.transitionTimer = 0;
        this.isTransitioning = false;
    }
    
    reset() {
        // Réinitialiser à l'environnement de départ
        this.currentEnvironment = 'tokyo';
        this.currentIndex = 0;
        this.transitionTimer = 0;
        this.isTransitioning = false;
    }
    
    update() {
        // Mise à jour des transitions
        if (this.isTransitioning) {
            this.transitionTimer--;
            if (this.transitionTimer <= 0) {
                this.isTransitioning = false;
            }
        }
    }
    
    nextEnvironment() {
        // Passer à l'environnement suivant
        this.currentIndex = (this.currentIndex + 1) % this.environmentOrder.length;
        this.currentEnvironment = this.environmentOrder[this.currentIndex];
        this.isTransitioning = true;
        this.transitionTimer = 60; // 1 seconde de transition
    }
    
    getCurrentEnvironment() {
        return this.environments[this.currentEnvironment];
    }
    
    changeEnvironment(newEnv) {
        if (this.environments[newEnv] && newEnv !== this.currentEnvironment) {
            this.isTransitioning = true;
            this.transitionProgress = 0;
            
            // Animation de transition
            const transition = setInterval(() => {
                this.transitionProgress += 0.02;
                
                if (this.transitionProgress >= 1) {
                    this.currentEnvironment = newEnv;
                    this.isTransitioning = false;
                    this.transitionProgress = 0;
                    clearInterval(transition);
                }
            }, 16);
        }
    }
    
    getRandomObstacle() {
        const env = this.getCurrentEnvironment();
        const obstacles = env.sprites.obstacles;
        return obstacles[Math.floor(Math.random() * obstacles.length)];
    }
    
    getRandomCollectible() {
        const env = this.getCurrentEnvironment();
        const collectibles = env.sprites.collectibles;
        return collectibles[Math.floor(Math.random() * collectibles.length)];
    }
    
    getRandomDecoration() {
        const env = this.getCurrentEnvironment();
        const decorations = env.sprites.decorations;
        return decorations[Math.floor(Math.random() * decorations.length)];
    }
    
    getSkyGradient(ctx, width, height) {
        const env = this.getCurrentEnvironment();
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        
        env.colors.sky.forEach((color, index) => {
            gradient.addColorStop(index / (env.colors.sky.length - 1), color);
        });
        
        return gradient;
    }
    
    getDifficultyMultiplier() {
        return this.getCurrentEnvironment().difficulty;
    }
    
    renderBackground(ctx, width, height, scrollX) {
        const env = this.getCurrentEnvironment();
        
        // Arrière-plan spécifique à l'environnement
        switch(env.name) {
            case 'Tokyo Moderne':
                this.renderTokyoBackground(ctx, width, height, scrollX);
                break;
            case 'Temple Ancien':
                this.renderTempleBackground(ctx, width, height, scrollX);
                break;
            case 'Forêt Mystique':
                this.renderForestBackground(ctx, width, height, scrollX);
                break;
            case 'Festival Matsuri':
                this.renderFestivalBackground(ctx, width, height, scrollX);
                break;
        }
    }
    
    renderTokyoBackground(ctx, width, height, scrollX) {
        const env = this.getCurrentEnvironment();
        
        // Ciel dégradé
        ctx.fillStyle = this.getSkyGradient(ctx, width, height);
        ctx.fillRect(0, 0, width, height);
        
        // Gratte-ciels en arrière-plan
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        env.sprites.background.forEach((sprite, index) => {
            const x = (scrollX * 0.1 + index * 180) % (width + 180);
            const y = 120 + Math.sin(index) * 30;
            ctx.globalAlpha = 0.4;
            ctx.fillText(sprite, x, y);
        });
        
        // Néons et lumières
        ctx.font = '24px Arial';
        env.sprites.decorations.forEach((decoration, index) => {
            const x = (scrollX * 0.6 + index * 90) % (width + 90);
            const y = 180 + Math.sin(Date.now() * 0.001 + index) * 5;
            ctx.globalAlpha = 0.8;
            ctx.fillText(decoration, x, y);
        });
        
        ctx.globalAlpha = 1;
        
        // Sol urbain
        ctx.fillStyle = env.colors.ground;
        ctx.fillRect(0, height - 100, width, 100);
        
        // Ligne d'horizon avec effet néon
        ctx.strokeStyle = env.colors.accent;
        ctx.lineWidth = 3;
        ctx.shadowColor = env.colors.accent;
        ctx.shadowBlur = 10;
        ctx.setLineDash([10, 5]);
        ctx.beginPath();
        ctx.moveTo(0, height - 100);
        ctx.lineTo(width, height - 100);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.shadowBlur = 0;
    }
    
    renderTempleBackground(ctx, width, height, scrollX) {
        const env = this.getCurrentEnvironment();
        
        // Ciel dégradé
        ctx.fillStyle = this.getSkyGradient(ctx, width, height);
        ctx.fillRect(0, 0, width, height);
        
        // Montagnes et temples
        ctx.font = '40px Arial';
        ctx.textAlign = 'center';
        env.sprites.background.forEach((sprite, index) => {
            const x = (scrollX * 0.05 + index * 200) % (width + 200);
            const y = 100 + Math.sin(index * 0.5) * 25;
            ctx.globalAlpha = 0.3;
            ctx.fillText(sprite, x, y);
        });
        
        // Pétales de cerisier flottants
        ctx.font = '20px Arial';
        for (let i = 0; i < 15; i++) {
            const x = (scrollX * 0.4 + i * 60 + Math.sin(Date.now() * 0.001 + i) * 20) % (width + 60);
            const y = 50 + Math.sin(Date.now() * 0.002 + i) * 100;
            ctx.globalAlpha = 0.6;
            ctx.fillText('🌸', x, y);
        }
        
        ctx.globalAlpha = 1;
        
        // Sol du temple
        ctx.fillStyle = env.colors.ground;
        ctx.fillRect(0, height - 100, width, 100);
        
        // Chemin de pierre
        ctx.strokeStyle = env.colors.accent;
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 8]);
        ctx.beginPath();
        ctx.moveTo(0, height - 100);
        ctx.lineTo(width, height - 100);
        ctx.stroke();
        ctx.setLineDash([]);
    }
    
    renderForestBackground(ctx, width, height, scrollX) {
        const env = this.getCurrentEnvironment();
        
        // Ciel dégradé
        ctx.fillStyle = this.getSkyGradient(ctx, width, height);
        ctx.fillRect(0, 0, width, height);
        
        // Arbres en couches
        ctx.font = '50px Arial';
        ctx.textAlign = 'center';
        env.sprites.background.forEach((sprite, index) => {
            const x = (scrollX * 0.2 + index * 120) % (width + 120);
            const y = 140 + Math.sin(index * 0.8) * 20;
            ctx.globalAlpha = 0.4;
            ctx.fillText(sprite, x, y);
        });
        
        // Particules mystiques
        ctx.font = '16px Arial';
        for (let i = 0; i < 20; i++) {
            const x = (scrollX * 0.8 + i * 40 + Math.sin(Date.now() * 0.003 + i) * 30) % (width + 40);
            const y = 80 + Math.sin(Date.now() * 0.004 + i) * 120;
            ctx.globalAlpha = 0.5 + Math.sin(Date.now() * 0.005 + i) * 0.3;
            ctx.fillText('✨', x, y);
        }
        
        ctx.globalAlpha = 1;
        
        // Sol forestier
        ctx.fillStyle = env.colors.ground;
        ctx.fillRect(0, height - 100, width, 100);
        
        // Sentier naturel
        ctx.strokeStyle = env.colors.accent;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.7;
        ctx.setLineDash([3, 7]);
        ctx.beginPath();
        ctx.moveTo(0, height - 100);
        ctx.lineTo(width, height - 100);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;
    }
    
    renderFestivalBackground(ctx, width, height, scrollX) {
        const env = this.getCurrentEnvironment();
        
        // Ciel dégradé
        ctx.fillStyle = this.getSkyGradient(ctx, width, height);
        ctx.fillRect(0, 0, width, height);
        
        // Décorations de festival
        ctx.font = '36px Arial';
        ctx.textAlign = 'center';
        env.sprites.background.forEach((sprite, index) => {
            const x = (scrollX * 0.3 + index * 100) % (width + 100);
            const y = 120 + Math.sin(Date.now() * 0.002 + index) * 15;
            ctx.globalAlpha = 0.7;
            ctx.fillText(sprite, x, y);
        });
        
        // Feux d'artifice et confettis
        ctx.font = '28px Arial';
        for (let i = 0; i < 12; i++) {
            const x = (scrollX * 0.5 + i * 80 + Math.sin(Date.now() * 0.003 + i) * 25) % (width + 80);
            const y = 60 + Math.sin(Date.now() * 0.004 + i) * 80;
            ctx.globalAlpha = 0.8 + Math.sin(Date.now() * 0.006 + i) * 0.2;
            const effects = ['🎆', '✨', '🎊', '🎉'];
            ctx.fillText(effects[i % effects.length], x, y);
        }
        
        ctx.globalAlpha = 1;
        
        // Sol du festival
        ctx.fillStyle = env.colors.ground;
        ctx.fillRect(0, height - 100, width, 100);
        
        // Chemin festif
        ctx.strokeStyle = env.colors.accent;
        ctx.lineWidth = 4;
        ctx.shadowColor = env.colors.accent;
        ctx.shadowBlur = 8;
        ctx.setLineDash([15, 5]);
        ctx.beginPath();
        ctx.moveTo(0, height - 100);
        ctx.lineTo(width, height - 100);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.shadowBlur = 0;
    }
    
    renderTransition(ctx, width, height) {
        if (!this.isTransitioning) return;
        
        // Effet de transition avec particules
        ctx.fillStyle = `rgba(255, 255, 255, ${this.transitionProgress * 0.8})`;
        ctx.fillRect(0, 0, width, height);
        
        // Particules de transition
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const size = Math.random() * 10 + 5;
            ctx.fillStyle = `rgba(255, 215, 0, ${this.transitionProgress * 0.6})`;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Texte de transition
        ctx.fillStyle = '#000';
        ctx.font = 'bold 32px Orbitron';
        ctx.textAlign = 'center';
        ctx.globalAlpha = this.transitionProgress;
        
        const nextEnv = this.environments[this.currentEnvironment];
        ctx.fillText(`Entering ${nextEnv.name}`, width/2, height/2);
        
        // Icône de l'environnement
        ctx.font = '48px Arial';
        const envIcon = nextEnv.sprites.background[0];
        ctx.fillText(envIcon, width/2, height/2 + 60);
        
        ctx.globalAlpha = 1;
    }
    
    renderEnvironmentDecorations(ctx, width, height, scrollX) {
        const env = this.getCurrentEnvironment();
        
        // Décorations spécifiques à l'environnement
        switch(env.name) {
            case 'Tokyo Moderne':
                this.renderTokyoDecorations(ctx, width, height, scrollX);
                break;
            case 'Temple Ancien':
                this.renderTempleDecorations(ctx, width, height, scrollX);
                break;
            case 'Forêt Mystique':
                this.renderForestDecorations(ctx, width, height, scrollX);
                break;
            case 'Festival Matsuri':
                this.renderFestivalDecorations(ctx, width, height, scrollX);
                break;
        }
    }
    
    renderDecorations(ctx, distance, width, groundY) {
        const env = this.getCurrentEnvironment();
        
        // Décorations spécifiques à l'environnement
        switch(env.name) {
            case 'Tokyo Moderne':
                this.renderTokyoDecorationsGround(ctx, distance, width, groundY);
                break;
            case 'Temple Ancien':
                this.renderTempleDecorationsGround(ctx, distance, width, groundY);
                break;
            case 'Forêt Mystique':
                this.renderForestDecorationsGround(ctx, distance, width, groundY);
                break;
            case 'Festival Matsuri':
                this.renderFestivalDecorationsGround(ctx, distance, width, groundY);
                break;
        }
    }
    
    renderTokyoDecorationsGround(ctx, distance, width, groundY) {
        // Lumières de circulation
        ctx.font = '20px Arial';
        for (let i = 0; i < 8; i++) {
            const x = (distance * 0.9 + i * 100) % (width + 100);
            const y = groundY + 20;
            ctx.globalAlpha = 0.8;
            const lights = ['🚦', '💡', '🌃'];
            ctx.fillText(lights[i % lights.length], x, y);
        }
        ctx.globalAlpha = 1;
    }
    
    renderTempleDecorationsGround(ctx, distance, width, groundY) {
        // Lanternes et éléments zen
        ctx.font = '24px Arial';
        for (let i = 0; i < 6; i++) {
            const x = (distance * 0.8 + i * 120) % (width + 120);
            const y = groundY + 30 + Math.sin(Date.now() * 0.001 + i) * 5;
            ctx.globalAlpha = 0.9;
            const decorations = ['🏮', '🕯️', '📿'];
            ctx.fillText(decorations[i % decorations.length], x, y);
        }
        ctx.globalAlpha = 1;
    }
    
    renderForestDecorationsGround(ctx, distance, width, groundY) {
        // Éléments naturels
        ctx.font = '18px Arial';
        for (let i = 0; i < 10; i++) {
            const x = (distance * 1.1 + i * 80) % (width + 80);
            const y = groundY + 40 + Math.sin(Date.now() * 0.002 + i) * 8;
            ctx.globalAlpha = 0.7;
            const nature = ['🍃', '🌿', '🦋', '🌺'];
            ctx.fillText(nature[i % nature.length], x, y);
        }
        ctx.globalAlpha = 1;
    }
    
    renderFestivalDecorationsGround(ctx, distance, width, groundY) {
        // Décorations festives animées
        ctx.font = '22px Arial';
        for (let i = 0; i < 7; i++) {
            const x = (distance * 0.7 + i * 110) % (width + 110);
            const y = groundY + 25 + Math.sin(Date.now() * 0.003 + i) * 10;
            ctx.globalAlpha = 0.9 + Math.sin(Date.now() * 0.005 + i) * 0.1;
            const festival = ['🎊', '🎉', '🎈', '🎀'];
            ctx.fillText(festival[i % festival.length], x, y);
        }
        ctx.globalAlpha = 1;
    }
    
    renderTokyoDecorations(ctx, width, height, scrollX) {
        // Lumières de circulation
        ctx.font = '20px Arial';
        for (let i = 0; i < 8; i++) {
            const x = (scrollX * 0.9 + i * 100) % (width + 100);
            const y = height - 80;
            ctx.globalAlpha = 0.8;
            const lights = ['🚦', '💡', '🌃'];
            ctx.fillText(lights[i % lights.length], x, y);
        }
        ctx.globalAlpha = 1;
    }
    
    renderTempleDecorations(ctx, width, height, scrollX) {
        // Lanternes et éléments zen
        ctx.font = '24px Arial';
        for (let i = 0; i < 6; i++) {
            const x = (scrollX * 0.8 + i * 120) % (width + 120);
            const y = height - 70 + Math.sin(Date.now() * 0.001 + i) * 5;
            ctx.globalAlpha = 0.9;
            const decorations = ['🏮', '🕯️', '📿'];
            ctx.fillText(decorations[i % decorations.length], x, y);
        }
        ctx.globalAlpha = 1;
    }
    
    renderForestDecorations(ctx, width, height, scrollX) {
        // Éléments naturels
        ctx.font = '18px Arial';
        for (let i = 0; i < 10; i++) {
            const x = (scrollX * 1.1 + i * 80) % (width + 80);
            const y = height - 60 + Math.sin(Date.now() * 0.002 + i) * 8;
            ctx.globalAlpha = 0.7;
            const nature = ['🍃', '🌿', '🦋', '🌺'];
            ctx.fillText(nature[i % nature.length], x, y);
        }
        ctx.globalAlpha = 1;
    }
    
    renderFestivalDecorations(ctx, width, height, scrollX) {
        // Décorations festives animées
        ctx.font = '22px Arial';
        for (let i = 0; i < 7; i++) {
            const x = (scrollX * 0.7 + i * 110) % (width + 110);
            const y = height - 75 + Math.sin(Date.now() * 0.003 + i) * 10;
            ctx.globalAlpha = 0.9 + Math.sin(Date.now() * 0.005 + i) * 0.1;
            const festival = ['🎊', '🎉', '🎈', '🎀'];
            ctx.fillText(festival[i % festival.length], x, y);
        }
        ctx.globalAlpha = 1;
    }
}

// Export pour utilisation dans le jeu principal
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnvironmentManager;
}