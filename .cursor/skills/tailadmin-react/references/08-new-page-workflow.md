# Adding a New Page — Checklist

Follow every step; skipping the sidebar-registration or route-registration step is the
most common way a new page ends up "built but unreachable."

1. **Create the page component**
   `src/pages/<Group>/<PageName>.tsx` (group by feature area the same way existing
   pages are grouped, e.g. `pages/Dashboard/`, `pages/Tables/`, `pages/Forms/` — match
   whatever grouping already exists in this repo rather than inventing a new taxonomy).

2. **Set page metadata**
   TailAdmin React has built-in per-page metadata management (document title, etc.).
   Look for a `PageMeta` (or similarly named) component already used by sibling pages
   and wrap your new page's content with it the same way, e.g.:
   ```tsx
   export default function Invoices() {
     return (
       <>
         <PageMeta title="Invoices | TailAdmin" description="Manage customer invoices" />
         <PageBreadcrumb pageTitle="Invoices" />
         {/* page content */}
       </>
     );
   }
   ```
   Check the exact component/prop names used by an existing page before copying this —
   this is the documented pattern, not a guaranteed literal API.

3. **Build the page from existing components**
   Compose the page from `src/components/ui/` and `src/components/form/` (see
   `02-ui-components.md` / `03-form-components.md`) and, if it needs charts, from
   `src/components/charts/` (see `06-charts-dataviz.md`). Don't hand-roll markup that
   already has a component.

4. **Register the route**
   In `App.tsx`, add a `<Route>` for the new page inside the existing `<Routes>` tree,
   following the same nesting/layout-wrapping pattern already used by sibling routes
   (most pages render inside the shared app-shell `Layout` route — don't bypass it
   unless the new page is an auth/standalone page like sign-in, which intentionally
   sits outside the dashboard shell).

5. **Add the sidebar navigation entry**
   Find the sidebar's menu-data array (in `src/layout/`, e.g. inside the `Sidebar`
   component or a nearby `menuItems`/`navItems` data file) and add an entry with:
   - label text
   - route path (must match the `<Route path>` exactly)
   - an icon (reuse an existing icon from the project's icon set — see
     `07-coding-conventions.md`)
   Place it in the correct group/section of the sidebar, matching how similar pages are
   grouped already.

6. **Dark mode + responsiveness pass**
   Before considering the page done, verify every new element has a `dark:` pairing
   (`05-colors-styling.md`) and that the layout collapses sensibly on mobile
   (stack cards, scroll wide tables horizontally, etc.) — TailAdmin pages are expected
   to work at both ends of the viewport range out of the box.

7. **Sanity check**
   Run `npm run dev` and click through: sidebar link → route loads → dark mode toggle
   still looks correct → no console errors, no ESLint errors from `npm run lint`.
