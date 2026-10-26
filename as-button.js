// Webflow "Button"/"Link" elements render as <a>; make one behave like a real button for keyboard and screen readers.
export function asButton(el) {
  if (el.tagName === "BUTTON") return;
  el.setAttribute("role", "button");
  if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "0");
  el.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      el.click();
    }
  });
}
