#!/bin/bash

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Vérifier que pnpm est installé
if ! command -v pnpm &> /dev/null; then
    log_error "pnpm n'est pas installé. Installez-le avec: npm install -g pnpm"
    exit 1
fi

# Fonction pour arrêter les processus
cleanup() {
    log_info "Arrêt des services..."
    if [ "$USE_PM2" = true ]; then
        pm2 delete jeu-7-familles-backend 2>/dev/null
        pm2 delete jeu-7-familles-frontend 2>/dev/null
    else
        kill $BACKEND_PID 2>/dev/null
        kill $FRONTEND_PID 2>/dev/null
    fi
    log_info "Services arrêtés."
    exit 0
}

# Capturer CTRL+C
trap cleanup INT

# Mode de lancement
MODE=${1:-"normal"}

case $MODE in
    "daemon")
        # Lancement avec PM2
        if ! command -v pm2 &> /dev/null; then
            log_error "PM2 n'est pas installé. Installez-le avec: npm install -g pm2"
            exit 1
        fi
        
        log_info "Lancement des services avec PM2..."
        
        # Backend
        cd server
        pm2 start "pnpm start" --name "jeu-7-familles-backend" --cwd .
        
        # Frontend (servir le build avec un serveur statique)
        cd ../front
        # Installer serve si nécessaire
        if ! command -v serve &> /dev/null; then
            log_info "Installation de serve..."
            npm install -g serve
        fi
        pm2 start "serve -s build -l 3000" --name "jeu-7-familles-frontend" --cwd .
        
        log_info "Services lancés avec PM2!"
        log_info "Utilisez 'pm2 list' pour voir l'état"
        log_info "Utilisez 'pm2 logs' pour voir les logs"
        log_info "Utilisez 'pm2 stop all' pour arrêter"
        ;;
        
    "stop")
        # Arrêter les services PM2
        if command -v pm2 &> /dev/null; then
            log_info "Arrêt des services PM2..."
            pm2 delete jeu-7-familles-backend 2>/dev/null
            pm2 delete jeu-7-familles-frontend 2>/dev/null
            log_info "Services arrêtés."
        else
            log_warning "PM2 n'est pas installé."
        fi
        ;;
        
    "dev")
        # Mode développement
        log_info "Lancement en mode développement..."
        
        # Backend
        log_info "Démarrage du backend sur le port 4000..."
        cd server
        pnpm start &
        BACKEND_PID=$!
        
        # Attendre que le backend démarre
        sleep 3
        
        # Frontend en mode dev
        log_info "Démarrage du frontend en mode dev sur le port 3000..."
        cd ../front
        pnpm start &
        FRONTEND_PID=$!
        
        log_info "==================================="
        log_info "Services démarrés!"
        log_info "Frontend (dev): http://localhost:3000"
        log_info "Backend: http://localhost:4000"
        log_info "Appuyez sur CTRL+C pour arrêter"
        log_info "==================================="
        
        # Attendre
        wait
        ;;
        
    *)
        # Mode normal (production local)
        log_info "Lancement en mode production local..."
        
        # Vérifier si le build existe
        if [ ! -d "front/build" ]; then
            log_warning "Build du frontend non trouvé. Construction en cours..."
            cd front
            pnpm build
            cd ..
        fi
        
        # Backend
        log_info "Démarrage du backend sur le port 4000..."
        cd server
        pnpm start &
        BACKEND_PID=$!
        
        # Attendre que le backend démarre
        sleep 3
        
        # Frontend (servir le build)
        log_info "Démarrage du frontend sur le port 3000..."
        cd ../front
        # Installer serve si nécessaire
        if ! command -v serve &> /dev/null; then
            log_info "Installation de serve..."
            npm install -g serve
        fi
        serve -s build -l 3000 &
        FRONTEND_PID=$!
        
        log_info "==================================="
        log_info "Services démarrés!"
        log_info "Frontend: http://localhost:3000"
        log_info "Backend: http://localhost:4000"
        log_info "Appuyez sur CTRL+C pour arrêter"
        log_info "==================================="
        
        # Attendre
        wait
        ;;
esac