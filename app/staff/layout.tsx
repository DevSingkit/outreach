// app/staff/layout.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';
import { Sidebar } from '@/components/Sidebar';
import { Topbar } from '@/components/Topbar';

const NAV_ITEMS = [
  {
    label: 'Dashboard',
    href: '/staff/dashboard',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
  },
  {
    label: 'Check-in',
    href: '/staff/checkin',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
  },
  {
    label: 'Queue',
    href: '/staff/queue',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  },
  {
    label: 'Examination',
    href: '/staff/examination',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/></svg>,
  },
  {
    label: 'Procedure',
    href: '/staff/procedure',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2L22 6"/><path d="M7 11l-5 5 1 3 3 1 5-5"/><path d="M21.3 8.7l-8-8-9 9 8 8 1.4-1.4-1-1L14 14l-1.4 1.4-1-1 2.1-2.1-1.4-1.4-2.1 2.1-1-1L11 10.6l-1.4-1.4 2.1-2.1L10.3 5.7z"/></svg>,
  },
  {
    label: 'Billing',
    href: '/staff/billing',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  },
  {
    label: 'Discharge',
    href: '/staff/discharge',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  },
  {
    label: 'Participants',
    href: '/staff/participants',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<{ userId: string; full_name: string; role: string } | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) return router.push('/auth/login');
      setUser({
        userId: data.user.id,
        full_name: data.user.user_metadata?.full_name ?? 'Staff',
        role: data.user.user_metadata?.role ?? 'Staff',
      });
    });
  }, []);

  if (!user) return null; // or a loading skeleton

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar navItems={NAV_ITEMS} onSignOut={() => router.push('/auth/login')} />
      <div className="flex-1 flex flex-col md:ml-[240px]">
        <Topbar title="Dashboard" user={user} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}