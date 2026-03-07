# Copilot / AI agent instructions for this repository

This is a small React app scaffolded with Vite. Keep instructions concise and actionable — prefer edits to existing files and small PRs.

Key facts (quick):
- Project type: React (JS, not TypeScript) + Vite. Entry: `src/index.jsx` and `index.html`.
- Routing: `react-router-dom` (routes are declared in `src/App.jsx`). Pages live under `src/page/`.
- UI: Material UI (`@mui/material`) + some plain CSS files (see `src/page/Registration/Registration.css` and `public/App.css`).
- Notable libraries: `react-multi-carousel` (`src/page/GamesPage.jsx`), `axios` (available in deps), `@mui/*`.

Developer commands you can run or suggest:
- dev (local): `npm run dev` (starts Vite with HMR)
- build: `npm run build` (vite build)
- preview: `npm run preview` (preview built app)
- lint: `npm run lint` (ESLint configured)

Project structure and patterns the agent should follow:
- Pages vs components: keep top-level route components in `src/page/` and reusable UI in `src/components/`.
- Default exports: components and pages use default exports (follow that style when adding new files).
- Styling: CSS files are imported directly in component files (e.g. `import './Registration/Registration.css'`), and inline styling is used in some pages (e.g. `GamesPage.jsx`). Prefer adding component-scoped CSS under `src/components` or a sibling folder under `src/page/`.
- Navigation: use `useNavigate()` from `react-router-dom` (see `NavBar.jsx`) or route `element` props in `App.jsx`.
- Forms: controlled components using `useState` are the pattern (see `RegistrationPage.jsx`). Validation is done locally in the page — follow the same pattern for small forms.

Integration & common touchpoints:
- Routing registration: add new pages by importing them in `src/App.jsx` and adding a `<Route path="/..." element={<MyPage/>} />`.
- Global state: there is no global state/Redux; add carefully and document if introducing one.
- API calls: `axios` is available; prefer keeping calls in small service modules under `src/services/` if you add them.

Examples to cite when making changes:
- Add a route: modify `src/App.jsx` (routes are declared there).
- Use navigation: `const navigate = useNavigate(); navigate('/games')` (see `src/components/NavBar.jsx`).
- Form pattern: controlled inputs + local `submitted`/`valid` booleans (see `src/page/Registration/RegistrationPage.jsx`).
- Carousel: custom arrows and inline item styles in `src/page/GamesPage.jsx` — follow this pattern for simple, self-contained UI behavior.

Linting / quality:
- The repo includes an ESLint setup and `npm run lint`. Run it for JS issues before committing.
- Keep changes minimal and focused to avoid breaking routes or imports — module paths are relative and case-sensitive on some environments.

When merging or editing files:
- If `.github/copilot-instructions.md` already existed, preserve any project-specific rules present there and append small clarifications. This file should remain concise (~20–50 lines).
- Provide specific file references in PR descriptions (e.g., "Updated routing in `src/App.jsx` and added `src/page/StatsPage.jsx`").

If anything is unclear or you need repository-level decisions (global state, API base URL, authentication), ask the human maintainer before introducing cross-cutting changes.

Files to inspect for examples: `src/App.jsx`, `src/page/Registration/RegistrationPage.jsx`, `src/page/GamesPage.jsx`, `src/components/NavBar.jsx`, `package.json`, `vite.config.js`.

Ask the user if they'd like stricter guidance (commit message formats, PR size limits, or branching rules) to be added to this file.
