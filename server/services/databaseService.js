const { PrismaClient } = require('@prisma/client');
const { GAME_STATUS } = require('../config/constants');

class DatabaseService {
  constructor() {
    this.prisma = new PrismaClient({
      log: ['error', 'warn'],
    });
  }

  async initialize() {
    try {
      await this.prisma.$connect();
      await this.resetDatabase();
      console.log('Base de données initialisée avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de la base:', error);
      throw error;
    }
  }

  async resetDatabase() {
    await this.prisma.player.deleteMany({});
    await this.prisma.game.deleteMany({});
    await this.createDefaultGame();
  }

  async createDefaultGame() {
    const defaultState = {
      status: GAME_STATUS.WAITING,
      players: [],
      deck: [],
      hands: {},
      currentPlayer: null,
      currentPlayerIndex: 0,
      completedFamilies: {},
      turnStartTime: null,
      lastAction: null,
      winner: null
    };

    await this.prisma.game.create({ 
      data: {
        id: 1,
        state: JSON.stringify(defaultState)
      }
    });
    
    console.log('Partie par défaut (id=1) créée');
  }

  async createGame() {
    const defaultState = {
      status: GAME_STATUS.WAITING,
      players: [],
      deck: [],
      hands: {},
      currentPlayer: null,
      currentPlayerIndex: 0,
      completedFamilies: {},
      turnStartTime: null,
      lastAction: null,
      winner: null
    };

    return await this.prisma.game.create({ 
      data: { 
        state: JSON.stringify(defaultState)
      } 
    });
  }

  async cleanup() {
    await this.prisma.$disconnect();
  }

  getPrisma() {
    return this.prisma;
  }
}

module.exports = new DatabaseService();