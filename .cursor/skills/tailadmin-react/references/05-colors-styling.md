# Colors & Styling System

TailAdmin React uses **Tailwind CSS v4**'s CSS-first configuration: the whole palette
is defined as CSS custom properties inside an `@theme` block in `src/index.css`, not in
a JS `tailwind.config.js` `theme.extend.colors` object.

## Golden rule

**Never invent a one-off hex color** (`bg-[#3b82f6]`, inline `style={{ color: '#...' }}`,
etc.). Always use one of the existing token scales below via Tailwind's generated
utility classes (`bg-brand-500`, `text-gray-700`, `border-error-300`, …). If a genuinely
new brand color is needed, add it to the `@theme` block in `src/index.css` first, then
use it — see "Adding a new color" below.

## Token scales (defined in `src/index.css` under `@theme`)

Each scale below runs `25 → 950` (lightest → darkest) unless noted.

**Brand** (primary/interactive color)
`brand-25 #f2f7ff · brand-50 #ecf3ff · brand-100 #dde9ff · brand-200 #c2d6ff · brand-300 #9cb9ff · brand-400 #7592ff · brand-500 #465fff · brand-600 #3641f5 · brand-700 #2a31d8 · brand-800 #252dae · brand-900 #262e89 · brand-950 #161950`

**Blue Light**
`blue-light-25 #f5fbff · blue-light-50 #f0f9ff · blue-light-100 #e0f2fe · blue-light-200 #b9e6fe · blue-light-300 #7cd4fd · blue-light-400 #36bffa · blue-light-500 #0ba5ec · blue-light-600 #0086c9 · blue-light-700 #026aa2 · blue-light-800 #065986 · blue-light-900 #0b4a6f · blue-light-950 #062c41`

**Gray** (backgrounds, text, borders — used constantly, incl. dark mode)
`gray-25 #fcfcfd · gray-50 #f9fafb · gray-100 #f2f4f7 · gray-200 #e4e7ec · gray-300 #d0d5dd · gray-400 #98a2b3 · gray-500 #667085 · gray-600 #475467 · gray-700 #344054 · gray-800 #1d2939 · gray-900 #101828 · gray-950 #0c111d` — plus `gray-dark #1a2231`

**Orange**
`orange-25 #fffaf5 · orange-50 #fff6ed · orange-100 #ffead5 · orange-200 #fddcab · orange-300 #feb273 · orange-400 #fd853a · orange-500 #fb6514 · orange-600 #ec4a0a · orange-700 #c4320a · orange-800 #9c2a10 · orange-900 #7e2410 · orange-950 #511c10`

**Success**
`success-25 #f6fef9 · success-50 #ecfdf3 · success-100 #d1fadf · success-200 #a6f4c5 · success-300 #6ce9a6 · success-400 #32d583 · success-500 #12b76a · success-600 #039855 · success-700 #027a48 · success-800 #05603a · success-900 #054f31 · success-950 #053321`

**Error**
`error-25 #fffbfa · error-50 #fef3f2 · error-100 #fee4e2 · error-200 #fecdca · error-300 #fda29b · error-400 #f97066 · error-500 #f04438 · error-600 #d92d20 · error-700 #b42318 · error-800 #912018 · error-900 #7a271a · error-950 #55160c`

**Warning**
`warning-25 #fffcf5 · warning-50 #fffaeb · warning-100 #fef0c7 · warning-200 #fedf89 · warning-300 #fec84b · warning-400 #fdb022 · warning-500 #f79009 · warning-600 #dc6803 · warning-700 #b54708 · warning-800 #93370d · warning-900 #7a2e0e · warning-950 #4e1d09`

**Accents**: `theme-pink-500 #ee46bc` · `theme-purple-500 #7a5af8`

Base: `current` (`currentColor`), `transparent`, `white #ffffff`, `black #101828`.

## Usage

```tsx
<div className="bg-brand-500 text-white">Custom color background with text</div>
```

Semantic mapping used throughout the codebase (follow these pairings when you touch
existing components, and reuse them in new ones):

| Purpose | Light | Dark |
|---|---|---|
| Page/card background | `bg-white` | `dark:bg-gray-900` (or `dark:bg-white/[0.03]` for nested surfaces) |
| Primary text | `text-gray-900` | `dark:text-white` / `dark:text-white/90` |
| Secondary/muted text | `text-gray-500` | `dark:text-gray-400` |
| Border | `border-gray-200` | `dark:border-gray-800` |
| Primary action | `bg-brand-500` hover `bg-brand-600` | usually unchanged across themes |
| Success state | `text-success-600` / `bg-success-50` | `dark:text-success-400` / `dark:bg-success-500/15` |
| Error state | `text-error-600` / `bg-error-50` | `dark:text-error-400` / `dark:bg-error-500/15` |
| Warning state | `text-warning-600` / `bg-warning-50` | `dark:text-warning-400` / `dark:bg-warning-500/15` |

## Adding a new color

Add it to the `@theme` block in `src/index.css`, following the existing scale naming
convention exactly:

```css
@theme {
  /* ...existing tokens... */
  --color-teal-500: #14b8a6;
}
```

It is then immediately usable as `bg-teal-500`, `text-teal-500`, `border-teal-500`,
etc. Don't duplicate an existing scale under a new name — check the palette above
first, a near-enough token almost certainly already exists.

## General styling conventions

- Utility-first Tailwind classes directly in JSX `className`. No CSS Modules, no
  styled-components/emotion, no separate per-component `.css` files.
- Prefer composing existing spacing/radius/shadow scales already used elsewhere in the
  codebase (e.g. `rounded-xl`, `shadow-theme-sm` if defined) over inventing new
  arbitrary values (`rounded-[13px]`) unless there's a specific design reason.
- Every interactive element needs visible `hover:`/`focus:` states and, where relevant,
  a `disabled:` state — mirror what `Button`/`Input` already do.
