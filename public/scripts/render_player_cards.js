const createCard = (node, card) => {
  const cardName = node.querySelector(".card-name");
  cardName.textContent = card;
  cardName.classList.add("player-card");
};

export const renderPlayerCards = (boardConfig) => {
  const playerCardsContainer = document.getElementById("players-cards-details");
  const cardTemplate = document.getElementById("card-template");
  const playerHands = boardConfig.currentPlayer.hand;
  for (const hand of playerHands) {
    const cardClone = cardTemplate.content.cloneNode(true);
    createCard(cardClone, hand);
    playerCardsContainer.appendChild(cardClone);
  }
};
