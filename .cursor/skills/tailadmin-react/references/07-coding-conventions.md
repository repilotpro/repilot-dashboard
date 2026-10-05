# Coding Conventions

## Components

- Functional components only, written in TypeScript.
- Define an explicit `interface`/`type` for props — never `any`, and avoid inline
  unnamed object prop types for anything with more than one or two fields:
  ```tsx
  interface StatCardProps {
    title: string;
    value: string | number;
    icon?: React.ReactNode;
    className?: string;
  }

  export default function StatCard({ title, value, icon, className = "" }: StatCardProps) {
    return (
      <div className={`rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] ${className}`}>
        {icon}
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <h4 className="text-title-sm font-bold text-gray-800 dark:text-white/90">{value}</h4>
      </div>
    );
  }
  ```
- One component per file, file name in `PascalCase` matching the component name
  (`StatCard.tsx` exports `StatCard`).
- Default-export the component from its file (matches the existing
  `import ComponentName from "../components/ComponentName"` convention) unless the file
  already uses named exports (some `ui/` subfolders export multiple small pieces, e.g.
  `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableCell` from one module — follow
  whatever the file you're editing already does).

## Props conventions to stay consistent with the existing kit

- `className?: string` (default `""`) on any component that could reasonably need
  layout overrides from its parent — always merge it in, don't drop it.
- `size` for scale variants (`"sm" | "md"`, occasionally `"lg" | "xl"`), `variant` for
  visual style (`"primary" | "outline"`, `"light" | "solid"`, etc.), `color` for
  semantic color — reuse these exact names rather than inventing `type`, `kind`,
  `appearance`, etc. for the same concept.
- `startIcon` / `endIcon` (both `React.ReactNode`) for icon slots — not `icon` or
  `leftIcon`/`rightIcon`.
- Boolean state flags like `error`, `success`, `disabled` rather than a single
  `status: "error" | "success" | "disabled"` string, matching `Input`.

## Icons

Pass icons as `React.ReactNode` into `startIcon`/`endIcon`/`icon`-style props (see
`Badge`, `Button`). Check whether the project already has an icon set (an `icons/`
folder of SVG React components, or a library like `lucide-react`) in `package.json` /
`src/` before adding a new icon dependency — reuse what's there first.

## Routing

Routes are registered with **React Router** in `App.tsx`. Add new routes as `<Route>`
elements inside the existing `<Routes>` tree rather than creating a second router
instance. See `08-new-page-workflow.md` for the full checklist when adding a page.

## Linting & quality

- `eslint.config.js` is already configured — run `npm run lint` and keep new code
  clean rather than introducing new lint suppressions.
- Keep functions small and colocate page-specific helper functions in the page file
  unless they're reused by more than one page, in which case promote them to
  `src/hooks/` (for stateful logic) or a small `utils`/`lib` module if one already
  exists.

## What NOT to introduce without being asked

- A different component library (MUI, Chakra, Ant Design, shadcn/ui, Bootstrap) —
  especially important since this project may use one elsewhere; keep it out of
  TailAdmin's own screens.
- A different charting library alongside ApexCharts.
- A global state manager (Redux, Zustand, Jotai, Recoil) — Context + local state is the
  established pattern here.
- CSS-in-JS or CSS Modules — Tailwind utility classes only.
- A different router.
- Path aliases, unless already configured in `tsconfig.json`/`vite.config.ts`.
