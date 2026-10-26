// "Which plan is right for me?" modal (Webflow native Modals aren't enabled on this site).
// Markup: [data-plan-modal] overlay (display:none via its class, so it stays out of the way in the Designer)
//   > [data-plan-modal-dialog] with [data-plan-modal-title] and [data-plan-modal-close];
// openers: [data-plan-modal-open]. [data-entity] buttons inside switch the plan (pricing-entity.js) and close it. See MARKUP.md.
import { toButton } from "./as-button.js";

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.querySelector("[data-plan-modal]");
  if (!modal) return;

  const style = document.createElement("style");
  style.textContent = "[data-plan-modal][data-open]{display:flex!important}";
  document.head.appendChild(style);

  const dialog = modal.querySelector("[data-plan-modal-dialog]") || modal;
  dialog.setAttribute("role", "dialog");
  dialog.setAttribute("aria-modal", "true");
  dialog.setAttribute("tabindex", "-1");
  const title = modal.querySelector("[data-plan-modal-title]");
  if (title) {
    if (!title.id) title.id = "plan-modal-title";
    dialog.setAttribute("aria-labelledby", title.id);
  }

  const closers = [...modal.querySelectorAll("[data-plan-modal-close]")].map(toButton);
  closers.forEach((el) => {
    if (!el.hasAttribute("aria-label")) el.setAttribute("aria-label", "Close");
  });

  let opener = null;
  const isOpen = () => modal.hasAttribute("data-open");
  const focusables = () =>
    [...dialog.querySelectorAll("a[href], button, [tabindex]:not([tabindex='-1'])")].filter((el) => el.offsetParent !== null);

  function open(trigger) {
    opener = trigger;
    modal.setAttribute("data-open", "");
    document.body.style.overflow = "hidden";
    (closers[0] || dialog).focus();
  }

  function close(returnFocus = true) {
    if (!isOpen()) return;
    modal.removeAttribute("data-open");
    document.body.style.overflow = "";
    if (returnFocus) opener?.focus();
  }

  document.querySelectorAll("[data-plan-modal-open]").forEach((el) => {
    const trigger = toButton(el);
    trigger.setAttribute("aria-haspopup", "dialog");
    trigger.addEventListener("click", () => open(trigger));
  });
  closers.forEach((el) => el.addEventListener("click", () => close()));

  // Picking a plan: pricing-entity.js switches and scrolls; land focus on the now-active toggle option.
  modal.querySelectorAll("[data-entity]").forEach((el) =>
    el.addEventListener("click", () => {
      close(false);
      document.querySelector("[data-entity-toggle] .is-active")?.focus({ preventScroll: true });
    })
  );

  modal.addEventListener("click", (e) => {
    if (e.target === modal) close();
  });

  document.addEventListener("keydown", (e) => {
    if (!isOpen()) return;
    if (e.key === "Escape") {
      close();
    } else if (e.key === "Tab") {
      // Keep focus inside the dialog.
      const items = focusables();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
});
