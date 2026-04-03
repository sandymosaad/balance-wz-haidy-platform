import {ChevronDown, ChevronUp} from 'lucide-react';
import {LoadingSkeleton} from '@/components/admin/LoadingSkeleton';

type ColumnDef<T> = {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
};

type DataTableProps<T> = {
  columns: ColumnDef<T>[];
  data: T[];
  isLoading?: boolean;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (key: string) => void;
  emptyText?: string;
};

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  isLoading,
  sortKey,
  sortDirection,
  emptyText = 'No data found.'
}: DataTableProps<T>) {
  if (isLoading) {
    return <LoadingSkeleton type="table" count={6} />;
  }

  if (!data.length) {
    return <p className="rounded-2xl border border-art-sage bg-art-cream p-6 text-sm text-art-clay">{emptyText}</p>;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-art-sage bg-white/70">
      <table className="min-w-full text-sm">
        <thead className="bg-art-beige/70 text-art-taupe">
          <tr>
            {columns.map((column) => (
              <th key={String(column.key)} className="px-4 py-3 text-left font-semibold">
                <span className="inline-flex items-center gap-1">
                  {column.header}
                  {column.sortable && sortKey === column.key ? (
                    sortDirection === 'asc' ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />
                  ) : null}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="border-t border-art-sage/40 hover:bg-art-cream/70">
              {columns.map((column) => (
                <td key={String(column.key)} className="px-4 py-3 text-art-charcoal">
                  {column.render ? column.render(row) : String(row[column.key as keyof T] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
