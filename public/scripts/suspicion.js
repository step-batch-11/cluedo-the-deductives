const SUSPICION_STATE = {
  selectedSuspect: null,
  selectedWeapon: null,
  currentRoom: null,
  hasMadeSuspicion: false,
};

const WEAPONS = [
  "DAGGER",
  "ROPE",
  "REVOLVER",
  "SPANNER",
  "LEAD PIPING",
  "CANDLESTICK",
];

const weaponPopup = document.getElementById("weapon-popup");

const modal = document.getElementById("suspicion-modal");

const showModal = (data) => {
  const modalContent = modal.querySelector(".modal-content");
  const suspicionTemp = document.querySelector("#suspicion-model-temp");
  const suspicionClone = suspicionTemp.content.cloneNode(true);

  suspicionClone.querySelector("#card-suspect .card-value").textContent =
    data.suspect;
  suspicionClone.querySelector("#card-weapon .card-value").textContent =
    data.weapon;
  suspicionClone.querySelector("#card-room .card-value").textContent =
    data.room;
  modalContent.innerHTML =
    suspicionClone.querySelector("#suspicion-container").innerHTML;

  document.getElementById("close-modal").addEventListener("click", () => {
    modal.classList.add("hidden");
  });
  modal.classList.remove("hidden");
};

const showResult = (data, result) => {
  const statusEl = document.getElementById("suspicion-status");
  const closeBtn = document.getElementById("close-modal");

  if (result.disproved) {
    let highlightId = "card-weapon";
    if (result.card === data.suspect) highlightId = "card-suspect";
    else if (result.card === data.weapon) highlightId = "card-weapon";
    else if (result.card === data.room) highlightId = "card-room";

    document.getElementById(highlightId)?.classList.add("card-revealed");
    statusEl.textContent = `${result.by} revealed the card`;
  } else {
    statusEl.textContent = "No one could disprove!";
  }

  closeBtn.style.display = "inline-block";
};

const mockFetchSuspicion = async (suspicion) => {
  const body = JSON.stringify(suspicion);
  await fetch("/suspect", {
    method: "POST",
    body,
    headers: { "content-type": "application/json" },
  });

  await fetch(`/update-pawn-position/${suspicion.suspectId}`, {
    method: "put",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      newNodeId: suspicion.room,
      tiles: [suspicion.room],
      isUsingSecretPassage: false,
    }),
  });

  return new Promise((resolve) => {
    setTimeout(() => {
      const isDisproved = Math.random() > 0.5;

      resolve({
        disproved: isDisproved,
        by: "LOKI",
        card: isDisproved ? suspicion.weapon : null,
      });
    }, 2000);
    setTimeout(() => {
      globalThis.window.location.reload();
    }, 3000);
  });
};

const submitSuspicion = async () => {
  const suspicion = {
    suspect: SUSPICION_STATE.selectedSuspect,
    weapon: SUSPICION_STATE.selectedWeapon,
    room: SUSPICION_STATE.currentRoom,
    suspectId: SUSPICION_STATE.suspectId,
  };

  showModal(suspicion);

  const result = await mockFetchSuspicion(suspicion);

  showResult(suspicion, result);
  SUSPICION_STATE.hasMadeSuspicion = true;
};

let selectedWeaponEl = null;

const selectWeapon = (card, selectedLabel, weapon) => {
  if (selectedWeaponEl) {
    selectedWeaponEl.classList.remove("weapon-selected");
  }

  if (selectedWeaponEl === card) {
    selectedWeaponEl = null;
    SUSPICION_STATE.selectedWeapon = null;
    selectedLabel.textContent = "Select a weapon";
  } else {
    card.classList.add("weapon-selected");
    selectedWeaponEl = card;
    SUSPICION_STATE.selectedWeapon = weapon;
    selectedLabel.textContent = weapon;
  }
};

const createActionButtons = () => {
  const actions = document.createElement("div");
  actions.className = "weapon-popup-actions";

  const suspectBtn = createSuspectButton();

  const cancelBtn = createCancelButton();

  actions.appendChild(suspectBtn);
  actions.appendChild(cancelBtn);
  return actions;
};

const createCancelButton = () => {
  const cancelBtn = document.createElement("button");
  cancelBtn.className = "weapon-btn weapon-btn-cancel";
  cancelBtn.textContent = "cancel";
  cancelBtn.onclick = () => {
    weaponPopup.classList.add("hidden");
    selectedWeaponEl = null;
    SUSPICION_STATE.selectedWeapon = null;
    SUSPICION_STATE.selectedSuspect = null;
  };
  return cancelBtn;
};

const createSuspectButton = () => {
  const suspectBtn = document.createElement("button");
  suspectBtn.className = "weapon-btn weapon-btn-confirm";
  suspectBtn.textContent = "suspect";
  suspectBtn.onclick = () => {
    if (!SUSPICION_STATE.selectedWeapon) return;
    weaponPopup.classList.add("hidden");
    submitSuspicion();
  };
  return suspectBtn;
};

const createSelectLabel = () => {
  const selectedLabel = document.createElement("div");
  selectedLabel.className = "weapon-selected-label";
  selectedLabel.id = "weapon-selected-label";
  selectedLabel.textContent = "Select a weapon";
  weaponPopup.appendChild(selectedLabel);
  return selectedLabel;
};

const createRoomLabel = () => {
  const roomLabel = document.createElement("div");
  roomLabel.className = "weapon-popup-room";
  roomLabel.textContent = SUSPICION_STATE.currentRoom;
  return roomLabel;
};

const createWeaponRow = (selectedLabel) => {
  const row = document.createElement("div");
  row.className = "weapon-cards-row";

  WEAPONS.forEach((weapon) => {
    appendWeapon(weapon, selectedLabel, row);
  });

  weaponPopup.appendChild(row);
};

const appendWeapon = (weapon, selectedLabel, row) => {
  const card = document.createElement("div");
  card.className = "weapon-item";
  card.dataset.weapon = weapon;

  const dot = document.createElement("div");
  dot.className = "weapon-dot";
  card.appendChild(dot);

  card.addEventListener("click", () => {
    selectWeapon(card, selectedLabel, weapon);
  });

  row.appendChild(card);
};

const showWeaponPopup = (x, y) => {
  weaponPopup.innerHTML = "";
  selectedWeaponEl = null;
  SUSPICION_STATE.selectedWeapon = null;

  const roomLabel = createRoomLabel();
  weaponPopup.appendChild(roomLabel);

  const selectedLabel = createSelectLabel();
  createWeaponRow(selectedLabel);

  const actionBtns = createActionButtons();
  weaponPopup.append(roomLabel, actionBtns);

  weaponPopup.style.left = Math.min(x, globalThis.window.innerWidth - 380) +
    "px";
  weaponPopup.style.top = Math.min(y, globalThis.window.innerHeight - 180) +
    "px";
  weaponPopup.classList.remove("hidden");
};

export const removePawnHighlight = () => {
  const pawns = document.querySelectorAll("[data-occupied-by]");

  pawns.forEach((p) => {
    p.classList.remove("highlight-suspect");
    p.removeEventListener("click", p.clickListener);
    delete p.clickListener;
  });
};

const onPawnSelect = (e, suspects) => {
  const pawnElement = e.target.closest("[data-occupied-by]");
  if (!pawnElement) return;

  const suspect = pawnElement.dataset.occupiedBy;
  removePawnHighlight();
  const { id, name } = suspects
    .find(({ char }) => char === suspect);

  SUSPICION_STATE.selectedSuspect = name;
  SUSPICION_STATE.suspectId = id;
  showWeaponPopup(e.pageX, e.pageY);
};

const highlightPawns = (pawns, suspects) => {
  pawns.forEach((pawn) => {
    if (!pawn.dataset.occupiedBy) return;

    pawn.classList.add("highlight-suspect");
    const handler = (e) => onPawnSelect(e, suspects);
    pawn.clickListener = handler;
    pawn.addEventListener("click", handler);
  });
};

const startSuspicion = ({ position }, suspects) => {
  SUSPICION_STATE.currentRoom = position.room;
  const pawns = document.querySelectorAll("[data-occupied-by]");
  highlightPawns(pawns, suspects);
};

document.getElementById("close-modal").addEventListener("click", () => {
  modal.classList.add("hidden");
});

export const suspicionBtnListener = ({ canSuspect, currentPlayer, pawns }) => {
  if (canSuspect) {
    startSuspicion(currentPlayer.pawn, pawns);
  } else {
    removePawnHighlight();
  }
};
