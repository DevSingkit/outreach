// components/DataTable.tsx
import { ReactNode } from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { EmptyState } from './EmptyState';

// ─── Types ───────────────────────────────────────────────────────────────────

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

// ─── Component ───────────────────────────────────────────────────────────────

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
    <div className="overflow-x-auto rounded-card">
      <table className="w-full min-w-[600px] text-sm font-dm">
        {/* Header */}
        <thead>
          <tr className="bg-background">
            {columns.map(col => (
              <th
                key={col.key}
                className={`
                  text-left text-xs font-semibold text-muted uppercase tracking-wide
                  px-4 py-3 first:pl-6 last:pr-6
                  ${col.className ?? ''}
                `}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody className="bg-surface">
          {data.map((row, idx) => (
            <tr
              key={rowKey ? rowKey(row) : idx}
              onClick={() => onRowClick?.(row)}
              className={`
                border-t border-muted/10
                min-h-[48px]
                transition-colors duration-100
                ${onRowClick ? 'cursor-pointer hover:bg-primary/5' : ''}
              `}
            >
              {columns.map(col => (
                <td
                  key={col.key}
                  className={`px-4 py-3 first:pl-6 last:pr-6 text-text align-middle ${col.className ?? ''}`}
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