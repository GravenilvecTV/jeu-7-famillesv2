import { useState } from 'react';
import { Button } from '../../../components/ui/Button';

const families = {
  "Anna": ["Papa", "Maman", "Frère", "Fille", "Grand-père", "Grand-mère"],
  "Awariz": ["Papa", "Maman", "Fils", "Fille", "Grand-père", "Grand-mère"],
  "Carlos": ["Papa", "Maman", "Fils", "Fille", "Grand-père", "Grand-mère"],
  "Kikoo": ["Papa", "Maman", "Fils", "Fille", "Grand-père", "Grand-mère"],
  "Lucy": ["Papa", "Maman", "Fils", "Fille", "Grand-père", "Grand-mère"],
  "Yoananas": ["Papa", "Maman", "Fils", "Fille", "Grand-père", "Grand-mère"],
  "Talcado": ["Papa", "Maman", "Fils", "Fille", "Grand-père", "Grand-mère"],
};

export const CardSelector = ({ myCards, onSelectCard, onCancel }) => {
  const [selectedFamily, setSelectedFamily] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);

  // Get families that the player has started
  const myFamilies = [...new Set(myCards.map(card => card.family))];

  // Get members the player already has for a family
  const getOwnedMembers = (family) => {
    return myCards
      .filter(card => card.family === family)
      .map(card => card.name);
  };

  // Get members the player can ask for
  const getMissingMembers = (family) => {
    const owned = getOwnedMembers(family);
    return families[family].filter(member => !owned.includes(member));
  };

  const handleConfirm = () => {
    if (selectedFamily && selectedMember) {
      onSelectCard({
        family: selectedFamily,
        name: selectedMember,
        // Add image path for consistency
        image: `familys/${selectedFamily.toLowerCase()}/${selectedMember.toLowerCase().replace('è', 'e').replace('î', 'i').replace('-', '')}.png`
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Quelle carte veux-tu demander ?</h2>
        
        {!selectedFamily ? (
          <>
            <p className="mb-4">Choisis d'abord une famille :</p>
            <div className="grid grid-cols-3 gap-3">
              {myFamilies.map(family => (
                <button
                  key={family}
                  onClick={() => setSelectedFamily(family)}
                  className="p-3 border-2 border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  <div className="font-bold">{family}</div>
                  <div className="text-xs text-gray-600">
                    {getOwnedMembers(family).length}/6 cartes
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <p className="mb-4">
              Famille <strong>{selectedFamily}</strong> - Choisis un membre :
            </p>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {getMissingMembers(selectedFamily).map(member => (
                <button
                  key={member}
                  onClick={() => setSelectedMember(member)}
                  className={`p-3 border-2 rounded transition-colors ${
                    selectedMember === member
                      ? 'border-blue-500 bg-blue-100'
                      : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                  }`}
                >
                  {member}
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                setSelectedFamily(null);
                setSelectedMember(null);
              }}
              className="text-sm text-gray-600 hover:text-gray-800 mb-4"
            >
              ← Changer de famille
            </button>
          </>
        )}
        
        <div className="flex gap-3 mt-6">
          <Button
            onClick={handleConfirm}
            disabled={!selectedFamily || !selectedMember}
            variant="primary"
          >
            Demander cette carte
          </Button>
          <Button
            onClick={onCancel}
            variant="secondary"
          >
            Annuler
          </Button>
        </div>
      </div>
    </div>
  );
};