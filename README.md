# 🐕 SHIBA RUSH - 柴犬ラッシュ

*Un jeu d'arcade endless runner inspiré de Tokyo avec notre adorable Shiba Inu !*

## 🌸 À propos du jeu

**Shiba Rush** est un jeu d'arcade endless runner optimisé pour les bornes d'arcade japonaises. Incarnez un adorable Shiba Inu qui court à travers les environnements emblématiques de Tokyo, collectant des pièces et évitant les obstacles dans une aventure sans fin !

### 🎮 Caractéristiques principales

- **🏃‍♂️ Gameplay fluide** : Sautez, glissez et dashez à travers Tokyo
- **🌆 Environnements japonais authentiques** :
  - 🏙️ **Shibuya** - Le cœur urbain de Tokyo
  - ⛩️ **Temple** - Sanctuaires traditionnels paisibles
  - 🌲 **Forêt de bambous** - Nature mystique japonaise
  - 🎌 **Festival Matsuri** - Célébrations colorées
- **👘 Système de costumes** : Débloquez des tenues adorables pour votre Shiba
- **🏆 Mode Attract** : Démonstration AI avec tableau des scores
- **⚡ Optimisé arcade** : Performance optimale sur hardware limité
- **🎵 Audio immersif** : Musiques et effets sonores thématiques

## 🕹️ Contrôles

### Contrôles Arcade (JAMMA)
- **Bouton 1** : Saut
- **Bouton 2** : Dash
- **Joystick Bas** : Glissade
- **Joystick Haut** : Action spéciale (changement d'environnement)

### Contrôles Clavier
- **Espace** : Saut
- **Shift** : Dash
- **Flèche Bas** : Glissade
- **Flèche Haut** : Action spéciale

## 🎯 Objectifs

- 🏃‍♂️ Courez le plus loin possible
- 🪙 Collectez un maximum de pièces
- 🏆 Battez votre meilleur score
- 👘 Débloquez tous les costumes
- 🌍 Explorez tous les environnements

## 🛠️ Architecture technique

### Structure du projet
```
Shiba-Rush/
├── index.html              # Point d'entrée principal
├── js/
│   ├── game.js            # Logique principale du jeu
│   ├── arcade-config.js   # Configuration arcade JAMMA
│   ├── arcade-ui.js       # Interface utilisateur arcade
│   ├── attract-mode.js    # Mode attract avec AI
│   ├── audio.js           # Gestionnaire audio
│   ├── costumes.js        # Système de costumes
│   ├── environments.js    # Environnements japonais
│   ├── performance-optimizer.js # Optimisations performance
│   └── sprites.js         # Gestionnaire de sprites
└── README.md              # Ce fichier
```

### Spécifications techniques
- **Résolution** : 720x480 (compatible 480p/720p)
- **Framerate** : 60 FPS
- **Input** : Compatible JAMMA (Joystick + 2 boutons)
- **Audio** : Stéréo, optimisé pour haut-parleurs arcade
- **Performance** : Object pooling, culling, batch rendering

## 🚀 Installation et lancement

### Prérequis
- Navigateur web moderne (Chrome, Firefox, Safari)
- Serveur HTTP local

### Lancement rapide
```bash
# Cloner le projet
git clone [repository-url]
cd Shiba-Rush

# Lancer un serveur HTTP local
python3 -m http.server 8000
# ou
npx serve .
# ou
php -S localhost:8000

# Ouvrir dans le navigateur
open http://localhost:8000
```

## 🎨 Thème et esthétique

### Palette de couleurs
- **🌸 Rose Sakura** : `#FFB7C5` - Douceur japonaise
- **🟡 Jaune Shiba** : `#D2691E` - Couleur du pelage
- **🔵 Bleu Tokyo** : `#1E90FF` - Modernité urbaine
- **🟢 Vert Bambou** : `#228B22` - Nature traditionnelle
- **🔴 Rouge Torii** : `#DC143C` - Spiritualité

### Inspirations
- **Shibuya Crossing** - L'énergie urbaine de Tokyo
- **Temples Sensoji** - La tradition millénaire
- **Parc Ueno** - La nature en ville
- **Festivals Matsuri** - La joie collective
- **Shiba Inu** - L'adorable mascotte japonaise

## 🏆 Système de scores

### Calcul du score
- **Distance parcourue** : 1 point par pixel
- **Pièces collectées** : 10 points par pièce
- **Changement d'environnement** : 50 points bonus
- **Multiplicateurs d'environnement** : Jusqu'à x2

### Tableau des scores
- **🥇 Top 10** des meilleurs scores
- **📊 Statistiques** : Distance, pièces, temps
- **💾 Sauvegarde locale** persistante

## 🎮 Mode Attract

Le mode attract se déclenche automatiquement après 30 secondes d'inactivité :
- **🤖 IA de démonstration** : Gameplay automatique
- **🏆 Affichage des high scores** : Top 10 des joueurs
- **📋 Instructions** : Guide des contrôles
- **🎵 Musique d'ambiance** : Thème principal

## 🔧 Optimisations performance

### Techniques implémentées
- **Object Pooling** : Réutilisation des objets
- **Frustum Culling** : Rendu sélectif
- **Batch Rendering** : Optimisation du rendu
- **Adaptive Quality** : Ajustement automatique
- **Garbage Collection** : Nettoyage périodique

### Métriques en temps réel
- **FPS** : Images par seconde
- **Objets rendus** : Compteur d'éléments
- **Niveau de qualité** : Adaptation automatique

## 🎵 Audio

### Musiques
- **🎼 Thème principal** : Mélodie entraînante
- **🌸 Ambiance Shibuya** : Rythme urbain
- **⛩️ Sérénité Temple** : Calme traditionnel
- **🌲 Mystère Forêt** : Nature apaisante
- **🎌 Joie Festival** : Célébration festive

### Effets sonores
- **🐕 Aboiements Shiba** : Expressions adorables
- **🪙 Collecte pièces** : Satisfaction immédiate
- **💨 Dash** : Vitesse et puissance
- **⚠️ Collision** : Feedback d'impact

## 👘 Système de costumes

### Costumes disponibles
- **🐕 Classique** : Le Shiba naturel
- **👘 Kimono** : Élégance traditionnelle
- **🥷 Ninja** : Furtivité et agilité
- **🌸 Sakura** : Beauté printanière
- **🎌 Festival** : Joie matsuri
- **⛩️ Moine** : Sagesse spirituelle

### Déblocage
- **🪙 Achat avec pièces** collectées
- **🏆 Récompenses de score** pour les meilleurs
- **🎯 Défis spéciaux** à accomplir

## 🌟 Fonctionnalités avancées

### Environnements dynamiques
- **🌅 Cycle jour/nuit** : Ambiances changeantes
- **🌦️ Effets météo** : Pluie, neige, soleil
- **🎆 Événements spéciaux** : Feux d'artifice, festivals
- **🏗️ Obstacles uniques** par environnement

### Particules et effets
- **✨ Traînées de dash** : Effet de vitesse
- **🌸 Pétales de sakura** : Ambiance poétique
- **💫 Collecte de pièces** : Feedback visuel
- **💥 Impacts** : Retour tactile

## 🐛 Débogage

### Console de développement
- **F12** : Ouvrir les outils développeur
- **Console** : Messages de débogage
- **Performance** : Métriques temps réel
- **Network** : Chargement des ressources

### Logs utiles
```javascript
// Afficher les métriques de performance
console.log(game.performanceOptimizer.getMetrics());

// Vérifier l'état du jeu
console.log(game.gameState);

// Déboguer l'audio
console.log(game.audioManager.isEnabled);
```

## 🤝 Contribution

Ce projet est ouvert aux contributions ! Voici comment participer :

1. **🍴 Fork** le projet
2. **🌿 Créer** une branche feature
3. **💻 Développer** votre fonctionnalité
4. **✅ Tester** soigneusement
5. **📤 Soumettre** une pull request

### Domaines d'amélioration
- **🎨 Nouveaux environnements** japonais
- **👘 Costumes additionnels** pour Shiba
- **🎵 Musiques originales** thématiques
- **🏆 Modes de jeu** alternatifs
- **📱 Adaptation mobile** responsive

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🙏 Remerciements

- **🐕 Communauté Shiba Inu** : Inspiration adorable
- **🇯🇵 Culture japonaise** : Richesse esthétique
- **🎮 Arcade classique** : Héritage du gaming
- **🌸 Tokyo** : Ville inspirante
- **👥 Développeurs** : Passion du code

---

*Fait avec ❤️ pour les amoureux des Shiba Inu et de la culture japonaise*

**がんばって！(Ganbatte!) - Bonne chance dans votre course !** 🐕🏃‍♂️✨