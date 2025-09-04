/**
 * 🎮 MODE ATTRACT - Shiba Rush
 * Démonstration automatique avec IA et affichage des scores
 * Compatible bornes d'arcade japonaises
 */

class AttractMode {
    constructor(game) {
        this.game = game;
        this.isActive = false;
        this.demoPlayer = null;
        this.attractTimer = 0;
        this.maxAttractTime = 60000; // 1 minute de démo
        this.idleTimer = 0;
        this.maxIdleTime = 30000; // 30 secondes avant attract
        
        // Configuration du mode attract
        this.config = {
            showHighScores: true,
            showInstructions: true,
            showCredits: true,
            cycleTime: 10000, // 10 secondes par écran
            demoSkill: 0.7 // Niveau de l'IA (0-1)
        };
        
        // État de l'écran attract
        this.currentScreen = 'title'; // title, scores, instructions, demo, credits
        this.screenTimer = 0;
        this.screenCycle = ['title', 'scores', 'instructions', 'demo', 'credits'];
        this.currentScreenIndex = 0;
        
        // Données pour l'affichage
        this.attractData = {
            title: 'SHIBA RUSH',
            subtitle: '🐕 L\'aventure arcade ultime! 🐕',
            instructions: [
                '🕹️ CONTRÔLES',
                '',
                '⬆️ SAUT - Éviter les obstacles',
                '⬇️ GLISSADE - Passer sous les barrières',
                '➡️ DASH - Traverser rapidement',
                '🔘 ACTION - Pouvoir spécial',
                '',
                '🪙 Collectez les pièces!',
                '👘 Débloquez des costumes!',
                '🌸 Explorez le Japon!'
            ],
            credits: [
                '🎮 SHIBA RUSH 🎮',
                '',
                '🎨 Développé avec passion',
                '🇯🇵 Inspiré du Japon',
                '🕹️ Optimisé pour arcade',
                '',
                '🐕 Merci de jouer! 🐕',
                '',
                '© 2024 Arcade Games'
            ]
        };
        
        this.init();
    }
    
    init() {
        // Initialisation de l'IA de démonstration
        this.demoPlayer = new DemoAI(this.game, this.config.demoSkill);
        
        // Écouteurs d'événements pour détecter l'activité
        this.setupActivityDetection();
        
        console.log('🎮 Mode Attract initialisé');
    }
    
    setupActivityDetection() {
        // Détection d'activité pour sortir du mode attract
        const resetIdleTimer = () => {
            this.idleTimer = 0;
            if (this.isActive) {
                this.stop();
            }
        };
        
        // Événements clavier
        document.addEventListener('keydown', resetIdleTimer);
        document.addEventListener('keyup', resetIdleTimer);
        
        // Événements souris (pour développement)
        document.addEventListener('mousedown', resetIdleTimer);
        document.addEventListener('mousemove', resetIdleTimer);
        
        // Événements tactiles
        document.addEventListener('touchstart', resetIdleTimer);
    }
    
    update(deltaTime) {
        if (!this.isActive) {
            // Vérifier si on doit démarrer le mode attract
            this.idleTimer += deltaTime;
            if (this.idleTimer >= this.maxIdleTime && this.game.gameState === 'menu') {
                this.start();
            }
            return;
        }
        
        // Mise à jour du mode attract
        this.attractTimer += deltaTime;
        this.screenTimer += deltaTime;
        
        // Cycle des écrans
        if (this.screenTimer >= this.config.cycleTime) {
            this.nextScreen();
        }
        
        // Mise à jour de l'IA pendant la démo
        if (this.currentScreen === 'demo' && this.demoPlayer) {
            this.demoPlayer.update(deltaTime);
        }
        
        // Arrêt automatique après le temps maximum
        if (this.attractTimer >= this.maxAttractTime) {
            this.restart();
        }
    }
    
    start() {
        this.isActive = true;
        this.attractTimer = 0;
        this.screenTimer = 0;
        this.currentScreenIndex = 0;
        this.currentScreen = this.screenCycle[0];
        
        // Sauvegarder l'état du jeu
        this.savedGameState = this.game.gameState;
        this.game.gameState = 'attract';
        
        console.log('🎮 Mode Attract démarré');
    }
    
    stop() {
        this.isActive = false;
        this.idleTimer = 0;
        
        // Restaurer l'état du jeu
        if (this.savedGameState) {
            this.game.gameState = this.savedGameState;
        } else {
            this.game.gameState = 'menu';
        }
        
        // Arrêter la démo si active
        if (this.demoPlayer) {
            this.demoPlayer.stop();
        }
        
        console.log('🎮 Mode Attract arrêté');
    }
    
    restart() {
        this.stop();
        setTimeout(() => this.start(), 1000);
    }
    
    nextScreen() {
        this.currentScreenIndex = (this.currentScreenIndex + 1) % this.screenCycle.length;
        this.currentScreen = this.screenCycle[this.currentScreenIndex];
        this.screenTimer = 0;
        
        // Actions spéciales pour certains écrans
        if (this.currentScreen === 'demo') {
            this.startDemo();
        } else if (this.demoPlayer && this.demoPlayer.isPlaying) {
            this.demoPlayer.stop();
        }
    }
    
    startDemo() {
        if (this.demoPlayer) {
            this.demoPlayer.start();
        }
    }
    
    render(ctx, width, height) {
        if (!this.isActive) return;
        
        // Arrière-plan attract
        this.renderBackground(ctx, width, height);
        
        // Rendu selon l'écran actuel
        switch (this.currentScreen) {
            case 'title':
                this.renderTitle(ctx, width, height);
                break;
            case 'scores':
                this.renderHighScores(ctx, width, height);
                break;
            case 'instructions':
                this.renderInstructions(ctx, width, height);
                break;
            case 'demo':
                this.renderDemo(ctx, width, height);
                break;
            case 'credits':
                this.renderCredits(ctx, width, height);
                break;
        }
        
        // Indicateur de progression
        this.renderProgressIndicator(ctx, width, height);
    }
    
    renderBackground(ctx, width, height) {
        // Dégradé de fond animé
        const time = Date.now() * 0.001;
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        
        const hue1 = (time * 20) % 360;
        const hue2 = (time * 20 + 180) % 360;
        
        gradient.addColorStop(0, `hsl(${hue1}, 50%, 20%)`);
        gradient.addColorStop(1, `hsl(${hue2}, 50%, 10%)`);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Particules de fond
        this.renderBackgroundParticles(ctx, width, height, time);
    }
    
    renderBackgroundParticles(ctx, width, height, time) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        
        for (let i = 0; i < 20; i++) {
            const x = (Math.sin(time + i) * 0.5 + 0.5) * width;
            const y = (Math.cos(time * 0.7 + i) * 0.5 + 0.5) * height;
            const size = Math.sin(time * 2 + i) * 2 + 3;
            
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    renderTitle(ctx, width, height) {
        // Titre principal
        ctx.font = 'bold 72px monospace';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#FFD700';
        ctx.strokeStyle = '#FF6B6B';
        ctx.lineWidth = 4;
        
        const titleY = height * 0.3;
        ctx.strokeText(this.attractData.title, width / 2, titleY);
        ctx.fillText(this.attractData.title, width / 2, titleY);
        
        // Sous-titre
        ctx.font = '32px monospace';
        ctx.fillStyle = '#87CEEB';
        ctx.fillText(this.attractData.subtitle, width / 2, titleY + 80);
        
        // Animation de pulsation
        const pulse = Math.sin(Date.now() * 0.005) * 0.1 + 1;
        ctx.save();
        ctx.scale(pulse, pulse);
        
        ctx.font = '24px monospace';
        ctx.fillStyle = '#FFF';
        ctx.fillText('APPUYEZ SUR UNE TOUCHE POUR JOUER', width / 2 / pulse, (height * 0.7) / pulse);
        
        ctx.restore();
    }
    
    renderHighScores(ctx, width, height) {
        ctx.font = 'bold 48px monospace';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#FFD700';
        ctx.fillText('🏆 MEILLEURS SCORES 🏆', width / 2, height * 0.15);
        
        // Récupération des scores
        const scores = this.game.getScores();
        
        ctx.font = '28px monospace';
        ctx.fillStyle = '#FFF';
        
        const startY = height * 0.3;
        const lineHeight = 50;
        
        if (scores.length === 0) {
            ctx.fillText('Aucun score enregistré', width / 2, startY);
            ctx.font = '20px monospace';
            ctx.fillStyle = '#87CEEB';
            ctx.fillText('Soyez le premier à jouer!', width / 2, startY + 60);
        } else {
            scores.slice(0, 10).forEach((score, index) => {
                const rank = index + 1;
                const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `${rank}.`;
                
                ctx.textAlign = 'left';
                ctx.fillText(`${medal}`, width * 0.2, startY + index * lineHeight);
                
                ctx.textAlign = 'center';
                ctx.fillText(`${score.score}`, width * 0.5, startY + index * lineHeight);
                
                ctx.textAlign = 'right';
                ctx.fillStyle = '#87CEEB';
                ctx.fillText(`${score.distance}m`, width * 0.8, startY + index * lineHeight);
                ctx.fillStyle = '#FFF';
            });
        }
    }
    
    renderInstructions(ctx, width, height) {
        ctx.font = 'bold 36px monospace';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#FFD700';
        ctx.fillText('📖 COMMENT JOUER 📖', width / 2, height * 0.1);
        
        ctx.font = '24px monospace';
        const startY = height * 0.2;
        const lineHeight = 35;
        
        this.attractData.instructions.forEach((line, index) => {
            if (line === '') return;
            
            if (line.includes('🕹️')) {
                ctx.fillStyle = '#FFD700';
                ctx.font = 'bold 28px monospace';
            } else if (line.includes('⬆️') || line.includes('⬇️') || line.includes('➡️') || line.includes('🔘')) {
                ctx.fillStyle = '#87CEEB';
                ctx.font = '22px monospace';
            } else if (line.includes('🪙') || line.includes('👘') || line.includes('🌸')) {
                ctx.fillStyle = '#98FB98';
                ctx.font = '20px monospace';
            } else {
                ctx.fillStyle = '#FFF';
                ctx.font = '24px monospace';
            }
            
            ctx.fillText(line, width / 2, startY + index * lineHeight);
        });
    }
    
    renderDemo(ctx, width, height) {
        // Rendu du jeu en mode démo
        if (this.demoPlayer && this.demoPlayer.isPlaying) {
            // Le jeu se rend normalement, on ajoute juste un overlay
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.fillRect(0, 0, width, height);
            
            ctx.font = 'bold 32px monospace';
            ctx.textAlign = 'center';
            ctx.fillStyle = '#FFD700';
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            
            ctx.strokeText('🤖 DÉMONSTRATION 🤖', width / 2, 50);
            ctx.fillText('🤖 DÉMONSTRATION 🤖', width / 2, 50);
            
            ctx.font = '20px monospace';
            ctx.fillStyle = '#FFF';
            ctx.strokeText('Appuyez sur une touche pour jouer', width / 2, height - 30);
            ctx.fillText('Appuyez sur une touche pour jouer', width / 2, height - 30);
        }
    }
    
    renderCredits(ctx, width, height) {
        ctx.font = 'bold 36px monospace';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#FFD700';
        ctx.fillText('✨ CRÉDITS ✨', width / 2, height * 0.1);
        
        ctx.font = '24px monospace';
        const startY = height * 0.25;
        const lineHeight = 40;
        
        this.attractData.credits.forEach((line, index) => {
            if (line === '') return;
            
            if (line.includes('SHIBA RUSH')) {
                ctx.fillStyle = '#FFD700';
                ctx.font = 'bold 32px monospace';
            } else if (line.includes('©')) {
                ctx.fillStyle = '#87CEEB';
                ctx.font = '18px monospace';
            } else {
                ctx.fillStyle = '#FFF';
                ctx.font = '24px monospace';
            }
            
            ctx.fillText(line, width / 2, startY + index * lineHeight);
        });
    }
    
    renderProgressIndicator(ctx, width, height) {
        // Indicateur de progression en bas
        const progress = this.screenTimer / this.config.cycleTime;
        const barWidth = width * 0.6;
        const barHeight = 4;
        const barX = (width - barWidth) / 2;
        const barY = height - 20;
        
        // Barre de fond
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        
        // Barre de progression
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(barX, barY, barWidth * progress, barHeight);
        
        // Points pour chaque écran
        const dotSize = 8;
        const dotSpacing = barWidth / (this.screenCycle.length - 1);
        
        this.screenCycle.forEach((screen, index) => {
            const dotX = barX + index * dotSpacing;
            const dotY = barY - 15;
            
            ctx.fillStyle = index === this.currentScreenIndex ? '#FFD700' : 'rgba(255, 255, 255, 0.5)';
            ctx.beginPath();
            ctx.arc(dotX, dotY, dotSize / 2, 0, Math.PI * 2);
            ctx.fill();
        });
    }
    
    // Getters
    get isRunning() {
        return this.isActive;
    }
    
    get currentScreenName() {
        return this.currentScreen;
    }
}

// IA de démonstration
class DemoAI {
    constructor(game, skillLevel = 0.7) {
        this.game = game;
        this.skillLevel = skillLevel; // 0-1, plus élevé = meilleur
        this.isPlaying = false;
        this.reactionTime = (1 - skillLevel) * 500 + 100; // 100-600ms
        this.lastAction = 0;
        this.actionCooldown = 200;
        
        // Stratégies de l'IA
        this.strategies = {
            aggressive: skillLevel > 0.8,
            defensive: skillLevel < 0.4,
            balanced: skillLevel >= 0.4 && skillLevel <= 0.8
        };
    }
    
    start() {
        this.isPlaying = true;
        this.game.startGame();
        console.log('🤖 IA de démonstration démarrée');
    }
    
    stop() {
        this.isPlaying = false;
        console.log('🤖 IA de démonstration arrêtée');
    }
    
    update(deltaTime) {
        if (!this.isPlaying || this.game.gameState !== 'playing') return;
        
        const now = Date.now();
        if (now - this.lastAction < this.actionCooldown) return;
        
        // Analyse de la situation
        const threats = this.analyzeThreats();
        const opportunities = this.analyzeOpportunities();
        
        // Prise de décision
        const action = this.decideAction(threats, opportunities);
        
        if (action) {
            this.executeAction(action);
            this.lastAction = now;
        }
    }
    
    analyzeThreats() {
        const threats = [];
        const player = this.game.player;
        const lookAhead = 200; // Distance de prédiction
        
        // Analyser les obstacles
        this.game.obstacles.forEach(obstacle => {
            const distance = obstacle.x - player.x;
            if (distance > 0 && distance < lookAhead) {
                threats.push({
                    type: 'obstacle',
                    distance: distance,
                    height: obstacle.y,
                    width: obstacle.width,
                    urgency: 1 - (distance / lookAhead)
                });
            }
        });
        
        return threats.sort((a, b) => b.urgency - a.urgency);
    }
    
    analyzeOpportunities() {
        const opportunities = [];
        const player = this.game.player;
        const lookAhead = 150;
        
        // Analyser les collectibles
        this.game.collectibles.forEach(collectible => {
            const distance = collectible.x - player.x;
            if (distance > 0 && distance < lookAhead) {
                opportunities.push({
                    type: 'collectible',
                    distance: distance,
                    value: collectible.value,
                    y: collectible.y,
                    priority: collectible.value / distance
                });
            }
        });
        
        return opportunities.sort((a, b) => b.priority - a.priority);
    }
    
    decideAction(threats, opportunities) {
        const player = this.game.player;
        
        // Gestion des menaces (priorité)
        if (threats.length > 0) {
            const threat = threats[0];
            
            if (threat.urgency > 0.7) {
                // Menace imminente
                if (threat.height > player.y) {
                    return 'slide'; // Obstacle en hauteur, glisser
                } else {
                    return Math.random() < this.skillLevel ? 'jump' : 'dash';
                }
            }
        }
        
        // Gestion des opportunités
        if (opportunities.length > 0 && Math.random() < this.skillLevel) {
            const opportunity = opportunities[0];
            
            if (opportunity.distance < 100) {
                // Collectible proche, ajuster la position
                if (Math.abs(opportunity.y - player.y) > 20) {
                    return opportunity.y < player.y ? 'jump' : 'slide';
                }
            }
        }
        
        // Actions aléatoires pour rendre la démo intéressante
        if (Math.random() < 0.02) {
            const actions = ['jump', 'dash', 'special'];
            return actions[Math.floor(Math.random() * actions.length)];
        }
        
        return null;
    }
    
    executeAction(action) {
        // Ajouter un délai de réaction réaliste
        setTimeout(() => {
            if (!this.isPlaying) return;
            
            switch (action) {
                case 'jump':
                    this.game.jump();
                    break;
                case 'slide':
                    this.game.slide();
                    break;
                case 'dash':
                    this.game.dash();
                    break;
                case 'special':
                    this.game.specialAction();
                    break;
            }
        }, Math.random() * this.reactionTime);
    }
}

// Export pour utilisation dans le jeu principal
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AttractMode, DemoAI };
}