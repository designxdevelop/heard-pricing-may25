// as-button.js
function toButton(el) {
  if (el.tagName === "BUTTON")
    return el;
  const button = document.createElement("button");
  button.type = "button";
  for (const { name, value } of el.attributes) {
    if (name !== "href" && name !== "role" && name !== "tabindex")
      button.setAttribute(name, value);
  }
  button.append(...el.childNodes);
  el.replaceWith(button);
  return button;
}
function asButton(el) {
  if (el.tagName === "BUTTON")
    return el;
  el.setAttribute("role", "button");
  if (!el.hasAttribute("tabindex"))
    el.setAttribute("tabindex", "0");
  el.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      el.click();
    }
  });
  return el;
}

// pricing-entity.js
document.addEventListener("DOMContentLoaded", () => {
  const ENTITIES = ["solo", "scorp"];
  const DEFAULT_ENTITY = "solo";
  const buttons = [...document.querySelectorAll("[data-entity]")].map((el) => el.closest("[data-entity-toggle]") ? toButton(el) : asButton(el));
  if (!buttons.length)
    return;
  const style = document.createElement("style");
  style.textContent = "[data-entity-hidden]{display:none!important}";
  document.head.appendChild(style);
  document.querySelectorAll("[data-entity-toggle]").forEach((group) => {
    if (!group.hasAttribute("role"))
      group.setAttribute("role", "group");
    if (!group.hasAttribute("aria-label"))
      group.setAttribute("aria-label", "Practice type");
  });
  buttons.forEach((btn) => {
    const inToggle = !!btn.closest("[data-entity-toggle]");
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      setEntity(btn.getAttribute("data-entity"));
      if (!inToggle)
        document.querySelector("[data-entity-toggle]")?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });
  function setEntity(entity) {
    if (!ENTITIES.includes(entity))
      entity = DEFAULT_ENTITY;
    document.querySelectorAll("[data-entity-toggle] [data-entity]").forEach((btn) => {
      const isActive = btn.getAttribute("data-entity") === entity;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
    document.querySelectorAll("[data-entity-toggle]").forEach((group) => group.setAttribute("data-active-entity", entity));
    document.documentElement.setAttribute("data-pricing-entity", entity);
    document.querySelectorAll("[data-entity-show]").forEach((el) => {
      el.toggleAttribute("data-entity-hidden", el.getAttribute("data-entity-show") !== entity);
    });
    document.dispatchEvent(new CustomEvent("heard:entity", { detail: { entity } }));
  }
  const requested = new URLSearchParams(window.location.search).get("entity") || window.location.hash.slice(1);
  setEntity(requested);
});

// pricing-slider.js
document.addEventListener("DOMContentLoaded", function() {
  const pricingCardsWrap = document.querySelector(".pr27-cards");
  if (!pricingCardsWrap) {
    console.error("Pricing cards wrap element not found.");
    return;
  }
  let isSliderActive = false;
  let touchstartX = 0;
  let touchendX = 0;
  let currentCardIndex = 0;
  let cards = [];
  let switchOptions = [];
  function getPricingCardSlides() {
    return Array.from(pricingCardsWrap.children).filter((child) => !child.hasAttribute("data-entity-hidden") && child.matches(".pr27-card"));
  }
  function createControls() {
    const controlsWrapper = document.createElement("div");
    controlsWrapper.className = "pricing-slider-controls";
    controlsWrapper.setAttribute("role", "tablist");
    controlsWrapper.setAttribute("aria-label", "Pricing plans");
    controlsWrapper.style.display = "flex";
    controlsWrapper.style.alignItems = "center";
    controlsWrapper.style.gap = "4px";
    controlsWrapper.style.width = "100%";
    controlsWrapper.style.padding = "4px";
    controlsWrapper.style.marginBottom = "14px";
    controlsWrapper.style.border = "1px solid rgba(34, 103, 82, 0.18)";
    controlsWrapper.style.borderRadius = "999px";
    controlsWrapper.style.background = "#fff";
    controlsWrapper.style.boxShadow = "0 1px 5px rgba(0, 0, 0, 0.14)";
    switchOptions = cards.map((card, index) => {
      const label = card.querySelector("[data-slider-label]")?.getAttribute("data-slider-label") || card.getAttribute("data-slider-label");
      const headingText = card.querySelector("h3")?.textContent?.trim();
      const option = document.createElement("button");
      option.type = "button";
      option.className = "pricing-slider-option";
      option.textContent = label || headingText || `Plan ${index + 1}`;
      option.setAttribute("role", "tab");
      option.style.flex = "1 1 0";
      option.style.minWidth = "0";
      option.style.border = "0";
      option.style.borderRadius = "999px";
      option.style.padding = "11px 8px";
      option.style.background = "transparent";
      option.style.color = "#545c57";
      option.style.font = "inherit";
      option.style.fontWeight = "600";
      option.style.fontSize = "16px";
      option.style.lineHeight = "1";
      option.style.cursor = "pointer";
      option.style.whiteSpace = "nowrap";
      option.addEventListener("click", () => {
        currentCardIndex = index;
        updateCardVisibility();
      });
      controlsWrapper.appendChild(option);
      return option;
    });
    pricingCardsWrap.parentNode.insertBefore(controlsWrapper, pricingCardsWrap);
    updateSwitchOptions();
  }
  function updateSwitchOptions() {
    if (!isSliderActive)
      return;
    switchOptions.forEach((option, index) => {
      const isActive = index === currentCardIndex;
      option.setAttribute("aria-selected", isActive ? "true" : "false");
      option.style.background = isActive ? "#23745c" : "transparent";
      option.style.color = isActive ? "#fff" : "#545c57";
      option.style.boxShadow = isActive ? "0 1px 2px rgba(0, 0, 0, 0.08)" : "none";
    });
  }
  function initSlider() {
    cards = getPricingCardSlides();
    if (cards.length <= 1)
      return;
    pricingCardsWrap.style.display = "block";
    pricingCardsWrap.style.scrollSnapType = "x mandatory";
    pricingCardsWrap.style.webkitOverflowScrolling = "touch";
    const featuredIndex = cards.findIndex((card) => card.matches("[data-featured]") || card.querySelector("[data-featured]"));
    currentCardIndex = Math.max(featuredIndex, 0);
    cards.forEach((card, index) => {
      card.style.minWidth = "100%";
      card.style.scrollSnapAlign = "start";
      card.style.display = index === currentCardIndex ? "flex" : "none";
    });
    isSliderActive = true;
    createControls();
    updateCardVisibility();
  }
  function destroySlider() {
    if (!pricingCardsWrap || !isSliderActive)
      return;
    pricingCardsWrap.style.display = "";
    pricingCardsWrap.style.scrollSnapType = "";
    pricingCardsWrap.style.webkitOverflowScrolling = "";
    cards.forEach((card) => {
      card.style.minWidth = "";
      card.style.scrollSnapAlign = "";
      card.style.display = "";
    });
    const controlsWrapper = pricingCardsWrap.previousElementSibling;
    if (controlsWrapper && controlsWrapper.matches(".pricing-slider-controls")) {
      controlsWrapper.remove();
    }
    switchOptions = [];
    isSliderActive = false;
    cards = [];
  }
  function updateCardVisibility() {
    if (!isSliderActive || cards.length === 0)
      return;
    cards.forEach((card, index) => {
      card.style.display = index === currentCardIndex ? "flex" : "none";
    });
    updateSwitchOptions();
  }
  function showNextCard() {
    if (currentCardIndex < cards.length - 1) {
      currentCardIndex++;
      updateCardVisibility();
    }
  }
  function showPrevCard() {
    if (currentCardIndex > 0) {
      currentCardIndex--;
      updateCardVisibility();
    }
  }
  function handleGesture() {
    const threshold = 50;
    if (touchendX < touchstartX - threshold) {
      showNextCard();
    }
    if (touchendX > touchstartX + threshold) {
      showPrevCard();
    }
  }
  pricingCardsWrap.addEventListener("touchstart", function(event) {
    if (!isSliderActive)
      return;
    touchstartX = event.changedTouches[0].screenX;
  }, { passive: true });
  pricingCardsWrap.addEventListener("touchend", function(event) {
    if (!isSliderActive)
      return;
    touchendX = event.changedTouches[0].screenX;
    handleGesture();
  }, { passive: true });
  function checkBreakpoint() {
    const screenWidth = window.innerWidth;
    if (screenWidth >= 240 && screenWidth <= 767) {
      if (!isSliderActive) {
        initSlider();
      }
    } else {
      if (isSliderActive) {
        destroySlider();
      }
    }
  }
  checkBreakpoint();
  window.addEventListener("resize", checkBreakpoint);
  document.addEventListener("heard:entity", () => {
    destroySlider();
    checkBreakpoint();
  });
});

// pricing-accordion.js
document.addEventListener("DOMContentLoaded", () => {
  const accordions = document.querySelectorAll("[data-card-accordion]");
  if (!accordions.length)
    return;
  const style = document.createElement("style");
  style.textContent = "[data-card-accordion]:not([data-open]) [data-card-accordion-panel]{display:none!important}";
  document.head.appendChild(style);
  accordions.forEach((accordion, i) => {
    const triggerEl = accordion.querySelector("[data-card-accordion-trigger]");
    const panel = accordion.querySelector("[data-card-accordion-panel]");
    if (!triggerEl || !panel)
      return;
    const trigger = toButton(triggerEl);
    if (!panel.id)
      panel.id = `card-accordion-panel-${i + 1}`;
    trigger.setAttribute("aria-controls", panel.id);
    const setOpen = (open) => {
      accordion.toggleAttribute("data-open", open);
      trigger.setAttribute("aria-expanded", open ? "true" : "false");
      const icon = trigger.querySelector("[data-card-accordion-icon]");
      if (icon)
        icon.textContent = open ? "−" : "+";
    };
    setOpen(accordion.hasAttribute("data-open"));
    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      setOpen(!accordion.hasAttribute("data-open"));
    });
  });
});

// pricing-modal.js
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.querySelector("[data-plan-modal]");
  if (!modal)
    return;
  const style = document.createElement("style");
  style.textContent = "[data-plan-modal][data-open]{display:flex!important}";
  document.head.appendChild(style);
  const dialog = modal.querySelector("[data-plan-modal-dialog]") || modal;
  dialog.setAttribute("role", "dialog");
  dialog.setAttribute("aria-modal", "true");
  dialog.setAttribute("tabindex", "-1");
  const title = modal.querySelector("[data-plan-modal-title]");
  if (title) {
    if (!title.id)
      title.id = "plan-modal-title";
    dialog.setAttribute("aria-labelledby", title.id);
  }
  const closers = [...modal.querySelectorAll("[data-plan-modal-close]")].map(toButton);
  closers.forEach((el) => {
    if (!el.hasAttribute("aria-label"))
      el.setAttribute("aria-label", "Close");
  });
  let opener = null;
  const isOpen = () => modal.hasAttribute("data-open");
  const focusables = () => [...dialog.querySelectorAll("a[href], button, [tabindex]:not([tabindex='-1'])")].filter((el) => el.offsetParent !== null);
  function open(trigger) {
    opener = trigger;
    modal.setAttribute("data-open", "");
    document.body.style.overflow = "hidden";
    (closers[0] || dialog).focus();
  }
  function close(returnFocus = true) {
    if (!isOpen())
      return;
    modal.removeAttribute("data-open");
    document.body.style.overflow = "";
    if (returnFocus)
      opener?.focus();
  }
  document.querySelectorAll("[data-plan-modal-open]").forEach((el) => {
    const trigger = toButton(el);
    trigger.setAttribute("aria-haspopup", "dialog");
    trigger.addEventListener("click", () => open(trigger));
  });
  closers.forEach((el) => el.addEventListener("click", () => close()));
  modal.querySelectorAll("[data-entity]").forEach((el) => el.addEventListener("click", () => {
    close(false);
    document.querySelector("[data-entity-toggle] .is-active")?.focus({ preventScroll: true });
  }));
  modal.addEventListener("click", (e) => {
    if (e.target === modal)
      close();
  });
  document.addEventListener("keydown", (e) => {
    if (!isOpen())
      return;
    if (e.key === "Escape") {
      close();
    } else if (e.key === "Tab") {
      const items = focusables();
      if (!items.length)
        return;
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
