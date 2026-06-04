import { notifyGameStart } from "../components/popup.js";
import { Shimmer } from "../components/shimmer.js";
import { accuseBtnListener } from "./board.js";
import { setupSecretPassageEvents } from "./event-listners/secret_passage_tooltip.js";
import { setupWeaponsEvents } from "./event-listners/weapon_tooltips.js";
import { renderPlayers } from "./render_player.js";
import { renderPlayerCards } from "./render_player_cards.js";

const initializeRoomState = (roomId) => {
  const slots = document.querySelectorAll(`#${roomId}-group .room-slot`);
  const available = Array.from({ length: slots.length }, (_, i) => i).reverse();
  return { occupied: {}, available };
};

const renderPawnInRoom = (pawnId, roomId, roomState) => {
  const { occupied, available } = roomState;
  if (available.length === 0) return;

  const freeIndex = available.pop();
  occupied[pawnId] = freeIndex;

  const slots = document.querySelectorAll(`#${roomId}-group .room-slot`);
  slots.forEach((slot) => slot.classList.remove("highlight-suspect"));
  const slot = slots[freeIndex];

  if (slot) {
    slot.setAttribute("fill", `url(#${pawnId}_pawn)`);
    slot.dataset.occupiedBy = pawnId;
  }
};

const renderPawnOnTile = (pawnId, x, y) => {
  const tile = document.getElementById(`tile-${x}-${y}`);
  if (tile) {
    tile.style.fill = `url(#${pawnId}_pawn)`;
    tile.dataset.occupiedBy = pawnId;
  }
};

const getPawnElement = (char) => {
  const tile = document.querySelector(`#${char}_pawn`);
  return tile.querySelector("circle");
};

const highlightActivePlayer = (char) => {
  const pawn = getPawnElement(char);
  pawn.classList.add("active-pawn");
};

const removeHighlight = (char) => {
  const pawn = getPawnElement(char);
  pawn.classList.remove("active-pawn");
};

export const placeCharacters = (boardConfig) => {
  const { activePlayer, pawns } = boardConfig;
  const roomRegistry = {};

  for (const { char, pos, id } of pawns) {
    removeHighlight(char);

    if (activePlayer.pawn.id === id) {
      highlightActivePlayer(char, pos);
    }

    if (pos.room) {
      roomRegistry[pos.room] = roomRegistry[pos.room] ||
        initializeRoomState(pos.room);
      renderPawnInRoom(char, pos.room, roomRegistry[pos.room]);
    } else {
      renderPawnOnTile(char, pos.x, pos.y);
    }
  }
};

export const clearAllPawns = () => {
  document.querySelectorAll(".room-slot").forEach((slot) => {
    slot.setAttribute("fill", "transparent");
    delete slot.dataset.occupiedBy;
  });

  document.querySelectorAll("rect[data-occupied-by]").forEach((tile) => {
    tile.style.fill = "";
    delete tile.dataset.occupiedBy;
  });
};

export const setupGame = (gameConfig) => {
  const tooltip = document.getElementById("tooltip");
  const playerCardsContainer = document.getElementById("players-cards-details");
  const shimmerELement = document.querySelector(".shimmer-overlay");
  const shimmer = new Shimmer(shimmerELement);
  const accuseBtn = document.querySelector("#accuse-button");

  setupSecretPassageEvents(tooltip);
  setupWeaponsEvents(tooltip);

  renderPlayers(gameConfig);
  renderPlayerCards(gameConfig.currentPlayer.hand, playerCardsContainer);
  clearAllPawns();

  accuseBtnListener(accuseBtn);
  notifyGameStart(gameConfig);

  shimmer.init();
};
