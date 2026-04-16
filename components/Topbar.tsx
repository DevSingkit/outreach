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
    <header className="h-[64px] bg-surface border-b border-muted/20 flex items-center justify-between px-6 sticky top-0 z-20">
      <h1 className="font-jakarta font-semibold text-text text-lg pl-10 md:pl-0">{title}</h1>
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex flex-col items-end">
          <span className="font-dm text-sm font-medium text-text leading-tight">{user.full_name}</span>
          <span className="text-xs text-muted font-dm">{user.role}</span>
        </div>
        <span className="bg-primary/10 text-primary text-xs font-semibold font-dm px-3 py-1 rounded-full">
          {user.role}
        </span>
        <button
          onClick={handleLogout}
          className="text-sm font-dm font-medium text-muted hover:text-error transition-colors px-2 py-1"
          aria-label="Logout"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M18 12H9m0 0l3-3m-3 3l3 3" />
          </svg>
        </button>
      </div>
    </header>
  );
}