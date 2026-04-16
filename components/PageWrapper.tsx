// components/PageWrapper.tsx
import { ReactNode } from 'react';

interface PageWrapperProps {
  children: ReactNode;
  className?: string;
}

/**
 * Main content area wrapper.
 * Used inside layout files to pad content correctly relative to the fixed sidebar.
 */
export function PageWrapper({ children, className = '' }: PageWrapperProps) {
  return (
    <main
      className={`
        flex-1
        min-h-screen
        ml-0 md:ml-[240px]
        bg-background
        ${className}
      `}
    >
      <div className="p-4 md:p-6 lg:p-8">
        {children}
      </div>
    </main>
  );
}