'use client';

import useSWR from 'swr';
import Link from 'next/link';
import { supabase } from '@/lib/supabase-client';

// ─── Icons ────────────────────────────────────────────────────────────────────
const IconPaw = ({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 2C10.34 2 9 3.34 9 5s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm-5 4C5.34 6 4 7.34 4 9s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm10 0c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zM5.5 14C3.57 14 2 15.57 2 17.5S3.57 21 5.5 21c.96 0 1.83-.38 2.48-1H16c.65.62 1.52 1 2.48 1C20.43 21 22 19.43 22 17.5S20.43 14 18.48 14c-1.5 0-2.78.87-3.43 2.13C14.57 16.05 13.82 16 13 16h-2c-.82 0-1.57.05-2.05.13C8.3 14.87 7.02 14 5.5 14z" />
  </svg>
);
const IconChevronRight = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

// ─── Design Tokens ────────────────────────────────────────────────────────────
const colors = {
  primary:     '#7B2CBF',
  primaryLight:'#F3E8FF',
  bg:          '#EDEDED',
  surface:     '#FFFFFF',
  text:        '#3A3A3A',
  textSoft:    '#6B6B6B',
  textMuted:   '#A8A8A8',
};
const fonts = {
  jakarta: "'Plus Jakarta Sans', sans-serif",
  vietnam: "'Be Vietnam Pro', sans-serif",
};

// ─── Status Badge ─────────────────────────────────────────────────────────────
const statusMap: Record<string, { bg: string; color: string }> = {
  Pending:      { bg: '#FFF3CD', color: '#856404' },
  'Checked-in': { bg: '#D1ECF1', color: '#0C5460' },
  'No-show':    { bg: '#F8D7DA', color: '#721C24' },
};
function StatusBadge({ status }: { status: string }) {
  const s = statusMap[status] ?? { bg: '#E2E3E5', color: '#383D41' };
  return (
    <span style={{ padding: '3px 11px', borderRadius: 100, fontSize: 11, fontWeight: 600, background: s.bg, color: s.color, fontFamily: fonts.vietnam, whiteSpace: 'nowrap' }}>
      {status}
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function OwnerRegistrationsPage() {
  const { data: registrations, isLoading } = useSWR('my-regs', async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    const { data: owner } = await supabase.from('owners').select('owner_id').eq('supabase_uid', user.id).single();
    if (!owner) return [];
    const { data } = await supabase.from('registrations').select('*, events(*)').eq('owner_id', owner.owner_id);
    return data;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Header */}
      <div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px', color: colors.primary, marginBottom: 10, fontFamily: fonts.jakarta }}>
          <IconPaw size={12} color={colors.primary} /> Pet Owner Portal
        </div>
        <h1 style={{ fontFamily: fonts.jakarta, fontSize: 26, fontWeight: 800, color: colors.text, margin: 0 }}>My Registrations</h1>
        <p style={{ fontFamily: fonts.vietnam, fontSize: 14, color: colors.textSoft, marginTop: 6 }}>All your past and upcoming event registrations.</p>
      </div>

      {isLoading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
          <span style={{ width: 24, height: 24, border: '3px solid rgba(123,44,191,0.15)', borderTop: `3px solid ${colors.primary}`, borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
        </div>
      )}

      {!isLoading && registrations?.length === 0 && (
        <div style={{ background: colors.surface, borderRadius: 20, padding: '48px 24px', textAlign: 'center', boxShadow: '0 12px 40px rgba(97,0,164,0.04)' }}>
          <IconPaw size={40} color={colors.textMuted} />
          <p style={{ fontFamily: fonts.vietnam, color: colors.textMuted, marginTop: 12 }}>No registrations yet.</p>
          <Link href="/events" style={{ display: 'inline-block', marginTop: 12, padding: '10px 24px', background: 'linear-gradient(135deg, #7B2CBF, #A66DD4)', color: 'white', borderRadius: 10, fontSize: 14, fontWeight: 700, fontFamily: fonts.jakarta, textDecoration: 'none' }}>
            Browse Events
          </Link>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {registrations?.map((reg: {
          registration_id: string;
          events?: { event_name: string; event_date: string; location_address: string };
          checkin_status: string;
          queue_number?: number;
        }) => (
          <Link
            key={reg.registration_id}
            href={`/owner/registrations/${reg.registration_id}`}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: colors.surface, borderRadius: 20, padding: '20px 24px', boxShadow: '0 12px 40px rgba(97,0,164,0.04)', textDecoration: 'none', transition: 'all 0.2s' }}
          >
            <div style={{ flex: 1, minWidth: 0, paddingRight: 16 }}>
              <p style={{ fontFamily: fonts.jakarta, fontSize: 15, fontWeight: 700, color: colors.text, margin: 0 }}>
                {reg.events?.event_name ?? 'Event'}
              </p>
              <p style={{ fontFamily: fonts.vietnam, fontSize: 12, color: colors.textMuted, margin: '4px 0 10px' }}>
                {reg.events?.event_date ? new Date(reg.events.event_date).toLocaleDateString('en-PH', { dateStyle: 'medium' }) : ''}
                {reg.queue_number ? ` · Queue #${reg.queue_number}` : ''}
              </p>
              <StatusBadge status={reg.checkin_status} />
            </div>
            <span style={{ color: colors.textMuted, flexShrink: 0 }}>
              <IconChevronRight size={18} />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}