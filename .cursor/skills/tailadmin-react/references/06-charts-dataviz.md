# Charts & Data Visualization

TailAdmin React's chart components (Line charts, Bar charts, and other dashboard
data-viz) are built on **ApexCharts** via the `apexcharts` + `react-apexcharts`
packages, wrapped in TailAdmin's own `Card`-based presentation (title, legend styling,
responsive container) to match the rest of the design system.

## Before adding a new chart

1. **Check `src/components/charts/` first** — TailAdmin already ships Line and Bar
   chart components; a new "revenue over time" or "orders by category" chart is very
   likely a data/config change to an existing chart component, not a reason to build a
   new charting component from scratch.
2. Confirm the exact prop names/shape of the local chart component by opening the file
   — this reference intentionally does not invent a prop table for it, since chart
   component APIs vary more between template releases than the core UI kit does.

## General ApexCharts-in-React pattern used by the project

```tsx
import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";

const options: ApexOptions = {
  chart: {
    type: "line",
    toolbar: { show: false },
    fontFamily: "Outfit, sans-serif", // match the project's base font
  },
  colors: ["#465fff"], // brand-500 — reuse tokens from 05-colors-styling.md
  xaxis: {
    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  },
  grid: { borderColor: "#e4e7ec" }, // gray-200 — pair with a dark-mode-aware value if the wrapper supports it
};

const series = [{ name: "Revenue", data: [120, 200, 150, 300, 250, 400] }];

export default function RevenueChart() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <Chart options={options} series={series} type="line" height={300} />
    </div>
  );
}
```

## Rules

- **Reuse the color tokens** from `05-colors-styling.md` for series colors (e.g.
  `#465fff` = `brand-500`) instead of arbitrary hex values, so charts stay visually
  consistent with the rest of the UI.
- **Wrap charts in the same card container styling** already used elsewhere
  (`rounded-2xl border ... bg-white dark:bg-white/[0.03] dark:border-gray-800`) rather
  than inventing new container chrome.
- Charts should be **responsive** — let ApexCharts' own responsive/`width="100%"`
  behavior handle resizing rather than fixed pixel widths.
- Don't swap in a different charting library (Recharts, Chart.js, D3, Victory, etc.)
  for an existing dashboard unless the user explicitly asks — ApexCharts is the
  established choice here and mixing libraries fragments the bundle and the visual
  language.
- If dark-mode-aware chart theming is needed (grid lines, axis labels, tooltip
  background), read the current theme from the `ThemeContext`/`useTheme()` hook
  (see `04-layout-theming.md`) and swap the relevant `ApexOptions` fields — don't just
  leave charts light-mode-only.
