import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  size?: "sm" | "md";
  variant?: "primary" | "outline";
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  className?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className">;

export default function Button({
  children,
  size = "md",
  variant = "primary",
  startIcon,
  endIcon,
  disabled = false,
  type = "button",
  className = "",
  ...props
}: ButtonProps) {
  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "px-4 py-2.5 text-sm",
  };
  const variants = {
    primary: "bg-accent-500 text-brand-800 hover:bg-accent-600 disabled:bg-accent-500/50 shadow-sm",
    outline: "bg-white text-brand-700 border border-gray-200 hover:bg-gray-50 disabled:opacity-50",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {startIcon}
      {children}
      {endIcon}
    </button>
  );
}
