# Form Components (`src/components/form/`)

Import pattern:
```tsx
import ComponentName from "../components/form/ComponentName";
```

## Input

| Prop | Type | Default | Description |
|---|---|---|---|
| `type` | `"text" \| "number" \| "email" \| "password" \| "date" \| "time" \| string` | `"text"` | Input type |
| `id` | `string` | — | Element id |
| `name` | `string` | — | Field name |
| `placeholder` | `string` | — | Placeholder |
| `value` | `string \| number` | — | Current value |
| `onChange` | `(e: React.ChangeEvent<HTMLInputElement>) => void` | — | Change handler |
| `className` | `string` | `""` | Extra classes |
| `min` / `max` / `step` | `string` / `string` / `number` | — | For numeric inputs |
| `disabled` | `boolean` | `false` | Disabled state |
| `success` | `boolean` | `false` | Success (green) validation state |
| `error` | `boolean` | `false` | Error (red) validation state |
| `hint` | `string` | — | Helper text below the field |

```tsx
<Input
  type="email"
  name="email"
  placeholder="you@example.com"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={!isValidEmail}
  hint={!isValidEmail ? "Enter a valid email address" : undefined}
/>
```

## Select

| Prop | Type | Default | Description |
|---|---|---|---|
| `options` | `Option[]` (`{ value, label }`) | required | Choices |
| `placeholder` | `string` | `"Select an option"` | Placeholder |
| `onChange` | `(value: string) => void` | required | Change handler |
| `className` | `string` | `""` | Extra classes |
| `defaultValue` | `string` | `""` | Initial value |

```tsx
<Select
  options={[
    { value: "admin", label: "Admin" },
    { value: "editor", label: "Editor" },
  ]}
  placeholder="Select a role"
  onChange={(value) => setRole(value)}
/>
```

## Checkbox

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | — | Optional label |
| `checked` | `boolean` | required | Checked state |
| `className` | `string` | `""` | Extra classes |
| `id` | `string` | — | Element id |
| `onChange` | `(checked: boolean) => void` | required | Change handler |
| `disabled` | `boolean` | `false` | Disabled state |

## Radio

| Prop | Type | Default | Description |
|---|---|---|---|
| `id` | `string` | required | Element id |
| `name` | `string` | required | Radio group name |
| `value` | `string` | required | Option value |
| `checked` | `boolean` | required | Whether selected |
| `label` | `string` | required | Option label |
| `onChange` | `(value: string) => void` | required | Change handler |
| `className` | `string` | `""` | Extra classes |
| `disabled` | `boolean` | `false` | Disabled state |

## File Upload

| Prop | Type | Default | Description |
|---|---|---|---|
| `className` | `string` | `undefined` | Extra classes |
| `onChange` | `(event: React.ChangeEvent<HTMLInputElement>) => void` | `undefined` | File-selection handler |

## Date Picker (flatpickr-based)

TailAdmin React ships a date-picker form element built on top of the `flatpickr`
package (not `react-flatpickr` — the template migrated to the plain `flatpickr`
package for React 19 compatibility). Its exact prop names aren't in this reference —
**open the existing `DatePicker`/date-picker file in `src/components/form/` and match
its current API** before using or extending it, rather than guessing flatpickr's raw
options object into a new prop shape.

## Building a new form

- Compose forms purely from the components above; don't hand-write raw
  `<input>`/`<select>` elements.
- Use `error` / `success` boolean props + `hint` text for inline validation feedback,
  matching the pattern already established on `Input`.
- Wrap groups of fields in the existing `Card`/layout spacing conventions
  (see `02-ui-components.md`), not custom one-off spacing.
- If the user wants real form validation (required fields, schema validation), check
  `package.json` for an existing form/validation library (e.g. `react-hook-form`,
  `zod`) before adding a new one — only introduce one if none exists and the user asks
  for validation logic beyond simple `error`/`hint` props.
