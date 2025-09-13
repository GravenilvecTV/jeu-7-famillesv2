import { useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import { socketService } from '../services/socketService';

export const useGameActions = () => {
  const { 
    gameId, 
    selectedCard,
    selectedOpponent,
    setMessage,
    setSelectedCard,
    setSelectedOpponent,
    isMyTurn 
  } = useGameStore();

  const drawCard = useCallback(() => {
    if (!isMyTurn()) {
      setMessage("Ce n'est pas votre tour !");
      return;
    }

    socketService.sendGameAction(gameId, {
      type: 'DRAW_CARD'
    });
  }, [gameId, isMyTurn, setMessage]);

  const askForCard = useCallback(() => {
    if (!isMyTurn()) {
      setMessage("Ce n'est pas votre tour !");
      return;
    }

    if (!selectedCard) {
      setMessage("Sélectionnez d'abord une carte !");
      return;
    }

    // Start opponent selection mode instead of sending directly
    const { startSelectingOpponent } = useGameStore.getState();
    startSelectingOpponent();
  }, [gameId, selectedCard, isMyTurn, setMessage]);

  const confirmAskCard = useCallback((targetPlayer) => {
    if (!isMyTurn()) {
      setMessage("Ce n'est pas votre tour !");
      return;
    }

    if (!selectedCard) {
      setMessage("Sélectionnez d'abord une carte !");
      return;
    }

    console.log('Sending ASK_CARD action:', { targetPlayer, card: selectedCard });
    
    socketService.sendGameAction(gameId, {
      type: 'ASK_CARD',
      payload: {
        targetPlayer: targetPlayer,
        card: selectedCard
      }
    });

    // Reset selections
    setSelectedCard(null);
    setSelectedOpponent(null);
    const { setIsSelectingOpponent } = useGameStore.getState();
    setIsSelectingOpponent(false);
  }, [gameId, selectedCard, isMyTurn, setMessage, setSelectedCard, setSelectedOpponent]);

  const passTurn = useCallback(() => {
    if (!isMyTurn()) {
      setMessage("Ce n'est pas votre tour !");
      return;
    }

    socketService.sendGameAction(gameId, {
      type: 'PASS_TURN'
    });
  }, [gameId, isMyTurn, setMessage]);

  return {
    drawCard,
    askForCard,
    confirmAskCard,
    passTurn
  };
};