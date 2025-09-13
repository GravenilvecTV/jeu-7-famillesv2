import { GAME_CONSTANTS } from '../../constants/game';

export const Timer = ({ timeRemaining, isActive }) => {
  const progressPercentage = ((GAME_CONSTANTS.TIMER_DURATION - timeRemaining) / GAME_CONSTANTS.TIMER_DURATION) * 100;
  
  if (!isActive) {
    return (
      <div className="w-full px-8 mb-2">
        <div className="relative h-3 bg-gray-200 rounded opacity-0"></div>
        <div className="text-xs text-gray-600 mt-1 text-right opacity-0">60s restantes</div>
      </div>
    );
  }
  
  return (
    <div className="w-full px-8 mb-2">
      <div className="relative h-3 bg-gray-200 rounded overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full bg-green-400 transition-all duration-1000 ease-linear"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      <div className="text-xs text-gray-600 mt-1 text-right">
        {timeRemaining}s restantes
      </div>
    </div>
  );
};