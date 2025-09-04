/**
 * 🚀 OPTIMISEUR DE PERFORMANCE - Shiba Rush
 * Optimisations avancées pour hardware arcade limité
 * Object pooling, culling, batch rendering
 */

class PerformanceOptimizer {
    constructor(game) {
        this.game = game;
        this.enabled = true;
        
        // Object pools pour éviter les allocations
        this.pools = {
            particles: [],
            obstacles: [],
            collectibles: [],
            effects: []
        };
        
        // Métriques de performance
        this.metrics = {
            frameTime: 0,
            renderCalls: 0,
            objectsRendered: 0,
            objectsCulled: 0,
            poolHits: 0,
            poolMisses: 0
        };
        
        // Configuration d'optimisation
        this.config = {
            maxParticles: 50,
            maxObstacles: 20,
            maxCollectibles: 15,
            cullDistance: 100, // pixels hors écran avant culling
            batchSize: 10, // objets par batch de rendu
            targetFPS: 60,
            adaptiveQuality: true
        };
        
        // État du système
        this.lastFrameTime = performance.now();
        this.frameCount = 0;
        this.qualityLevel = 1.0; // 1.0 = qualité maximale
        
        this.init();
    }
    
    init() {
        // Initialisation des pools d'objets
        this.initObjectPools();
        
        // Démarrage du monitoring
        this.startPerformanceMonitoring();
        
        console.log('🚀 Optimiseur de performance initialisé');
    }
    
    initObjectPools() {
        // Pool de particules
        for (let i = 0; i < this.config.maxParticles; i++) {
            this.pools.particles.push(this.createParticle());
        }
        
        // Pool d'obstacles
        for (let i = 0; i < this.config.maxObstacles; i++) {
            this.pools.obstacles.push(this.createObstacle());
        }
        
        // Pool de collectibles
        for (let i = 0; i < this.config.maxCollectibles; i++) {
            this.pools.collectibles.push(this.createCollectible());
        }
    }
    
    createParticle() {
        return {
            x: 0, y: 0, vx: 0, vy: 0,
            life: 0, maxLife: 60,
            color: '#FFF', size: 2,
            type: 'dust', active: false
        };
    }
    
    createObstacle() {
        return {
            x: 0, y: 0, width: 40, height: 40,
            type: 'box', active: false,
            sprite: null, animation: 0
        };
    }
    
    createCollectible() {
        return {
            x: 0, y: 0, width: 20, height: 20,
            type: 'coin', value: 10, active: false,
            animation: 0, collected: false
        };
    }
    
    // Object pooling - récupération d'objets
    getFromPool(poolName) {
        const pool = this.pools[poolName];
        
        // Chercher un objet inactif
        for (let i = 0; i < pool.length; i++) {
            if (!pool[i].active) {
                pool[i].active = true;
                this.metrics.poolHits++;
                return pool[i];
            }
        }
        
        // Aucun objet disponible - créer si possible
        if (pool.length < this.config[`max${poolName.charAt(0).toUpperCase() + poolName.slice(1)}`]) {
            let newObj;
            switch(poolName) {
                case 'particles': newObj = this.createParticle(); break;
                case 'obstacles': newObj = this.createObstacle(); break;
                case 'collectibles': newObj = this.createCollectible(); break;
                default: return null;
            }
            newObj.active = true;
            pool.push(newObj);
            this.metrics.poolMisses++;
            return newObj;
        }
        
        return null; // Pool plein
    }
    
    // Retour d'objet au pool
    returnToPool(obj, poolName) {
        obj.active = false;
        // Reset des propriétés si nécessaire
        if (poolName === 'particles') {
            obj.life = 0;
        }
    }
    
    // Culling - élimination des objets hors écran
    cullObjects(objects, camera = { x: 0, y: 0 }) {
        const canvas = this.game.canvas;
        const cullDistance = this.config.cullDistance;
        
        let culled = 0;
        let rendered = 0;
        
        for (let i = 0; i < objects.length; i++) {
            const obj = objects[i];
            if (!obj.active) continue;
            
            // Vérification des limites de l'écran avec marge
            const onScreen = (
                obj.x + obj.width > camera.x - cullDistance &&
                obj.x < camera.x + canvas.width + cullDistance &&
                obj.y + obj.height > camera.y - cullDistance &&
                obj.y < camera.y + canvas.height + cullDistance
            );
            
            if (onScreen) {
                rendered++;
            } else {
                culled++;
                // Marquer pour suppression si trop loin
                if (obj.x < camera.x - cullDistance * 2) {
                    this.returnToPool(obj, this.getPoolNameForObject(obj));
                }
            }
        }
        
        this.metrics.objectsRendered += rendered;
        this.metrics.objectsCulled += culled;
        
        return objects.filter(obj => obj.active);
    }
    
    getPoolNameForObject(obj) {
        if (obj.life !== undefined) return 'particles';
        if (obj.value !== undefined) return 'collectibles';
        return 'obstacles';
    }
    
    // Batch rendering - rendu par lots
    batchRender(ctx, objects, renderFunction) {
        const batchSize = this.config.batchSize;
        
        for (let i = 0; i < objects.length; i += batchSize) {
            const batch = objects.slice(i, i + batchSize);
            
            // Optimisations de contexte par batch
            ctx.save();
            
            // Rendu du batch
            batch.forEach(obj => {
                if (obj.active) {
                    renderFunction(ctx, obj);
                    this.metrics.renderCalls++;
                }
            });
            
            ctx.restore();
        }
    }
    
    // Qualité adaptative
    updateAdaptiveQuality() {
        if (!this.config.adaptiveQuality) return;
        
        const currentFPS = 1000 / this.metrics.frameTime;
        const targetFPS = this.config.targetFPS;
        
        if (currentFPS < targetFPS * 0.8) {
            // Performance dégradée - réduire la qualité
            this.qualityLevel = Math.max(0.5, this.qualityLevel - 0.1);
            this.applyQualityReduction();
        } else if (currentFPS > targetFPS * 0.95 && this.qualityLevel < 1.0) {
            // Performance stable - augmenter la qualité
            this.qualityLevel = Math.min(1.0, this.qualityLevel + 0.05);
            this.applyQualityImprovement();
        }
    }
    
    applyQualityReduction() {
        // Réduction du nombre de particules
        this.config.maxParticles = Math.floor(50 * this.qualityLevel);
        
        // Réduction de la distance de culling
        this.config.cullDistance = Math.floor(100 * this.qualityLevel);
        
        console.log(`🔧 Qualité réduite à ${Math.floor(this.qualityLevel * 100)}%`);
    }
    
    applyQualityImprovement() {
        // Restauration progressive de la qualité
        this.config.maxParticles = Math.floor(50 * this.qualityLevel);
        this.config.cullDistance = Math.floor(100 * this.qualityLevel);
    }
    
    // Monitoring des performances
    startPerformanceMonitoring() {
        setInterval(() => {
            this.updateMetrics();
            this.updateAdaptiveQuality();
            
            // Log des métriques si debug activé
            if (this.game.arcadeConfig.settings?.debug?.showPerformance) {
                this.logPerformanceMetrics();
            }
        }, 1000); // Toutes les secondes
    }
    
    updateMetrics() {
        const now = performance.now();
        this.metrics.frameTime = now - this.lastFrameTime;
        this.lastFrameTime = now;
        this.frameCount++;
    }
    
    logPerformanceMetrics() {
        const fps = Math.round(1000 / this.metrics.frameTime);
        console.log('📊 Performance:', {
            FPS: fps,
            'Objets rendus': this.metrics.objectsRendered,
            'Objets éliminés': this.metrics.objectsCulled,
            'Pool hits': this.metrics.poolHits,
            'Pool misses': this.metrics.poolMisses,
            'Qualité': `${Math.floor(this.qualityLevel * 100)}%`
        });
        
        // Reset des compteurs
        this.metrics.objectsRendered = 0;
        this.metrics.objectsCulled = 0;
        this.metrics.renderCalls = 0;
    }
    
    // Optimisation de la mémoire
    garbageCollect() {
        // Nettoyage des pools
        Object.keys(this.pools).forEach(poolName => {
            const pool = this.pools[poolName];
            // Garder seulement les objets actifs et un buffer minimum
            const activeCount = pool.filter(obj => obj.active).length;
            const minBuffer = Math.floor(this.config[`max${poolName.charAt(0).toUpperCase() + poolName.slice(1)}`] * 0.3);
            
            if (pool.length > activeCount + minBuffer) {
                this.pools[poolName] = pool.slice(0, activeCount + minBuffer);
            }
        });
    }
    
    // Interface publique pour le jeu
    optimizeParticles(particles) {
        return this.cullObjects(particles);
    }
    
    optimizeObstacles(obstacles) {
        return this.cullObjects(obstacles);
    }
    
    optimizeCollectibles(collectibles) {
        return this.cullObjects(collectibles);
    }
    
    createOptimizedParticle(x, y, type = 'dust') {
        const particle = this.getFromPool('particles');
        if (particle) {
            particle.x = x;
            particle.y = y;
            particle.type = type;
            particle.life = particle.maxLife;
            return particle;
        }
        return null;
    }
    
    createOptimizedObstacle(x, y, type = 'box') {
        const obstacle = this.getFromPool('obstacles');
        if (obstacle) {
            obstacle.x = x;
            obstacle.y = y;
            obstacle.type = type;
            return obstacle;
        }
        return null;
    }
    
    createOptimizedCollectible(x, y, type = 'coin') {
        const collectible = this.getFromPool('collectibles');
        if (collectible) {
            collectible.x = x;
            collectible.y = y;
            collectible.type = type;
            collectible.collected = false;
            return collectible;
        }
        return null;
    }
    
    // Méthodes utilitaires
    getQualityLevel() {
        return this.qualityLevel;
    }
    
    getMetrics() {
        return { ...this.metrics };
    }
    
    setEnabled(enabled) {
        this.enabled = enabled;
    }
    
    // Nettoyage
    destroy() {
        // Nettoyage des pools
        Object.keys(this.pools).forEach(poolName => {
            this.pools[poolName] = [];
        });
        
        console.log('🚀 Optimiseur de performance détruit');
    }
}

// Export pour utilisation dans le jeu principal
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceOptimizer;
}