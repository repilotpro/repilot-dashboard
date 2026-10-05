---
name: tailadmin-react
description: Component APIs, folder structure, color tokens, dark mode, charts, and page-creation conventions for TailAdmin React — the free Tailwind CSS v4 + React 19 + Vite admin dashboard template. Use this skill when the user is building, editing, or extending dashboard UI that belongs to TailAdmin's own design system (its Sidebar/Header shell, or components under src/components/ui or src/components/form, or TailAdmin-style pages/cards/tables/charts). Do NOT use this skill for parts of the project that clearly use a different UI/component library (e.g. MUI, Ant Design, Chakra, shadcn, Bootstrap) — match whatever library the file in question already imports instead.
---

# TailAdmin React Skill

Deep, documentation-accurate knowledge of **TailAdmin React** — the free/open-source
Tailwind CSS admin dashboard template by Pimjo, built on **React 19 + TypeScript +
Tailwind CSS v4 + Vite** (this is the React/Vite edition, not the Next.js edition —
don't assume `next-themes`, `next/router`, App Router, etc. exist unless you actually
see them in the code).

## When this skill applies — and when it doesn't

This project may contain **more than one UI system** (e.g. TailAdmin alongside another
component library in a different part of the app). Before applying anything in this
skill:

1. Look at what the file you're editing (or the closest sibling file) already imports.
   If it imports from `src/components/ui/*`, `src/components/form/*`, or clearly
   mirrors TailAdmin's layout/props patterns → this skill applies.
2. If the file imports from a different design system (MUI, Ant Design, Chakra,
   shadcn/ui, Bootstrap, a custom in-house kit, etc.) → **this skill does not apply**.
   Follow that library's own conventions instead; don't mix TailAdmin components or
   color tokens into non-TailAdmin UI, and don't mix the other library's components
   into TailAdmin screens.
3. If it's genuinely ambiguous (a brand-new page with no precedent), ask the user which
   design system the new page should use rather than guessing.

## Golden rules (once this skill applies)

1. **Reuse before you build.** Check `src/components/ui/` and `src/components/form/`
   before writing new markup from scratch — see `references/02-ui-components.md` and
   `references/03-form-components.md` for the full prop tables.
2. **Never introduce a second UI library into TailAdmin's own screens.** TailAdmin's
   whole value is one consistent design system; don't add MUI/AntD/shadcn/etc. here
   even if the rest of the monorepo uses something else elsewhere.
3. **Tailwind utility classes only**, using the design tokens documented in
   `references/05-colors-styling.md` — no new global CSS, CSS Modules, or
   styled-components inside TailAdmin screens.
4. **Every visual change needs a `dark:` pairing.** TailAdmin is dark-mode-first.
5. **Strict TypeScript** — explicit prop interfaces, no `any`, reuse existing prop
   names (`variant`, `size`, `color`, `className`, `startIcon`/`endIcon`, `error`/
   `success`/`disabled`) instead of inventing synonyms. Full conventions in
   `references/07-coding-conventions.md`.
6. **Match the existing import convention**:
   `import ComponentName from "../components/ComponentName";` — relative paths, no new
   `@/` aliases unless one is already configured.
7. **Don't restructure the project** (no new state-management library, no swapping
   React Router, no moving folders) unless the user explicitly asks.
8. When a local file's actual props differ slightly from a reference doc below, the
   **local file wins** — these docs are the correct default, not a guaranteed literal
   match to every fork/version.

## Reference index (read on demand, not all at once)

Don't load every file below for every task — open only the one(s relevant to what
you're doing right now, to keep context tight:

| File | Read this when... |
|---|---|
| `references/01-project-structure.md` | Deciding where a new file/page/component should live |
| `references/02-ui-components.md` | Using or building Alert, Avatar, Badge, Breadcrumb, Button, Card, Carousel, Dropdown, Links, Modal, ProgressBar, Popover, Table, Tabs, Tooltip, Videos, etc. |
| `references/03-form-components.md` | Using or building Input, Select, Checkbox, Radio, FileUpload, Date Picker |
| `references/04-layout-theming.md` | Touching the Sidebar/Header shell, `SidebarContext`, `ThemeContext`, or dark-mode logic |
| `references/05-colors-styling.md` | Choosing any color/className — full `@theme` token palette and light/dark pairing conventions |
| `references/06-charts-dataviz.md` | Adding or editing a chart (ApexCharts) |
| `references/07-coding-conventions.md` | General TypeScript/React style questions, prop naming, file naming |
| `references/08-new-page-workflow.md` | Adding a brand-new page/route + sidebar entry, step by step |

## Quick facts (Free vs Pro, for context only)

Free TailAdmin React ships 1 dashboard, 35+ components, 50+ UI elements. Pro adds 7+
dashboards (Analytics, Ecommerce, Marketing, CRM, SaaS, Stocks, Logistics, AI, Sales,
Finance…) and 500+ components. If the user asks for something that sounds like a
Pro-only page/component and it isn't in this codebase, say so rather than inventing it.

Docs: https://tailadmin.com/docs · Repo:
https://github.com/TailAdmin/free-react-tailwind-admin-dashboard
