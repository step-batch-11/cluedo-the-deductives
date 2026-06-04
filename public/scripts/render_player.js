import {
  isActivePlayer,
  isCurrentPlayer,
  toId,
  toNormalCase,
} from "./utils/common.js";

const createPlayer = (node, player, activePlayer, currentPlayer) => {
  const playerNode = node.querySelector(".player");
  if (isActivePlayer(player.id, activePlayer)) {
    playerNode.setAttribute("id", "active-player");
  }

  if (player.isEliminated) {
    playerNode.classList.add("eliminated-player");
  }

  const icon = node.querySelector(".player-icon");
  icon.src = `/images/${toId(player.pawn)}_profile.avif`;
  icon.setAttribute("id", `${player.pawn}-icon`);

  const playerPawnColor = node.querySelector(".player-pawn-color");
  playerPawnColor.setAttribute("id", `${player.pawn}-icon`);

  const playerName = node.querySelector(".player-name");

  playerName.textContent = isCurrentPlayer(player.id, currentPlayer)
    ? "You"
    : player.name;

  const playerPawn = node.querySelector(".player-pawn");
  playerPawn.textContent = toNormalCase(player.pawn);
};

export const renderPlayers = ({ players, activePlayer, currentPlayer }) => {
  const allPlayerContainer = document.getElementById(
    "players-details-container",
  );
  const playerTemplate = document.getElementById("player-template");

  for (const player of players) {
    const playerClone = playerTemplate.content.cloneNode(true);
    createPlayer(playerClone, player, activePlayer, currentPlayer);

    allPlayerContainer.appendChild(playerClone);
  }
};
