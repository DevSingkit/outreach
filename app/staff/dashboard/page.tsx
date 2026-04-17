// staff/dashboard/page.tsx
'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';
import useSWR from 'swr';
import { supabase } from '@/lib/supabase-client';

const IconPaw = ({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) => (
<svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
<path d="M12 2C10.34 2 9 3.34 9 5s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm-5 4C5.34 6 4 7.34 4 9s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm10 0c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zM5.5 14C3.57 14 2 15.57 2 17.5S3.57 21 5.5 21c.96 0 1.83-.38 2.48-1H16c.65.62 1.52 1 2.48 1C20.43 21 22 19.43 22 17.5S20.43 14 18.48 14c-1.5 0-2.78.87-3.43 2.13C14.57 16.05 13.82 16 13 16h-2c-.82 0-1.57.05-2.05.13C8.3 14.87 7.02 14 5.5 14z" />
</svg>
);
 
const IconQr = ({ size = 20 }: { size?: number }) => (
<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
<rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="5" y="5" width="3" height="3" /><rect x="16" y="5" width="3" height="3" /><rect x="16" y="16" width="3" height="3" /><rect x="5" y="16" width="3" height="3" />
</svg>
);
const IconList = ({ size = 20 }: { size?: number }) => (
<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
<line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
</svg>
);
const IconUsers = ({ size = 20 }: { size?: number }) => (
<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
</svg>
);
const IconActivity = ({ size = 20 }: { size?: number }) => (
<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
<polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
</svg>
);
// ─── SHARED STYLE TOKENS ────────────────────────────────────
 
const colors = {
primary: '#7B2CBF',
primaryHover: '#A66DD4',
primaryLight: '#F3E8FF',
secondary: '#7ED957',
secondaryDark: '#5BB832',
secondaryLight: '#E8F8E0',
bg: '#EDEDED',
surface: '#FFFFFF',
text: '#3A3A3A',
textSoft: '#6B6B6B',
textMuted: '#A8A8A8',
border: 'rgba(123,44,191,0.12)',
error: '#C0392B',
};
 
const fonts = {
jakarta: "'Plus Jakarta Sans', sans-serif",
vietnam: "'Be Vietnam Pro', sans-serif",
};

const cardStyle: React.CSSProperties = {
background: colors.surface,
borderRadius: 20,
padding: 28,
boxShadow: '0 12px 40px rgba(97,0,164,0.04)',
border: '1px solid transparent',
};

 
const sectionLabel = (icon: React.ReactNode, text: string) => (
<div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px', color: colors.primary, marginBottom: 10, fontFamily: fonts.jakarta }}>
{icon} {text}
</div>
);
 
// ─── STATUS BADGE ────────────────────────────────────────────
 
const statusMap: Record<string, { bg: string; color: string }> = {
pending: { bg: '#FFF3CD', color: '#856404' },
'checked-in': { bg: '#D1ECF1', color: '#0C5460' },
'Checked-in': { bg: '#D1ECF1', color: '#0C5460' },
accepted: { bg: '#D4EDDA', color: '#155724' },
Accepted: { bg: '#D4EDDA', color: '#155724' },
rejected: { bg: '#F8D7DA', color: '#721C24' },
Rejected: { bg: '#F8D7DA', color: '#721C24' },
completed: { bg: '#7B2CBF', color: '#FFFFFF' },
Completed: { bg: '#7B2CBF', color: '#FFFFFF' },
paid: { bg: '#7ED957', color: '#1A4D00' },
Paid: { bg: '#7ED957', color: '#1A4D00' },
waived: { bg: '#E2D9F3', color: '#4A1D96' },
Waived: { bg: '#E2D9F3', color: '#4A1D96' },
unpaid: { bg: '#FFF3CD', color: '#856404' },
Unpaid: { bg: '#FFF3CD', color: '#856404' },
open: { bg: '#D4EDDA', color: '#155724' },
Open: { bg: '#D4EDDA', color: '#155724' },
ongoing: { bg: '#D1ECF1', color: '#0C5460' },
Ongoing: { bg: '#D1ECF1', color: '#0C5460' },
closed: { bg: '#F8D7DA', color: '#721C24' },
};
 
function StatusBadge({ status }: { status: string }) {
const s = statusMap[status] ?? { bg: '#E2E3E5', color: '#383D41' };
return (
<span style={{ padding: '3px 11px', borderRadius: 100, fontSize: 11, fontWeight: 600, background: s.bg, color: s.color, fontFamily: fonts.vietnam, whiteSpace: 'nowrap' }}>
{status}
</span>
);
}
 
export default function StaffDashboardPage() {
  const { data: events } = useSWR('events', async () => {
  const { data } = await supabase.from('events').select('*');
  return data;
});
  const activeEvent = events?.find((e: { status: string }) => e.status === 'Ongoing' || e.status === 'Open');
  const { data: participants, mutate } = useSWR(
  activeEvent ? `checkin-event-${activeEvent.event_id}` : null,
  async () => {
    const { data } = await supabase
      .from('registrations')
      .select('*, owners(*), registration_pets(*, pets(*))')
      .eq('event_id', activeEvent!.event_id);
    return data;
  }
);
 
  useEffect(() => {
    if (!activeEvent) return;
    const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    const channel = supabase.channel(`event-${activeEvent.event_id}-queue`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'registrations' }, () => mutate())
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'registrations' }, () => mutate())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [activeEvent?.event_id]);
 
  const checkedInCount = participants?.filter((p: { checkin_status: string }) => p.checkin_status === 'Checked-in').length ?? 0;
  const slotsLeft = activeEvent 
  ? (activeEvent.max_capacity ?? 0) - (participants?.length ?? 0) 
  : 0;
 
  const stats = [
    { icon: <IconUsers size={22} />, label: 'Registered', value: participants?.length ?? '—', color: colors.primary },
    { icon: <IconActivity size={22} />, label: 'Checked-in', value: checkedInCount, color: '#0C5460' },
    { icon: <IconUsers size={22} />, label: 'Capacity', value: activeEvent?.max_capacity ?? '—', color: colors.primary },
    { icon: <IconActivity size={22} />, label: 'Slots Left', value: activeEvent ? slotsLeft : '—', color: slotsLeft < 5 ? colors.error : colors.secondaryDark },
  ];
 
  const actions = [
    { href: '/staff/checkin', icon: <IconQr size={26} />, title: 'Check-in', desc: 'Scan QR or walk-in', primary: true },
    { href: '/staff/queue', icon: <IconList size={26} />, title: 'Queue', desc: 'Manage pet flow', primary: false },
    { href: '/staff/participants', icon: <IconUsers size={26} />, title: 'Participants', desc: 'View all registrants', primary: false },
  ];
 
  return (
    <div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
 
      {/* Page header */}
      <div style={{ marginBottom: 32 }}>
        {sectionLabel(<IconPaw size={12} color={colors.primary} />, 'Staff Portal')}
        <h1 style={{ fontFamily: fonts.jakarta, fontSize: 26, fontWeight: 800, color: colors.text, margin: 0 }}>Dashboard</h1>
        {activeEvent && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
            <span style={{ fontFamily: fonts.vietnam, fontSize: 14, color: colors.textSoft }}>Active event:</span>
            <span style={{ fontFamily: fonts.jakarta, fontSize: 14, fontWeight: 700, color: colors.text }}>{activeEvent.event_name}</span>
            <StatusBadge status={activeEvent.status} />
          </div>
        )}
      </div>
 
      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        {stats.map(({ icon, label, value, color }) => (
          <div key={label} style={{ ...cardStyle, padding: 24 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: colors.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center', color, marginBottom: 16 }}>
              {icon}
            </div>
            <p style={{ fontFamily: fonts.jakarta, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.2px', color: colors.textMuted, margin: '0 0 4px' }}>{label}</p>
            <p style={{ fontFamily: fonts.jakarta, fontSize: 32, fontWeight: 800, color: colors.text, margin: 0, lineHeight: 1 }}>{value}</p>
          </div>
        ))}
      </div>
 
      {/* Quick actions */}
      <div style={{ marginBottom: 12 }}>
        {sectionLabel(<IconList size={12} />, 'Quick Actions')}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {actions.map(({ href, icon, title, desc, primary }) => (
          <Link key={href} href={href} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 18, padding: '22px 24px', borderRadius: 20, background: primary ? 'linear-gradient(135deg,#7B2CBF,#A66DD4)' : colors.surface, boxShadow: '0 12px 40px rgba(97,0,164,0.06)', transition: 'all 0.2s', color: primary ? 'white' : colors.text }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: primary ? 'rgba(255,255,255,0.15)' : colors.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center', color: primary ? 'white' : colors.primary, flexShrink: 0 }}>
              {icon}
            </div>
            <div>
              <p style={{ fontFamily: fonts.jakarta, fontWeight: 700, fontSize: 15, margin: '0 0 2px', color: primary ? 'white' : colors.text }}>{title}</p>
              <p style={{ fontFamily: fonts.vietnam, fontSize: 12, margin: 0, color: primary ? 'rgba(255,255,255,0.75)' : colors.textMuted }}>{desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}