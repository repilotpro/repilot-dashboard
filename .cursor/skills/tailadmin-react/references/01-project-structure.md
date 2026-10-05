# Project Structure

TailAdmin React follows a clean, component-based architecture designed for Vite. It
separates UI components, pages, and logic hooks to keep the codebase maintainable.

## Root directory

| File / Folder | Purpose |
|---|---|
| `src/` | Source code: all application logic and components |
| `public/` | Static files served as-is (favicon, robots.txt, etc.) |
| `vite.config.ts` | Vite build/dev-server configuration |
| `package.json` | Dependencies and npm scripts |
| `index.css` (in `src/`) | Tailwind v4 entry point + `@theme` design tokens |
| `tsconfig.json` / `tsconfig.app.json` / `tsconfig.node.json` | TypeScript configuration |
| `eslint.config.js` | Lint rules — keep new code compliant |

## `src/` layout

```
src/
├── components/           # Reusable UI components
│   ├── ui/                # Atom-level components (Button, Badge, Modal, Table, …)
│   ├── form/               # Form-specific inputs (Input, Select, Checkbox, Radio, FileUpload, …)
│   └── common/             # App-specific shared/composite components (page meta, breadcrumbs wiring, etc.)
├── layout/                # Sidebar, Header and the app shell that wraps every page
├── context/ (or contexts/) # React Context providers — SidebarContext, ThemeContext
├── hooks/                 # Custom hooks
├── icons/ or images/      # SVG icon components / static image assets
├── pages/                 # Route-level components, one route per file (grouped in subfolders)
│   └── Dashboard/           # e.g. Ecommerce.tsx, Analytics.tsx, …
├── App.tsx                # Root component — React Router route tree lives here
├── main.tsx               # Vite entry point (ReactDOM.createRoot)
└── index.css               # Global styles + Tailwind v4 `@theme` tokens
```

> The exact folder name for contexts (`context/` vs `contexts/`) and icons
> (`icons/` vs `images/`) can vary very slightly between template releases — check
> the actual folder names present in this repo before creating a new file, and put
> new files in whichever one already exists rather than creating a duplicate.

## Where things belong

- **New reusable, generic UI atom** (a button variant, a new badge style, a new kind
  of card) → `src/components/ui/<component-name>/ComponentName.tsx`. Follow the prop
  patterns in `02-ui-components.md`.
- **New form input** → `src/components/form/`, matching the patterns in
  `03-form-components.md`.
- **New page/route** → `src/pages/<Group>/<PageName>.tsx`, then:
  1. Register a `<Route>` for it in `App.tsx`.
  2. Add a nav entry (icon + label + path) to the sidebar's menu data in `layout/`.
  3. See the full checklist in `08-new-page-workflow.md`.
- **New shared cross-page logic** (not visual) → a hook in `src/hooks/`.
- **New global state** → a Context provider in `src/context(s)/`, consistent with how
  `SidebarContext` and `ThemeContext` already work (see `04-layout-theming.md`). Don't
  add a state-management library for something a Context can handle.
- **Design tokens / palette changes** → `src/index.css` under the `@theme` block only.
  See `05-colors-styling.md`. Never hard-code a one-off hex color in a component.

## Import convention

Components are imported by relative path from where they're used:

```tsx
import ComponentName from "../components/ComponentName";
```

Keep this pattern. Don't introduce `@/` path aliases unless one is already wired up in
`tsconfig.json`'s `paths` and `vite.config.ts`'s `resolve.alias` — check both before
assuming aliases are available.
