/**
 * 🐕 SHIBA RUSH - Endless Runner Arcade Game
 * Optimisé pour bornes d'arcade japonaises
 * Résolution: 720x480 (compatible 480p/720p)
 * Input: Joystick + 2 boutons (JAMMA compatible)
 */

class ShibaRush {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = 720;
        this.height = 480;
        
        // États du jeu
        this.gameState = 'attract'; // attract, menu, playing, paused, gameOver
        this.difficulty = 'NORMAL';
        this.score = 0;
        this.distance = 0;
        this.coins = 0;
        this.coinsThisRun = 0;
        this.speed = 3;
        this.baseSpeed = 3;
        this.maxSpeed = 12;
        
        // Gestionnaires de systèmes
        this.arcadeConfig = new ArcadeConfig();
        this.audioManager = new AudioManager();
        this.environmentManager = new EnvironmentManager();
        this.costumeManager = new CostumeManager();
        this.performanceOptimizer = new PerformanceOptimizer(this);
        this.arcadeUI = new ArcadeUI(this);
        this.attractMode = new AttractMode(this);
        
        // État des menus
        this.showCostumeMenu = false;
        this.showSettingsMenu = false;
        
        // Timer pour retour au mode attract
        this.inactivityTimer = 0;
        this.attractModeDelay = 30000; // 30 secondes d'inactivité
        
        // Shiba player
        this.player = {
            x: 100,
            y: 350,
            width: 40,
            height: 40,
            velocityY: 0,
            isJumping: false,
            isSliding: false,
            isDashing: false,
            dashCooldown: 0,
            animFrame: 0,
            costume: 'default'
        };
        
        // Physique
        this.gravity = 0.8;
        this.jumpPower = -15;
        this.groundHeight = 100;
        
        // Obstacles et collectibles
        this.obstacles = [];
        this.collectibles = [];
        this.particles = [];
        this.lastObstacleTime = 0;
        this.lastCollectibleTime = 0;
        this.lastGCTime = Date.now();
        this.dashCooldown = 0;
        
        // Compteurs de performance
        this.frameCount = 0;
        this.lastFPSUpdate = 0;
        this.currentFPS = 0;
        
        this.init();
    }
    
    // Méthodes pour l'interface arcade
    getScores() {
        try {
            const scores = JSON.parse(localStorage.getItem('shibaRushScores') || '[]');
            const highScore = parseInt(localStorage.getItem('shibaRush_highScore')) || 0;
            const totalCoins = parseInt(localStorage.getItem('shibaRush_coins')) || 0;
            
            let maxDistance = 0;
            let lastScore = 0;
            
            if (scores.length > 0) {
                lastScore = scores[scores.length - 1].score;
                maxDistance = Math.max(...scores.map(s => s.distance));
            }
            
            return {
                highScore,
                lastScore,
                maxDistance,
                totalCoins
            };
        } catch (e) {
            return {
                highScore: 0,
                lastScore: 0,
                maxDistance: 0,
                totalCoins: 0
            };
        }
    }
    
    toggleDifficulty() {
        const difficulties = ['FACILE', 'NORMAL', 'DIFFICILE', 'EXPERT'];
        const currentIndex = difficulties.indexOf(this.difficulty);
        this.difficulty = difficulties[(currentIndex + 1) % difficulties.length];
        
        // Ajuster les paramètres selon la difficulté
        switch(this.difficulty) {
            case 'FACILE':
                this.baseSpeed = 2;
                this.maxSpeed = 8;
                break;
            case 'NORMAL':
                this.baseSpeed = 3;
                this.maxSpeed = 12;
                break;
            case 'DIFFICILE':
                this.baseSpeed = 4;
                this.maxSpeed = 16;
                break;
            case 'EXPERT':
                this.baseSpeed = 5;
                this.maxSpeed = 20;
                break;
        }
    }
    
    restartGame() {
        this.startGame();
    }
    
    init() {
        console.log('🔧 Initialisation du jeu Shiba Rush...');
        
        // Configuration du canvas
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        console.log('🖼️ Canvas configuré:', this.width, 'x', this.height);
        
        // Initialisation des systèmes
        console.log('🎮 Initialisation arcade config...');
        this.arcadeConfig.init();
        
        console.log('🔊 Initialisation audio manager...');
        this.audioManager.init();
        
        console.log('🌍 Initialisation environment manager...');
        this.environmentManager.init();
        
        console.log('👘 Initialisation costume manager...');
        this.costumeManager.init();
        
        console.log('⚡ Initialisation performance optimizer...');
        this.performanceOptimizer.init();
        
        console.log('🎪 Initialisation attract mode...');
        this.attractMode.init();
        
        // Configuration des contrôles
        this.setupControls();
        
        // Démarrage de la boucle de jeu
        console.log('🔄 Démarrage de la boucle de jeu...');
        this.gameLoop();
        
        console.log('✅ Shiba Rush initialisé avec succès!');
    }
    
    setupControls() {
        console.log('🎮 Configuration des contrôles...');
        // Gestion des événements arcade
        this.arcadeConfig.setupInputHandlers((input, pressed) => {
            if (!pressed) return;
            
            console.log('🕹️ Input arcade:', input, 'État du jeu:', this.gameState);
            // Réinitialiser le timer d'inactivité à chaque interaction
            this.inactivityTimer = 0;
            
            if (this.gameState === 'attract') {
                console.log('🚪 Sortie du mode attract vers menu (arcade)');
                // Sortir du mode attract avec n'importe quelle entrée
                this.gameState = 'menu';
                this.attractMode.stop();
            } else if (this.gameState === 'playing') {
                switch(input) {
                    case 'P1_BUTTON1':
                        console.log('🦘 Saut (arcade)!');
                        this.jump();
                        break;
                    case 'P1_BUTTON2':
                        console.log('💨 Dash (arcade)!');
                        this.dash();
                        break;
                    case 'P1_DOWN':
                        console.log('🏃 Glissade (arcade)!');
                        this.slide();
                        break;
                    case 'P1_UP':
                        console.log('⭐ Action spéciale (arcade)!');
                        this.specialAction();
                        break;
                }
            }
        });
        
        // Gestion des événements clavier pour les tests
        document.addEventListener('keydown', (e) => {
            console.log('⌨️ Touche pressée:', e.code, 'État du jeu:', this.gameState);
            // Réinitialiser le timer d'inactivité à chaque interaction
            this.inactivityTimer = 0;
            
            if (this.gameState === 'attract') {
                console.log('🚪 Sortie du mode attract vers menu');
                // Sortir du mode attract avec n'importe quelle touche
                this.gameState = 'menu';
                this.attractMode.stop();
                return;
            }
            
            if (this.gameState === 'menu') {
                if (e.code === 'Space' || e.code === 'Enter') {
                    console.log('🎯 Démarrage du jeu depuis le menu');
                    this.startGame();
                }
                return;
            }
            
            if (this.gameState === 'playing') {
                switch(e.code) {
                    case 'Space':
                        e.preventDefault();
                        console.log('🦘 Saut!');
                        this.jump();
                        break;
                    case 'ShiftLeft':
                    case 'ShiftRight':
                        e.preventDefault();
                        console.log('💨 Dash!');
                        this.dash();
                        break;
                    case 'ArrowDown':
                        e.preventDefault();
                        console.log('🏃 Glissade!');
                        this.slide();
                        break;
                    case 'ArrowUp':
                        e.preventDefault();
                        console.log('⭐ Action spéciale!');
                        this.specialAction();
                        break;
                }
            }
            
            if (this.gameState === 'gameOver') {
                if (e.code === 'Space' || e.code === 'Enter') {
                    console.log('🔄 Redémarrage du jeu');
                    this.restartGame();
                }
            }
        });
    }
    
    startGame() {
        console.log('🚀 Démarrage du jeu!');
        this.gameState = 'playing';
        this.score = 0;
        this.distance = 0;
        this.coinsThisRun = 0;
        this.coins = parseInt(localStorage.getItem('shibaRush_coins')) || 0;
        this.speed = this.baseSpeed;
        this.player.y = this.canvas.height - this.groundHeight - this.player.height;
        this.player.velocityY = 0;
        this.player.isJumping = false;
        this.player.isSliding = false;
        this.player.isDashing = false;
        this.obstacles = [];
        this.collectibles = [];
        this.particles = [];
        this.lastObstacleTime = 0;
        this.lastCollectibleTime = 0;
        this.dashCooldown = 0;
        
        // Réinitialiser l'environnement
        console.log('🌍 Réinitialisation de l\'environnement');
        this.environmentManager.reset();
        
        // Démarrer la musique
        console.log('🎵 Démarrage de la musique de fond');
        this.audioManager.startBackgroundMusic();
    }
    
    jump() {
        if (!this.player.isJumping && !this.player.isSliding) {
            this.player.velocityY = this.jumpPower;
            this.player.isJumping = true;
            this.audioManager.playSound('jump');
            this.createParticleEffect(this.player.x, this.player.y + this.player.height, 'dust');
        }
    }
    
    slide() {
        if (!this.player.isJumping && !this.player.isSliding) {
            this.player.isSliding = true;
            this.player.height = 20;
            this.audioManager.playSound('slide');
            this.createParticleEffect(this.player.x + this.player.width, this.player.y + this.player.height, 'slide');
            
            setTimeout(() => {
                this.player.isSliding = false;
                this.player.height = 40;
            }, 800);
        }
    }
    
    dash() {
        if (this.dashCooldown <= 0) {
            this.player.isDashing = true;
            this.dashCooldown = 120; // 2 secondes à 60fps
            this.speed = Math.min(this.speed + 2, this.maxSpeed);
            this.audioManager.playSound('dash');
            this.createParticleEffect(this.player.x - 10, this.player.y + this.player.height / 2, 'dash');
            
            setTimeout(() => {
                this.player.isDashing = false;
            }, 300);
        }
    }
    
    specialAction() {
        // Action spéciale : changement d'environnement
        this.environmentManager.nextEnvironment();
        this.audioManager.playSound('environmentChange');
        this.score += 50; // Bonus pour changement d'environnement
    }
    
    startAttractMode() {
        this.gameState = 'attract';
        this.attractMode.start();
        this.inactivityTimer = 0;
    }
    
    exitAttractMode() {
        this.gameState = 'menu';
        this.attractMode.stop();
        this.inactivityTimer = 0;
    }
    
    isHighScore(score) {
        return this.attractMode.isHighScore(score);
    }
    
    addHighScore(score, name = 'PLAYER') {
        this.attractMode.addHighScore(score, name);
    }
    
    createParticleEffect(x, y, type) {
        const baseParticleCount = type === 'dash' ? 8 : 4;
        const particleCount = Math.floor(baseParticleCount * this.performanceOptimizer.getQualityLevel());
        
        for (let i = 0; i < particleCount; i++) {
            const particle = this.performanceOptimizer.createOptimizedParticle(
                x + Math.random() * 20 - 10,
                y + Math.random() * 20 - 10,
                type
            );
            if (particle) {
                particle.velocityX = (Math.random() - 0.5) * 4;
                particle.velocityY = (Math.random() - 0.5) * 4;
                particle.life = 30;
                particle.maxLife = 30;
                particle.type = type;
                particle.color = type === 'dash' ? '#FFD700' : '#8B4513';
                this.particles.push(particle);
            }
        }
    }
    
    update() {
        if (this.gameState === 'attract') {
            this.attractMode.update();
            return;
        }
        
        // Gestion du timer d'inactivité pour retour au mode attract
        if (this.gameState === 'menu') {
            this.inactivityTimer += 16; // ~60fps
            if (this.inactivityTimer >= this.attractModeDelay) {
                this.gameState = 'attract';
                this.attractMode.start();
                this.inactivityTimer = 0;
            }
        }
        
        if (this.gameState !== 'playing') return;
        
        // Mise à jour des systèmes
        this.environmentManager.update();
        this.audioManager.update();
        
        // Mise à jour du joueur
        this.updatePlayer();
        
        // Mise à jour des objets
        this.updateObstacles();
        this.updateCollectibles();
        this.updateParticles();
        
        // Génération d'objets
        this.spawnObjects();
        
        // Vérification des collisions
        this.checkCollisions();
        
        // Mise à jour du score et de la vitesse
        this.distance += this.speed;
        this.score += Math.floor(this.speed);
        
        // Augmentation progressive de la vitesse avec multiplicateur d'environnement
        const envMultiplier = this.environmentManager.getCurrentEnvironment().difficultyMultiplier || 1;
        if (this.speed < this.maxSpeed) {
            this.speed += 0.001 * envMultiplier;
        }
        
        // Réduction du cooldown de dash
        if (this.dashCooldown > 0) {
            this.dashCooldown--;
        }
    }
    
    updatePlayer() {
        // Physique du saut
        if (this.player.isJumping) {
            this.player.velocityY += this.gravity;
            this.player.y += this.player.velocityY;
            
            // Atterrissage
            if (this.player.y >= this.canvas.height - this.groundHeight - this.player.height) {
                this.player.y = this.canvas.height - this.groundHeight - this.player.height;
                this.player.velocityY = 0;
                this.player.isJumping = false;
            }
        }
        
        // Animation du personnage
        this.player.animFrame += 0.2;
        if (this.player.animFrame >= 4) {
            this.player.animFrame = 0;
        }
    }
    
    updateObstacles() {
        // Optimisation avec culling
        this.obstacles = this.performanceOptimizer.optimizeObstacles(this.obstacles);
        
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            const obstacle = this.obstacles[i];
            if (!obstacle.active) continue;
            
            obstacle.x -= this.speed;
            
            if (obstacle.x + obstacle.width < 0) {
                this.performanceOptimizer.returnToPool(obstacle, 'obstacles');
                this.obstacles.splice(i, 1);
            }
        }
    }
    
    updateCollectibles() {
        // Optimisation avec culling
        this.collectibles = this.performanceOptimizer.optimizeCollectibles(this.collectibles);
        
        for (let i = this.collectibles.length - 1; i >= 0; i--) {
            const collectible = this.collectibles[i];
            if (!collectible.active) continue;
            
            collectible.x -= this.speed;
            
            if (collectible.x + collectible.width < 0) {
                this.performanceOptimizer.returnToPool(collectible, 'collectibles');
                this.collectibles.splice(i, 1);
            }
        }
    }
    
    updateParticles() {
        // Optimisation avec culling
        this.particles = this.performanceOptimizer.optimizeParticles(this.particles);
        
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            if (!particle.active) continue;
            
            particle.x += particle.velocityX;
            particle.y += particle.velocityY;
            particle.life--;
            
            if (particle.life <= 0) {
                this.performanceOptimizer.returnToPool(particle, 'particles');
                this.particles.splice(i, 1);
            }
        }
    }
    
    spawnObjects() {
        const currentTime = Date.now();
        
        // Génération d'obstacles avec object pooling
        if (currentTime - this.lastObstacleTime > 2000 - (this.speed * 50)) {
            const obstacle = this.performanceOptimizer.createOptimizedObstacle(
                this.canvas.width,
                this.canvas.height - this.groundHeight - 60,
                'rock'
            );
            
            if (obstacle) {
                obstacle.width = 30;
                obstacle.height = 60;
                this.obstacles.push(obstacle);
            }
            this.lastObstacleTime = currentTime;
        }
        
        // Génération de collectibles avec object pooling
        if (currentTime - this.lastCollectibleTime > 1500) {
            const collectible = this.performanceOptimizer.createOptimizedCollectible(
                this.canvas.width,
                this.canvas.height - this.groundHeight - 100 - Math.random() * 100,
                'coin'
            );
            
            if (collectible) {
                collectible.width = 20;
                collectible.height = 20;
                collectible.value = 10;
                this.collectibles.push(collectible);
            }
            this.lastCollectibleTime = currentTime;
        }
    }
    
    checkCollisions() {
        // Collision avec obstacles
        for (const obstacle of this.obstacles) {
            if (this.isColliding(this.player, obstacle)) {
                this.gameOver();
                return;
            }
        }
        
        // Collision avec collectibles
        for (let i = this.collectibles.length - 1; i >= 0; i--) {
            const collectible = this.collectibles[i];
            if (this.isColliding(this.player, collectible)) {
                this.collectItem(collectible);
                this.collectibles.splice(i, 1);
            }
        }
    }
    
    isColliding(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }
    
    collectItem(item) {
        this.coins += item.value;
        this.coinsThisRun += item.value;
        this.score += item.value * 2;
        this.audioManager.playSound('collect');
        this.createParticleEffect(item.x, item.y, 'collect');
    }
    
    gameOver() {
        console.log('🎮 Game Over - Score:', this.score, 'Distance:', Math.floor(this.distance));
        this.gameState = 'gameOver';
        this.audioManager.playSound('gameOver');
        this.audioManager.stopBackgroundMusic();
        
        // Vérifier si c'est un high score
        console.log('🏆 Vérification high score...');
        if (this.attractMode && this.attractMode.isHighScore(this.score)) {
            console.log('🎉 Nouveau high score!', this.score);
            this.attractMode.addHighScore(this.score, 'PLAYER', Math.floor(this.distance));
        } else {
            console.log('📊 Score normal:', this.score);
        }
        
        // Sauvegarder les scores et statistiques
        this.saveGameStats();
        
        // Sauvegarder les pièces
        localStorage.setItem('shibaRush_coins', this.coins.toString());
        
        // Programmer le retour au mode attract après 10 secondes
        setTimeout(() => {
            if (this.gameState === 'gameOver') {
                console.log('⏰ Retour automatique au mode attract');
                this.startAttractMode();
            }
        }, 10000);
    }
    
    saveGameStats() {
        try {
            const highScores = JSON.parse(localStorage.getItem('shibaRushScores') || '[]');
            highScores.push({
                score: this.score,
                distance: Math.floor(this.distance),
                coins: this.coinsThisRun || this.coins,
                date: new Date().toISOString(),
                difficulty: this.difficulty
            });
            
            // Garder seulement les 10 meilleurs scores
            highScores.sort((a, b) => b.score - a.score);
            highScores.splice(10);
            
            localStorage.setItem('shibaRushScores', JSON.stringify(highScores));
            
            // Sauvegarder le meilleur score
            const highScore = parseInt(localStorage.getItem('shibaRush_highScore')) || 0;
            if (this.score > highScore) {
                localStorage.setItem('shibaRush_highScore', this.score.toString());
            }
        } catch (e) {
            console.log('Impossible de sauvegarder le score');
        }
    }
    
    render() {
        // Effacer le canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Rendu de l'arrière-plan
        this.environmentManager.renderBackground(this.ctx, this.canvas.width, this.canvas.height);
        
        // Rendu du sol
        this.ctx.fillStyle = this.environmentManager.getCurrentEnvironment().colors.ground;
        this.ctx.fillRect(0, this.canvas.height - this.groundHeight, this.canvas.width, this.groundHeight);
        
        if (this.gameState === 'playing') {
            // Rendu des décorations d'environnement
            this.environmentManager.renderDecorations(this.ctx, this.canvas.width, this.canvas.height);
            
            // Rendu des obstacles
            this.renderObstacles();
            
            // Rendu des collectibles
            this.renderCollectibles();
            
            // Rendu du joueur
            this.renderPlayer();
            
            // Rendu des particules
            this.renderParticles();
        }
        
        // Rendu de l'interface utilisateur
        if (this.gameState === 'attract') {
            this.attractMode.render(this.ctx, this.canvas.width, this.canvas.height);
        } else if (this.gameState === 'playing') {
            this.renderUI();
        } else {
            this.arcadeUI.render(this.ctx, this.canvas.width, this.canvas.height);
        }
        
        // Rendu spécial pour Game Over
        if (this.gameState === 'gameOver') {
            this.arcadeUI.renderGameOverScreen(this.ctx, this.canvas.width, this.canvas.height);
        }
        
        // Rendu du menu des costumes si ouvert
        if (this.showCostumeMenu) {
            this.costumeManager.renderMenu(this.ctx, this.canvas.width, this.canvas.height);
        }
    }
    
    renderObstacles() {
        // Batch rendering pour les obstacles
        this.performanceOptimizer.batchRender(this.ctx, this.obstacles, (ctx, obstacle) => {
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        });
    }
    
    renderCollectibles() {
        // Batch rendering pour les collectibles
        this.performanceOptimizer.batchRender(this.ctx, this.collectibles, (ctx, collectible) => {
            if (collectible.type === 'coin') {
                ctx.fillStyle = '#FFD700';
                ctx.beginPath();
                ctx.arc(
                    collectible.x + collectible.width / 2,
                    collectible.y + collectible.height / 2,
                    collectible.width / 2,
                    0,
                    Math.PI * 2
                );
                ctx.fill();
            }
        });
    }
    
    renderPlayer() {
        const costume = this.costumeManager.getCurrentCostume();
        
        // Couleur du costume
        this.ctx.fillStyle = costume.colors?.primary || '#DEB887';
        
        // Effet de dash
        if (this.player.isDashing) {
            this.ctx.shadowColor = '#FFD700';
            this.ctx.shadowBlur = 10;
        }
        
        // Corps du Shiba
        this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
        
        // Réinitialiser l'ombre
        this.ctx.shadowBlur = 0;
        
        // Détails du costume
        if (costume.colors?.secondary) {
            this.ctx.fillStyle = costume.colors.secondary;
            this.ctx.fillRect(this.player.x + 5, this.player.y + 5, this.player.width - 10, this.player.height - 10);
        }
    }
    
    renderParticles() {
        // Batch rendering pour les particules
        this.performanceOptimizer.batchRender(this.ctx, this.particles, (ctx, particle) => {
            const alpha = particle.life / particle.maxLife;
            ctx.globalAlpha = alpha;
            ctx.fillStyle = particle.color;
            ctx.fillRect(particle.x, particle.y, 4, 4);
        });
        this.ctx.globalAlpha = 1;
    }
    
    renderUI() {
        // Interface de jeu
        this.ctx.font = 'bold 20px monospace';
        this.ctx.fillStyle = '#FFD700';
        this.ctx.textAlign = 'left';
        
        // Score et distance
        this.ctx.fillText(`Score: ${Math.floor(this.score)}`, 20, 30);
        this.ctx.fillText(`Distance: ${Math.floor(this.distance / 10)}m`, 20, 55);
        this.ctx.fillText(`Pièces: ${this.coins}`, 20, 80);
        
        // Environnement actuel
        const currentEnv = this.environmentManager.getCurrentEnvironment();
        this.ctx.fillText(`Environnement: ${currentEnv.name}`, 20, 105);
        
        // Cooldown de dash
        if (this.dashCooldown > 0) {
            this.ctx.fillStyle = '#FF6B6B';
            this.ctx.fillText(`Dash: ${Math.ceil(this.dashCooldown / 60)}s`, 20, 130);
        } else {
            this.ctx.fillStyle = '#00FF00';
            this.ctx.fillText('Dash: Prêt!', 20, 130);
        }
        
        // FPS et métriques de performance (debug)
        if (this.arcadeConfig.settings?.debug?.showFPS) {
            this.ctx.fillStyle = '#87CEEB';
            this.ctx.font = '14px monospace';
            this.ctx.textAlign = 'right';
            
            const metrics = this.performanceOptimizer.getMetrics();
            const fps = Math.round(1000 / metrics.frameTime) || 60;
            const quality = Math.floor(this.performanceOptimizer.getQualityLevel() * 100);
            
            this.ctx.fillText(`FPS: ${fps}`, this.canvas.width - 20, 30);
            this.ctx.fillText(`Qualité: ${quality}%`, this.canvas.width - 20, 50);
            this.ctx.fillText(`Objets: ${metrics.objectsRendered}`, this.canvas.width - 20, 70);
        }
    }
    
    gameLoop() {
        // Calcul des FPS
        this.frameCount++;
        const currentTime = Date.now();
        if (currentTime - this.lastFPSUpdate >= 1000) {
            this.currentFPS = this.frameCount;
            this.frameCount = 0;
            this.lastFPSUpdate = currentTime;
            
            // Mise à jour des métriques de performance
            this.arcadeConfig.updatePerformanceMetrics(this.currentFPS);
        }
        
        // Mise à jour et rendu
        this.update();
        this.render();
        
        // Mise à jour des métriques de performance
        this.performanceOptimizer.updateMetrics();
        
        // Garbage collection périodique (toutes les 5 secondes)
        if (Date.now() - this.lastGCTime > 5000) {
            this.performanceOptimizer.garbageCollect();
            this.lastGCTime = Date.now();
        }
        
        // Continuer la boucle
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Initialisation du jeu
window.addEventListener('load', () => {
    new ShibaRush();
});