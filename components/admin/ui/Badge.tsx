import type { ReactNode } from "react";

const colorMap = {
  primary: {
    light: "bg-brand-50 text-brand-700",
    solid: "bg-brand-500 text-white",
  },
  success: {
    light: "bg-emerald-50 text-emerald-700",
    solid: "bg-emerald-600 text-white",
  },
  error: {
    light: "bg-red-50 text-red-700",
    solid: "bg-red-600 text-white",
  },
  warning: {
    light: "bg-amber-50 text-amber-800",
    solid: "bg-amber-500 text-white",
  },
  info: {
    light: "bg-sky-50 text-sky-700",
    solid: "bg-sky-600 text-white",
  },
  light: {
    light: "bg-gray-100 text-gray-700",
    solid: "bg-gray-200 text-gray-800",
  },
  dark: {
    light: "bg-brand-800/10 text-brand-800",
    solid: "bg-brand-800 text-white",
  },
} as const;

type BadgeColor = keyof typeof colorMap;

export default function Badge({
  children,
  variant = "light",
  size = "md",
  color = "primary",
  startIcon,
  endIcon,
  className = "",
}: {
  children: ReactNode;
  variant?: "light" | "solid";
  size?: "sm" | "md";
  color?: BadgeColor;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  className?: string;
}) {
  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-xs",
  };
  const tones = colorMap[color][variant];

  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-semibold capitalize ${sizes[size]} ${tones} ${className}`}>
      {startIcon}
      {children}
      {endIcon}
    </span>
  );
}
