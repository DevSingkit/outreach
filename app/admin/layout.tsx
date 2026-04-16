// app/admin/layout.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';
import { Sidebar, NavItem } from '@/components/Sidebar';
import { Topbar } from '@/components/Topbar';

const IconCalendar = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const IconUsers = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IconBarChart = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/>
  </svg>
);
const IconMessage = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/admin/dashboard',
    icon: <IconBarChart size={20} />,
  },
  {
    label: 'Events',
    href: '/admin/events',
    icon: <IconCalendar size={20} />,
  },
  {
    label: 'Staff',
    href: '/admin/staff',
    icon: <IconUsers size={20} />,
  },
  {
    label: 'Chatbot Logs',
    href: '/admin/chatbot-logs',
    icon: <IconMessage size={20} />,
  },
  {
    label: 'Reports',
    href: '/admin/reports',
    icon: <IconBarChart size={20} />,
  },
];

const pageTitles: Record<string, string> = {
  '/admin/dashboard': 'Dashboard',
  '/admin/events': 'Events',
  // add more as needed
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ userId: string; full_name: string; role: string } | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.push('/auth/login'); return; }

      const { data } = await supabase
        .from('staff_accounts')
        .select('full_name, role')
        .eq('supabase_uid', session.user.id)
        .single();

      setUser({
        userId: session.user.id,
        full_name: data?.full_name ?? session.user.email ?? '',
        role: data?.role ?? 'Admin',
      });
    });
  }, [router]);

  const title = pageTitles[pathname] ?? 'Admin';

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        navItems={navItems}
        onSignOut={async () => {
          await supabase.auth.signOut();
          router.push('/auth/login');
        }}
      />
      <div className="flex flex-col flex-1 md:ml-[240px]">
        <Topbar title={title} user={user} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}