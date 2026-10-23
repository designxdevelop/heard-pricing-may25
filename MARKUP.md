# /pricing Webflow markup (2027 pricing, phase 1)

Add these as Webflow **custom attributes** (Element settings → Custom attributes). If an attribute has no value, leave the value field empty.

## 1. Script

The page loads the script from a hidden embed in the page body (not site settings):

```html
<script src="https://cdn.jsdelivr.net/gh/designxdevelop/heard-pricing-may25@7245820/dist/heard-pricing.js/heard-pricing.js"></script>
```

After this branch is pushed, change `@7245820` to the new commit SHA. The URL is pinned to a commit, so pushing to `main` doesn't change the live site. The commented-out `austin-thesing/...@fa18948` and `heard-pricing@3f53ca3` tags in that embed can be deleted.

## 2. Customer-type toggle

| Element | Attribute | Value |
|---|---|---|
| Toggle wrapper | `data-entity-toggle` | (empty) |
| "Solo sole prop" button | `data-entity` | `solo` |
| "S corp or group" button | `data-entity` | `scorp` |

- The script adds `role="group"` and `aria-label="Practice type"` to the wrapper, unless you set them yourself.
- On each change, the script updates `aria-pressed` on both buttons and puts the `is-active` class on the selected one. Style the selected pill with the `is-active` combo class.
- The wrapper gets `data-active-entity="solo|scorp"`. Custom CSS can use it to slide a thumb.
- Use a Webflow **Button**, or a Div Block with the button tag. If the element renders as `<a>`, the script adds `role="button"`, `tabindex="0"`, and Enter/Space key support.
- Any other element with `data-entity` also switches the view, for example the "See solo plans" and "See S corp and group plans" buttons in the "Which plan is right for me?" modal. Only buttons inside the wrapper get `aria-pressed`.
- The default view is `solo`. Deep links: `/pricing?entity=scorp` or `/pricing#scorp`.

## 3. Anything that depends on customer type

Add `data-entity-show` with the value `solo` or `scorp`. Elements without this attribute always show. Use it on:

- Each pricing card. It goes on the direct child of `.pricing-cards-wrap-may-2025`.
- Each column of the "Prefer to pay monthly?" row.
- The tax-package banner, if it has a solo version and an S corp version (Up to $2,626 vs Up to $3,376).
- The S corp side panel ("Every S corp requirement, handled start to finish"), if you build it: `scorp`.

Hidden elements get `data-entity-hidden`, plus an injected `display:none !important` rule that overrides Webflow classes.

## 4. Cards (keep all in `.pricing-cards-wrap-may-2025`)

Reuse the three existing `.pricing-card-may25` cards (Lite, Essential, Premium). The Premium card becomes Essential (for S Corps or Groups).

| | Lite | Essential (for Sole Props) | Essential (for S Corps or Groups) |
|---|---|---|---|
| `data-entity-show` | `solo` | `solo` | `scorp` |
| `data-featured` | — | (empty) | (empty) |
| `data-slider-label` | `Lite` | `Essential` | `Essential` |
| Badge | none | "Most popular" | none (the design hides it when only one card shows) |
| Annual price shown | $139/mo | $189/mo | $299/mo |
| Annual billing line | $1,668 billed annually · save $240 a year | $2,268 billed annually · save $360 a year | $3,588 billed annually · save $600 a year |
| Monthly price | $159/mo | $219/mo | $349/mo |
| Monthly row line | Billed monthly · $20 more a month than annual | Billed monthly · $30 more a month than annual | Billed monthly · $50 more a month than annual |

- `data-featured` makes the mobile slider open on that card. Without it, the slider opens on the first card.
- `data-slider-label` sets the text of the mobile plan switch. Without it, the switch uses the card's `h3`.
- The real annual discounts are 12.6%, 13.7%, and 14.3%. Don't write "save 15%".

### Only if you keep the monthly/annual toggle

The existing attributes still work. The `.pricing-chart_toggle-container` element is now optional. When it is present, it gets `aria-pressed` (true means monthly) and keyboard support.

| Element | Lite | Essential (Sole Props) | Essential (S Corps/Groups) |
|---|---|---|---|
| price number: `price-per-month` / `price-per-annual` | `159` / `139` | `219` / `189` | `349` / `299` |
| detail line: `monthly-details` / `annual-details` | `Billed monthly • Cancel anytime` / `$1,668 billed annually · save $240 a year` | … / `$2,268 billed annually · save $360 a year` | … / `$3,588 billed annually · save $600 a year` |
| `.price-month`: `ppm-monthly` / `ppm-annually` | `/mo` / `/mo` | same | same |

## 5. Add-ons

- Payroll: **$49/mo plus $9 per person**, monthly only. Label: "Add-on for Essential (S corps & groups)".
- Catch-up bookkeeping: $99/mo (no change).

## 6. FAQ

You can edit the FAQ copy, but keep the `.pricing-faq_row`, `.acc-head h3` and `.acc-body` classes. The FAQ schema script depends on them.
