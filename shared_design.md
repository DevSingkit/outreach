All page must follow this. if they not, you can edit it to align to this design.
this is the staff/dashboard do not use the logic, just the design from fonts to color to page color.

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

const IconList = ({ size = 20 }: { size?: number }) => (
<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
<line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
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

// ─── STAT CARD ───────────────────────────────────────────────

function StatCard({ label, value, accent, isLoading }: { label: string; value: string | number; accent: string; isLoading: boolean }) {
  return (
    <div style={{
      background: colors.surface,
      borderRadius: 16,
      padding: '16px 20px',
      boxShadow: '0 4px 16px rgba(97,0,164,0.05)',
      borderLeft: `4px solid ${accent}`,
    }}>
      <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px', color: colors.textMuted, margin: '0 0 4px', fontFamily: fonts.jakarta }}>
        {label}
      </p>
      <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 36, fontWeight: 800, color: '#3A3A3A', lineHeight: 1 }}>
        {isLoading ? '—' : value}
      </div>
    </div>
  );
}

export default function StaffDashboardPage() {
  const { data: events } = useSWR('events', async () => {
    const { data } = await supabase.from('events').select('*');
    return data;
  });

  const activeEvent = events?.find((e: { status: string }) => e.status === 'Ongoing' || e.status === 'Open');

  // Overall stats across ALL registrations
  const { data: allParticipants } = useSWR(
    'all-participants-overview',
    
    async (): Promise<{ checkin_status: string; registration_pets: { reg_pet_id: string }[] }[] | null> => {
      const { data } = await supabase
        .from('registrations')
        .select('checkin_status, registration_pets(reg_pet_id)');
      return data;
    }
  );
  
  const isLoading = !events || !allParticipants;
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

  const totalRegistered = allParticipants?.length ?? 0;
  const totalCheckedIn  = allParticipants?.filter(p => p.checkin_status === 'Checked-in').length ?? 0;
  const totalPending    = allParticipants?.filter(p => p.checkin_status === 'Pending').length ?? 0;
  const totalPets       = allParticipants?.reduce((acc, p) => acc + (p.registration_pets?.length ?? 0), 0) ?? 0;

  return (
    <div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Page header */}
      <div style={{ marginBottom: 28 }}>
        {sectionLabel(<IconPaw size={12} color={colors.primary} />, 'Staff Portal')}
        <h1 style={{ fontFamily: fonts.jakarta, fontSize: 26, fontWeight: 800, color: colors.text, margin: 0 }}>Dashboard</h1>
        <p style={{ fontFamily: fonts.vietnam, fontSize: 14, color: colors.textSoft, marginTop: 6 }}>Select an event to manage.</p>
      </div>

      {/* Overall stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 32 }}>
        <StatCard label="Total Registered" value={totalRegistered} accent={colors.primary} isLoading={isLoading}/>
        <StatCard label="Checked In"        value={totalCheckedIn}  accent="#28A745" isLoading={isLoading}/>
        <StatCard label="Pending"           value={totalPending}    accent="#FFC107" isLoading={isLoading}/>
        <StatCard label="Total Pets"        value={totalPets}       accent="#17A2B8" isLoading={isLoading}/>
      </div>

      {/* Event list */}
      
      <div style={{ marginBottom: 12 }}>
        {isLoading && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
              <span style={{ width: 24, height: 24, border: '3px solid rgba(123,44,191,0.15)', borderTop: '3px solid #7B2CBF', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
            </div>
          )}
        {sectionLabel(<IconList size={12} />, 'Events')}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {!events && (
          <p style={{ fontFamily: fonts.vietnam, color: colors.textMuted, fontSize: 14 }}>Loading events...</p>
        )}
        {events?.length === 0 && (
          <p style={{ fontFamily: fonts.vietnam, color: colors.textMuted, fontSize: 14 }}>No events found.</p>
        )}
        {events?.map((event: { event_id: string; event_name: string; event_date: string; status: string; location_address: string; max_capacity?: number; registered_count?: number }) => (
          <Link
            key={event.event_id}
            href={`/staff/dashboard/${event.event_id}`}
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '20px 24px',
              borderRadius: 20,
              background: colors.surface,
              boxShadow: '0 12px 40px rgba(97,0,164,0.04)',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontFamily: fonts.jakarta, fontWeight: 700, fontSize: 15, color: colors.text }}>{event.event_name}</span>
              <span style={{ fontFamily: fonts.vietnam, fontSize: 12, color: colors.textMuted }}>
                {new Date(event.event_date).toLocaleDateString('en-PH', { dateStyle: 'medium' })} · {event.location_address}
              </span>
              {event.max_capacity && (
                <span style={{ fontFamily: fonts.vietnam, fontSize: 12, color: colors.textSoft }}>
                  {event.registered_count ?? 0} / {event.max_capacity} registered
                </span>
              )}
            </div>
            <StatusBadge status={event.status} />
          </Link>
        ))}
      </div>
    </div>
  );
}