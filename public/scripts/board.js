import { displayAccusationPopup } from "./accusation.js";
import { displayPopup } from "./utils.js";

const highlightTiles = (tiles) => {
  tiles.forEach((turn) => {
    const tile = document.querySelector(`#${turn}`);
    tile.classList.add("highlight");
    tile.parentNode.appendChild(tile);
  });
};

const getHighlightPath = () => {
  const reachableNodes = localStorage.getItem("reachableNodes") ?? "[]";
  return JSON.parse(reachableNodes);
};

const movePlayer = (tiles) => {
  tiles.map((turn) => {
    const tile = document.querySelector(`#${turn}`);
    tile.addEventListener("click", async (e) => {
      e.preventDefault();
      const currentNodeId = e.target.id;

      await fetch("/update-pawn-position", {
        method: "post",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ currentNodeId, turns: tiles }),
      });
      globalThis.window.location.reload();
      localStorage.clear();
    });
  });
};

const fetchReachableNodes = () =>
  fetch("/get-reachable-nodes")
    .then((response) => response.json());

const fetchRollDice = () =>
  fetch("/roll", { method: "POST" })
    .then((response) => response.json());

const handleDiceClick = async (event, dice) => {
  event.preventDefault();
  dice.setAttribute("disabled", true);

  const { diceValue } = await fetchRollDice();
  displayPopup(`dice value is ${diceValue}`);

  const { reachableNodes } = await fetchReachableNodes();
  localStorage.setItem("reachableNodes", JSON.stringify(reachableNodes));
  highlightTiles(reachableNodes);
  movePlayer(reachableNodes);
};

const diceListener = (dice) => {
  if (dice._handler) {
    dice.removeEventListener("click", dice._handler);
  }

  const handler = async (e) => await handleDiceClick(e, dice);

  dice._handler = handler;
  dice.addEventListener("click", handler, { once: true });
};

const handlePass = async (event) => {
  event.preventDefault();
  const res = await fetch("/pass", { method: "post" });

  if (res.status === 200) {
    const { currentPlayer } = await res.json();
    displayPopup(`${currentPlayer.name} turns!`);
    localStorage.clear();
  }
};

const passBtnListener = (passBtn) => {
  if (passBtn._handler) {
    passBtn.removeEventListener("click", passBtn._handler);
  }

  const handler = async (e) => await handlePass(e, passBtn);

  passBtn._handler = handler;
  passBtn.addEventListener("click", handler, { once: true });
};

export const renderActions = (boardConfig) => {
  const dice = document.querySelector("#dice-button");
  const passBtn = document.querySelector("#pass-button");
  const attributeFn = !boardConfig.canRoll ? "setAttribute" : "removeAttribute";
  dice[attributeFn]("disabled", "");

  diceListener(dice);
  passBtnListener(passBtn);

  const path = getHighlightPath();
  if (path.length) {
    passBtn.setAttribute("disabled", "");
    highlightTiles(path);
    movePlayer(path);
  }
};

export const accuseBtnListener = (accuseBtn) => {
  accuseBtn.addEventListener("click", (event) => {
    event.preventDefault();
    displayAccusationPopup();
  });
};
