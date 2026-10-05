export default function RefreshButton({
  onClick,
  disabled = false,
  loading = false,
  className = "",
}: {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      title="Refresh"
      aria-label="Refresh"
      onClick={onClick}
      disabled={disabled || loading}
      className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-500 p-0 text-brand-800 shadow-sm transition hover:bg-accent-600 disabled:cursor-not-allowed disabled:bg-accent-500/50 ${className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
        aria-hidden="true"
      >
        <path d="M21 12a9 9 0 1 1-2.25-6" />
        <path d="M21 3v6h-6" />
      </svg>
    </button>
  );
}
