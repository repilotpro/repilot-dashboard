import { TableCell } from "@/components/admin/ui/Table";

export default function SortableTh({
  label,
  column,
  sortBy,
  sortOrder,
  onSort,
  className = "",
}: {
  label: string;
  column: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSort: (column: string) => void;
  className?: string;
}) {
  const active = sortBy === column;
  const arrow = active ? (sortOrder === "asc" ? "↑" : "↓") : null;

  return (
    <TableCell isHeader className={className}>
      <button
        type="button"
        onClick={() => onSort(column)}
        className={`inline-flex items-center gap-1 uppercase tracking-wide transition hover:text-brand-700 ${
          active ? "text-brand-700" : "text-gray-500"
        }`}
      >
        <span>{label}</span>
        {arrow ? <span className="text-[10px] font-black normal-case">{arrow}</span> : null}
      </button>
    </TableCell>
  );
}
