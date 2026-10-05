# UI Component Reference (`src/components/ui/`)

This is the documented, official prop surface for TailAdmin React's core UI kit, taken
from the TailAdmin docs. **Always check for one of these before writing raw
`<div>`/`<button>` markup from scratch.** If the local file's props have drifted
slightly from this table, trust the local file — but this is the correct default.

General import pattern for all of them:
```tsx
import ComponentName from "../components/ui/ComponentName";
```

---

## Alert
Feedback banner for success/error/warning/info messages.

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `"success" \| "error" \| "warning" \| "info"` | required | Style + icon |
| `title` | `string` | required | Alert title |
| `message` | `string` | required | Alert body |
| `showLink` | `boolean` | `false` | Show a "Learn More" link |
| `linkHref` | `string` | `"#"` | Link target |
| `linkText` | `string` | `"Learn more"` | Link text |

```tsx
<Alert
  variant="success"
  title="Saved"
  message="Your changes have been saved successfully."
/>
```

## Avatar
User profile image with optional status dot.

| Prop | Type | Default |
|---|---|---|
| `src` | `string` | required |
| `alt` | `string` | `"User Avatar"` |
| `size` | `"xsmall" \| "small" \| "medium" \| "large" \| "xlarge" \| "xxlarge"` | `"medium"` |
| `status` | `"online" \| "offline" \| "busy" \| "none"` | `"none"` |

## Badge
Small status/count/label chip.

| Prop | Type | Default |
|---|---|---|
| `variant` | `"light" \| "solid"` | `"light"` |
| `size` | `"sm" \| "md"` | `"md"` |
| `color` | `"primary" \| "success" \| "error" \| "warning" \| "info" \| "light" \| "dark"` | `"primary"` |
| `startIcon` | `React.ReactNode` | — |
| `endIcon` | `React.ReactNode` | — |
| `children` | `React.ReactNode` | required |

## Breadcrumb
Path/navigation trail.

| Prop | Type | Default |
|---|---|---|
| `items` | `BreadcrumbItem[]` | required |
| `variant` | `"default" \| "withIcon" \| "dotted" \| "chevron"` | `"default"` |

## Button

| Prop | Type | Default | Required |
|---|---|---|---|
| `children` | `ReactNode` | — | ✅ |
| `size` | `"sm" \| "md"` | `"md"` | no |
| `variant` | `"primary" \| "outline"` | `"primary"` | no |
| `startIcon` | `ReactNode` | — | no |
| `endIcon` | `ReactNode` | — | no |
| `onClick` | `() => void` | — | no |
| `disabled` | `boolean` | `false` | no |
| `className` | `string` | `""` | no |

```tsx
<Button variant="primary" size="md" onClick={handleSave}>
  Save changes
</Button>
```

## Button Group
Groups related `Button`s together for combined actions/toolbars (see
`src/components/ui/button-group` if present) — compose from the `Button` component
above rather than hand-rolling new button markup.

## Card

| Component | Prop | Type | Description |
|---|---|---|---|
| `Card` | `children` | `ReactNode` | Card body |
| `CardTitle` | `children` | `ReactNode` | Short heading |
| `CardDescription` | `children` | `ReactNode` | Supporting text |

```tsx
<Card>
  <CardTitle>Monthly Revenue</CardTitle>
  <CardDescription>Compared to last month</CardDescription>
  {/* chart or content */}
</Card>
```

## Carousel
Sliding content showcase — compose with existing `Carousel` component, don't add a new
carousel library (e.g. Swiper/Embla) unless the user explicitly asks for one.

## Dropdown

**Dropdown props**

| Prop | Type | Default | Description |
|---|---|---|---|
| `isOpen` | `boolean` | required | Controls visibility |
| `onClose` | `() => void` | required | Close handler |
| `children` | `React.ReactNode` | required | Usually `DropdownItem`s |
| `className` | `string` | `""` | Extra classes |

**DropdownItem props**

| Prop | Type | Default | Description |
|---|---|---|---|
| `tag` | `"a" \| "button"` | `"button"` | Renders as link or button |
| `href` | `string` | `undefined` | URL (when `tag="a"`) |
| `onClick` | `() => void` | `undefined` | Click handler |
| `onItemClick` | `() => void` | `undefined` | Called to close the dropdown after selection |
| `baseClassName` | `string` | `"block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"` | Base classes |
| `className` | `string` | `""` | Extra classes |
| `children` | `React.ReactNode` | required | Item content |

```tsx
<Dropdown isOpen={open} onClose={() => setOpen(false)}>
  <DropdownItem onItemClick={() => setOpen(false)}>Edit</DropdownItem>
  <DropdownItem tag="a" href="/profile" onItemClick={() => setOpen(false)}>
    View profile
  </DropdownItem>
</Dropdown>
```

## Images / Links / List
Utility presentational components. `Links` in particular:

| Prop | Type | Default | Description |
|---|---|---|---|
| `href` | `string` | required | Target URL |
| `children` | `React.ReactNode` | required | Link content |
| `variant` | `"default" \| "colored" \| "underline" \| "opacity" \| "opacityHover"` | `"default"` | Visual style |
| `color` | `"primary" \| "secondary" \| "success" \| "danger" \| "warning" \| "info" \| "light" \| "dark"` | `"primary"` | For `colored`/`underline` |
| `opacity` | `10 \| 25 \| 50 \| 75 \| 100` | `100` | For `opacity`/`opacityHover` |
| `className` | `string` | `""` | Extra classes |

## Modal

| Prop | Type | Default | Description |
|---|---|---|---|
| `isOpen` | `boolean` | — | Visibility |
| `onClose` | `() => void` | — | Close handler |
| `children` | `React.ReactNode` | — | Modal content |
| `className` | `string` | — | Extra classes |
| `showCloseButton` | `boolean` | `true` | Show the ✕ button |
| `isFullscreen` | `boolean` | `false` | Full-screen modal |

```tsx
<Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
  <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
    Confirm delete
  </h3>
  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
    This action cannot be undone.
  </p>
</Modal>
```

## Notification / ProgressBar / Pagination / Popover / Ribbons / Spinner

**ProgressBar**

| Prop | Type | Default |
|---|---|---|
| `progress` | `number` | required (0–100) |
| `size` | `"sm" \| "md" \| "lg" \| "xl"` | `"sm"` |
| `label` | `"none" \| "outside" \| "inside"` | `"none"` |
| `className` | `string` | `""` |

**Popover**

| Prop | Type | Description |
|---|---|---|
| `position` | `"top" \| "right" \| "bottom" \| "left"` | Placement relative to trigger |
| `trigger` | `React.ReactNode` | Trigger element (required) |
| `children` | `ReactNode` | Popover content (required) |

`Notification`, `Pagination`, `Ribbons`, and `Spinner` are presentational — reuse them
as-is for loading states, table pagination, and highlight tags rather than building new
ones.

## Table

| Component | Prop | Type | Default | Description |
|---|---|---|---|---|
| `Table` | `children` | `ReactNode` | required | `TableHeader`/`TableBody` |
| `Table` | `className` | `string` | — | Extra classes |
| `TableHeader` | `children` | `ReactNode` | required | Header row(s) |
| `TableBody` | `children` | `ReactNode` | required | Body row(s) |
| `TableRow` | `children` | `ReactNode` | required | `TableCell`s |
| `TableCell` | `children` | `ReactNode` | required | Cell content |
| `TableCell` | `isHeader` | `boolean` | `false` | Renders `<th>` instead of `<td>` |

```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableCell isHeader>Name</TableCell>
      <TableCell isHeader>Status</TableCell>
    </TableRow>
  </TableHeader>
  <TableBody>
    {rows.map((row) => (
      <TableRow key={row.id}>
        <TableCell>{row.name}</TableCell>
        <TableCell>
          <Badge color="success">{row.status}</Badge>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

## Tabs
Composable section switcher — use the existing `Tabs` component for any segmented
content view instead of building custom tab-state UI.

## Tooltip

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | required | Trigger element |
| `content` | `string` | required | Tooltip text |
| `position` | `"top" \| "right" \| "bottom" \| "left"` | `"top"` | Placement |
| `theme` | `"light" \| "dark"` | `"light"` | Tooltip color theme |

## Videos

| Prop | Type | Default | Description |
|---|---|---|---|
| `videoId` | `string` | required | YouTube video ID |
| `aspectRatio` | `"16:9" \| "4:3" \| "21:9" \| "1:1"` | `"16:9"` | Embed aspect ratio |
| `title` | `string` | `"YouTube video"` | iframe title |
| `className` | `string` | `""` | Extra classes |

---

## When a needed component genuinely doesn't exist

If you need something not in this list (e.g. a stat/KPI card, a stepper, a rich file
manager), build it by **composing the primitives above** (`Card`, `Badge`, `Button`,
`ProgressBar`, etc.) and the color tokens in `05-colors-styling.md`, matching the same
visual language — spacing, radii, shadows, and dark-mode pairing already used elsewhere
in the codebase — rather than pulling in an external component library.
