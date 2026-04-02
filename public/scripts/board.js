import { displayAccusationPopup } from "./accusation.js";
import { displayPopup } from "./utils.js";

const hightlightTiles = (tiles) => {
  tiles.forEach((turn) => {
    const tile = document.querySelector(`#${turn}`);
    tile.classList.add("highlight");
    tile.parentNode.appendChild(tile);
  });
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
    });
  });
};

const handleDiceClick = async (event, dice) => {
  event.preventDefault();
  dice.setAttribute("disabled", true);

  const parsedResponse = await fetch("/roll-and-get-turns")
    .then((response) => response.json());

  const { diceValue, turns } = parsedResponse;
  const message = `dice value is ${diceValue}`;

  displayPopup(message);
  hightlightTiles(turns);
  movePlayer(turns);
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

export const accuseBtnListener = (accuseBtn) => {
  accuseBtn.addEventListener("click", (event) => {
    event.preventDefault();
    displayAccusationPopup();
  });
};

export const renderActions = (boardConfig) => {
  const dice = document.querySelector("#dice-button");
  const passBtn = document.querySelector("#pass-button");

  const attributeFn = !boardConfig.canRoll ? "setAttribute" : "removeAttribute";
  dice[attributeFn]("disabled", "");

  diceListener(dice);
  passBtnListener(passBtn);
};
