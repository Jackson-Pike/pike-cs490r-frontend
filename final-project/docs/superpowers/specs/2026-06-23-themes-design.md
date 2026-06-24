# Themes System — Design Spec
**Date:** 2026-06-23  
**Feature:** Plug-and-play visual themes that change colors and typography site-wide without touching component structure.

---

## Overview

Five predefined themes, selectable from the profile page. Each theme redefines a shared set of CSS custom properties (colors + fonts) scoped to a `data-theme` attribute on `<html>`. Switching is animated via the View Transitions API. Selection persists in `localStorage`.

---

## Architecture

### New files

```
src/
  themes/
    themes.css          ← all five theme variable blocks + transition animation
  context/
    ThemeContext.jsx    ← active theme state, localStorage, data-theme writer, font injector
  hooks/
    useTheme.js         ← thin hook exposing { theme, setTheme, themes }
```

### Existing file changes

- `main.jsx` — wrap `<App />` in `<ThemeProvider>`
- `index.css` — remove the `--green` hardcoded value from `:root`; it becomes `--primary` per theme
- All component CSS files that reference `var(--green)` — find-replace to `var(--primary)`

### Data-theme placement

`data-theme` goes on `document.documentElement` (the `<html>` element) so the background color reaches the full viewport, not just `#root`.

---

## CSS Token Contract

Every theme defines exactly these variables:

| Token | Purpose |
|---|---|
| `--bg` | Page background |
| `--bg-secondary` | Cards, panels, shelves |
| `--bg-dark` | Header background |
| `--bg-dark-secondary` | Header inner surface |
| `--text` | Body text color |
| `--text-h` | Heading text color |
| `--primary` | Primary accent color (replaces `--green`) |
| `--border` | Dividers and outlines |
| `--shadow` | Box shadow values |
| `--sans` | Body font stack |
| `--heading` | Display/heading font stack |

---

## The Five Themes

### 1. Dark Cinema (`dark-cinema`) — default
- **Bg:** `#121212` / `#1a1a1a`
- **Primary:** `#00ff85` (neon green)
- **Text:** `#9ca3af` / `#f3f4f6`
- **Fonts:** `system-ui, 'Segoe UI', sans-serif` for both heading and body
- This is the current look — no visual changes, just mapped to the token system.

### 2. Vintage Hollywood (`vintage-hollywood`)
- **Bg:** `#f5f0e8` (cream) / `#ede7d9` (warm parchment)
- **Primary:** `#c9a84c` (gold)
- **Text:** `#4a3728` (dark brown) / `#1a0f00`
- **Heading font:** Playfair Display (serif, from Google Fonts)
- **Body font:** Lora (serif)
- Warm, elegant, art-deco feel.

### 3. Streaming Service (`streaming-service`)
- **Bg:** `#0a0a0a` / `#141414`
- **Primary:** `#e50914` (Netflix red)
- **Text:** `#a3a3a3` / `#ffffff`
- **Heading font:** Anton (bold condensed sans, from Google Fonts)
- **Body font:** Inter
- High-contrast, bold, recognizable streaming aesthetic.

### 4. Retro VHS (`retro-vhs`)
- **Bg:** `#0d0015` (deep purple) / `#150020`
- **Primary:** `#00f5e4` (cyan-teal)
- **Text:** `#b09fc0` / `#e8d5f5`
- **Heading font:** VT323 (pixel/CRT monospace, from Google Fonts)
- **Body font:** Share Tech Mono
- CRT terminal, late-80s video store vibe.

### 5. Clean Light (`clean-light`)
- **Bg:** `#ffffff` / `#f8f8fa`
- **Primary:** `#6366f1` (indigo)
- **Text:** `#6b7280` / `#111827`
- **Heading font:** Plus Jakarta Sans (from Google Fonts)
- **Body font:** Plus Jakarta Sans
- Minimal, editorial, Letterboxd-adjacent.

---

## ThemeContext

```jsx
// Exposes:
{ theme, setTheme, themes }

// themes = [
//   { id: 'dark-cinema',        label: 'Dark Cinema',        swatch: '#00ff85', bg: '#121212' },
//   { id: 'vintage-hollywood',  label: 'Vintage Hollywood',  swatch: '#c9a84c', bg: '#f5f0e8' },
//   { id: 'streaming-service',  label: 'Streaming Service',  swatch: '#e50914', bg: '#0a0a0a' },
//   { id: 'retro-vhs',          label: 'Retro VHS',          swatch: '#00f5e4', bg: '#0d0015' },
//   { id: 'clean-light',        label: 'Clean Light',        swatch: '#6366f1', bg: '#ffffff' },
// ]
```

**Initialization (in `useLayoutEffect`):**
1. Read `localStorage.getItem('theme')`, fall back to `'dark-cinema'`
2. Set `document.documentElement.dataset.theme = savedTheme`
3. Inject the Google Fonts `<link>` for that theme

**On `setTheme(id)`:**
1. If `document.startViewTransition` exists, wrap steps 2–4 inside it; otherwise call directly
2. Set `document.documentElement.dataset.theme = id`
3. Swap Google Fonts `<link>` (remove old, inject new)
4. Set `localStorage.setItem('theme', id)`
5. Update React state

Fonts for Dark Cinema use system fonts — no `<link>` injection needed.

---

## Profile Page Switcher

Added as an "Appearance" card section in `ProfilePage.jsx`, below the user info block.

**UI:** A horizontal row of five circular swatches. Each swatch:
- Filled circle in the theme's `swatch` color
- Outer ring in the theme's `bg` color
- Active theme: checkmark overlay + glowing ring
- Hover: theme label appears below as a small caption
- Click: brief pulse animation on the swatch, then theme transition fires

No new route or page. Lives at `/profile` behind the existing `ProtectedRoute`.

---

## Transition Animation

**Primary:** `document.startViewTransition()` — browser crossfades old and new page snapshots.

**Ripple enhancement** (in `themes.css`): Override the default crossfade with a circular clip-path expansion:

```css
::view-transition-new(root) {
  animation: theme-ripple 0.45s ease-out;
}

@keyframes theme-ripple {
  from { clip-path: circle(0% at 50% 50%); }
  to   { clip-path: circle(150% at 50% 50%); }
}
```

**Graceful degradation:** In Firefox (no View Transitions support), theme switches instantly with no animation. The feature is purely additive.

**Swatch feedback:** The clicked swatch scales up briefly (`transform: scale(1.2)`) then back, giving tactile feedback before the page transition fires.

---

## Font Loading Strategy

- Google Fonts are loaded lazily — only the active theme's fonts are in the DOM
- A single `<link id="theme-fonts">` element is reused; its `href` is swapped on theme change
- Dark Cinema uses system fonts, so no `<link>` is needed for the default state — no network request on first load

---

## Out of Scope

- Custom/user-defined themes
- Per-component theme overrides
- Theme preview before applying
- Admin-only themes
