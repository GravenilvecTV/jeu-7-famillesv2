import { useEffect, useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { socketService } from '../services/socketService';
import { useGameStore } from '../store/gameStore';
import { SOCKET_EVENTS } from '../constants/game';

export const useSocket = () => {
  const queryClient = useQueryClient();
  const socketRef = useRef(null);
  
  const {
    setIsConnected,
    setSocketError,
    setPlayerCount,
    setPlayerList,
    gameId,
  } = useGameStore();

  const connect = useCallback(() => {
    if (socketRef.current?.connected) return;
    
    socketRef.current = socketService.connect();
    socketRef.current.connect();
    
    socketRef.current.on(SOCKET_EVENTS.CONNECT, () => {
      setIsConnected(true);
      setSocketError(false);
    });

    socketRef.current.on(SOCKET_EVENTS.CONNECT_ERROR, () => {
      setSocketError(true);
      setIsConnected(false);
    });

    socketRef.current.on(SOCKET_EVENTS.DISCONNECT, () => {
      setIsConnected(false);
    });

    socketRef.current.on(SOCKET_EVENTS.GAME_STATE, (gameState) => {
      console.log('Game state received:', gameState);
      const { updateServerGameState } = useGameStore.getState();
      updateServerGameState(gameState);
      queryClient.invalidateQueries({ queryKey: ['game', gameId] });
    });

    socketRef.current.on(SOCKET_EVENTS.PLAYER_JOINED, ({ playerName, players, count }) => {
      console.log('Player joined event:', { playerName, players, count });
      if (players && Array.isArray(players)) {
        setPlayerList(players);
        setPlayerCount(typeof count === 'number' ? count : players.length);
      } else if (playerName) {
        setPlayerList(prev => {
          if (!prev.includes(playerName)) {
            return [...prev, playerName];
          }
          return prev;
        });
        if (typeof count === 'number') {
          setPlayerCount(count);
        }
      }
    });

    socketRef.current.on(SOCKET_EVENTS.PLAYER_COUNT, (data) => {
      console.log('Player count event:', data);
      const count = typeof data === 'number' ? data : data?.count;
      if (typeof count === 'number') {
        setPlayerCount(count);
      }
    });

    socketRef.current.on(SOCKET_EVENTS.PLAYER_LIST, (players) => {
      console.log('Player list event:', players);
      if (Array.isArray(players)) {
        setPlayerList(players);
        setPlayerCount(players.length);
      }
    });

    // Add game message handler
    socketRef.current.on('gameMessage', ({ message }) => {
      console.log('Game message:', message);
      const { setMessage } = useGameStore.getState();
      setMessage(message);
    });

    // Add game finished handler
    socketRef.current.on('gameFinished', ({ winner }) => {
      console.log('Game finished, winner:', winner);
      const { updateGameState } = useGameStore.getState();
      updateGameState({ status: 'finished', winner });
    });

    // Add player left handler
    socketRef.current.on('playerLeft', ({ playerName, players, count }) => {
      console.log('Player left:', playerName);
      setPlayerList(players);
      setPlayerCount(count);
    });

    return socketRef.current;
  }, [setIsConnected, setSocketError, setPlayerCount, setPlayerList, queryClient, gameId]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketService.disconnect();
      socketRef.current = null;
      setIsConnected(false);
      setPlayerCount(0);
      setPlayerList([]);
    }
  }, [setIsConnected, setPlayerCount, setPlayerList]);

  const joinGame = useCallback((gameId, playerName) => {
    if (socketRef.current?.connected) {
      socketService.joinGame(gameId, playerName);
    }
  }, []);

  const sendGameAction = useCallback((gameId, action) => {
    if (socketRef.current?.connected) {
      socketService.sendGameAction(gameId, action);
    }
  }, []);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    connect,
    disconnect,
    joinGame,
    sendGameAction,
    isConnected: socketRef.current?.connected || false,
  };
};