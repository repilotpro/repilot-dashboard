import { TableCell, TableRow } from "@/components/admin/ui/Table";

const BAR_WIDTHS = ["w-36", "w-24", "w-16", "w-20", "w-28", "w-20", "w-16", "w-16", "w-28"];

function SkeletonBar({ className = "" }: { className?: string }) {
  return <div className={`h-3.5 animate-pulse rounded bg-gray-200 ${className}`} />;
}

export default function TableSkeleton({ columns = 5, rows = 6 }: { columns?: number; rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }, (_, rowIndex) => (
        <TableRow key={rowIndex}>
          {Array.from({ length: columns }, (_, colIndex) => {
            const width = BAR_WIDTHS[colIndex % BAR_WIDTHS.length];
            const isPrimary = colIndex === 0;
            return (
              <TableCell key={colIndex}>
                {isPrimary ? (
                  <div className="space-y-2">
                    <SkeletonBar className={`${width} h-4`} />
                    <SkeletonBar className="h-2.5 w-20" />
                  </div>
                ) : (
                  <SkeletonBar className={width} />
                )}
              </TableCell>
            );
          })}
        </TableRow>
      ))}
    </>
  );
}
