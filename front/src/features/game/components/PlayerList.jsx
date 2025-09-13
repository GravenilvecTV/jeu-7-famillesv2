import { Button } from '../../../components/ui/Button';

export const PlayerList = ({ playerList, onDisconnect }) => {
  return (
    <div className="absolute top-4 right-4 flex flex-col items-end z-50">
      <ul className="mb-2 bg-white bg-opacity-90 rounded shadow px-4 py-2 text-gray-800 text-base max-w-xs">
        {playerList.length > 0 ? (
          playerList.filter(p => typeof p === 'string').map((player, idx) => (
            <li key={idx}>• {player}</li>
          ))
        ) : (
          <li className="italic text-gray-400">Aucun joueur</li>
        )}
      </ul>
      
      <Button
        variant="danger"
        onClick={onDisconnect}
        size="sm"
      >
        Se déconnecter
      </Button>
    </div>
  );
};