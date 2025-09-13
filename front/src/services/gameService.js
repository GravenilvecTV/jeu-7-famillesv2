import { families } from '../data/families';

export const gameService = {
  shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  },

  getAllCards() {
    return families.flatMap(family => 
      family.cards.map(card => ({
        ...card,
        family: family.name
      }))
    );
  },

  distributeCards(numPlayers = 4) {
    const allCards = this.shuffleArray(this.getAllCards());
    const handSize = Math.floor(allCards.length / numPlayers);
    const hands = [];
    
    for (let i = 0; i < numPlayers; i++) {
      hands.push(allCards.slice(i * handSize, (i + 1) * handSize));
    }
    
    const deck = allCards.slice(numPlayers * handSize);
    
    return { hands, deck };
  },

  checkForCompleteFamilies(playerHand) {
    const completedFamilies = [];
    
    families.forEach(family => {
      const hasAllCards = family.cards.every(card =>
        playerHand.some(handCard => 
          handCard.name === card.name && handCard.family === family.name
        )
      );
      
      if (hasAllCards) {
        completedFamilies.push(family.name);
      }
    });
    
    return completedFamilies;
  },

  findCardInHand(hand, targetCard) {
    return hand.findIndex(card => 
      card.name === targetCard.name && card.family === targetCard.family
    );
  },

  removeCardFromHand(hand, cardIndex) {
    const newHand = [...hand];
    const [removedCard] = newHand.splice(cardIndex, 1);
    return { newHand, removedCard };
  },

  addCardToHand(hand, card) {
    return [...hand, card];
  },

  isGameOver(completedFamilies) {
    return completedFamilies.length === families.length;
  },
};