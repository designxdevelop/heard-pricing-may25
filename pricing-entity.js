// Customer-type toggle ("Solo sole prop" vs "S corp or group").
// Buttons: [data-entity="solo|scorp"]. Content: [data-entity-show="solo|scorp"].
// Elements without data-entity-show always show. See MARKUP.md.
import { asButton } from "./as-button.js";

document.addEventListener("DOMContentLoaded", () => {
  const ENTITIES = ["solo", "scorp"];
  const DEFAULT_ENTITY = "solo";
  const buttons = document.querySelectorAll("[data-entity]");
  if (!buttons.length) return;

  // Beats Webflow's class-level display and the mobile slider's inline display.
  const style = document.createElement("style");
  style.textContent = "[data-entity-hidden]{display:none!important}";
  document.head.appendChild(style);

  document.querySelectorAll("[data-entity-toggle]").forEach((group) => {
    if (!group.hasAttribute("role")) group.setAttribute("role", "group");
    if (!group.hasAttribute("aria-label")) group.setAttribute("aria-label", "Practice type");
  });

  buttons.forEach((btn) => {
    asButton(btn);
    const inToggle = !!btn.closest("[data-entity-toggle]");
    btn.addEventListener("click", (e) => {
      // Outside the toggle (e.g. the "Which plan is right for me?" modal) the link may also close a Webflow modal,
      // so don't cancel its default; bring the toggle into view instead.
      if (inToggle) e.preventDefault();
      setEntity(btn.getAttribute("data-entity"));
      if (!inToggle) document.querySelector("[data-entity-toggle]")?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });

  function setEntity(entity) {
    if (!ENTITIES.includes(entity)) entity = DEFAULT_ENTITY;

    // Only the toggle's own buttons get the pressed state; other triggers (e.g. modal links) just switch.
    document.querySelectorAll("[data-entity-toggle] [data-entity]").forEach((btn) => {
      const isActive = btn.getAttribute("data-entity") === entity;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
    document.querySelectorAll("[data-entity-toggle]").forEach((group) => group.setAttribute("data-active-entity", entity));
    // Keeps the pre-paint CSS in the Webflow embed (see MARKUP.md) in sync with the toggle.
    document.documentElement.setAttribute("data-pricing-entity", entity);
    document.querySelectorAll("[data-entity-show]").forEach((el) => {
      el.toggleAttribute("data-entity-hidden", el.getAttribute("data-entity-show") !== entity);
    });

    document.dispatchEvent(new CustomEvent("heard:entity", { detail: { entity } }));
  }

  // Deep links: ?entity=scorp or #scorp
  const requested = new URLSearchParams(window.location.search).get("entity") || window.location.hash.slice(1);
  setEntity(requested);
});
