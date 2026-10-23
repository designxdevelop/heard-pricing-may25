# /pricing Webflow markup (2027 pricing, phase 1)

The new module is already built in Webflow on the Pricing page. In the Navigator it's called **"Pricing 2027 (new module, hidden until launch)"** (class `pr27-section`) and sits directly above the old "Pricing Section (no Lite)" component. To hide it again, add the `is-prelaunch-hidden` combo class (`display: none`).

> Prices, attributes and class names are final. Card copy comes from Mel's mockup and is a placeholder until the copy is confirmed.

## 1. Script

The new section has two embeds of its own:

- **"Pricing 2027 pre-paint (no-flash CSS)"** is the first child of the section. Its small inline script sets `html[data-pricing-entity]` from `?entity=` or `#scorp` (default `solo`), and its CSS hides the other customer type before first paint. On mobile the CSS also shows only the `data-featured` card until the slider starts. The rules only apply after that inline script runs, and Webflow doesn't run scripts in the Designer, so the Designer still shows everything.
- **"Pricing 2027 script (jsDelivr @e8d28c0)"** is the last child of the section. It loads the full script, which keeps `data-pricing-entity` in sync when someone switches types. It's built from the `pricing-2027-phase1` branch:

```html
<script src="https://cdn.jsdelivr.net/gh/designxdevelop/heard-pricing-may25@e8d28c0/dist/heard-pricing.js/heard-pricing.js"></script>
```

The old section still loads `@7245820` through the shared "Pricing Logic (JS)" component, which has 3 instances. Leave that component alone. Both scripts can run on the same page: each slider only manages its own controls. Deleting the old section at launch also removes the old script. To ship a new build, change the SHA in the new embed. Custom code only runs on a published site, so the toggle can't be tested in the Designer.

## 2. Attributes the script reads

| Element | Attribute | Value |
|---|---|---|
| `.pr27-toggle` | `data-entity-toggle` | (empty) |
| Toggle buttons (`.pr27-toggle-btn`) | `data-entity` | `solo` / `scorp` |
| Anything that depends on customer type | `data-entity-show` | `solo` / `scorp` |
| Card to open on for mobile | `data-featured` | (empty) |
| Mobile switch label | `data-slider-label` | `Lite` / `Essential` |

- The script sets `aria-pressed` on the toggle buttons and puts `is-active` on the selected one. The selected pill is styled by the `.pr27-toggle-btn.is-active` combo class.
- Webflow renders the buttons as `<a>`, so the script adds `role="button"`, `tabindex="0"` and Enter/Space key support.
- The default view is `solo`. Deep links: `/pricing?entity=scorp` or `/pricing#scorp`.
- The mobile slider (≤767px) uses `.pr27-cards`, and only its direct `.pr27-card` children that are showing.

## 3. What's tagged

| Element | `data-entity-show` |
|---|---|
| Tax offer banner "Up to $2,626" (`.pr27-pkg`) | `solo` |
| Tax offer banner "Up to $3,376" (`.pr27-pkg`) | `scorp` |
| Lite card | `solo` |
| Essential (for Sole Props) card, "Most popular", `data-featured` | `solo` |
| Essential (for S Corps or Groups) card, `data-featured` | `scorp` |
| S corp panel (`.pr27-panel`) | `scorp` |
| Monthly row columns: Lite $159, Essential $219 / Essential $349 | `solo`, `solo` / `scorp` |

## 4. Prices

| | Annual (shown on card) | Billed yearly | Saves | Monthly |
|---|---|---|---|---|
| Lite | $139/mo | $1,668 | $240/yr | $159/mo |
| Essential (for Sole Props) | $189/mo | $2,268 | $360/yr | $219/mo |
| Essential (for S Corps or Groups) | $299/mo | $3,588 | $600/yr | $349/mo |

- Payroll: $49/mo + $9 per person, monthly only.
- Catch-up bookkeeping: $99/mo.
- Don't write "save 15%". The real annual discounts are 12.6%, 13.7% and 14.3%.

## 5. Before launch

- Delete the old "Pricing Section (no Lite)" component on this page, which has its own `h1`. Also remove the `is-prelaunch-hidden` class if it's on, and change the embed SHA.
- FAQ: keep the `.pricing-faq_row`, `.acc-head h3` and `.acc-body` classes, which the FAQ schema script depends on.
