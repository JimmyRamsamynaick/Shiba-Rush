// Système de sprites et assets pour Shiba Rush
// Optimisé pour les bornes d'arcade avec rendu pixel art

class SpriteManager {
    constructor() {
        this.sprites = {
            shiba: {
                idle: this.createShibaSprite('idle'),
                run: this.createShibaSprite('run'),
                jump: this.createShibaSprite('jump'),
                slide: this.createShibaSprite('slide'),
                dash: this.createShibaSprite('dash')
            },
            environments: {
                tokyo: this.createTokyoSprites(),
                temple: this.createTempleSprites(),
                forest: this.createForestSprites(),
                festival: this.createFestivalSprites()
            },
            effects: {
                particles: this.createParticleSprites(),
                powerups: this.createPowerupSprites()
            },
            ui: {
                buttons: this.createUISprites(),
                icons: this.createIconSprites()
            }
        };
        
        this.animations = {
            shibaRun: { frames: 4, speed: 8 },
            shibaTail: { frames: 2, speed: 10 },
            particles: { frames: 6, speed: 4 },
            powerupGlow: { frames: 8, speed: 6 }
        };
        
        this.currentFrame = 0;
        this.frameCounter = 0;
    }
    
    createShibaSprite(action) {
        // Création de sprites pixel art pour le Shiba
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 32;
        canvas.height = 32;
        
        // Désactiver l'antialiasing pour un look pixel art
        ctx.imageSmoothingEnabled = false;
        
        switch(action) {
            case 'idle':
                return this.drawShibaIdle(ctx);
            case 'run':
                return this.drawShibaRun(ctx);
            case 'jump':
                return this.drawShibaJump(ctx);
            case 'slide':
                return this.drawShibaSlide(ctx);
            case 'dash':
                return this.drawShibaDash(ctx);
            default:
                return canvas;
        }
    }
    
    drawShibaIdle(ctx) {
        // Corps principal
        ctx.fillStyle = '#DEB887'; // Beige Shiba
        ctx.fillRect(8, 12, 16, 12);
        
        // Tête
        ctx.fillRect(10, 6, 12, 8);
        
        // Oreilles
        ctx.fillStyle = '#CD853F';
        ctx.fillRect(9, 4, 3, 4);
        ctx.fillRect(20, 4, 3, 4);
        
        // Yeux
        ctx.fillStyle = '#000';
        ctx.fillRect(12, 8, 2, 2);
        ctx.fillRect(18, 8, 2, 2);
        
        // Museau
        ctx.fillStyle = '#000';
        ctx.fillRect(15, 11, 2, 1);
        
        // Queue
        ctx.fillStyle = '#DEB887';
        ctx.fillRect(24, 14, 4, 6);
        
        // Pattes
        ctx.fillStyle = '#CD853F';
        ctx.fillRect(10, 24, 3, 6);
        ctx.fillRect(13, 24, 3, 6);
        ctx.fillRect(16, 24, 3, 6);
        ctx.fillRect(19, 24, 3, 6);
        
        return ctx.canvas;
    }
    
    drawShibaRun(ctx) {
        // Animation de course avec pattes en mouvement
        this.drawShibaIdle(ctx);
        
        // Effet de mouvement sur les pattes
        const offset = Math.sin(Date.now() * 0.01) * 2;
        ctx.fillStyle = '#CD853F';
        ctx.fillRect(10, 24 + offset, 3, 6);
        ctx.fillRect(16, 24 - offset, 3, 6);
        
        return ctx.canvas;
    }
    
    drawShibaJump(ctx) {
        // Shiba en position de saut
        this.drawShibaIdle(ctx);
        
        // Queue relevée
        ctx.fillStyle = '#DEB887';
        ctx.fillRect(24, 10, 4, 8);
        
        // Pattes repliées
        ctx.fillStyle = '#CD853F';
        ctx.fillRect(11, 20, 2, 4);
        ctx.fillRect(14, 20, 2, 4);
        ctx.fillRect(17, 20, 2, 4);
        ctx.fillRect(20, 20, 2, 4);
        
        return ctx.canvas;
    }
    
    drawShibaSlide(ctx) {
        // Shiba en position de glissade
        ctx.fillStyle = '#DEB887';
        ctx.fillRect(4, 18, 20, 8);
        
        // Tête allongée
        ctx.fillRect(6, 14, 12, 6);
        
        // Oreilles
        ctx.fillStyle = '#CD853F';
        ctx.fillRect(5, 12, 3, 4);
        ctx.fillRect(16, 12, 3, 4);
        
        // Yeux
        ctx.fillStyle = '#000';
        ctx.fillRect(8, 16, 2, 2);
        ctx.fillRect(12, 16, 2, 2);
        
        // Queue traînante
        ctx.fillStyle = '#DEB887';
        ctx.fillRect(24, 20, 6, 4);
        
        return ctx.canvas;
    }
    
    drawShibaDash(ctx) {
        // Shiba avec effet de vitesse
        this.drawShibaRun(ctx);
        
        // Effet de traînée dorée
        ctx.fillStyle = '#FFD700';
        ctx.globalAlpha = 0.6;
        ctx.fillRect(2, 12, 6, 12);
        ctx.fillRect(0, 14, 4, 8);
        ctx.globalAlpha = 1.0;
        
        return ctx.canvas;
    }
    
    createTokyoSprites() {
        return {
            buildings: ['🏢', '🏬', '🏭', '🌃'],
            neon: ['💡', '🔆', '✨', '💫'],
            vehicles: ['🚗', '🚕', '🚌', '🚇'],
            decorations: ['🌆', '🎌', '📱', '💻']
        };
    }
    
    createTempleSprites() {
        return {
            buildings: ['⛩️', '🏯', '🏮', '🗾'],
            nature: ['🌸', '🍃', '🌿', '🦋'],
            zen: ['🕯️', '📿', '🧘', '☯️'],
            decorations: ['🎋', '🎍', '🌺', '🍂']
        };
    }
    
    createForestSprites() {
        return {
            trees: ['🌲', '🌳', '🎄', '🌴'],
            wildlife: ['🦋', '🐛', '🐝', '🦜'],
            mystical: ['✨', '🌟', '💫', '🔮'],
            decorations: ['🍄', '🌿', '🌺', '🍃']
        };
    }
    
    createFestivalSprites() {
        return {
            decorations: ['🎊', '🎉', '🎈', '🎀'],
            fireworks: ['🎆', '🎇', '✨', '💥'],
            food: ['🍡', '🍢', '🍱', '🍜'],
            games: ['🎯', '🎪', '🎠', '🎡']
        };
    }
    
    createParticleSprites() {
        const particles = {};
        const types = ['dust', 'spark', 'glow', 'trail'];
        
        types.forEach(type => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = 8;
            canvas.height = 8;
            
            ctx.imageSmoothingEnabled = false;
            
            switch(type) {
                case 'dust':
                    ctx.fillStyle = '#D2B48C';
                    ctx.fillRect(2, 2, 4, 4);
                    break;
                case 'spark':
                    ctx.fillStyle = '#FFD700';
                    ctx.fillRect(3, 1, 2, 6);
                    ctx.fillRect(1, 3, 6, 2);
                    break;
                case 'glow':
                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillRect(3, 3, 2, 2);
                    ctx.globalAlpha = 0.5;
                    ctx.fillRect(2, 2, 4, 4);
                    ctx.globalAlpha = 1.0;
                    break;
                case 'trail':
                    ctx.fillStyle = '#87CEEB';
                    ctx.fillRect(0, 3, 8, 2);
                    break;
            }
            
            particles[type] = canvas;
        });
        
        return particles;
    }
    
    createPowerupSprites() {
        const powerups = {};
        const types = ['speed', 'magnet', 'shield', 'multiplier'];
        
        types.forEach(type => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = 16;
            canvas.height = 16;
            
            ctx.imageSmoothingEnabled = false;
            
            // Base commune
            ctx.fillStyle = '#FFD700';
            ctx.fillRect(2, 2, 12, 12);
            ctx.fillStyle = '#FFA500';
            ctx.fillRect(3, 3, 10, 10);
            
            // Icône spécifique
            ctx.fillStyle = '#000';
            switch(type) {
                case 'speed':
                    ctx.fillRect(6, 5, 4, 2);
                    ctx.fillRect(8, 7, 4, 2);
                    ctx.fillRect(6, 9, 4, 2);
                    break;
                case 'magnet':
                    ctx.fillRect(5, 5, 2, 6);
                    ctx.fillRect(9, 5, 2, 6);
                    ctx.fillRect(7, 5, 2, 2);
                    ctx.fillRect(7, 9, 2, 2);
                    break;
                case 'shield':
                    ctx.fillRect(6, 4, 4, 8);
                    ctx.fillRect(5, 6, 6, 4);
                    break;
                case 'multiplier':
                    ctx.fillRect(6, 5, 4, 2);
                    ctx.fillRect(6, 9, 4, 2);
                    ctx.fillRect(7, 7, 2, 2);
                    break;
            }
            
            powerups[type] = canvas;
        });
        
        return powerups;
    }
    
    createUISprites() {
        return {
            buttons: {
                start: '▶️',
                pause: '⏸️',
                settings: '⚙️',
                costume: '👘',
                back: '⬅️'
            },
            borders: {
                arcade: '═══════════════════',
                neon: '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓',
                traditional: '━━━━━━━━━━━━━━━━━━━'
            }
        };
    }
    
    createIconSprites() {
        return {
            score: '🏆',
            coins: '🪙',
            distance: '📏',
            speed: '💨',
            environment: '🌍',
            costume: '👘',
            sound: '🔊',
            fps: '📊'
        };
    }
    
    update() {
        this.frameCounter++;
        
        // Mise à jour des animations
        Object.keys(this.animations).forEach(animName => {
            const anim = this.animations[animName];
            if (this.frameCounter % anim.speed === 0) {
                this.currentFrame = (this.currentFrame + 1) % anim.frames;
            }
        });
    }
    
    getSprite(category, type, state = 'default') {
        try {
            return this.sprites[category][type][state] || this.sprites[category][type];
        } catch (e) {
            console.warn(`Sprite non trouvé: ${category}.${type}.${state}`);
            return null;
        }
    }
    
    renderSprite(ctx, sprite, x, y, scale = 1) {
        if (!sprite) return;
        
        ctx.save();
        ctx.imageSmoothingEnabled = false;
        
        if (typeof sprite === 'string') {
            // Emoji ou texte
            ctx.font = `${16 * scale}px Arial`;
            ctx.fillText(sprite, x, y);
        } else {
            // Canvas sprite
            ctx.drawImage(sprite, x, y, sprite.width * scale, sprite.height * scale);
        }
        
        ctx.restore();
    }
    
    createPixelEffect(ctx, x, y, color, size = 2) {
        // Effet pixel parfait pour les particules
        ctx.fillStyle = color;
        ctx.fillRect(Math.floor(x), Math.floor(y), size, size);
    }
    
    // Méthodes utilitaires pour les effets visuels
    createGlowEffect(ctx, x, y, radius, color, intensity = 0.5) {
        ctx.save();
        ctx.globalAlpha = intensity;
        ctx.shadowColor = color;
        ctx.shadowBlur = radius;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, radius / 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
    
    createTrailEffect(ctx, points, color, width = 2) {
        if (points.length < 2) return;
        
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        
        for (let i = 1; i < points.length; i++) {
            ctx.globalAlpha = i / points.length;
            ctx.lineTo(points[i].x, points[i].y);
        }
        
        ctx.stroke();
        ctx.restore();
    }
}

// Export pour utilisation dans le jeu principal
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SpriteManager;
}