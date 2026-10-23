document.addEventListener("DOMContentLoaded", () => {
  const toggleButton = document.querySelector(".pricing-chart_toggle-container");

  const getPriceElements = () => document.querySelectorAll("[price-per-month][price-per-annual]");
  const getDetailElements = () => document.querySelectorAll("[monthly-details][annual-details]");
  const getHideIfMonthlyElements = () => document.querySelectorAll('[hide-if="monthly"]');
  const getPriceMonthElements = () => document.querySelectorAll(".price-month");
  const getTaxPackageValues = () => document.querySelectorAll(".tax-package-value");
  const getPlanBadges = () => document.querySelectorAll(".badge-tax-plan");

  let currentView = "annual"; // Initial view

  const setTextFromAttr = (elements, attributeName) => {
    elements.forEach((el) => {
      const value = el.getAttribute(attributeName);
      if (value !== null && value !== el.textContent) {
        el.textContent = value;
      }
    });
  };

  function updateView() {
    if (toggleButton) toggleButton.setAttribute("aria-pressed", currentView === "monthly" ? "true" : "false");
    if (currentView === "annual") {
      setTextFromAttr(getPriceElements(), "price-per-annual");
      setTextFromAttr(getDetailElements(), "annual-details");
      getHideIfMonthlyElements().forEach((el) => {
        el.style.opacity = "1";
      });
      setTextFromAttr(getPriceMonthElements(), "ppm-annually");
      setTextFromAttr(getTaxPackageValues(), "a-value");
      setTextFromAttr(getPlanBadges(), "a-value");
    } else {
      // monthly view
      setTextFromAttr(getPriceElements(), "price-per-month");
      setTextFromAttr(getDetailElements(), "monthly-details");
      getHideIfMonthlyElements().forEach((el) => {
        el.style.opacity = "0";
      });
      setTextFromAttr(getPriceMonthElements(), "ppm-monthly");
      setTextFromAttr(getTaxPackageValues(), "m-value");
      setTextFromAttr(getPlanBadges(), "m-value");
    }
  }

  // Optional: the 2027 design shows annual on cards with a separate monthly row, so the toggle may be absent.
  if (toggleButton) {
    if (toggleButton.tagName !== "BUTTON") {
      toggleButton.setAttribute("role", "button");
      if (!toggleButton.hasAttribute("tabindex")) toggleButton.setAttribute("tabindex", "0");
      toggleButton.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleButton.click();
        }
      });
    }
    if (!toggleButton.hasAttribute("aria-label")) toggleButton.setAttribute("aria-label", "Show monthly pricing");
    toggleButton.addEventListener("click", () => {
      currentView = currentView === "annual" ? "monthly" : "annual";
      updateView();
    });
  }

  // Initial setup
  updateView();
  window.addEventListener("load", updateView);
});
