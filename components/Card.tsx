import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  variant?: 'default' | 'elevated' | 'purple' | 'ghost';
  padding?: 'sm' | 'md' | 'lg';
}

export function Card({
  children,
  title,
  subtitle,
  className = '',
  variant = 'default',
  padding = 'md',
}: CardProps) {
  const base = 'rounded-[var(--radius-lg)] transition-all duration-200';

  const variants = {
    default:
      'bg-[var(--surface)] border border-[var(--border-soft)] shadow-[var(--shadow-sm)]',
    elevated:
      'bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-md)]',
    purple:
      'bg-gradient-to-br from-[var(--p)] to-[var(--p-mid)] border border-transparent shadow-[var(--shadow-lg)]',
    ghost:
      'bg-[var(--p-tint)] border border-[var(--border)]',
  };

  const paddings = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const isOnPurple = variant === 'purple';

  return (
    <div className={`${base} ${variants[variant]} ${paddings[padding]} ${className}`}>
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h3
              className="font-[family-name:var(--font-display)] text-[15px] font-semibold tracking-tight leading-snug"
              style={{ color: isOnPurple ? 'white' : 'var(--ink)' }}
            >
              {title}
            </h3>
          )}
          {subtitle && (
            <p
              className="text-[12.5px] mt-0.5"
              style={{ color: isOnPurple ? 'rgba(255,255,255,0.6)' : 'var(--ink-3)' }}
            >
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}