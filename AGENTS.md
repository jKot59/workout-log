# Agent Guidance

## Project Shape

- This is a Next.js 16 App Router application using TypeScript and React 19.
- Public UI lives in `src/app/page.tsx`; authenticated UI belongs under `src/app/(protected)/`.
- Route handlers under `src/app/api/` proxy requests to the backend. Keep backend-origin handling in `src/lib/authProxy.ts` and shared client requests in `src/lib/apiFetch.ts`.
- Zustand stores in `src/stores/` hold client state. IndexedDB persistence and initialization live under `src/shared/lib/indexedDB/` and `src/app/providers/`.
- Reusable UI is organized into `src/components/`, `src/features/`, `src/widgets/`, and `src/shared/ui/`. Follow the nearest existing pattern before adding a new abstraction.

## Working Conventions

- Use native `fetch`; do not introduce Axios. Browser requests should include credentials when they participate in authentication.
- Keep access tokens in the in-memory auth store. Do not persist tokens in localStorage, sessionStorage, IndexedDB, or other durable storage.
- Treat `AIAuthfeature.md` as the authentication design reference, but verify its proposed structure against the current implementation before changing code.
- Preserve the existing path alias (`@/*`) and CSS Modules/SCSS styling approach. Avoid broad formatting or unrelated refactors.
- Components that use hooks, browser APIs, Zustand, or event handlers must remain client components with `'use client'`.
- Avoid direct IndexedDB access outside the existing database managers and initializer/provider boundaries.
- When combining Ant Design forms with React Hook Form, keep AntD's `Form` responsible for `onFinish` and use `Controller` for controlled AntD inputs; verify submitted values with a focused form test.
- Before changing authentication behavior, inspect the relevant route handler, proxy/service, auth store, provider, and middleware together; cookie forwarding and in-memory token updates are part of the same flow.
- Keep `/` public and protected pages under `src/app/(protected)/`; middleware, `AuthProvider`, and `ProtectedLayout` each contribute to the access boundary.

## Verification

- Install dependencies with `yarn install` (the repository includes `yarn.lock`; npm also works when necessary).
- Run `npm run lint` for ESLint and `npm run build` for a production compile.
- Run `npx vitest run` for unit/component tests when present.
- Run `npm test` for Playwright tests. The Playwright config expects the app at `http://localhost:3000`; start `npm run dev` separately because its `webServer` block is currently commented out.
- For UI changes, test both the public landing page and the protected workout flow, and check desktop and narrow viewport behavior.

## Documentation

- Setup and product overview: [README.md](README.md)
- Authentication architecture and security requirements: [AIAuthfeature.md](AIAuthfeature.md)
- Browser end-to-end tests: [tests/HomePage.spec.ts](tests/HomePage.spec.ts) and [tests/TrainingPage.spec.ts](tests/TrainingPage.spec.ts)
