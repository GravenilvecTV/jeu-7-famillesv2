import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const initialState = {
  // Connection state
  gameId: 1,
  playerName: '',
  isConnected: false,
  socketError: false,
  
  // Server game state
  serverGameState: null,
  status: 'waiting', // waiting, playing, finished
  players: [],
  currentPlayer: null,
  currentPlayerIndex: 0,
  hands: {}, // playerName -> card count
  myHand: [], // Current player's actual cards
  deck: 0,
  completedFamilies: {},
  turnStartTime: null,
  timeRemaining: 60000,
  winner: null,
  
  // UI state
  selectedCard: null,
  selectedOpponent: null,
  isSelectingOpponent: false,
  dragOverPlayer: null,
  message: '',
  playerCount: 0,
  playerList: [],
};

export const useGameStore = create(
  devtools(
    (set, get) => ({
      ...initialState,

      // Setters
      setPlayerName: (playerName) => set({ playerName }),
      setIsConnected: (isConnected) => set({ isConnected }),
      setSocketError: (socketError) => set({ socketError }),
      setPlayerCount: (playerCount) => set({ playerCount }),
      setPlayerList: (playerList) => set({ playerList }),
      setMessage: (message) => set({ message }),
      setSelectedCard: (selectedCard) => set({ selectedCard }),
      setSelectedOpponent: (selectedOpponent) => set({ selectedOpponent }),
      setIsSelectingOpponent: (isSelectingOpponent) => set({ isSelectingOpponent }),
      setDragOverPlayer: (dragOverPlayer) => set({ dragOverPlayer }),

      // Update game state from server
      updateServerGameState: (gameState) => {
        const playerName = get().playerName;
        
        // Extract my hand if I'm a player
        let myHand = [];
        let processedHands = {};
        
        if (gameState.hands) {
          Object.keys(gameState.hands).forEach(player => {
            if (player === playerName) {
              // For current player, extract the actual cards
              myHand = gameState.hands[player] || [];
              // Store the count for consistency
              processedHands[player] = Array.isArray(myHand) ? myHand.length : myHand;
            } else {
              // For other players, it's already a number
              processedHands[player] = gameState.hands[player];
            }
          });
        }
        
        set({
          serverGameState: gameState,
          status: gameState.status,
          players: gameState.players || [],
          currentPlayer: gameState.currentPlayer,
          currentPlayerIndex: gameState.currentPlayerIndex,
          hands: processedHands,
          myHand,
          deck: gameState.deck?.length || 0,
          completedFamilies: gameState.completedFamilies || {},
          turnStartTime: gameState.turnStartTime,
          timeRemaining: gameState.timeRemaining || 60000,
          winner: gameState.winner,
        });
      },

      updateGameState: (updates) => set(updates),

      selectCard: (card) => {
        set({
          selectedCard: card,
          message: '',
          isSelectingOpponent: false,
        });
      },

      selectOpponent: (opponentName) => {
        set({
          selectedOpponent: opponentName,
          isSelectingOpponent: false,
          message: '',
        });
      },

      startSelectingOpponent: () => {
        const selectedCard = get().selectedCard;
        if (!selectedCard) {
          set({ message: "Sélectionne d'abord une carte !" });
          return false;
        }
        set({
          isSelectingOpponent: true,
          selectedOpponent: null,
          message: "Choisis le joueur à qui demander la carte.",
        });
        return true;
      },

      isMyTurn: () => {
        const { currentPlayer, playerName } = get();
        return currentPlayer === playerName;
      },

      resetGame: () => {
        set(initialState);
      },

      isWaiting: () => {
        const { status } = get();
        return status === 'waiting';
      },

      isPlaying: () => {
        const { status } = get();
        return status === 'playing';
      },
    }),
    {
      name: 'game-store',
    }
  )
);