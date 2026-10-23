// pricing-entity.js
document.addEventListener("DOMContentLoaded", () => {
  const ENTITIES = ["solo", "scorp"];
  const DEFAULT_ENTITY = "solo";
  const buttons = document.querySelectorAll("[data-entity]");
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
    if (btn.tagName !== "BUTTON") {
      btn.setAttribute("role", "button");
      if (!btn.hasAttribute("tabindex"))
        btn.setAttribute("tabindex", "0");
      btn.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          btn.click();
        }
      });
    }
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      setEntity(btn.getAttribute("data-entity"));
    });
  });
  function setEntity(entity) {
    if (!ENTITIES.includes(entity))
      entity = DEFAULT_ENTITY;
    buttons.forEach((btn) => {
      const isActive = btn.getAttribute("data-entity") === entity;
      btn.classList.toggle("is-active", isActive);
      if (btn.closest("[data-entity-toggle]"))
        btn.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
    document.querySelectorAll("[data-entity-toggle]").forEach((group) => group.setAttribute("data-active-entity", entity));
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
