// Webflow can't output a real <button> (its Button/Link elements render as <a>), so the script fixes that at runtime.

// Swap an element for a real <button type="button">, keeping its classes, attributes and children.
export function toButton(el) {
  if (el.tagName === "BUTTON") return el;
  const button = document.createElement("button");
  button.type = "button";
  for (const { name, value } of el.attributes) {
    if (name !== "href" && name !== "role" && name !== "tabindex") button.setAttribute(name, value);
  }
  button.append(...el.childNodes);
  el.replaceWith(button);
  return button;
}

// Keep the <a> (e.g. it's styled as a site button) but give it button semantics and keyboard support.
export function asButton(el) {
  if (el.tagName === "BUTTON") return el;
  el.setAttribute("role", "button");
  if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "0");
  el.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      el.click();
    }
  });
  return el;
}
