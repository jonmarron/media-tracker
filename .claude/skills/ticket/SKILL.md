---
name: ticket
description: This skill should be used when the user asks to work on a specific ticket, start the next ticket, or do any development work on the media-tracker project. It covers the full git workflow (branch → implement → push → PR → mark done) and all coding conventions, component patterns, theming rules, and architecture for the media-tracker codebase.
---

# Media Tracker — Ticket Skill

Covers two things: the git workflow for executing tickets, and the coding standards for the media-tracker project. Read both sections before starting any ticket.

---

## Part 1 — Ticket Workflow

### Identifying the Ticket

- If the user specifies a ticket number (e.g. "ticket 5"), work on that ticket.
- If the user says "next ticket" or similar, find the first ticket in `BACKLOG.md` with status `[ ]`.
- Status legend: `[ ]` = todo, `[~]` = in progress, `[x]` = done.

### Step 1 — Branch from develop

```bash
git fetch origin
git checkout develop
git pull origin develop
git checkout -b feat/ticket-N-short-description
```

Branch naming: `feat/ticket-N-short-description` — e.g. `feat/ticket-5-add-item-drawer`

If the branch already exists locally, delete and recreate it:
```bash
git branch -D feat/ticket-N-short-description
git checkout -b feat/ticket-N-short-description
```

### Step 2 — Mark ticket in-progress

In `BACKLOG.md`, change the ticket status from `[ ]` to `[~]`, then commit:

```bash
git add BACKLOG.md
git commit -m "chore: start ticket N"
```

### Step 3 — Implement

Read the ticket description and acceptance criteria from `BACKLOG.md` carefully before writing any code. Follow all conventions in Part 2 of this skill. Run `npx tsc --noEmit` before committing to confirm no type errors.

Commit as work progresses:
```bash
git add <specific files>
git commit -m "feat: ticket-N description of what was done"
```

### Step 4 — Push and open PR (no approval needed)

```bash
git push origin feat/ticket-N-short-description
gh pr create --base develop --title "feat: ticket-N — Short Title" --body "..."
```

PR body must include:
- **Summary** — what was implemented
- **Changes** — bullet list of files created/modified and what each does
- **Acceptance Criteria** — copied from the ticket in BACKLOG.md

### Step 5 — Mark ticket done

In `BACKLOG.md`, change the ticket status from `[~]` to `[x]`, then commit and push:

```bash
git add BACKLOG.md
git commit -m "chore: complete ticket N"
git push origin feat/ticket-N-short-description
```

### Step 6 — Stop and report

After the PR is created and the ticket is marked `[x]`, stop completely. Report the PR URL to the user. Do not start the next ticket — wait for the user's instruction.

---

## Part 2 — Coding Standards

### Stack

- Next.js 14+ with App Router
- TypeScript strict mode — no `any` types
- Tailwind CSS v4 — utility-first, no inline styles
- lucide-react for all icons
- next/font for typography (never CDN `<link>` tags)
- localStorage for persistence (no backend)

### Project Structure

```
src/
  app/              # App Router pages and layouts
    layout.tsx      # Root layout — server component, renders AppShell
    page.tsx        # Dashboard (/)
    books/page.tsx  # Books (/books)
    films/page.tsx  # Films (/films)
    globals.css     # Global styles and CSS variables
  components/       # Shared UI components (PascalCase filenames)
  types/            # index.ts — all types exported from here
  data/             # storage.ts, mockData.ts
  hooks/            # Custom hooks (camelCase filenames)
```

### Server vs Client Components

Default to server components. Only add `'use client'` when the component needs:
- `useState`, `useEffect`, `useRef`, or other React hooks
- Browser APIs (`localStorage`, `window`, `document`)
- Event handlers (`onClick`, `onChange`, etc.)

Pattern — server page renders a client component:
```tsx
// src/app/books/page.tsx (server component, no "use client")
import { MediaListView } from '@/components/MediaListView';
export default function BooksPage() {
  return <MediaListView type="book" />;
}
```

### Component Rules

- Named exports everywhere — exception: `page.tsx` and `layout.tsx` use default exports (Next.js requirement)
- Always type props with an explicit interface
- Keep components under ~100 lines — extract hooks or sub-components if longer
- Use `@/` path alias for all imports

```tsx
'use client';

interface MediaCardProps {
  title: string;
  type: 'book' | 'film';
}

export function MediaCard({ title, type }: MediaCardProps) {
  return <div className="...">{/* markup */}</div>;
}
```

### Hooks

- One hook per file, camelCase filename (e.g. `useMediaItems.ts`)
- Prefix with `use`
- Return an object, not an array

### Data Layer

All types are defined in and exported from `src/types/index.ts`:

```ts
export type MediaType = 'book' | 'film';
export type MediaStatus = 'completed' | 'want';

export interface MediaItem {
  id: string;
  type: MediaType;
  title: string;
  author?: string;
  director?: string;
  year?: number;
  genre?: string;
  rating?: number; // 1–5, completed items only
  status: MediaStatus;
  notes?: string;
  coverUrl?: string;
  dateAdded: string;       // ISO string
  dateCompleted?: string;  // ISO string
}
```

All storage operations go through `src/data/storage.ts` — never access `localStorage` directly from components. Available helpers: `getItems`, `addItem`, `updateItem`, `deleteItem`, `searchItems`.

Guard all localStorage access against SSR:
```ts
if (typeof window === 'undefined') return [];
```

### Theming

All colors are CSS custom properties defined in `src/app/globals.css`. Never hardcode hex values in components. Use `var(--token)` in Tailwind: `bg-[var(--primary)]`.

Current tokens:
```
--background:         #ffffff  (page background)
--foreground:         #171717  (primary text)
--surface:            #f8f8f8  (subtle backgrounds, sidebar)
--surface-raised:     #ffffff  (cards)
--border:             #e5e5e5  (dividers, card borders)
--muted:              #737373  (secondary text, placeholders)
--primary:            #6366f1  (indigo — buttons, active states)
--primary-foreground: #ffffff  (text on primary)
--primary-hover:      #4f46e5  (hover state for primary)
--danger:             #ef4444  (delete actions)
--danger-hover:       #dc2626  (hover state for danger)
```

### Layout Architecture

```
layout.tsx (server)
  └── AppShell (client) — manages drawer state, mobile sidebar toggle
        ├── Sidebar — nav links, active state via usePathname()
        ├── Navbar — page title, "+ Add" button, search input
        └── {children} — page content
```

AppShell manages global UI state (drawer open/closed, mobile sidebar). The Drawer renders inside AppShell, not inside individual pages.

### Routing & Navigation

- Use `<Link href="...">` from `next/link` for navigation
- Use `usePathname()` from `next/navigation` for active route detection

### Animations & Interactions

- Use CSS transitions for hover/focus: `transition-colors duration-200`
- Drawer: slide in from right with semi-transparent backdrop
- Cards: subtle border/shadow change on hover
- No animation should exceed 300ms

### Quality Bar

Every component must:
- Have TypeScript types for all props
- Handle empty states gracefully
- Work on mobile (min-width 320px)
- Be keyboard-navigable where interactive
- Include ARIA attributes for non-obvious interactive elements

### Don'ts

- No `any` types
- No inline styles — use Tailwind utilities
- No hardcoded hex colors — use CSS variables
- No CDN font links — use `next/font`
- No additional UI libraries (no MUI, Chakra, etc.)
- No direct `localStorage` calls in components
- No components over ~100 lines
- Never skip empty states
