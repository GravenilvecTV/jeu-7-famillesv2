# Serveur Jeu de 7 Familles

## Architecture

```
server/
├── config/
│   └── constants.js        # Constantes globales (durées, événements, etc.)
├── handlers/
│   ├── connectionHandler.js # Gestion connexion/déconnexion joueurs
│   └── gameActionHandler.js # Gestion des actions de jeu
├── services/
│   ├── databaseService.js  # Service Prisma et gestion BDD
│   ├── gameStateManager.js # Gestion état des parties en mémoire
│   └── timerService.js     # Gestion des timers de tour
├── gameLogic.js           # Logique métier du jeu
└── server.js              # Point d'entrée principal
```

## Fonctionnalités

### Gestion des parties
- État centralisé côté serveur
- Validation de toutes les actions
- Distribution automatique des cartes
- Détection des familles complètes
- Gestion du tour par tour

### Sécurité
- Vérification du tour du joueur
- Cartes cachées pour les adversaires
- Validation côté serveur uniquement
- État personnalisé par joueur

### Temps réel
- WebSocket via Socket.io
- Synchronisation automatique
- Gestion des déconnexions
- Timer automatique (60s/tour)

## API REST

### Health Check
```
GET /health
```

### Créer une partie
```
POST /games
```

### Récupérer une partie
```
GET /games/:gameId
```

### Liste des parties
```
GET /games
```

## Événements WebSocket

### Client → Serveur
- `joinGame`: Rejoindre une partie
- `gameAction`: Effectuer une action (DRAW_CARD, ASK_CARD, PASS_TURN)

### Serveur → Client
- `gameState`: État de la partie
- `gameMessage`: Message d'information
- `gameFinished`: Fin de partie
- `playerJoined`: Nouveau joueur
- `playerLeft`: Joueur parti
- `playerCount`: Nombre de joueurs
- `error`: Erreur

## Installation

```bash
pnpm install
```

## Lancement

```bash
pnpm start
```

## Base de données

Le serveur utilise Prisma avec SQLite. La base est réinitialisée à chaque démarrage avec une partie par défaut (ID=1).

## Configuration

Les constantes peuvent être modifiées dans `config/constants.js`:
- `TURN_DURATION`: Durée d'un tour (60000ms par défaut)
- `MIN_PLAYERS`: Nombre minimum de joueurs (2)
- `MAX_PLAYERS`: Nombre maximum de joueurs (4)