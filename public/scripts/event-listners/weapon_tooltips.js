import { toSentenceCase } from "../utils/common.js";

const hideWeapon = (tooltip) => tooltip.classList.add("hidden");

const moveWeapon = (tooltip, e) => {
  tooltip.style.left = e.pageX + 10 + "px";
  tooltip.style.top = e.pageY + 10 + "px";
};

const previewWeapon = (e, tooltip) => {
  tooltip.textContent = toSentenceCase(e.target.dataset.name);
  tooltip.classList.remove("hidden");
};

export const setupWeaponsEvents = (tooltip) => {
  const weapons = document.querySelectorAll(".weapon");
  weapons.forEach((weapon) => {
    weapon.addEventListener("mouseenter", (e) => previewWeapon(e, tooltip));
    weapon.addEventListener("mousemove", (e) => moveWeapon(tooltip, e));
    weapon.addEventListener("mouseleave", () => hideWeapon(tooltip));
  });
};
