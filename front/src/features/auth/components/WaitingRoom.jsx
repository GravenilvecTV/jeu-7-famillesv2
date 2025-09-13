import { Button } from '../../../components/ui/Button';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { GAME_CONSTANTS } from '../../../constants/game';

export const WaitingRoom = ({ playerCount, playerList, onDisconnect }) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-white text-2xl font-bold mb-4">
        En attente de joueurs...
      </div>
      
      <div className="text-white text-lg font-semibold">
        Joueurs dans la partie : {playerCount}/{GAME_CONSTANTS.MAX_PLAYERS}
      </div>
      
      <ul className="text-white text-lg font-bold mt-2 bg-white bg-opacity-20 rounded px-6 py-3 shadow">
        {playerList.length > 0 ? (
          playerList.map((player, idx) => (
            <li key={idx}>• {player}</li>
          ))
        ) : (
          <li className="italic text-gray-200">Aucun joueur connecté</li>
        )}
      </ul>
      
      <div className="flex items-center gap-2 text-white text-base mt-6">
        <LoadingSpinner size="sm" />
        <span className="animate-pulse">
          La partie commence dès que {GAME_CONSTANTS.MIN_PLAYERS} joueurs sont dans la partie
        </span>
      </div>
      
      <Button
        variant="danger"
        onClick={onDisconnect}
        className="mt-6"
      >
        Quitter
      </Button>
    </div>
  );
};