# MovieListPage Stories Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a Storybook story file for `MovieListPage` covering the success, loading, and error render states.

**Architecture:** A single story file wraps `MovieListPage` in a `MemoryRouter` decorator (required because the page renders `<Link>` components) and uses per-story MSW handler overrides to control what the `useFetch` hook receives. The global MSW setup in `.storybook/preview.jsx` is already active — stories only need to override the `movies` handler.

**Tech Stack:** Storybook 10, MSW 2 via `msw-storybook-addon`, React Router `MemoryRouter`, `storybook/test` for play tests.

## Global Constraints

- Follow the pattern established in `src/components/MovieCard.stories.jsx` for meta shape, story exports, and play test style.
- All stories tagged `['autodocs']` (Storybook default) — no custom tags needed.
- MSW handler key must match `mswHandlers.movies` shape already in `.storybook/msw-handlers.js`.
- Do not modify any file other than the one being created.

---

### Task 1: Create MovieListPage.stories.jsx with Default (success) story

**Files:**
- Create: `src/pages/MovieListPage.stories.jsx`

**Interfaces:**
- Consumes: `MovieListPage` default export from `./MovieListPage`
- Consumes: `http`, `HttpResponse` from `msw`
- Consumes: `MemoryRouter` from `react-router-dom`
- Consumes: `expect` from `storybook/test`
- Produces: `Default` named export (story), used by Storybook canvas

- [ ] **Step 1: Write the story file with only the Default story**

Create `src/pages/MovieListPage.stories.jsx`:

```jsx
import { expect } from 'storybook/test';
import { http, HttpResponse } from 'msw';
import { MemoryRouter } from 'react-router-dom';
import MovieListPage from './MovieListPage';

const sampleMovies = [
  {
    _id: '1',
    title: 'The Matrix',
    director: 'The Wachowskis',
    genre: 'Sci-Fi',
    releaseDate: '1999-03-31T00:00:00.000Z',
    synopsis: 'A hacker discovers the world is a simulation.',
    runtime: 136,
    maturity_rating: 'R',
    poster_url: 'https://placehold.co/150x220?text=The+Matrix',
  },
  {
    _id: '2',
    title: 'Inception',
    director: 'Christopher Nolan',
    genre: 'Sci-Fi',
    releaseDate: '2010-07-16T00:00:00.000Z',
    synopsis: 'A thief enters dreams to plant an idea.',
    runtime: 148,
    maturity_rating: 'PG-13',
    poster_url: 'https://placehold.co/150x220?text=Inception',
  },
];

const meta = {
  component: MovieListPage,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export default meta;

export const Default = {
  parameters: {
    msw: {
      handlers: [
        http.get('http://localhost:3000/api/movies', () =>
          HttpResponse.json(sampleMovies)
        ),
      ],
    },
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('The Matrix')).toBeVisible();
    await expect(canvas.getByText('Inception')).toBeVisible();
  },
};
```

- [ ] **Step 2: Run Storybook and verify Default story renders both movies**

```bash
npm run storybook
```

Open `http://localhost:6006` and navigate to **Pages/MovieListPage → Default**. Both "The Matrix" and "Inception" movie cards should be visible. The play test indicator in the toolbar should show green.

- [ ] **Step 3: Commit**

```bash
git add final-project/src/pages/MovieListPage.stories.jsx
git commit -m "feat(stories): add MovieListPage Default story"
```

---

### Task 2: Add Loading story

**Files:**
- Modify: `src/pages/MovieListPage.stories.jsx`

**Interfaces:**
- Consumes: `Default` story shape from Task 1
- Produces: `Loading` named export

- [ ] **Step 1: Add the Loading story to the file**

Append below the `Default` export:

```jsx
export const Loading = {
  parameters: {
    msw: {
      handlers: [
        http.get('http://localhost:3000/api/movies', () => new Promise(() => {})),
      ],
    },
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Loading...')).toBeVisible();
  },
};
```

`new Promise(() => {})` never resolves, so `useFetch` stays in the loading state permanently.

- [ ] **Step 2: Verify in Storybook**

Navigate to **Pages/MovieListPage → Loading**. The canvas should show "Loading..." and the play test should be green.

- [ ] **Step 3: Commit**

```bash
git add final-project/src/pages/MovieListPage.stories.jsx
git commit -m "feat(stories): add MovieListPage Loading story"
```

---

### Task 3: Add Error story

**Files:**
- Modify: `src/pages/MovieListPage.stories.jsx`

**Interfaces:**
- Consumes: `Default` and `Loading` story shapes from Tasks 1–2
- Produces: `Error` named export

- [ ] **Step 1: Add the Error story to the file**

Append below the `Loading` export:

```jsx
export const Error = {
  parameters: {
    msw: {
      handlers: [
        http.get('http://localhost:3000/api/movies', () =>
          HttpResponse.error()
        ),
      ],
    },
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Failed to fetch')).toBeVisible();
  },
};
```

`HttpResponse.error()` simulates a network failure. The browser throws `TypeError: Failed to fetch`, `useFetch` catches it and sets `error = error.message`, and `MovieListPage` renders that string directly.

- [ ] **Step 2: Verify in Storybook**

Navigate to **Pages/MovieListPage → Error**. The canvas should show "Failed to fetch" and the play test should be green.

- [ ] **Step 3: Commit**

```bash
git add final-project/src/pages/MovieListPage.stories.jsx
git commit -m "feat(stories): add MovieListPage Error story"
```
