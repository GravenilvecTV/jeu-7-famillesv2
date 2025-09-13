# 🎮 Jeu des 7 Familles - Multiplayer

Un jeu des 7 familles en ligne multijoueur pour 2 à 4 joueurs, développé avec React et Node.js.

## 🎯 Fonctionnalités

- **Multijoueur temps réel** via WebSocket (Socket.io)
- **2 à 4 joueurs** par partie
- **7 familles** de 6 cartes chacune (42 cartes au total)
- **Drag & drop** pour demander des cartes
- **Sélecteur de cartes** pour choisir précisément quelle carte demander
- **Timer de 60 secondes** par tour
- **Leaderboard en temps réel** avec les familles complétées
- **Détection automatique** des familles complétées
- **Gestion des égalités** en fin de partie

## 📦 Stack Technique

### Frontend
- React 19 avec Hooks
- TanStack Query (gestion des états serveur)
- Zustand (gestion d'état local)
- Socket.io Client
- Tailwind CSS

### Backend
- Node.js + Express
- Socket.io Server
- Prisma ORM + SQLite
- Architecture modulaire

## 🚀 Installation Locale

### Prérequis
- Node.js 18+
- pnpm (ou npm/yarn)

### Installation

```bash
# Cloner le repo
git clone <votre-repo>
cd jeu-7-familles

# Installer les dépendances
cd server && pnpm install
cd ../front && pnpm install
```

### Lancement en développement

```bash
# Terminal 1 - Backend
cd server
pnpm start

# Terminal 2 - Frontend  
cd front
pnpm start
```

Le jeu sera accessible sur `http://localhost:3000`

## 🖥️ Déploiement sur VPS

### Prérequis VPS
- Ubuntu 20.04+ ou Debian 11+
- Node.js 18+ installé
- pnpm installé globalement
- Ports 3001 (backend) et 3000 (frontend) ouverts

### Installation sur VPS

```bash
# 1. Cloner le projet
cd /var/www
git clone <votre-repo> jeu-7-familles
cd jeu-7-familles

# 2. Installer les dépendances
cd server && pnpm install
cd ../front && pnpm install

# 3. Build le frontend
cd ../front
pnpm build

# 4. Configurer les variables d'environnement
cd ../front
echo "REACT_APP_SERVER_URL=http://VOTRE_IP_VPS:3001" > .env.production

# 5. Lancer avec le script
cd ..
chmod +x start.sh
./start.sh
```

### Script de lancement (start.sh)

Le fichier `start.sh` permet de lancer les deux applications :

```bash
./start.sh        # Lance en mode normal
./start.sh daemon # Lance en arrière-plan avec PM2
./start.sh stop   # Arrête les services PM2
```

### Configuration Nginx (optionnel)

Pour servir le frontend via Nginx sur le port 80 :

```nginx
server {
    listen 80;
    server_name votre-domaine.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /socket.io/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

### Avec PM2 (recommandé pour production)

```bash
# Installer PM2 globalement
npm install -g pm2

# Lancer avec PM2
./start.sh daemon

# Voir les logs
pm2 logs

# Arrêter
pm2 stop all

# Redémarrer
pm2 restart all

# Sauvegarder la config pour démarrage auto
pm2 save
pm2 startup
```

## 🎮 Comment jouer

1. **Connexion** : Chaque joueur entre son nom
2. **Attente** : La partie démarre quand tous les joueurs sont connectés
3. **But** : Collecter le maximum de familles complètes (6 cartes de la même famille)
4. **Tour de jeu** :
   - Demander une carte spécifique à un adversaire
   - Si l'adversaire l'a → vous la recevez et continuez
   - Si l'adversaire ne l'a pas → vous piochez et c'est au suivant
5. **Fin** : Quand les 7 familles sont complétées
6. **Gagnant** : Celui qui a complété le plus de familles

## 📁 Structure du projet

```
jeu-7-familles/
├── front/                 # Application React
│   ├── src/
│   │   ├── components/   # Composants UI
│   │   ├── features/     # Fonctionnalités (game)
│   │   ├── hooks/        # Hooks personnalisés
│   │   ├── services/     # Services (socket, api)
│   │   └── store/        # État global (Zustand)
│   └── public/
│       └── images/       # Images des cartes
├── server/               # Serveur Node.js
│   ├── server.js        # Point d'entrée
│   ├── gameLogic.js     # Logique du jeu
│   ├── handlers/        # Gestionnaires Socket.io
│   ├── services/        # Services métier
│   └── prisma/          # Base de données
└── start.sh             # Script de lancement
```

## 🐛 Résolution de problèmes

### Le frontend ne se connecte pas au backend
- Vérifier que le backend tourne sur le port 3001
- Vérifier la variable `REACT_APP_SERVER_URL` dans `.env.production`
- Vérifier les règles firewall pour les ports 3001 et 3000

### Erreur "Port already in use"
```bash
# Trouver et tuer le processus
lsof -i :3001
kill -9 <PID>
```

### Base de données corrompue
```bash
cd server
rm prisma/dev.db
pnpm prisma db push
```

## 📝 Notes pour YouTubers

- Le jeu supporte **jusqu'à 4 joueurs simultanés**
- **Une seule partie** à la fois (ID fixé à 1)
- Pas de reconnexion automatique si déconnecté
- Les données sont perdues au redémarrage du serveur
- Testé pour des sessions courtes (15-30 min)

## 🤝 Contribution

Ce projet est conçu pour un usage spécifique (vidéo YouTube avec 3 participants). 
Pour des besoins plus complexes, n'hésitez pas à forker et adapter !

## 📄 Licence

MIT