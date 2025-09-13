import { Button } from '../../../components/ui/Button';
import { Timer } from '../../../components/ui/Timer';
import { Message } from '../../../components/ui/Message';

export const GameControls = ({
  timer = 60,
  message,
  isGameOver,
  isPlayerTurn,
  isSelectingOpponent,
  hasSelectedCard,
  onAskCard,
  onDrawCard,
  onNextPlayer,
  winner,
}) => {
  return (
    <div className={`absolute bottom-0 left-0 w-full flex flex-col items-center z-40 ${
      isSelectingOpponent && isPlayerTurn ? "pointer-events-none opacity-50" : ""
    }`}>
      <div className="flex gap-2 mt-2 mb-2">
        <Button
          onClick={onAskCard}
          disabled={!isPlayerTurn || !hasSelectedCard || isSelectingOpponent}
          variant={isPlayerTurn && !isSelectingOpponent && hasSelectedCard ? "primary" : "secondary"}
        >
          Demander la carte
        </Button>
        
        <Button
          onClick={onDrawCard}
          disabled={!isPlayerTurn || isSelectingOpponent}
          variant="info"
          title="Piocher une carte"
        >
          Piocher
        </Button>
        
        <Button
          onClick={onNextPlayer}
          variant="secondary"
          title="Passer son tour"
        >
          Passer
        </Button>
      </div>
      
      <Timer timeRemaining={timer} isActive={isPlayerTurn} />
      
      <div className="w-full text-center mt-1">
        <Message message={message} variant="info" />
        {isGameOver && (
          <div className="text-xl font-bold text-red-600">
            Partie terminée ! {winner && `Gagnant : ${winner}`}
          </div>
        )}
      </div>
    </div>
  );
};