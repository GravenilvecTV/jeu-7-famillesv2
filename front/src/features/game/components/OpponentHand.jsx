import Card from '../../../components/Card';

export const OpponentHand = ({
  position,
  playerId,
  cards = 0, // Now it's a number (card count)
  isActive = false,
  isSelectable = false,
  isDragOver = false,
  onSelect,
  onDrop,
  onDragOver,
  onDragLeave,
  playerName = '',
}) => {
  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'absolute top-8 left-1/2 transform -translate-x-1/2';
      case 'right':
        return 'absolute right-8 top-1/2 transform -translate-y-1/2';
      case 'left':
        return 'absolute left-8 top-1/2 transform -translate-y-1/2';
      default:
        return '';
    }
  };

  const getLayoutClasses = () => {
    switch (position) {
      case 'top':
        return 'flex-row';
      case 'right':
        return 'flex-col items-end';
      case 'left':
        return 'flex-col items-start';
      default:
        return '';
    }
  };

  const getPerspectiveClass = () => {
    switch (position) {
      case 'top':
        return 'opponent-hand-top';
      case 'left':
        return 'opponent-hand-left';
      case 'right':
        return 'opponent-hand-right';
      default:
        return '';
    }
  };

  const getCardRotation = (index) => {
    if (position === 'left') {
      const rotations = ["rotate-3", "rotate-2", "rotate-1", "rotate-0", "-rotate-1", "-rotate-2", "-rotate-3"];
      return rotations[index % rotations.length];
    } else if (position === 'right') {
      const rotations = ["-rotate-3", "-rotate-2", "-rotate-1", "rotate-0", "rotate-1", "rotate-2", "rotate-3"];
      return rotations[index % rotations.length];
    }
    return "";
  };

  const getImagePosition = () => {
    switch (position) {
      case 'top':
        return 'ml-4';
      case 'right':
        return 'mb-2 -mr-2';
      case 'left':
        return 'mb-2 -ml-2';
      default:
        return '';
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (onDrop) {
      try {
        const data = e.dataTransfer.getData('application/json');
        if (data) {
          const draggedCard = JSON.parse(data);
          onDrop(draggedCard, playerId);
        }
      } catch (error) {
        console.error('Error parsing dragged card data:', error);
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (onDragOver) {
      onDragOver(e);
    }
  };

  return (
    <div className={`${getPositionClasses()} flex flex-col items-center z-50`}>
      <div
        className={`flex ${getLayoutClasses()} ${
          isSelectable ? "ring-4 ring-blue-400 cursor-pointer" : ""
        } ${isDragOver ? "ring-4 ring-green-400 bg-green-50" : ""}`}
        onClick={isSelectable ? onSelect : undefined}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={onDragLeave}
      >
        {position === 'top' && (
          <div className={`flex justify-center items-center relative ${getPerspectiveClass()} ${
            isActive ? "ring-4 ring-yellow-400 bg-yellow-50 shadow-xl" : ""
          } drop-zone`}>
            {isActive && (
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded bg-yellow-400 text-white font-bold text-xs shadow">
                Tour de {playerName}
              </div>
            )}
            {/* Show card backs based on card count */}
            {Array.from({ length: cards }, (_, idx) => (
              <div
                key={idx}
                className={`${getCardRotation(idx)} -mr-6`}
              >
                <Card card={null} hidden={true} isOpponent={true} />
              </div>
            ))}
          </div>
        )}
        
        <img
          src="/images/player.png"
          alt="Joueur"
          className={`w-16 h-16 ${getImagePosition()} ${
            isActive ? "border-4 border-yellow-400 shadow-lg" : ""
          }`}
        />
        
        {position !== 'top' && (
          <div className={`flex justify-center items-center relative ${getPerspectiveClass()} ${
            isActive ? "ring-4 ring-yellow-400 bg-yellow-50 shadow-xl" : ""
          } drop-zone`}>
            {isActive && (
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded bg-yellow-400 text-white font-bold text-xs shadow">
                Tour de {playerName}
              </div>
            )}
            {/* Show card backs based on card count */}
            {Array.from({ length: cards }, (_, idx) => (
              <div
                key={idx}
                className={`${getCardRotation(idx)} -mr-6`}
              >
                <Card card={null} hidden={true} isOpponent={true} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};