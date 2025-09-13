import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gameApi } from '../api/gameApi';

export const useGame = (gameId) => {
  return useQuery({
    queryKey: ['game', gameId],
    queryFn: () => gameApi.getGame(gameId).then(res => res.data),
    enabled: !!gameId,
  });
};

export const useGames = () => {
  return useQuery({
    queryKey: ['games'],
    queryFn: () => gameApi.getAllGames().then(res => res.data),
  });
};

export const useCreateGame = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: gameApi.createGame,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['games'] });
      return data;
    },
  });
};

export const useJoinGame = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ gameId, playerName }) => gameApi.joinGame(gameId, playerName),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['game', variables.gameId] });
    },
  });
};

export const useUpdateGameState = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ gameId, state }) => gameApi.updateGameState(gameId, state),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['game', variables.gameId] });
    },
  });
};