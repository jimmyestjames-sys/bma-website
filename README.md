# BE MY A11Y — Website

Static website for [bemya11y.com](https://bemya11y.com), hosted on Cloudflare Pages.  
Built from scratch as clean, accessible HTML/CSS/JS — no frameworks, no build step required.

## Structure

```
bemya11y/
├── index.html          # Homepage
├── services.html       # Services page
├── accessibility.html  # What is Accessibility? page
├── about.html          # About / Our Story page
├── contact.html        # Contact page (with form)
├── 404.html            # Custom 404
├── _redirects          # Cloudflare Pages URL redirects
├── _headers            # Cloudflare Pages security & cache headers
├── css/
│   └── styles.css      # All styles (design tokens → components)
├── js/
│   └── site.js         # Nav toggle, form validation, live regions
└── images/             # (Add your images here — see notes below)
```

## Deploying to Cloudflare Pages

1. Push this repo to GitHub.
2. Go to **Cloudflare Dashboard → Pages → Create a project**.
3. Connect your GitHub repository.
4. Set **Framework preset** to `None`.
5. Leave the **Build command** blank.
6. Set **Output directory** to `/` (root).
7. Deploy — Cloudflare will serve the static files automatically.

`_redirects` and `_headers` are picked up automatically by Cloudflare Pages.

## Adding Your Images

- **Logo** — Replace the `<span class="site-logo-text">BE MY A11Y</span>` in each page's header with an `<img>` tag:
  ```html
  <img src="/images/logo.svg" alt="BE MY A11Y" height="48">
  ```
- **Founder headshot** — In `about.html`, replace the `.founder-avatar` `<div>` with:
  ```html
  <img src="/images/james.jpg" alt="James, Founder of BE MY A11Y" class="founder-avatar">
  ```
- **Story photo** — In `about.html`, replace the placeholder div in the "How We Started" section.
- **Brand logos** — In `about.html`, replace each `.logo-placeholder` div with your logo images.

## Contact Form

The form on `contact.html` is currently wired for client-side demo only (JS simulates success).  
To wire it to a real endpoint, choose one:

**Option A — Formspree (easiest)**
```html
<form id="contact-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

**Option B — Cloudflare Pages Functions**  
Add `/functions/contact.js` and point the form's `action` to `/contact` (POST).

**Option C — Netlify Forms** (if migrating to Netlify instead)
```html
<form id="contact-form" netlify name="contact">
```

## Accessibility

This site is built to **WCAG 2.2 AA**:

- Skip navigation link on every page
- Semantic HTML5 landmarks (`<header>`, `<main>`, `<footer>`, `<nav>`)
- `aria-label` on all navigation regions
- `aria-current="page"` applied to active nav link via JS
- Accessible mobile nav toggle with `aria-expanded` and `aria-controls`
- Focus management on mobile nav close (Escape key)
- All form inputs have associated `<label>` elements
- Inline error messages linked via `aria-describedby`
- `aria-invalid` set on invalid fields
- `aria-live` region for dynamic announcements
- 44×44px minimum touch target size on all interactive elements
- `prefers-reduced-motion` respected via CSS media query
- `focusable="false"` on decorative SVGs

## Fonts

Using Google Fonts (Inter + Playfair Display) loaded via `<link>` in each page `<head>`.  
To self-host for better privacy/performance, download the fonts and update the `@font-face` declarations in `css/styles.css`.

---

© 2026 BE MY A11Y, LLC. All rights reserved.
