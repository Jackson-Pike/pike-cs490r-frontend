# MovieListPage Stories Design

**Date:** 2026-06-18

## Goal

Add a Storybook story file for `MovieListPage` that covers all three render states: success, loading, and error. This allows each state to be developed and tested in isolation without running the backend.

## File

`src/pages/MovieListPage.stories.jsx`

## Stories

### Default (Success)
- MSW returns the two sample movies already defined in `.storybook/msw-handlers.js`
- Renders the movie list via `MovieCard` components
- Play test verifies both movie titles are visible in the canvas

### Loading
- MSW handler delays indefinitely (never resolves) using `http.get` with a custom resolver that returns a pending promise
- Verifies the "Loading..." text is visible

### Error
- MSW handler returns `HttpResponse.error()` or a 500 response
- Verifies an error message is visible in the canvas

## Setup

- **Router:** Wrap with `MemoryRouter` from `react-router-dom` via a decorator, since `MovieListPage` renders `<Link>` components that require router context. `MemoryRouter` is correct for Storybook/testing — it doesn't interact with the browser URL bar.
- **MSW:** Already globally initialized in `.storybook/preview.jsx`. Each story overrides the handler via the `parameters.msw.handlers` field.

## Pattern Reference

Follow the structure of `src/components/MovieCard.stories.jsx` for meta, story shape, and play test style.

## Out of Scope

- Navigation behavior (clicking a card) — tested in e2e, not Storybook
- Authenticated states — `MovieListPage` has no auth gate
