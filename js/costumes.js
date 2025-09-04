/**
 * 👘 SYSTÈME DE COSTUMES - Shiba Rush
 * Gestion des costumes et objets débloquables pour le Shiba
 */

class CostumeManager {
    constructor() {
        this.costumes = {
            default: {
                name: 'Shiba Classique',
                description: 'Le look original de notre héros',
                sprites: {
                    idle: '🐕',
                    run: ['🐕', '🐶'],
                    jump: '🦮',
                    slide: '🐕‍🦺',
                    dash: '🐕💨'
                },
                unlocked: true,
                cost: 0,
                rarity: 'common',
                effects: {}
            },
            
            samurai: {
                name: 'Shiba Samouraï',
                description: 'Un guerrier noble avec son katana',
                sprites: {
                    idle: '🐕⚔️',
                    run: ['🐕⚔️', '🐶⚔️'],
                    jump: '🦮⚔️',
                    slide: '🐕‍🦺⚔️',
                    dash: '🐕⚔️💨'
                },
                unlocked: false,
                cost: 500,
                rarity: 'rare',
                effects: {
                    dashPower: 1.2,
                    scoreMultiplier: 1.1
                }
            },
            
            ninja: {
                name: 'Shiba Ninja',
                description: 'Furtif et agile dans l\'ombre',
                sprites: {
                    idle: '🐕🥷',
                    run: ['🐕🥷', '🐶🥷'],
                    jump: '🦮🥷',
                    slide: '🐕‍🦺🥷',
                    dash: '🐕🥷💨'
                },
                unlocked: false,
                cost: 750,
                rarity: 'rare',
                effects: {
                    invisibilityChance: 0.1,
                    jumpHeight: 1.15
                }
            },
            
            kimono: {
                name: 'Shiba en Kimono',
                description: 'Élégant pour les festivals',
                sprites: {
                    idle: '🐕👘',
                    run: ['🐕👘', '🐶👘'],
                    jump: '🦮👘',
                    slide: '🐕‍🦺👘',
                    dash: '🐕👘💨'
                },
                unlocked: false,
                cost: 300,
                rarity: 'uncommon',
                effects: {
                    coinMagnet: 1.5,
                    festivalBonus: 2.0
                }
            },
            
            chef: {
                name: 'Shiba Chef',
                description: 'Maître de la cuisine japonaise',
                sprites: {
                    idle: '🐕👨‍🍳',
                    run: ['🐕👨‍🍳', '🐶👨‍🍳'],
                    jump: '🦮👨‍🍳',
                    slide: '🐕‍🦺👨‍🍳',
                    dash: '🐕👨‍🍳💨'
                },
                unlocked: false,
                cost: 400,
                rarity: 'uncommon',
                effects: {
                    foodBonus: 2.0,
                    healthRegen: true
                }
            },
            
            robot: {
                name: 'Cyber Shiba',
                description: 'Shiba du futur avec des améliorations cybernétiques',
                sprites: {
                    idle: '🤖🐕',
                    run: ['🤖🐕', '🤖🐶'],
                    jump: '🤖🦮',
                    slide: '🤖🐕‍🦺',
                    dash: '🤖🐕⚡'
                },
                unlocked: false,
                cost: 1000,
                rarity: 'legendary',
                effects: {
                    speedBoost: 1.3,
                    dashCooldown: 0.7,
                    techBonus: 3.0
                }
            },
            
            golden: {
                name: 'Shiba Doré',
                description: 'La forme ultime du Shiba légendaire',
                sprites: {
                    idle: '🐕✨',
                    run: ['🐕✨', '🐶✨'],
                    jump: '🦮✨',
                    slide: '🐕‍🦺✨',
                    dash: '🐕✨💫'
                },
                unlocked: false,
                cost: 2000,
                rarity: 'mythic',
                effects: {
                    allBonus: 2.0,
                    invincibilityFrames: 1.5,
                    goldenAura: true
                }
            }
        };
        
        this.accessories = {
            none: {
                name: 'Aucun',
                sprite: '',
                unlocked: true,
                cost: 0,
                effects: {}
            },
            
            sunglasses: {
                name: 'Lunettes de Soleil',
                sprite: '🕶️',
                unlocked: false,
                cost: 100,
                effects: {
                    coolness: 1.2,
                    sunProtection: true
                }
            },
            
            hat: {
                name: 'Chapeau Traditionnel',
                sprite: '👒',
                unlocked: false,
                cost: 150,
                effects: {
                    traditionBonus: 1.3
                }
            },
            
            crown: {
                name: 'Couronne Impériale',
                sprite: '👑',
                unlocked: false,
                cost: 500,
                effects: {
                    royalBonus: 2.0,
                    scoreMultiplier: 1.5
                }
            }
        };
        
        this.currentCostume = 'default';
        this.currentAccessory = 'none';
        this.unlockedCostumes = ['default'];
        this.unlockedAccessories = ['none'];
        
        this.loadProgress();
    }
    
    init() {
        // Initialisation du gestionnaire de costumes
        this.loadProgress();
    }
    
    getCurrentCostume() {
        return this.costumes[this.currentCostume];
    }
    
    getCurrentAccessory() {
        return this.accessories[this.currentAccessory];
    }
    
    getPlayerSprite(action) {
        const costume = this.getCurrentCostume();
        const accessory = this.getCurrentAccessory();
        
        let sprite = costume.sprites[action];
        
        // Si c'est un tableau (animation), prendre le premier
        if (Array.isArray(sprite)) {
            sprite = sprite[0];
        }
        
        // Ajouter l'accessoire
        if (accessory.sprite) {
            sprite += accessory.sprite;
        }
        
        return sprite;
    }
    
    getAnimationSprites(action) {
        const costume = this.getCurrentCostume();
        const accessory = this.getCurrentAccessory();
        
        let sprites = costume.sprites[action];
        
        // Si ce n'est pas un tableau, en faire un
        if (!Array.isArray(sprites)) {
            sprites = [sprites];
        }
        
        // Ajouter l'accessoire à chaque frame
        if (accessory.sprite) {
            sprites = sprites.map(sprite => sprite + accessory.sprite);
        }
        
        return sprites;
    }
    
    getCombinedEffects() {
        const costumeEffects = this.getCurrentCostume().effects || {};
        const accessoryEffects = this.getCurrentAccessory().effects || {};
        
        // Combiner les effets
        const combined = { ...costumeEffects };
        
        Object.keys(accessoryEffects).forEach(key => {
            if (combined[key]) {
                // Multiplier les effets numériques
                if (typeof combined[key] === 'number') {
                    combined[key] *= accessoryEffects[key];
                }
            } else {
                combined[key] = accessoryEffects[key];
            }
        });
        
        return combined;
    }
    
    unlockCostume(costumeId, coins) {
        const costume = this.costumes[costumeId];
        
        if (!costume) return { success: false, message: 'Costume introuvable' };
        if (costume.unlocked) return { success: false, message: 'Déjà débloqué' };
        if (coins < costume.cost) return { success: false, message: 'Pas assez de pièces' };
        
        costume.unlocked = true;
        this.unlockedCostumes.push(costumeId);
        this.saveProgress();
        
        return { 
            success: true, 
            message: `${costume.name} débloqué !`,
            coinsSpent: costume.cost
        };
    }
    
    unlockAccessory(accessoryId, coins) {
        const accessory = this.accessories[accessoryId];
        
        if (!accessory) return { success: false, message: 'Accessoire introuvable' };
        if (accessory.unlocked) return { success: false, message: 'Déjà débloqué' };
        if (coins < accessory.cost) return { success: false, message: 'Pas assez de pièces' };
        
        accessory.unlocked = true;
        this.unlockedAccessories.push(accessoryId);
        this.saveProgress();
        
        return { 
            success: true, 
            message: `${accessory.name} débloqué !`,
            coinsSpent: accessory.cost
        };
    }
    
    equipCostume(costumeId) {
        if (this.costumes[costumeId] && this.costumes[costumeId].unlocked) {
            this.currentCostume = costumeId;
            this.saveProgress();
            return true;
        }
        return false;
    }
    
    equipAccessory(accessoryId) {
        if (this.accessories[accessoryId] && this.accessories[accessoryId].unlocked) {
            this.currentAccessory = accessoryId;
            this.saveProgress();
            return true;
        }
        return false;
    }
    
    getUnlockedCostumes() {
        return Object.keys(this.costumes).filter(id => this.costumes[id].unlocked);
    }
    
    getUnlockedAccessories() {
        return Object.keys(this.accessories).filter(id => this.accessories[id].unlocked);
    }
    
    getLockedCostumes() {
        return Object.keys(this.costumes).filter(id => !this.costumes[id].unlocked);
    }
    
    getLockedAccessories() {
        return Object.keys(this.accessories).filter(id => !this.accessories[id].unlocked);
    }
    
    getRarityColor(rarity) {
        const colors = {
            common: '#ffffff',
            uncommon: '#1eff00',
            rare: '#0070dd',
            epic: '#a335ee',
            legendary: '#ff8000',
            mythic: '#e6cc80'
        };
        return colors[rarity] || '#ffffff';
    }
    
    saveProgress() {
        try {
            const progress = {
                currentCostume: this.currentCostume,
                currentAccessory: this.currentAccessory,
                unlockedCostumes: this.unlockedCostumes,
                unlockedAccessories: this.unlockedAccessories
            };
            
            // Mettre à jour le statut unlocked
            this.unlockedCostumes.forEach(id => {
                if (this.costumes[id]) {
                    this.costumes[id].unlocked = true;
                }
            });
            
            this.unlockedAccessories.forEach(id => {
                if (this.accessories[id]) {
                    this.accessories[id].unlocked = true;
                }
            });
            
            localStorage.setItem('shibaRushCostumes', JSON.stringify(progress));
        } catch (e) {
            console.log('Impossible de sauvegarder les costumes');
        }
    }
    
    loadProgress() {
        try {
            const saved = localStorage.getItem('shibaRushCostumes');
            if (saved) {
                const progress = JSON.parse(saved);
                
                this.currentCostume = progress.currentCostume || 'default';
                this.currentAccessory = progress.currentAccessory || 'none';
                this.unlockedCostumes = progress.unlockedCostumes || ['default'];
                this.unlockedAccessories = progress.unlockedAccessories || ['none'];
                
                // Mettre à jour le statut unlocked
                this.unlockedCostumes.forEach(id => {
                    if (this.costumes[id]) {
                        this.costumes[id].unlocked = true;
                    }
                });
                
                this.unlockedAccessories.forEach(id => {
                    if (this.accessories[id]) {
                        this.accessories[id].unlocked = true;
                    }
                });
            }
        } catch (e) {
            console.log('Impossible de charger les costumes sauvegardés');
        }
    }
    
    renderCostumeMenu(ctx, width, height, coins) {
        // Fond semi-transparent
        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.fillRect(0, 0, width, height);
        
        // Titre
        ctx.fillStyle = '#ff6b6b';
        ctx.font = 'bold 32px Orbitron';
        ctx.textAlign = 'center';
        ctx.fillText('🎭 GARDE-ROBE SHIBA', width/2, 50);
        
        // Pièces disponibles
        ctx.fillStyle = '#ffd700';
        ctx.font = '20px Orbitron';
        ctx.fillText(`💰 Pièces: ${coins}`, width/2, 80);
        
        // Grille des costumes
        const cols = 3;
        const rows = Math.ceil(Object.keys(this.costumes).length / cols);
        const cellWidth = 200;
        const cellHeight = 120;
        const startX = (width - (cols * cellWidth)) / 2;
        const startY = 120;
        
        Object.entries(this.costumes).forEach(([id, costume], index) => {
            const col = index % cols;
            const row = Math.floor(index / cols);
            const x = startX + col * cellWidth;
            const y = startY + row * cellHeight;
            
            // Cadre du costume
            ctx.strokeStyle = this.getRarityColor(costume.rarity);
            ctx.lineWidth = costume.unlocked ? 3 : 1;
            ctx.strokeRect(x, y, cellWidth - 10, cellHeight - 10);
            
            // Fond
            ctx.fillStyle = costume.unlocked ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(x, y, cellWidth - 10, cellHeight - 10);
            
            // Sprite du costume
            ctx.font = '40px Arial';
            ctx.textAlign = 'center';
            ctx.fillStyle = costume.unlocked ? '#fff' : '#666';
            ctx.fillText(costume.sprites.idle, x + cellWidth/2 - 5, y + 50);
            
            // Nom
            ctx.font = '12px Orbitron';
            ctx.fillStyle = this.getRarityColor(costume.rarity);
            ctx.fillText(costume.name, x + cellWidth/2 - 5, y + 70);
            
            // Prix ou équipé
            ctx.font = '10px Orbitron';
            if (costume.unlocked) {
                if (this.currentCostume === id) {
                    ctx.fillStyle = '#00ff00';
                    ctx.fillText('ÉQUIPÉ', x + cellWidth/2 - 5, y + 85);
                } else {
                    ctx.fillStyle = '#fff';
                    ctx.fillText('CLIQUER POUR ÉQUIPER', x + cellWidth/2 - 5, y + 85);
                }
            } else {
                ctx.fillStyle = '#ffd700';
                ctx.fillText(`💰 ${costume.cost}`, x + cellWidth/2 - 5, y + 85);
            }
        });
        
        // Instructions
        ctx.fillStyle = '#fff';
        ctx.font = '16px Orbitron';
        ctx.textAlign = 'center';
        ctx.fillText('Appuyez sur ÉCHAP pour fermer', width/2, height - 30);
    }
}

// Export pour utilisation dans le jeu principal
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CostumeManager;
}