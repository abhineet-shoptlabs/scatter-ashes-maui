# Scatter Ashes Maui - Complete Project Context & Migration Blueprint

This document captures the entire history, design system, feature specifications, and current state of the **Scatter Ashes Maui** single-page application (SPA). Use this file to import all required context when transferring the project to a new Antigravity IDE environment or session.

---

## 1. Project Overview & Philosophy

**Scatter Ashes Maui** is a respectful, serene, and modern web application offering ash scattering ceremonies at sea and by air off the coast of Maui. The design and UX are guided by the Hawaiian principles of **Aloha** (love, peace, compassion) and **Kokua** (help, support), providing families with a professional, compassionate, and seamless planning experience.

---

## 2. Core Architecture & Files

The project is built as a lightweight, secure, and fast-loading static web application using standard frontend technologies:

1. **[index.html](file:///Users/abhineetkeshari/Antigravity%20Projects/ScatterAshesMaui/index.html)**:
   - Contains a responsive, glassmorphic Navigation Bar.
   - Hero section with dramatic sunset beach imagery (`assets/hero.png`).
   - *Kokua* Introduction Section detailing the ceremony philosophy.
   - Core Scattering Packages Grid (6 cards) and Bespoke Customizable Add-ons Grid (13 cards).
   - Cost & Package Planner Wizard (interactive choices grid + live sidebar summary).
   - About/History Section with an orchid lei illustration (`assets/lei.png`).
   - Inquiry Contact Form with validation and popup success modal.
   - Scripts loaded with a cache-buster query string (`app.js?v=1.1`).

2. **[style.css](file:///Users/abhineetkeshari/Antigravity%20Projects/ScatterAshesMaui/style.css)**:
   - Implements variables for primary colors (Serene Navy `#0f172a`, Ocean Blue, Warm Sand, and Trust Gold `#b45309`).
   - Type hierarchy pairing **EB Garamond** (elegant headings) with **Lato** (clean, readable body text).
   - Glassmorphic card design tokens (backdrop blur, subtle border lines).
   - Dark mode styles (`@media (prefers-color-scheme: dark)` overrides).
   - Hover scaling transition cubic-beziers for card zoom animations.
   - Stylesheets loaded with cache-buster `style.css?v=1.1`.

3. **[app.js](file:///Users/abhineetkeshari/Antigravity%20Projects/ScatterAshesMaui/app.js)**:
   - Navigation scroll classes bindings and mobile drawer hooks.
   - Complete `PRICING` dictionary (mapping all core packages and bespoke add-ons).
   - Selection state tracking and real-time package calculations in `updateSummary()`.
   - Toggle expand/collapse listener for the Bespoke Options section.
   - CTA scroll bindings and form auto-populator string formatter.
   - Success modal controllers and form validation hooks.

---

## 3. Visual Assets (assets/)

All card backgrounds utilize custom high-resolution photographic images designed to represent each service, overlayed with a dark linear-gradient for readability:

| File Name | Service Mapped | Image Description |
| :--- | :--- | :--- |
| `logo.png` | Brand Identity | High-contrast black brand logo lockup (inverted in dark-mode). |
| `hero.png` | Site Hero / Photo card | Serene coastal sunset over calm waves. |
| `lei.png` | About us / Wreath card | Orchid lei floating peacefully on waves at sunset. |
| `card_raft.png` | Super Raft | Zodiac raft cruising near Maui cliffs. |
| `card_snorkel.png` | Scatter & Snorkel | Charter catamaran sailing in turquoise bay with snorkelers. |
| `card_helicopter.png` | Helicopter | Helicopter soaring over deep green coastal valleys. |
| `card_plane.png` | Fixed Wing Plane | Single-engine plane flying over high clouds. |
| `card_unattended.png` | Unattended Package | Lei floating peacefully on ocean surface. |
| `card_special.png` | Special Requests / Beach | Serene volcanic Maui shoreline at sunrise with palms. |
| `card_kahu.png` | Kahu Clergy | Hawaiian Kahu minister blessing in white robes on beach. |
| `card_puolo.png` | Hawaiian Pu'olo / Bamboo | Handcrafted ti-leaf eco-urn sitting on ocean rocks. |
| `card_urns.png` | Biodegradable Urns | Eco-friendly shell-shaped urn resting on sandy beach. |
| `card_petals.png` | Fresh Flower Petals | Plumeria, orchid, and hibiscus petals floating on sea. |
| `card_leis.png` | Ti Leaf / Orchid Leis | Green ti-leaf and purple orchid lei on water surface. |
| `card_vocalist.png` | Ukulele Vocalist | Musician playing a wooden ukulele on beach at sunset. |
| `card_song_tribute.png`| Personalized Song | Acoustic guitar resting on bench overlooking ocean. |
| `card_doves.png` | White Dove Release | Flock of white doves flying over sea. |
| `card_bespoke.png` | Sprays & Easels | Elegant floral spray arrangement backdrop. |

---

## 4. Key Implementation Features & Solutions

### A. Photographic Background Legibility Overrides
To display background photos on the cards without sacrificing readability, a dark linear gradient overlay is applied via `::after`, and typography colors are overridden:
```css
.service-card.service-card-with-bg::after {
  content: '';
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(to bottom, rgba(15,23,42,0.55), rgba(15,23,42,0.90));
  z-index: -1;
}
.service-card.service-card-with-bg .service-title { color: #ffffff !important; }
.service-card.service-card-with-bg .service-desc { color: #d1d5db !important; }
.service-card.service-card-with-bg .service-meta { color: #fef08a !important; }
```

### B. Smooth Zoom Transitions (No Jank)
To prevent text shifts on hover, the background image is mapped to a `::before` pseudo-element and scaled independently of the text content:
```css
.service-card.service-card-with-bg::before {
  content: '';
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background-size: cover; background-position: center;
  z-index: -2;
  transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
.service-card.service-card-with-bg:hover::before {
  transform: scale(1.08);
}
```

### C. Collapsible Bespoke section (Show 6 by Default)
- Cards 7 through 13 are given the class `.bespoke-extra` (`display: none !important;` by default).
- When the container `#bespoke-grid` gets the `.expanded` class, cards show as `display: flex !important;` with a smooth keyframe fade-in translation.
- A button toggles the container class, text label, and scrolls the user focus back to the section title on collapse to maintain orientation.

### D. Cost & Package Planner Synchronization
The Ceremony Cost & Package Planner is fully synchronized with the actual brochure rates:
- **Core options**: Super Raft ($2,500), Scatter & Snorkel ($3,360), Helicopter ($1,500), Fixed Wing ($1,055), Unattended ($1,500), and Special Requests ($0 / Custom Varies).
- **Add-on options**: Corrected Professional Photography to $500, removed Hula Dancer, and added Floating Sea Wreath ($300) and Bamboo Float ($325) options.
- **Form Integration**: Formulates chosen options and total estimated cost, and injects the formatted request text into the message box before scrolling to the contact form.

---

## 5. Deployment Details

- **Local Server**: Run a preview server on port `8000` (`python3 -m http.server 8000`).
- **Git Branching Strategy**: Updates were developed, tested locally, committed to a new branch `feature/service-card-updates`, pushed to origin, and subsequently merged into `main`.
- **Production URL**: **[https://abhineet-shoptlabs.github.io/scatter-ashes-maui/](https://abhineet-shoptlabs.github.io/scatter-ashes-maui/)** (built and hosted via GitHub Pages).
