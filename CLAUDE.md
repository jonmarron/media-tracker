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

## Git Workflow (MANDATORY — follow this for EVERY ticket)

**Before you start coding, always read `BACKLOG.md` and find the next ticket
with status `[ ]` (todo). That is the ticket you work on.**

### 1. Start the ticket

```bash
git fetch origin
git checkout develop
git pull origin develop
git checkout -b feat/ticket-N-short-description
```

Branch naming: `feat/ticket-N-short-description`
Examples: `feat/ticket-0-project-setup`, `feat/ticket-2-layout-shell`

### 2. Update the ticket status to in-progress

Open `BACKLOG.md` and change the ticket's status from `[ ]` to `[~]`:

```
**Status:** [~]
```

Commit this change:

```bash
git add BACKLOG.md
git commit -m "chore: start ticket N"
```

### 3. Code the feature

Implement everything in the ticket. Make granular commits as you go:

```bash
git add .
git commit -m "feat: ticket-N description of what was done"
```

### 4. Push and create a Pull Request

```bash
git push origin feat/ticket-N-short-description
gh pr create --base develop --title "feat: ticket-N — Short Title" \
  --body "## Summary
Implements Ticket N from BACKLOG.md.

## Changes
- [list what was built]

## Acceptance Criteria
- [copy from BACKLOG.md]"
```

### 5. Mark the ticket as done

Open `BACKLOG.md` and change the ticket's status from `[~]` to `[x]`:

```
**Status:** [x]
```

Commit and push:

```bash
git add BACKLOG.md
git commit -m "chore: complete ticket N"
git push origin feat/ticket-N-short-description
```

### 6. Move to the next ticket

Do NOT wait for PR review. Immediately find the next `[ ]` ticket in
`BACKLOG.md` and start the cycle again from step 1.

### Status legend in BACKLOG.md

- `[ ]` = Todo (not started)
- `[~]` = In progress
- `[x]` = Done (PR created)

### Rules

- NEVER commit directly to `develop` or `main`
- ALWAYS branch from the latest `develop`
- ALWAYS create a PR via `gh pr create` — do not merge yourself
- ALWAYS update ticket status in BACKLOG.md at start and end
- One branch per ticket. One PR per ticket.
