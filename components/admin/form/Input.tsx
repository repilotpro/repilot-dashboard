import type { InputHTMLAttributes } from "react";

type InputProps = {
  success?: boolean;
  error?: boolean;
  hint?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export default function Input({
  type = "text",
  className = "",
  disabled = false,
  success = false,
  error = false,
  hint,
  ...props
}: InputProps) {
  const ring = error
    ? "border-red-300 focus:border-red-400 focus:ring-red-100"
    : success
      ? "border-emerald-300 focus:border-emerald-400 focus:ring-emerald-100"
      : "border-gray-200 focus:border-brand-300 focus:ring-brand-100";

  return (
    <div className="w-full">
      <input
        type={type}
        disabled={disabled}
        className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-brand-800 outline-none ring-0 transition focus:ring-4 disabled:opacity-50 ${ring} ${className}`}
        {...props}
      />
      {hint ? <p className={`mt-1.5 text-xs ${error ? "text-red-600" : "text-gray-500"}`}>{hint}</p> : null}
    </div>
  );
}
