import { ReactNode } from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { EmptyState } from './EmptyState';

export interface Column<T = Record<string, unknown>> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T extends Record<string, unknown>> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  rowKey?: (row: T) => string;
  onRowClick?: (row: T) => void;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  loading = false,
  emptyMessage = 'No data found.',
  rowKey,
  onRowClick,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (data.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <div className="overflow-x-auto rounded-[var(--radius-lg)]">
      <table className="w-full min-w-[600px] text-sm font-[family-name:var(--font-body)]">
        <thead>
          <tr className="bg-[var(--background)]">
            {columns.map(col => (
              <th
                key={col.key}
                className={`
                  text-left text-xs font-semibold text-[var(--ink-3)] uppercase tracking-wide
                  px-4 py-3 first:pl-6 last:pr-6
                  ${col.className ?? ''}
                `}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-[var(--surface)]">
          {data.map((row, idx) => (
            <tr
              key={rowKey ? rowKey(row) : idx}
              onClick={() => onRowClick?.(row)}
              className={`
                border-t border-[var(--border-soft)]
                min-h-[48px]
                transition-colors duration-100
                ${onRowClick ? 'cursor-pointer hover:bg-[var(--p-tint)]/50' : ''}
              `}
            >
              {columns.map(col => (
                <td
                  key={col.key}
                  className={`px-4 py-3 first:pl-6 last:pr-6 text-[var(--ink)] align-middle ${col.className ?? ''}`}
                >
                  {col.render ? col.render(row) : (row[col.key] as ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}