// components/EmptyState.tsx
import { ReactNode } from 'react';

interface EmptyStateProps {
  message: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}

export function EmptyState({ message, description, action, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {icon ? (
        <div className="mb-4 text-muted">{icon}</div>
      ) : (
        <div className="mb-4 w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
          <svg
            className="w-7 h-7 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
            />
          </svg>
        </div>
      )}
      <p className="font-jakarta font-semibold text-text text-base">{message}</p>
      {description && (
        <p className="mt-1 text-sm text-muted font-dm">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}