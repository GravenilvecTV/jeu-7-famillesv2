import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';

export const useGameTimer = () => {
  const intervalRef = useRef();
  const { timeRemaining, updateGameState } = useGameStore();

  useEffect(() => {
    clearInterval(intervalRef.current);
    
    intervalRef.current = setInterval(() => {
      updateGameState(state => ({
        timeRemaining: Math.max(0, state.timeRemaining - 1000)
      }));
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [updateGameState]);

  return {
    timeRemaining: Math.floor(timeRemaining / 1000) // Convert to seconds
  };
};