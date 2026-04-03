import { createCard } from "./render_player_cards.js";
import { displayPopup, sendRequest, toId, toSentenceCase } from "./utils.js";

const getTemplateClone = (templateId) => {
  const template = document.getElementById(templateId);
  return template.content.cloneNode(true);
};

const createOption = (option, optionLabel) => {
  const optionClone = getTemplateClone("option-template");
  const optionElement = optionClone.querySelector(".option");
  const input = optionClone.querySelector("input");
  const label = optionClone.querySelector("label");

  input.name = optionLabel;
  input.value = option;
  input.id = `accuse-${toId(option)}`;

  label.textContent = toSentenceCase(option);
  label.setAttribute("for", input.id);
  return optionElement;
};

const renderOptions = (optionsToRender) => {
  optionsToRender.forEach(({ options, label }) => {
    const optionsContainer = document.getElementById(label);

    const optionElements = options.map((option) => createOption(option, label));
    optionsContainer.append(...optionElements);
  });
};

const displayMurderCombination = (combination) => {
  const envelope = document.querySelector("#envelop");

  const cards = Object.values(combination).map((name) => {
    const cardClone = getTemplateClone("card-template");

    createCard(cardClone, name, "envelop-card");
    return cardClone;
  });
  envelope.append(...cards);
};

const handleAccusationSubmission = async (combination) => {
  const res = await sendRequest({
    url: "/accuse",
    method: "post",
    body: combination,
  });

  displayMurderCombination(res.murderCombination);
};

const closePopup = (popup) => {
  setTimeout(() => {
    popup.remove();
  }, 4000);
};

const attachSubmitAccusationListener = () => {
  const form = document.querySelector("form");
  const accusationBackGround = document.getElementById("accusation-popup");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formdata = new FormData(form);
    const accusationDetails = Object.fromEntries(formdata.entries());
    const { suspects: suspect, weapons: weapon, rooms: room } =
      accusationDetails;

    if (Object.keys(accusationDetails).length === 3) {
      await handleAccusationSubmission({ suspect, weapon, room });
    } else {
      displayPopup("Incomplete combination");
    }

    form.reset();
    closePopup(accusationBackGround);
  });
};

const attachClosePopupListener = () => {
  const accusationBackGround = document.getElementById("accusation-popup");

  accusationBackGround.addEventListener("click", (e) => {
    if (e.target.id === "accusation-popup") {
      accusationBackGround.remove();
    }
  });
};

const renderAccusationForm = (suspects, weapons, rooms) => {
  const accusationTemplateClone = getTemplateClone("accusation-template");
  const accusationPopup = accusationTemplateClone.querySelector(
    "#accusation-popup",
  );

  const body = document.querySelector("body");
  body.appendChild(accusationPopup);
  attachClosePopupListener();
  renderOptions([suspects, weapons, rooms]);
  attachSubmitAccusationListener();
};

export const displayAccusationPopup = () => {
  const SUSPECTS = [
    "miss scarlett",
    "colonel mustard",
    "mrs white",
    "reverend green",
    "mrs peacock",
    "professor plum",
  ];

  const WEAPONS = [
    "dagger",
    "rope",
    "revolver",
    "spanner",
    "lead piping",
    "candlestick",
  ];

  const ROOMS = [
    "dining room",
    "kitchen",
    "ballroom",
    "conservatory",
    "billiard room",
    "library",
    "study",
    "hall",
    "lounge",
  ];

  renderAccusationForm(
    { label: "suspects", options: SUSPECTS },
    { label: "weapons", options: WEAPONS },
    { label: "rooms", options: ROOMS },
  );
};
