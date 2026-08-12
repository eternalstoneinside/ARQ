# Roadmap

## Phase 0 — complete

Inspect repository, preserve useful work, choose foundation, and document the plan. Initial state was empty and not a Git repository.

## Phase 1 — complete

React/Vite/Tailwind foundation; strict TypeScript; routes and mobile shell; design tokens; shared primitives; Ukrainian copy foundation; centralized PLN/date utilities; domain types; realistic mock data; interactive Home/Add/Analytics; Settings placeholder; responsive light UI and dark token foundation; durable documentation.

## ARQ Balance beta foundation — current

- Google authentication and guarded routes;
- complete space and invitation-code lifecycle;
- persistent transaction CRUD with soft deletion and realtime refresh;
- derived Home, history, details, and Analytics;
- consistent mobile privacy, navigation, motion, and Safari behavior;
- automated local tests and a two-account release checklist;
- one production truth in `main`, deployed to GitHub Pages.

## Next after stabilization

1. Complete the two-real-account checklist and fix reproducible defects.
2. Improve loading, offline, and retry states based on real usage.
3. Add guarded error monitoring before expanding the feature surface.
4. Finish PWA installation and standalone-mode polish.

## Later product work

Recurring salary, rent, and subscriptions are next. They require an idempotent server-side scheduler, execution history, timezone rules, and duplicate protection before UI ships.
