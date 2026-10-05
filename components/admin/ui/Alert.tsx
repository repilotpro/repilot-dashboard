const variants = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  error: "border-red-200 bg-red-50 text-red-800",
  warning: "border-amber-200 bg-amber-50 text-amber-900",
  info: "border-sky-200 bg-sky-50 text-sky-800",
};

export default function Alert({
  variant = "info",
  title,
  message,
  className = "",
}: {
  variant?: keyof typeof variants;
  title?: string;
  message?: string;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border px-4 py-3 ${variants[variant]} ${className}`} role="alert">
      {title ? <p className="text-sm font-bold">{title}</p> : null}
      {message ? <p className={`text-sm ${title ? "mt-1 opacity-90" : ""}`}>{message}</p> : null}
    </div>
  );
}
