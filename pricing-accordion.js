// Card accordions ("Also included: ..." expanders under each pricing card).
// Markup: [data-card-accordion] > [data-card-accordion-trigger] + [data-card-accordion-panel]; optional [data-card-accordion-icon].
// Closed by default; add data-open to start one open. Several can be open at once. See MARKUP.md.
import { toButton } from "./as-button.js";

document.addEventListener("DOMContentLoaded", () => {
  const accordions = document.querySelectorAll("[data-card-accordion]");
  if (!accordions.length) return;

  // Same rule as the pre-paint embed; beats Webflow's class-level display.
  const style = document.createElement("style");
  style.textContent = "[data-card-accordion]:not([data-open]) [data-card-accordion-panel]{display:none!important}";
  document.head.appendChild(style);

  accordions.forEach((accordion, i) => {
    const triggerEl = accordion.querySelector("[data-card-accordion-trigger]");
    const panel = accordion.querySelector("[data-card-accordion-panel]");
    if (!triggerEl || !panel) return;
    const trigger = toButton(triggerEl);

    if (!panel.id) panel.id = `card-accordion-panel-${i + 1}`;
    trigger.setAttribute("aria-controls", panel.id);

    const setOpen = (open) => {
      accordion.toggleAttribute("data-open", open);
      trigger.setAttribute("aria-expanded", open ? "true" : "false");
      const icon = trigger.querySelector("[data-card-accordion-icon]");
      if (icon) icon.textContent = open ? "−" : "+";
    };
    setOpen(accordion.hasAttribute("data-open"));

    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      setOpen(!accordion.hasAttribute("data-open"));
    });
  });
});
