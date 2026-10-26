# /pricing Webflow markup (2027 pricing, phase 1)

The new module is the **"Pricing - 2027"** component (root class `pr27-section`), placed on the Pricing page. The old "Pricing Section (no Lite)" is in a hidden div below it.

> Prices, attributes and class names are final. Card copy comes from Mel's mockup and is a placeholder until the copy is confirmed.

## 1. Script

The new section has two embeds of its own:

- **"Pricing 2027 pre-paint (no-flash CSS)"** is the first child of the section. Its small inline script sets `html[data-pricing-entity]` from `?entity=` or `#scorp` (default `solo`), and its CSS hides the other customer type before first paint. On mobile the CSS also shows only the `data-featured` card until the slider starts, and card accordion panels stay closed until the script runs. The rules only apply after that inline script runs, and Webflow doesn't run scripts in the Designer, so the Designer still shows everything.
- **"Pricing 2027 script (jsDelivr @fe05db7)"** is the last child of the section. It loads the full script: the toggle (it keeps `data-pricing-entity` in sync), the mobile slider, the card accordions and the plan-help modal. It's built from the `pricing-2027-phase1` branch:

```html
<script src="https://cdn.jsdelivr.net/gh/designxdevelop/heard-pricing-may25@fe05db7/dist/heard-pricing.js/heard-pricing.js"></script>
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
- Toggle options are Webflow Links. The script swaps them for real `<button type="button">` elements, keeping their classes and attributes. In Webflow, Solo carries the `is-active` combo so the selected state also shows in the Designer and before the script loads.

| Card accordion | Attribute |
|---|---|
| Wrapper (`.pr27-acc`) | `data-card-accordion` (add `data-open` to start it open) |
| Trigger (`.pr27-acc-trigger`) | `data-card-accordion-trigger`. The script makes it a real `<button>` and sets `aria-expanded` and `aria-controls` |
| Icon span (`.pr27-acc-icon`) | `data-card-accordion-icon` (the script sets `+` or `−`) |
| Panel (`.pr27-acc-panel`) | `data-card-accordion-panel` |

| Plan help modal | Attribute |
|---|---|
| Opener link under the toggle (`.pr27-help-link`) | `data-plan-modal-open` |
| Overlay (`.pr27-modal`, `display: none` by class) | `data-plan-modal` |
| Dialog card (`.pr27-modal-card`) | `data-plan-modal-dialog` (the script adds `role="dialog"`, `aria-modal` and `aria-labelledby`) |
| Title | `data-plan-modal-title` |
| Close × | `data-plan-modal-close` |
| "See solo plans" / "See S corp and group plans" | `data-entity="solo"` / `data-entity="scorp"` (they switch the plan, close the modal and focus the toggle) |

The card accordions deliberately don't use `.acc-head`, `.acc-body` or `.pricing-faq_row`, which the FAQ schema script reads.

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

## 5. Card accordion copy (all three cards; closed by default)

Trigger: **Also included: bookkeeping, reports & tracking, Heard Banking**

- **Bookkeeping:** Monthly done-for-you bookkeeping · Connect multiple business bank accounts · Dedicated bookkeeping team reviewing your monthly books for accuracy · Year-end tax-ready books · Tax deduction tracking
- **Reports & tracking:** Monthly income, expense, and profit reports and tracking · Profit and loss statements · Profit allocation guide · Real-time income tracking and goal monitoring
- **Heard Banking\*:** Business checking, savings, and a Heard debit card · Every transaction auto-categorized into your books and taxes · Separate accounts for taxes, savings, and owner draws

No Premium items and no phone support.

## 6. "Which plan is right for me?" modal copy

- Link: **Not sure? Which plan is right for me**
- **Solo sole prop or single-member LLC:** You report your business income on your personal return (Schedule C). With tax season coming up, most solo practices choose Essential: we prepare and file your annual return, on top of your bookkeeping and quarterly estimates. Just starting out? Lite covers your books and quarterly taxes, and you can add annual filing later. → **See solo plans**
- **S corp, or any group practice:** Your business files its own return (Form 1120-S), and you pay yourself a salary through payroll. Essential for S corps and groups covers your business and personal returns. → **See S corp and group plans**
- Still not sure? **Book a free consult** (`/free-consult`). We'll take a first look at whether an S corp could make sense for you.

Native Webflow Modals aren't enabled on this site, so the overlay is a plain div and the script handles opening and closing: Esc, backdrop click, focus trap, and focus returning to the trigger. To edit the modal in the Designer, select **"Plan help modal (hidden; script opens it)"** in the Navigator and temporarily set its display to flex.

## 7. Before launch

- To ship a new build: push `pricing-2027-phase1`, then change the SHA in the "Pricing 2027 script" embed.
- The old "Pricing Section (no Lite)" now sits in a hidden div on this page, and it has its own `h1`. Delete it once the launch is confirmed.
- FAQ: keep the `.pricing-faq_row`, `.acc-head h3` and `.acc-body` classes, which the FAQ schema script depends on.
