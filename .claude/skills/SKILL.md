---
name: media-tracker-skill
description: >
  Conventions and patterns for the Media Tracker web app built with
  Next.js App Router, TypeScript, and Tailwind CSS. Use this skill whenever
  working on the media-tracker project — it covers component patterns,
  the data layer, layout structure, theming, and accessibility requirements.
  Trigger on any task involving the media tracker backlog, tickets, or codebase.
---

# Media Tracker — Project Skill

This skill defines the conventions, component patterns, and quality bar for
the Media Tracker application. Follow these guidelines for every ticket.

## Stack & Versions

- Next.js 14+ with App Router
- TypeScript (strict mode, no `any`)
- Tailwind CSS v4 (utility-first)
- lucide-react for all icons
- next/font for typography (no CDN links)
- localStorage for persistence (no backend)

## Next.js Specifics

### Server vs Client Components

Next.js App Router defaults to Server Components. Only add `"use client"`
when the component needs:

- useState, useEffect, useRef, or other React hooks
- Browser APIs (localStorage, window, document)
- Event handlers (onClick, onChange, etc.)
- Context providers or consumers

In practice, most of this app's components will be client components
because they interact with localStorage and have interactive state.
That's fine — just be intentional about the boundary.

**Pattern:** Create a server component page that renders a client component:

```tsx
// src/app/books/page.tsx (server component — no "use client")
import { BooksList } from '@/components/BooksList';

export default function BooksPage() {
  return <BooksList />;
}

// src/components/BooksList.tsx (client component)
('use client');
import { useMediaItems } from '@/hooks/useMediaItems';
// ...
```

### Routing

Next.js App Router uses file-system routing. No React Router needed.

```
src/app/
  layout.tsx        → Root layout (wraps everything)
  page.tsx          → Dashboard (/)
  books/
    page.tsx        → Books (/books)
  films/
    page.tsx        → Films (/films)
```

- Use `<Link href="/books">` from `next/link` for navigation
- Use `usePathname()` from `next/navigation` to detect the active route
- The root `layout.tsx` is the App Shell (sidebar + navbar + drawer)

### Fonts

Use `next/font/google` — never load fonts via `<link>` tags:

```tsx
// src/app/layout.tsx
import { Outfit, Inter } from 'next/font/google';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-heading' });
const inter = Inter({ subsets: ['latin'], variable: '--font-body' });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable}`}>
      <body>{/* ... */}</body>
    </html>
  );
}
```

## Component Patterns

### File structure

Simple components: single file in `src/components/MediaCard.tsx`
Complex components with sub-parts:

```
src/components/MediaCard/
  MediaCard.tsx
  index.ts            # Re-export
```

### Component template

```tsx
'use client';

import { type FC } from 'react';

interface MediaCardProps {
  title: string;
  type: 'book' | 'film';
}

export const MediaCard: FC<MediaCardProps> = ({ title, type }) => {
  return <div className="...">{/* markup */}</div>;
};
```

Rules:

- Always type props with an explicit interface
- Destructure props in the function signature
- Use named exports for components
- Exception: page.tsx and layout.tsx use default exports (Next.js requirement)
- Keep components under 100 lines; extract hooks or sub-components if longer

### Hooks

```tsx
// src/hooks/useMediaItems.ts
'use client';
import { useState, useCallback } from 'react';
import type { MediaItem, MediaType } from '@/types';
import { getItems, addItem } from '@/data/storage';

export function useMediaItems(type?: MediaType) {
  // ...return { items, add, remove, update, isLoading }
}
```

Rules:

- Prefix with `use`
- One hook per file
- Return an object, not an array

## Data Layer

### Types (src/types/index.ts)

```ts
export type MediaType = 'book' | 'film';
export type MediaStatus = 'completed' | 'want';

export interface MediaItem {
  id: string;
  type: MediaType;
  title: string;
  author?: string; // books only
  director?: string; // films only
  year?: number;
  genre?: string;
  rating?: number; // 1-5, completed items only
  status: MediaStatus;
  notes?: string;
  coverUrl?: string;
  dateAdded: string; // ISO string
  dateCompleted?: string; // ISO string
}
```

### Storage (src/data/storage.ts)

All storage operations go through helper functions. Never call
`localStorage` directly from components.

**Hydration safety:** Since localStorage isn't available during SSR,
always guard access:

```ts
function getItems(type?: MediaType): MediaItem[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem('media-items');
  // ...
}
```

Components using storage should handle the hydration mismatch by
initializing state as empty and loading from localStorage in a
useEffect.

## Layout Architecture

```
src/app/layout.tsx          ← Root layout (html + body + providers)
  └── AppShell              ← Client component with sidebar + navbar + drawer
        ├── Sidebar
        ├── Navbar           (contains "+ Add" button and search)
        ├── {children}       (page content via Next.js slot)
        └── Drawer           (conditionally rendered)
```

- Root layout.tsx is a server component that wraps children in an AppShell client component
- AppShell manages drawer state and search state, passing them down via context
- Sidebar reads `usePathname()` to highlight the active link
- Navbar reads `usePathname()` to display the correct page title

## Theming

Define all theme colors as CSS custom properties in `src/app/globals.css`:

```css
:root {
  --color-bg-primary: #0f0f0f;
  --color-bg-secondary: #1a1a1a;
  --color-bg-card: #242424;
  --color-accent: #f59e0b;
  --color-accent-hover: #d97706;
  --color-text-primary: #f5f5f5;
  --color-text-secondary: #a3a3a3;
  --color-border: #2e2e2e;
}
```

Reference in Tailwind via `bg-[var(--color-bg-primary)]` or configure
in `tailwind.config.ts` under `theme.extend.colors`.

Note: These are starter values. The developer may customize in Ticket 2.
The pattern matters — colors come from CSS variables, not hardcoded values.

## Drawer Pattern

Managed at the AppShell level via React context:

```ts
interface DrawerState {
  isOpen: boolean;
  mode: 'add' | 'edit';
  editItem?: MediaItem;
  defaultType?: MediaType; // pre-selected based on current route
}
```

Any component can open the drawer via context. The drawer itself renders
inside AppShell, not inside individual pages.

## Search Pattern

Search is debounced (300ms) and filters client-side. The search input
lives in the navbar; search state is shared via context so pages can
read the query and filter their items accordingly.

## Quality Bar

### Every component must:

- Have TypeScript types for all props (no `any`)
- Be keyboard-navigable where interactive
- Include ARIA attributes for non-obvious interactive elements
- Handle empty states gracefully
- Work on mobile (min-width 320px)

### Animations

- Use CSS transitions for hover/focus: `transition-all duration-200 ease-out`
- Drawer: slide-in from right with backdrop fade
- Cards: subtle scale or shadow on hover
- No animation should exceed 300ms

## Don't

- Don't use React Router — Next.js App Router handles routing
- Don't load fonts via CDN — use next/font
- Don't install additional UI libraries (no Material UI, Chakra, etc.)
- Don't use `any` type
- Don't use inline styles — use Tailwind utilities
- Don't create components over 100 lines — split them
- Don't hardcode colors — use CSS variables
- Don't skip empty states
- Don't forget focus management in the drawer
- Don't forget "use client" on components that use hooks or browser APIs
- Don't read localStorage during SSR — always guard with typeof window check
