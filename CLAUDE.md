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

## Git

- Commit after each completed ticket
- Format: `feat: ticket-N short description`
- Example: `feat: ticket-2 app layout shell with sidebar and navbar`
