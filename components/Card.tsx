// components/Card.tsx
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  title?: string;
  className?: string;
}

export function Card({ children, title, className = '' }: CardProps) {
  return (
    <div className={`bg-surface rounded-card p-6 shadow-sm ${className}`}>
      {title && (
        <h3 className="font-jakarta text-lg font-semibold text-text mb-4">{title}</h3>
      )}
      {children}
    </div>
  );
}