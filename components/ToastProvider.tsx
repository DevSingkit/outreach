// components/ToastProvider.tsx
'use client';

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  ReactNode,
} from 'react';
import * as Toast from '@radix-ui/react-toast';

// ─── Types ───────────────────────────────────────────────────────────────────

type ToastVariant = 'success' | 'error' | 'info';

interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
}

interface ToastOptions {
  title: string;
  description?: string;
  variant?: ToastVariant;
}

interface ToastContextValue {
  toast: (opts: ToastOptions) => void;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

// ─── Variant styles ───────────────────────────────────────────────────────────

const variantStyles: Record<ToastVariant, string> = {
  success: 'bg-secondary text-[#1A4D00] border-secondary',
  error:   'bg-red-100 text-error border-error',
  info:    'bg-blue-100 text-info border-blue-400',
};

const variantIcons: Record<ToastVariant, string> = {
  success: '✓',
  error:   '✕',
  info:    'i',
};

// ─── Provider ────────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ToastMessage[]>([]);
  const counter = useRef(0);

  const toast = useCallback((opts: ToastOptions) => {
    const id = String(++counter.current);
    setMessages(prev => [
      ...prev,
      { id, title: opts.title, description: opts.description, variant: opts.variant ?? 'info' },
    ]);
  }, []);

  const remove = (id: string) =>
    setMessages(prev => prev.filter(m => m.id !== id));

  return (
    <ToastContext.Provider value={{ toast }}>
      <Toast.Provider swipeDirection="right" duration={4000}>
        {children}

        {messages.map(msg => (
          <Toast.Root
            key={msg.id}
            open
            onOpenChange={open => { if (!open) remove(msg.id); }}
            className={`
              flex items-start gap-3 p-4 pr-8 rounded-card border shadow-md
              data-[state=open]:animate-in data-[state=closed]:animate-out
              data-[swipe=end]:animate-out
              data-[state=closed]:fade-out-80
              data-[state=open]:slide-in-from-top-full
              data-[state=open]:sm:slide-in-from-bottom-full
              ${variantStyles[msg.variant]}
            `}
          >
            {/* Icon dot */}
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-current/20 flex items-center justify-center text-xs font-bold">
              {variantIcons[msg.variant]}
            </span>

            <div className="flex flex-col gap-1 min-w-0">
              <Toast.Title className="font-jakarta text-sm font-semibold leading-tight">
                {msg.title}
              </Toast.Title>
              {msg.description && (
                <Toast.Description className="font-dm text-xs opacity-80">
                  {msg.description}
                </Toast.Description>
              )}
            </div>

            <Toast.Close
              className="absolute top-2 right-2 opacity-60 hover:opacity-100 text-current text-sm leading-none"
              aria-label="Close"
            >
              ✕
            </Toast.Close>
          </Toast.Root>
        ))}

        <Toast.Viewport className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 w-full max-w-sm" />
      </Toast.Provider>
    </ToastContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}