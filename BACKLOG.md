# Media Tracker — Project Backlog

> **How to use this file with Claude Code:**
> Read `CLAUDE.md` first — it contains the full Git workflow.
> Then read this file. Find the next ticket with status `[ ]` and work on it.
> Follow the Git workflow: branch from develop → code → push → PR → update status.

## Status Legend

- `[ ]` = Todo — not started
- `[~]` = In progress — currently being worked on
- `[x]` = Done — PR created to develop

---

## Project Overview

A web app for tracking books and films. Users can save items they've read/watched or want to read/watch. The app has three views (Dashboard, Books, Films) with a persistent sidebar, a top navbar with search and filters, and a drawer form for adding new items.

**Stack:** Next.js 14+ (App Router), TypeScript, Tailwind CSS
**State:** Local state (no backend — use in-memory data with localStorage for persistence)
**Router:** Next.js App Router (file-system based)

---

## Tickets

### Ticket 0 — Project Setup

**Status:** [x]

Scaffold a new Next.js project with TypeScript and the App Router. Install and configure:

- Tailwind CSS v4
- lucide-react for icons

Set up the folder structure:

```
src/
  app/                # App Router pages and layouts
    layout.tsx        # Root layout
    page.tsx          # Dashboard (/)
    books/
      page.tsx        # Books page (/books)
    films/
      page.tsx        # Films page (/films)
    globals.css       # Global styles and CSS variables
  components/         # Shared/reusable components
  types/              # TypeScript types/interfaces
  data/               # Mock data, localStorage helpers
  hooks/              # Custom hooks
```

Create placeholder pages (Dashboard, Books, Films) that just render their name as an h1. Set up the `@/` path alias in tsconfig.

**Acceptance criteria:**

- `npm run dev` starts the app without errors
- Navigating to `/`, `/books`, `/films` renders the correct placeholder
- Tailwind classes work (verify with a colored div)
- Path alias `@/` resolves correctly

---

### Ticket 1 — Data Model & Storage Layer

**Status:** [x]

Define the TypeScript types for the app and build a simple storage layer using localStorage.

**Types to define (in `src/types/`):**

```ts
type MediaType = 'book' | 'film';
type MediaStatus = 'completed' | 'want';

interface MediaItem {
  id: string; // uuid
  type: MediaType;
  title: string;
  author?: string; // books only
  director?: string; // films only
  year?: number;
  genre?: string;
  rating?: number; // 1-5, user's rating (only for completed)
  status: MediaStatus;
  notes?: string;
  coverUrl?: string; // optional image URL
  dateAdded: string; // ISO date string
  dateCompleted?: string; // ISO date string, when they finished it
}
```

**Storage helpers (in `src/data/`):**

- `getItems(type?: MediaType): MediaItem[]`
- `addItem(item: Omit<MediaItem, "id" | "dateAdded">): MediaItem`
- `updateItem(id: string, updates: Partial<MediaItem>): MediaItem`
- `deleteItem(id: string): void`
- `searchItems(query: string, type?: MediaType): MediaItem[]`

Seed the storage with 8–10 mock items (mix of books and films, mix of statuses) so the UI has something to display immediately during development.

**Acceptance criteria:**

- Types are exported and usable across the app
- Storage functions work (test by calling them in a page component and logging results)
- Mock data loads on first visit, persists on refresh

---

### Ticket 2 — App Layout Shell (Sidebar + Navbar)

**Status:** [x]

Build the persistent layout that wraps all pages.

**Sidebar (left, always visible on desktop):**

- App logo/name at the top ("MediaTracker" or similar)
- Navigation links: Dashboard, Books, Films
- Each link has an icon (use lucide-react) and label
- Active link is visually highlighted
- Sidebar is fixed width (~240px), full height
- On mobile (<768px): sidebar collapses to a hamburger menu in the navbar

**Navbar (top bar, to the right of the sidebar):**

- Left side: Page title (dynamic — shows "Dashboard", "Books", or "Films" based on current route)
- Left side, next to title: "+ Add" button (primary style)
- Right side: Search input field with a search icon
- The navbar is sticky at the top

The "+ Add" button and search input don't need to do anything yet — just render them. We'll wire them up in later tickets.

Use the root `layout.tsx` as the shell — it wraps all pages via `{children}`. Create a client component `AppShell` that layout.tsx renders, containing the sidebar, navbar, and a slot for page content.

Use `next/link` for navigation and `usePathname()` from `next/navigation` for active route detection.

**Acceptance criteria:**

- Sidebar renders with all three nav links
- Clicking links navigates between pages; active link is highlighted
- Navbar shows the correct page title for each route
- Layout is responsive (sidebar collapses on mobile)
- The overall look feels clean and intentional — not generic

---

### Ticket 3 — Books & Films List Pages

**Status:** [x]

Build the list view used by both the Books page (`/books`) and Films page (`/films`). These share the same layout and behavior, just filtered by media type.

**Filter bar (below the navbar, inside the page content area):**

- Two tab-like filter buttons: "Completed" and "Want to Read/Watch"
- An "All" option as default
- Active filter is visually distinct

**List view:**

- Display items as a clean list or card grid (cards preferred for visual appeal)
- Each card shows: title, author/director, year, genre, status badge, rating (stars, only if completed), cover image (or a placeholder)
- Cards should have a subtle hover effect
- Clicking a card could later open a detail view, but for now just log the item id
- Empty state: if no items match the filter, show a friendly message with a prompt to add one

**Data source:** Use the storage helpers from Ticket 1. Filter by `type === "book"` or `type === "film"` depending on the page.

**Acceptance criteria:**

- `/books` shows only books, `/films` shows only films
- Filter buttons work and update the displayed list
- Cards look polished and display all relevant info
- Empty state displays when filters match nothing

---

### Ticket 4 — Dashboard Page

**Status:** [x]

Build the Dashboard view (`/`). This is the landing page — it should feel like a quick overview.

**Layout:**

- A welcome section or heading at the top
- Two sections: "Recently Added Books" and "Recently Added Films"
- Each section shows the 5 most recently added items (sorted by `dateAdded` descending)
- Items displayed as compact horizontal cards or a small list
- Each section has a "View all →" link that navigates to `/books` or `/films`

**Stats (optional but nice):**

- Small stat cards at the top showing: total books, total films, total completed, total in wishlist

**Acceptance criteria:**

- Dashboard shows the 5 most recent books and 5 most recent films
- "View all" links navigate correctly
- Page looks like a proper dashboard, not just a dumping ground of data

---

### Ticket 5 — Add Item Drawer

**Status:** [x]

Build a slide-in drawer component that opens from the right side of the screen when the user clicks the "+ Add" button in the navbar.

**Drawer behavior:**

- Slides in from the right with a smooth animation
- Has a semi-transparent backdrop/overlay that closes the drawer on click
- Close button (X) in the top-right of the drawer
- Pressing Escape closes the drawer
- Body scroll is locked when drawer is open

**Form inside the drawer:**

- Media type toggle: Book / Film (this determines which fields show)
- Title (required, text input)
- Author (text input, shown only for books)
- Director (text input, shown only for films)
- Year (number input)
- Genre (text input or small select)
- Status: "Completed" or "Want to Read/Watch" (radio or toggle)
- Rating: 1–5 stars (interactive, only shown if status is "Completed")
- Notes (textarea)
- Cover URL (text input, optional)
- Submit button at the bottom

**On submit:**

- Validate required fields (at minimum: title)
- Call `addItem()` from the storage layer
- Close the drawer
- The list on the current page should update to reflect the new item

**Context-aware defaults:**

- If the user is on `/books` when they click "+ Add", default the media type to "Book"
- If on `/films`, default to "Film"
- If on Dashboard, no default — user picks

**Acceptance criteria:**

- Drawer opens/closes smoothly with animation
- Form renders correctly, toggling fields based on book/film
- Submitting adds the item to storage and it appears in the list
- Validation prevents empty titles from being submitted
- Context-aware defaults work based on current route

---

### Ticket 6 — Search Functionality

**Status:** [x]

Wire up the search input in the navbar so it actually filters content.

**Behavior:**

- Typing in the search input filters the current page's items in real time (debounced, ~300ms)
- On the Books page: searches book titles, authors, genres
- On the Films page: searches film titles, directors, genres
- On the Dashboard: searches across all items, results replace the dashboard layout with a simple results list
- Clearing the search restores the normal view
- Show a "No results for [query]" message when nothing matches

Use the `searchItems()` helper from Ticket 1, or filter client-side.

**Acceptance criteria:**

- Search filters items as the user types
- Works correctly on all three pages
- Debounced (doesn't fire on every keystroke)
- Clear/empty search restores normal view
- No results state is handled gracefully

---

### Ticket 7 — Edit & Delete Items

**Status:** [x]

Add the ability to edit and delete existing items.

**Edit:**

- Clicking a card in the list opens the same drawer from Ticket 5, but pre-filled with the item's data
- The drawer title changes to "Edit Book" / "Edit Film"
- Submitting calls `updateItem()` and updates the list

**Delete:**

- Add a delete button inside the edit drawer (bottom, danger-styled)
- Clicking it shows a confirmation (inline or a small modal)
- Confirming calls `deleteItem()`, closes the drawer, and updates the list

**Acceptance criteria:**

- Clicking a card opens the drawer with pre-filled data
- Editing an item persists the changes
- Deleting an item removes it from storage and the UI
- Delete has a confirmation step to prevent accidents

---

### Ticket 8 — Next.js API Routes (Backend)

**Status:** [x]

Replace the localStorage-only approach with a proper Next.js backend using API Routes. The data should be stored server-side (in-memory for now, using a module-level store) so it survives across client sessions without relying on the browser.

**API routes to create (under `src/app/api/`):**

- `GET /api/items` — return all items, with optional `?type=book|film` query param
- `POST /api/items` — create a new item (accepts item fields in the request body, assigns `id` and `dateAdded` server-side)
- `PUT /api/items/[id]` — update an existing item by id (accepts partial fields)
- `DELETE /api/items/[id]` — delete an item by id

**Data store:**

- Use a module-level array in `src/data/serverStore.ts` as the in-memory store (shared across requests within the same server process)
- Seed the store with the same mock data from `mockData.ts` on first load
- Keep the existing `storage.ts` (localStorage) untouched — the frontend will switch to the API in Ticket 9

**Validation:**

- `POST` and `PUT` should return `400` if `title` is missing or empty
- `PUT` and `DELETE` should return `404` if the item id does not exist
- All routes should return JSON

**Acceptance criteria:**

- All four routes respond correctly when tested with `curl` or a REST client
- `GET /api/items` returns the seeded mock data
- `POST /api/items` creates and returns the new item with a server-generated id
- `PUT /api/items/[id]` updates and returns the modified item
- `DELETE /api/items/[id]` removes the item and returns `204`
- Error cases (missing title, unknown id) return the correct status codes

---

### Ticket 9 — Connect Frontend to Backend API

**Status:** [x]

Wire the frontend to the API routes created in Ticket 8. Replace all direct calls to the localStorage helpers (`addItem`, `updateItem`, `deleteItem`, `getItems`, `searchItems`) in components and hooks with `fetch` calls to the new API.

**Changes required:**

- Create `src/data/api.ts` with async functions mirroring the storage helpers: `getItems`, `addItem`, `updateItem`, `deleteItem`, `searchItems` (client-side filter on the fetched results)
- Update `useMediaItems` hook to `async`/`await` the new `getItems` from `api.ts` instead of calling localStorage directly
- Update `AddItemDrawer` to call the async `addItem` / `updateItem` / `deleteItem` from `api.ts`
- Handle loading and error states in `useMediaItems` — expose `loading: boolean` and `error: string | null`
- Show a loading indicator (spinner or skeleton) in `MediaListView` and Dashboard while data is fetching
- The localStorage `storage.ts` should no longer be used by any component — it can be kept as dead code for reference

**Acceptance criteria:**

- Adding, editing, and deleting items goes through the API (verify in the Network tab)
- `localStorage` is no longer read or written during normal app use
- Page refresh retains data (served from the in-memory server store)
- Loading state is visible while the initial fetch is in progress
- Errors from the API are surfaced to the user (a simple inline message is fine)

---

### Ticket 10 — Swagger API Documentation

**Status:** [~]

Add an interactive Swagger UI to document and manually test the API routes built in Ticket 8. Use `swagger-ui-react` for the UI and define the OpenAPI spec as a plain TypeScript object served from a new API route.

**Changes required:**

- Install `swagger-ui-react` and `@types/swagger-ui-react`
- Create `src/app/api/docs/openapi.ts` — exports the OpenAPI 3.0 spec object describing all four endpoints (`GET /api/items`, `POST /api/items`, `PUT /api/items/[id]`, `DELETE /api/items/[id]`) with request/response schemas derived from the `MediaItem` type
- Create `src/app/api/docs/route.ts` — `GET /api/docs` returns the spec as JSON so it can be fetched by the UI
- Create `src/app/docs/page.tsx` — a client page at `/docs` that renders `SwaggerUI` pointed at `/api/docs`
- Add a link to `/docs` in the Sidebar under the existing nav links, visually separated (e.g. a small "API Docs" entry at the bottom)

**Spec must document:**

- All request parameters (`?type` query param on GET)
- Request body schemas for POST and PUT (with `title` marked as required)
- All response schemas (200/201 with `MediaItem`, 204 for DELETE, 400/404 error shape)
- Tag all routes under `"Items"`

**Acceptance criteria:**

- Navigating to `/docs` renders the Swagger UI without errors
- All four endpoints are listed with their parameters, request bodies, and response schemas
- Clicking "Try it out" on `GET /api/items` and executing returns live data from the server
- The sidebar link to `/docs` is visible and navigates correctly

---

### Ticket 11 — Polish & Micro-interactions

**Status:** [ ]

Final pass to make the app feel finished and delightful.

**Animations:**

- Page transitions (subtle fade or slide between routes)
- Cards animate in on page load (staggered entrance)
- Filter tabs have a smooth active-state transition
- Drawer open/close already has animation, but refine easing

**Empty states:**

- Each page should have a thoughtful empty state with an illustration or icon, a message, and a CTA button that opens the add drawer

**Responsive refinements:**

- Test and fix any layout issues on mobile
- Drawer should be full-width on mobile
- Cards should stack to single column on small screens

**Accessibility:**

- All interactive elements are keyboard-navigable
- Focus trap inside the drawer when open
- Proper ARIA labels on buttons, inputs, and navigation
- Screen reader-friendly status badges

**Acceptance criteria:**

- The app feels polished and cohesive
- No janky transitions or broken layouts on mobile
- Keyboard-only navigation works throughout
- A non-developer would look at this and think "this feels like a real product"

---

## Tips for Working with Claude Code

1. **Just say "work on the next ticket."** Claude Code will read this file, find the next `[ ]` ticket, and follow the full Git workflow from `CLAUDE.md` automatically.

2. **Review before the PR.** After Claude Code finishes coding, run `npm run dev` and check the browser. If something's off, tell Claude Code to fix it before it pushes and creates the PR.

3. **Add design preferences on Ticket 2.** That's where the visual identity gets locked in. Tell Claude Code what you want (dark mode, colors, fonts) in that prompt.

4. **You handle PR merges.** Claude Code creates the PR but does not merge it. Review the PR on GitHub, merge it into develop when you're happy, then tell Claude Code to continue with the next ticket.
