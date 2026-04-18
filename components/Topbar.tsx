'use client';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';
import { useToast } from './ToastProvider';

interface TopbarProps {
  title: string;
  user: {
    userId: string;
    full_name: string;
    role: string;
  };
}

const IconUser = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconLogOut = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

export function Topbar({ title, user }: TopbarProps) {
  const router = useRouter();
  const { toast } = useToast();

  async function handleLogout() {
    try {
      await supabase.auth.signOut();
      router.push('/auth/login');
    } catch {
      toast({ title: 'Logout failed. Try again.', variant: 'error' });
    }
  }

  return (
    <header className="h-[64px] bg-[var(--surface)] border-b border-[var(--border-soft)] flex items-center justify-between px-6 sticky top-0 z-20 backdrop-blur-sm">
      <h1 className="font-[family-name:var(--font-display)] font-semibold text-[var(--ink)] text-lg pl-10 md:pl-0 tracking-tight">
        {title}
      </h1>

      <div className="flex items-center gap-3">
        {/* Name on top, role below — hidden on very small screens */}
        <div className="hidden sm:flex flex-col items-end">
          <span className="font-[family-name:var(--font-body)] text-sm font-medium text-[var(--ink)] leading-tight">
            {user.full_name}
          </span>
          <span className="text-xs text-[var(--ink-3)] font-[family-name:var(--font-body)]">
            {user.role}
          </span>
        </div>

        {/* Violet avatar icon — replaces the duplicate role pill */}
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #7B2CBF, #A66DD4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            flexShrink: 0,
          }}
        >
          <IconUser size={18} />
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="text-[var(--ink-3)] hover:text-red-500 transition-colors px-2 py-1 rounded-md hover:bg-red-50/50"
          aria-label="Logout"
        >
          <IconLogOut size={20} />
        </button>
      </div>
    </header>
  );
}