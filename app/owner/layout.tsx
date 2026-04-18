// app/owner/layout.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';
import { Sidebar } from '@/components/Sidebar';
import { Topbar } from '@/components/Topbar';

const NAV_ITEMS = [
  {
    label: 'Dashboard',
    href: '/owner/dashboard',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
  },
  {
    label: 'Registrations',
    href: '/owner/registrations',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  },
  {
    label: 'My Pets',
    href: '/owner/pets',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C10.34 2 9 3.34 9 5s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm-5 4C5.34 6 4 7.34 4 9s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm10 0c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zM5.5 14C3.57 14 2 15.57 2 17.5S3.57 21 5.5 21c.96 0 1.83-.38 2.48-1H16c.65.62 1.52 1 2.48 1C20.43 21 22 19.43 22 17.5S20.43 14 18.48 14c-1.5 0-2.78.87-3.43 2.13C14.57 16.05 13.82 16 13 16h-2c-.82 0-1.57.05-2.05.13C8.3 14.87 7.02 14 5.5 14z"/></svg>,
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<{ userId: string; full_name: string; role: string } | null>(null);

  useEffect(() => {
  async function fetchUser() {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) { router.push('/auth/login'); return; }

    const { data } = await supabase
      .from('owners')
      .select('first_name, last_name')
      .eq('supabase_uid', authUser.id)
      .single();

    setUser({
      userId: authUser.id,
      full_name: data ? `${data.first_name} ${data.last_name}` : authUser.email ?? 'Owner',
      role: 'Owner',
    });
  }
  fetchUser();
}, [router]);

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar
          navItems={NAV_ITEMS}
          onSignOut={async () => {
            await supabase.auth.signOut();
            router.push('/auth/login');
          }}
        />
      <div className="flex-1 flex flex-col md:ml-[240px]">
        <Topbar title="Dashboard" user={user} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}