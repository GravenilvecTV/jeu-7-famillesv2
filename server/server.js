const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const databaseService = require('./services/databaseService');
const { handleJoinGame, handleDisconnect } = require('./handlers/connectionHandler');
const { handleGameAction } = require('./handlers/gameActionHandler');
const { EVENTS, DEFAULT_GAME_ID } = require('./config/constants');

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = new Server(server, { 
  cors: { 
    origin: '*',
    methods: ['GET', 'POST']
  } 
});

app.use(express.json());

// Initialize database
async function initializeServer() {
  try {
    await databaseService.initialize();
    setupRoutes();
    setupSocketHandlers();
    startServer();
  } catch (error) {
    console.error('Erreur lors de l\'initialisation du serveur:', error);
    process.exit(1);
  }
}

// Setup REST API routes
function setupRoutes() {
  const prisma = databaseService.getPrisma();

  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Create a new game
  app.post('/games', async (req, res) => {
    try {
      const game = await databaseService.createGame();
      res.json(game);
    } catch (error) {
      console.error('Erreur création partie:', error);
      res.status(500).json({ error: 'Erreur lors de la création de la partie' });
    }
  });

  // Get game state
  app.get('/games/:gameId', async (req, res) => {
    try {
      const game = await prisma.game.findUnique({ 
        where: { id: Number(req.params.gameId) }, 
        include: { players: true } 
      });
      
      if (!game) {
        return res.status(404).json({ error: 'Partie non trouvée' });
      }
      
      res.json(game);
    } catch (error) {
      console.error('Erreur récupération partie:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération de la partie' });
    }
  });

  // Get all games
  app.get('/games', async (req, res) => {
    try {
      const games = await prisma.game.findMany({ 
        include: { players: true } 
      });
      res.json(games);
    } catch (error) {
      console.error('Erreur récupération parties:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des parties' });
    }
  });
}

// Setup WebSocket handlers
function setupSocketHandlers() {
  const prisma = databaseService.getPrisma();

  io.on('connection', (socket) => {
    console.log(`🔌 Nouveau client connecté: ${socket.id}`);
    
    // Handle player joining game
    socket.on(EVENTS.JOIN_GAME, async (data) => {
      await handleJoinGame(socket, io, prisma, data);
    });
    
    // Handle game actions
    socket.on(EVENTS.GAME_ACTION, async (data) => {
      await handleGameAction(socket, io, prisma, data);
    });
    
    // Handle disconnection
    socket.on('disconnecting', async () => {
      await handleDisconnect(socket, io, prisma);
    });
    
    socket.on('disconnect', () => {
      console.log(`🔌 Client déconnecté: ${socket.id}`);
    });
  });
}

// Start the server
function startServer() {
  const PORT = process.env.PORT || 4000;
  
  server.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════╗
║      🎮 Serveur 7 Familles             ║
║      Démarré sur le port ${PORT}          ║
║      http://localhost:${PORT}             ║
╚════════════════════════════════════════╝
    `);
  });
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n⏹️  Arrêt du serveur...');
  await databaseService.cleanup();
  server.close(() => {
    console.log('✅ Serveur arrêté proprement');
    process.exit(0);
  });
});

process.on('SIGTERM', async () => {
  console.log('\n⏹️  Arrêt du serveur...');
  await databaseService.cleanup();
  server.close(() => {
    console.log('✅ Serveur arrêté proprement');
    process.exit(0);
  });
});

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('❌ Erreur non capturée:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promise rejetée non gérée:', reason);
  process.exit(1);
});

// Start the server
initializeServer();