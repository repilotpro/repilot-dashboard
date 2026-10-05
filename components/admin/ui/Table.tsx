import type { HTMLAttributes, ReactNode, TdHTMLAttributes, ThHTMLAttributes } from "react";

export function Table({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className={`min-w-full divide-y divide-gray-200 ${className}`}>{children}</table>
    </div>
  );
}

export function TableHeader({ children }: { children: ReactNode }) {
  return <thead className="bg-gray-50">{children}</thead>;
}

export function TableBody({ children }: { children: ReactNode }) {
  return <tbody className="divide-y divide-gray-100 bg-white">{children}</tbody>;
}

export function TableRow({ children, className = "", ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr className={className} {...props}>
      {children}
    </tr>
  );
}

export function TableCell({
  children,
  isHeader = false,
  className = "",
  colSpan,
}: {
  children?: ReactNode;
  isHeader?: boolean;
  className?: string;
  colSpan?: number;
} & Pick<TdHTMLAttributes<HTMLTableCellElement> & ThHTMLAttributes<HTMLTableCellElement>, never>) {
  if (isHeader) {
    return (
      <th scope="col" colSpan={colSpan} className={`px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500 ${className}`}>
        {children}
      </th>
    );
  }
  return (
    <td colSpan={colSpan} className={`px-4 py-3 text-sm text-gray-700 ${className}`}>
      {children}
    </td>
  );
}
