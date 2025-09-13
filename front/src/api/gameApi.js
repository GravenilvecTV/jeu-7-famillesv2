import { apiClient } from '../config/api';

export const gameApi = {
  createGame: () => 
    apiClient.post('/games'),

  joinGame: (gameId, playerName) => 
    apiClient.post(`/games/${gameId}/players`, { name: playerName }),

  getGame: (gameId) => 
    apiClient.get(`/games/${gameId}`),

  getAllGames: () => 
    apiClient.get('/games'),

  updateGameState: (gameId, state) => 
    apiClient.put(`/games/${gameId}/state`, { state }),
};