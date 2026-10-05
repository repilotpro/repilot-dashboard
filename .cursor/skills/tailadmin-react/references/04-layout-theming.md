# App Layout & Theming

## The layout wrapper

TailAdmin's shell is a Flexbox layout that manages the relationship between the
**Sidebar** and the **Main Content Area**:

```tsx
<div className="flex h-screen overflow-hidden">
  {/* Sidebar */}
  <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

  {/* Content area wrapper */}
  <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
    {/* Header */}
    <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

    {/* Page content */}
    <main>
      <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
        {children}
      </div>
    </main>
  </div>
</div>
```

| Component | Role | CSS behavior |
|---|---|---|
| **Wrapper** | Flex container holding sidebar & content | `flex h-screen overflow-hidden` — full viewport height, no body scroll |
| **Sidebar** | Navigation menu | `fixed` on mobile / `static` on desktop, `translate-x` toggling animation |
| **Header** | Top nav & actions | `sticky top-0` — stays visible while scrolling |
| **Main** | Page content | `flex-1`, `overflow-y-auto` for internal scrolling |

Don't rewrite this shell to a CSS-Grid layout or a different structure — every page
renders inside it via `App.tsx`'s route tree, so changing it is a global, high-blast-
radius edit. If asked to tweak it, prefer the two documented customization points
below.

### Responsive behavior (mobile-first)

- **Desktop (`lg:` / ≥1024px)**: Sidebar is `lg:static` and always visible; main
  content sits next to it.
- **Mobile/tablet**: Sidebar is `absolute`/`fixed`, hidden by default
  (`-translate-x-full`). A hamburger button in the Header toggles `sidebarOpen`. When
  open it slides in (`translate-x-0`), typically with a click-outside overlay to close.

### Customizing the layout

- **Sidebar width** → adjust the width classes (`w-64` → `w-72` etc.) inside the
  `Sidebar` component file in `src/layout/`.
- **Content padding / max width** → the `<main>` wrapper uses
  `max-w-screen-2xl` to cap width on ultra-wide monitors. Drop that class (keep
  `mx-auto w-full p-4 ...`) for a fully fluid layout if the user wants edge-to-edge
  content.

## SidebarContext

Manages the sidebar's open/collapsed state so any component in the tree (Header
hamburger button, overlay, Sidebar itself) can read/toggle it without prop drilling.
Consume it via its existing hook (e.g. `useSidebar()`) rather than re-deriving sidebar
state locally in a new component — check `src/context(s)/SidebarContext.tsx` for the
exact exported hook name before using it.

## ThemeContext — dark mode

This is the **React/Vite** edition, so dark mode is handled by TailAdmin's own
`ThemeContext` (a `useTheme()`-style hook backed by React Context + `localStorage`
persistence), **not** `next-themes` — that package only applies to the Next.js edition
of TailAdmin and should never be added here.

Tailwind CSS v4 dark mode mechanics used by the project:

```css
/* in src/index.css, alongside the @theme block */
@custom-variant dark (&:where(.dark, .dark *));
```

With that custom variant declared, any element gets dark styling whenever the `.dark`
class is present on an ancestor (typically `<html>`), toggled by the theme
context/hook:

```tsx
<div className="bg-white text-black dark:bg-gray-900 dark:text-white">
  {/* content */}
</div>
```

### Rules for dark mode

1. **Every new component must pair a light class with a `dark:` class** — see the
   pattern above and the color pairs in `05-colors-styling.md`
   (e.g. `bg-white dark:bg-gray-900`, `text-gray-900 dark:text-white`,
   `border-gray-200 dark:border-gray-800`).
2. Toggle theme via the existing context hook (check its real name in
   `ThemeContext.tsx`), e.g.:
   ```tsx
   const { theme, toggleTheme } = useTheme();
   <button onClick={toggleTheme}>Toggle theme</button>
   ```
   Don't reimplement dark-mode toggling with your own `localStorage`/`useState` logic
   in a new component — always go through the shared context so state stays in sync
   app-wide.
3. Never hardcode a color that ignores dark mode (e.g. a raw `bg-[#fff]` with no dark
   counterpart) on anything visible in the main content area.
