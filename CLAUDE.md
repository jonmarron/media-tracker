# Media Tracker

## Project Overview

A web app for tracking books and films. Built with Next.js (App Router),
TypeScript, and Tailwind CSS.

## Stack

- Next.js 14+ with App Router
- TypeScript (strict mode)
- Tailwind CSS v4
- lucide-react for icons
- localStorage for persistence (no backend)

## Project Structure (Next.js App Router)

```
src/
  app/                  # App Router pages and layouts
    layout.tsx          # Root layout (sidebar + navbar wrapper)
    page.tsx            # Dashboard (/)
    books/
      page.tsx          # Books page (/books)
    films/
      page.tsx          # Films page (/films)
  components/           # Shared/reusable UI components
  types/                # TypeScript types and interfaces
  data/                 # Mock data and localStorage helpers
  hooks/                # Custom React hooks
```

## Conventions

- Use the App Router — no pages/ directory
- Mark client components with "use client" only when needed (state, effects, browser APIs)
- Keep server components as the default where possible
- Use TypeScript strict mode — no `any` types
- Co-locate component styles using Tailwind utility classes
- Name files in PascalCase for components (e.g., `MediaCard.tsx`)
- Name files in camelCase for utilities/hooks (e.g., `useMediaItems.ts`)
- Export types from `src/types/index.ts`
- Keep components small and composable — split at ~100 lines
- Use named exports, not default exports (except for page.tsx and layout.tsx which Next.js requires as default exports)
- All colors via CSS custom properties — never hardcode hex in components
- Use CSS variables for theme colors, defined in `globals.css`
- Use Next.js `<Link>` for navigation, `usePathname()` for active route detection
- Use `next/font` for loading Google Fonts (not CDN links)

## Backlog

The full project plan is in `BACKLOG.md`. Work through tickets in order.
Each ticket has acceptance criteria that must be met before moving on.

## Git Workflow

Follow this for every ticket:

1. `git fetch origin && git checkout develop && git pull origin develop`
2. `git checkout -b feat/ticket-N-short-description`
3. Update ticket status in BACKLOG.md from `[ ]` to `[~]`, commit: `chore: start ticket N`
4. Implement the ticket, commit: `feat: ticket-N description`
5. Push and create a PR: `gh pr create --base develop`
6. Update ticket status from `[~]` to `[x]`, commit and push: `chore: complete ticket N`
7. **Stop. Wait for the user to tell you to start the next ticket.**

### Rules

- NEVER commit directly to `develop` or `main`
- ALWAYS branch from the latest `develop`
- ALWAYS create a PR via `gh pr create` — do not merge yourself
- ALWAYS update ticket status in BACKLOG.md at start and end
- One branch per ticket. One PR per ticket.
- **NEVER automatically start the next ticket — always wait for user instruction**
