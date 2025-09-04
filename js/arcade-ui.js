// Interface utilisateur optimisée pour bornes d'arcade
// Navigation joystick + boutons, affichage haute visibilité

class ArcadeUI {
    constructor(game) {
        this.game = game;
        this.currentMenu = 'main';
        this.selectedIndex = 0;
        this.menuItems = {};
        this.animations = {
            glow: 0,
            pulse: 0,
            scroll: 0
        };
        
        // Configuration des menus
        this.setupMenus();
        
        // Écouteurs d'événements arcade
        this.setupArcadeControls();
        
        // Timers pour les animations
        this.animationTimer = 0;
        this.lastInputTime = Date.now();
        this.inputCooldown = 200; // ms
    }
    
    setupMenus() {
        this.menuItems = {
            main: [
                { text: '▶️ COMMENCER', action: 'startGame', icon: '🎮' },
                { text: '👘 COSTUMES', action: 'openCostumes', icon: '🎨' },
                { text: '⚙️ OPTIONS', action: 'openSettings', icon: '🔧' },
                { text: '🏆 SCORES', action: 'openScores', icon: '📊' },
                { text: '❓ AIDE', action: 'openHelp', icon: '💡' }
            ],
            costumes: [
                { text: '🐕 SHIBA CLASSIQUE', action: 'selectCostume', data: 'classic', cost: 0 },
                { text: '🥷 NINJA SHIBA', action: 'selectCostume', data: 'ninja', cost: 100 },
                { text: '⚔️ SAMOURAÏ SHIBA', action: 'selectCostume', data: 'samurai', cost: 250 },
                { text: '👘 GEISHA SHIBA', action: 'selectCostume', data: 'geisha', cost: 500 },
                { text: '🤖 CYBER SHIBA', action: 'selectCostume', data: 'cyber', cost: 1000 },
                { text: '⬅️ RETOUR', action: 'backToMain', icon: '🔙' }
            ],
            settings: [
                { text: '🔊 VOLUME: HIGH', action: 'toggleVolume', icon: '🎵' },
                { text: '📺 RÉSOLUTION: 720P', action: 'toggleResolution', icon: '🖥️' },
                { text: '⚡ EFFETS: ON', action: 'toggleEffects', icon: '✨' },
                { text: '🎯 DIFFICULTÉ: NORMAL', action: 'toggleDifficulty', icon: '🎲' },
                { text: '💾 SAUVEGARDER', action: 'saveSettings', icon: '💿' },
                { text: '⬅️ RETOUR', action: 'backToMain', icon: '🔙' }
            ],
            scores: [
                { text: '🥇 MEILLEUR: 0', action: 'none', icon: '👑' },
                { text: '📈 DERNIÈRE: 0', action: 'none', icon: '📊' },
                { text: '🏃 DISTANCE MAX: 0m', action: 'none', icon: '📏' },
                { text: '🪙 PIÈCES TOTALES: 0', action: 'none', icon: '💰' },
                { text: '🗑️ EFFACER SCORES', action: 'clearScores', icon: '❌' },
                { text: '⬅️ RETOUR', action: 'backToMain', icon: '🔙' }
            ],
            help: [
                { text: '🕹️ JOYSTICK: DÉPLACER', action: 'none', icon: '⬆️' },
                { text: '🔴 BOUTON 1: SAUT', action: 'none', icon: '🦘' },
                { text: '🔵 BOUTON 2: DASH', action: 'none', icon: '💨' },
                { text: '⬇️ BAS: GLISSADE', action: 'none', icon: '🐕' },
                { text: '⚡ SPÉCIAL: ENVIRONNEMENT', action: 'none', icon: '🌍' },
                { text: '⬅️ RETOUR', action: 'backToMain', icon: '🔙' }
            ],
            gameOver: [
                { text: '🔄 REJOUER', action: 'restartGame', icon: '🎮' },
                { text: '📊 VOIR SCORES', action: 'openScores', icon: '🏆' },
                { text: '🏠 MENU PRINCIPAL', action: 'backToMain', icon: '🏠' }
            ]
        };
    }
    
    setupArcadeControls() {
        window.addEventListener('arcadeInput', (e) => {
            const { input, pressed } = e.detail;
            
            if (!pressed || Date.now() - this.lastInputTime < this.inputCooldown) return;
            this.lastInputTime = Date.now();
            
            switch(input) {
                case 'P1_UP':
                    this.navigateUp();
                    break;
                case 'P1_DOWN':
                    this.navigateDown();
                    break;
                case 'P1_BUTTON1':
                case 'P1_START':
                    this.selectItem();
                    break;
                case 'P1_BUTTON2':
                    this.goBack();
                    break;
            }
        });
        
        // Contrôles clavier de fallback
        document.addEventListener('keydown', (e) => {
            if (Date.now() - this.lastInputTime < this.inputCooldown) return;
            
            switch(e.code) {
                case 'ArrowUp':
                case 'KeyW':
                    this.navigateUp();
                    break;
                case 'ArrowDown':
                case 'KeyS':
                    this.navigateDown();
                    break;
                case 'Enter':
                case 'Space':
                    this.selectItem();
                    break;
                case 'Escape':
                case 'Backspace':
                    this.goBack();
                    break;
            }
        });
    }
    
    navigateUp() {
        const items = this.menuItems[this.currentMenu];
        this.selectedIndex = (this.selectedIndex - 1 + items.length) % items.length;
        this.game.audioManager.playSound('menuMove');
    }
    
    navigateDown() {
        const items = this.menuItems[this.currentMenu];
        this.selectedIndex = (this.selectedIndex + 1) % items.length;
        this.game.audioManager.playSound('menuMove');
    }
    
    selectItem() {
        const items = this.menuItems[this.currentMenu];
        const selectedItem = items[this.selectedIndex];
        
        this.game.audioManager.playSound('menuSelect');
        this.executeAction(selectedItem.action, selectedItem.data);
    }
    
    goBack() {
        if (this.currentMenu !== 'main') {
            this.currentMenu = 'main';
            this.selectedIndex = 0;
            this.game.audioManager.playSound('menuBack');
        }
    }
    
    executeAction(action, data) {
        switch(action) {
            case 'startGame':
                this.game.startGame();
                break;
            case 'openCostumes':
                this.currentMenu = 'costumes';
                this.selectedIndex = 0;
                this.updateCostumeMenu();
                break;
            case 'openSettings':
                this.currentMenu = 'settings';
                this.selectedIndex = 0;
                this.updateSettingsMenu();
                break;
            case 'openScores':
                this.currentMenu = 'scores';
                this.selectedIndex = 0;
                this.updateScoresMenu();
                break;
            case 'openHelp':
                this.currentMenu = 'help';
                this.selectedIndex = 0;
                break;
            case 'selectCostume':
                this.game.costumeManager.selectCostume(data);
                break;
            case 'toggleVolume':
                this.game.audioManager.toggleVolume();
                this.updateSettingsMenu();
                break;
            case 'toggleResolution':
                this.game.arcadeConfig.toggleResolution();
                this.updateSettingsMenu();
                break;
            case 'toggleEffects':
                this.game.arcadeConfig.toggleEffects();
                this.updateSettingsMenu();
                break;
            case 'toggleDifficulty':
                this.game.toggleDifficulty();
                this.updateSettingsMenu();
                break;
            case 'saveSettings':
                this.game.arcadeConfig.saveSettings();
                this.game.audioManager.saveSettings();
                break;
            case 'clearScores':
                this.clearAllScores();
                this.updateScoresMenu();
                break;
            case 'restartGame':
                this.game.restartGame();
                break;
            case 'backToMain':
                this.currentMenu = 'main';
                this.selectedIndex = 0;
                break;
        }
    }
    
    updateCostumeMenu() {
        const costumes = this.game.costumeManager.costumes;
        this.menuItems.costumes = [];
        
        Object.keys(costumes).forEach(key => {
            const costume = costumes[key];
            const canAfford = this.game.coins >= costume.cost;
            const isUnlocked = costume.unlocked;
            const isCurrent = this.game.costumeManager.currentCostume === key;
            
            let text = `${costume.icon || '🐕'} ${costume.name.toUpperCase()}`;
            if (isCurrent) text += ' ✅';
            else if (!isUnlocked) text += ` (${costume.cost}🪙)`;
            
            this.menuItems.costumes.push({
                text: text,
                action: isUnlocked ? 'selectCostume' : 'buyCostume',
                data: key,
                cost: costume.cost,
                canAfford: canAfford,
                unlocked: isUnlocked,
                current: isCurrent
            });
        });
        
        this.menuItems.costumes.push({ text: '⬅️ RETOUR', action: 'backToMain', icon: '🔙' });
    }
    
    updateSettingsMenu() {
        const audio = this.game.audioManager;
        const arcade = this.game.arcadeConfig;
        
        this.menuItems.settings = [
            { text: `🔊 VOLUME: ${audio.settings.masterVolume > 0.5 ? 'HIGH' : 'LOW'}`, action: 'toggleVolume', icon: '🎵' },
            { text: `📺 RÉSOLUTION: ${arcade.settings.display.resolution}`, action: 'toggleResolution', icon: '🖥️' },
            { text: `⚡ EFFETS: ${arcade.settings.rendering.particleEffects ? 'ON' : 'OFF'}`, action: 'toggleEffects', icon: '✨' },
            { text: `🎯 DIFFICULTÉ: ${this.game.difficulty || 'NORMAL'}`, action: 'toggleDifficulty', icon: '🎲' },
            { text: '💾 SAUVEGARDER', action: 'saveSettings', icon: '💿' },
            { text: '⬅️ RETOUR', action: 'backToMain', icon: '🔙' }
        ];
    }
    
    updateScoresMenu() {
        const scores = this.game.getScores();
        
        this.menuItems.scores = [
            { text: `🥇 MEILLEUR: ${scores.highScore || 0}`, action: 'none', icon: '👑' },
            { text: `📈 DERNIÈRE: ${scores.lastScore || 0}`, action: 'none', icon: '📊' },
            { text: `🏃 DISTANCE MAX: ${scores.maxDistance || 0}m`, action: 'none', icon: '📏' },
            { text: `🪙 PIÈCES TOTALES: ${scores.totalCoins || 0}`, action: 'none', icon: '💰' },
            { text: '🗑️ EFFACER SCORES', action: 'clearScores', icon: '❌' },
            { text: '⬅️ RETOUR', action: 'backToMain', icon: '🔙' }
        ];
    }
    
    clearAllScores() {
        localStorage.removeItem('shibaRush_scores');
        localStorage.removeItem('shibaRush_coins');
        this.game.coins = 0;
    }
    
    update() {
        this.animationTimer += 0.1;
        this.animations.glow = Math.sin(this.animationTimer) * 0.5 + 0.5;
        this.animations.pulse = Math.sin(this.animationTimer * 2) * 0.3 + 0.7;
        this.animations.scroll = Math.sin(this.animationTimer * 0.5) * 10;
    }
    
    render(ctx, width, height) {
        if (this.game.gameState === 'playing') return;
        
        this.update();
        
        // Arrière-plan du menu avec effet
        this.renderMenuBackground(ctx, width, height);
        
        // Titre du jeu
        this.renderTitle(ctx, width, height);
        
        // Menu actuel
        this.renderCurrentMenu(ctx, width, height);
        
        // Instructions en bas
        this.renderInstructions(ctx, width, height);
        
        // Informations du joueur
        this.renderPlayerInfo(ctx, width, height);
    }
    
    renderMenuBackground(ctx, width, height) {
        // Dégradé d'arrière-plan
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(0.5, '#16213e');
        gradient.addColorStop(1, '#0f0f23');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Effet de grille arcade
        ctx.strokeStyle = '#FFD700';
        ctx.globalAlpha = 0.1;
        ctx.lineWidth = 1;
        
        for (let x = 0; x < width; x += 40) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
        
        for (let y = 0; y < height; y += 40) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
        
        ctx.globalAlpha = 1;
    }
    
    renderTitle(ctx, width, height) {
        if (this.currentMenu !== 'main') return;
        
        // Titre principal avec effet de lueur
        ctx.font = 'bold 48px monospace';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#FFD700';
        ctx.strokeStyle = '#FFA500';
        ctx.lineWidth = 3;
        
        const titleY = height * 0.2;
        const glowIntensity = this.animations.glow * 20;
        
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = glowIntensity;
        
        ctx.strokeText('SHIBA RUSH', width / 2, titleY);
        ctx.fillText('SHIBA RUSH', width / 2, titleY);
        
        // Sous-titre
        ctx.font = '20px monospace';
        ctx.fillStyle = '#87CEEB';
        ctx.shadowBlur = 5;
        ctx.fillText('🐕 ENDLESS RUNNER ARCADE 🎌', width / 2, titleY + 40);
        
        ctx.shadowBlur = 0;
    }
    
    renderCurrentMenu(ctx, width, height) {
        const items = this.menuItems[this.currentMenu];
        const startY = height * 0.4;
        const itemHeight = 50;
        
        ctx.font = 'bold 24px monospace';
        ctx.textAlign = 'center';
        
        items.forEach((item, index) => {
            const y = startY + index * itemHeight;
            const isSelected = index === this.selectedIndex;
            
            // Arrière-plan de l'élément sélectionné
            if (isSelected) {
                const pulseWidth = 300 + this.animations.pulse * 50;
                ctx.fillStyle = 'rgba(255, 215, 0, 0.2)';
                ctx.fillRect(width / 2 - pulseWidth / 2, y - 20, pulseWidth, 35);
                
                ctx.strokeStyle = '#FFD700';
                ctx.lineWidth = 2;
                ctx.strokeRect(width / 2 - pulseWidth / 2, y - 20, pulseWidth, 35);
            }
            
            // Texte de l'élément
            if (isSelected) {
                ctx.fillStyle = '#FFD700';
                ctx.shadowColor = '#FFD700';
                ctx.shadowBlur = 10;
            } else {
                ctx.fillStyle = item.unlocked === false ? '#666' : '#FFF';
                ctx.shadowBlur = 0;
            }
            
            // Indicateur de sélection
            if (isSelected) {
                ctx.fillText('▶ ' + item.text + ' ◀', width / 2, y);
            } else {
                ctx.fillText(item.text, width / 2, y);
            }
            
            // Indicateur de coût pour les costumes
            if (item.cost !== undefined && !item.unlocked) {
                ctx.font = '16px monospace';
                ctx.fillStyle = item.canAfford ? '#00FF00' : '#FF0000';
                ctx.fillText(`Coût: ${item.cost} pièces`, width / 2, y + 20);
                ctx.font = 'bold 24px monospace';
            }
        });
        
        ctx.shadowBlur = 0;
    }
    
    renderInstructions(ctx, width, height) {
        ctx.font = '16px monospace';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#87CEEB';
        
        const instructionsY = height - 60;
        
        if (this.currentMenu === 'main') {
            ctx.fillText('🕹️ HAUT/BAS: Naviguer | 🔴 BOUTON 1: Sélectionner | 🔵 BOUTON 2: Retour', width / 2, instructionsY);
        } else {
            ctx.fillText('🕹️ HAUT/BAS: Naviguer | 🔴 SÉLECTIONNER | 🔵 RETOUR', width / 2, instructionsY);
        }
        
        // Version et crédits
        ctx.font = '12px monospace';
        ctx.fillStyle = '#666';
        ctx.fillText('Shiba Rush v1.0 - Optimisé pour bornes d\'arcade JAMMA', width / 2, height - 20);
    }
    
    renderPlayerInfo(ctx, width, height) {
        // Informations du joueur en haut à droite
        ctx.font = '18px monospace';
        ctx.textAlign = 'right';
        ctx.fillStyle = '#FFD700';
        
        const infoX = width - 20;
        ctx.fillText(`🪙 ${this.game.coins || 0}`, infoX, 30);
        
        const currentCostume = this.game.costumeManager.getCurrentCostume();
        ctx.fillText(`👘 ${currentCostume.name}`, infoX, 55);
        
        // Environnement actuel
        const currentEnv = this.game.environmentManager.getCurrentEnvironment();
        ctx.fillText(`🌍 ${currentEnv.name}`, infoX, 80);
    }
    
    renderGameOverScreen(ctx, width, height) {
        // Arrière-plan semi-transparent
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, width, height);
        
        // Titre Game Over
        ctx.font = 'bold 48px monospace';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#FF6B6B';
        ctx.strokeStyle = '#FF0000';
        ctx.lineWidth = 3;
        
        const titleY = height * 0.3;
        ctx.strokeText('GAME OVER', width / 2, titleY);
        ctx.fillText('GAME OVER', width / 2, titleY);
        
        // Statistiques de la partie
        ctx.font = '24px monospace';
        ctx.fillStyle = '#FFF';
        
        const statsY = titleY + 60;
        ctx.fillText(`Score: ${this.game.score}`, width / 2, statsY);
        ctx.fillText(`Distance: ${Math.floor(this.game.distance / 10)}m`, width / 2, statsY + 30);
        ctx.fillText(`Pièces: ${this.game.coinsThisRun || 0}`, width / 2, statsY + 60);
        
        // Menu Game Over
        this.currentMenu = 'gameOver';
        this.renderCurrentMenu(ctx, width, height);
    }
}

// Export pour utilisation dans le jeu principal
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ArcadeUI;
}