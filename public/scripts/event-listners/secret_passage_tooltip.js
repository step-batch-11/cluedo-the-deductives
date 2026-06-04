import { toSentenceCase } from "../utils/common.js";

const hideSecretPassage = (tooltip) => {
  tooltip.classList.add("hidden");
};

const previewSecretPassage = (p, tooltip) => {
  const to = p.dataset.to;
  const direction = p.dataset.tooltip;
  const formatted = toSentenceCase(to);
  tooltip.textContent = `Go to ${formatted}`;
  tooltip.className = `tooltip tooltip-${direction}`;
  const rect = p.getBoundingClientRect();
  tooltip.style.left = `${rect.left + rect.width / 2}px`;
  tooltip.style.top = `${rect.top + rect.height / 2}px`;
  tooltip.classList.remove("hidden");
};

export const setupSecretPassageEvents = (tooltip) => {
  const passages = document.querySelectorAll(".secret-passage");
  passages.forEach((p) => {
    p.addEventListener("mouseenter", (_e) => previewSecretPassage(p, tooltip));
    p.addEventListener("mouseleave", () => hideSecretPassage(tooltip));
  });
};
