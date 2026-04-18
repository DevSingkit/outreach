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
const IconClipboard = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
  </svg>
);
const IconCalendar = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const IconMessage = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
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
  secondary:   '#7ED957',
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
  Pending:    { bg: '#FFF3CD', color: '#856404' },
  'Checked-in': { bg: '#D1ECF1', color: '#0C5460' },
  'No-show':  { bg: '#F8D7DA', color: '#721C24' },
};
function StatusBadge({ status }: { status: string }) {
  const s = statusMap[status] ?? { bg: '#E2E3E5', color: '#383D41' };
  return (
    <span style={{ padding: '3px 11px', borderRadius: 100, fontSize: 11, fontWeight: 600, background: s.bg, color: s.color, fontFamily: fonts.vietnam, whiteSpace: 'nowrap' }}>
      {status}
    </span>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon, label, children, accent }: { icon: React.ReactNode; label: string; children: React.ReactNode; accent: string }) {
  return (
    <div style={{ background: colors.surface, borderRadius: 16, padding: '20px 24px', boxShadow: '0 4px 16px rgba(97,0,164,0.05)', borderLeft: `4px solid ${accent}`, display: 'flex', alignItems: 'flex-start', gap: 16 }}>
      <div style={{ width: 40, height: 40, borderRadius: 12, background: colors.primaryLight, color: colors.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px', color: colors.textMuted, margin: '0 0 6px', fontFamily: fonts.jakarta }}>
          {label}
        </p>
        {children}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function OwnerDashboardPage() {
  const { data: registrations, isLoading } = useSWR('my-regs', async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    const { data: owner } = await supabase.from('owners').select('owner_id').eq('supabase_uid', user.id).single();
    if (!owner) return [];
    const { data } = await supabase.from('registrations').select('*, events(*)').eq('owner_id', owner.owner_id);
    return data;
  });

  const total    = registrations?.length ?? 0;
  const upcoming = registrations?.find((r: { checkin_status: string }) => r.checkin_status === 'Pending');
  const activeChatbot = registrations
    ?.flatMap((r: { chatbot_sessions?: { session_token: string; expires_at: string }[] }) => r.chatbot_sessions ?? [])
    .find((s: { expires_at: string }) => new Date(s.expires_at) > new Date());

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Header */}
      <div style={{ marginBottom: 4 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px', color: colors.primary, marginBottom: 10, fontFamily: fonts.jakarta }}>
          <IconPaw size={12} color={colors.primary} /> Pet Owner Portal
        </div>
        <h1 style={{ fontFamily: fonts.jakarta, fontSize: 26, fontWeight: 800, color: colors.text, margin: 0 }}>Dashboard</h1>
        <p style={{ fontFamily: fonts.vietnam, fontSize: 14, color: colors.textSoft, marginTop: 6 }}>Welcome back. Here's a summary of your activity.</p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
        <StatCard icon={<IconClipboard size={20} />} label="Total Registrations" accent={colors.primary}>
          <p style={{ fontFamily: fonts.jakarta, fontSize: 36, fontWeight: 800, color: colors.text, lineHeight: 1, margin: 0 }}>
            {isLoading ? '—' : total}
          </p>
        </StatCard>

        <StatCard icon={<IconCalendar size={20} />} label="Next Event" accent="#28A745">
          {upcoming ? (
            <p style={{ fontFamily: fonts.vietnam, fontSize: 14, fontWeight: 600, color: colors.text, margin: 0 }}>
              {(upcoming as { events?: { event_name: string } }).events?.event_name ?? 'Upcoming Event'}
            </p>
          ) : (
            <p style={{ fontFamily: fonts.vietnam, fontSize: 14, color: colors.textMuted, margin: 0 }}>None scheduled</p>
          )}
        </StatCard>

        <StatCard icon={<IconMessage size={20} />} label="Post-op Chatbot" accent="#17A2B8">
          {activeChatbot ? (
            <Link href={`/chatbot/${activeChatbot.session_token}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 14, fontWeight: 600, color: colors.primary, fontFamily: fonts.vietnam, textDecoration: 'none' }}>
              Open Chatbot <IconChevronRight size={14} />
            </Link>
          ) : (
            <p style={{ fontFamily: fonts.vietnam, fontSize: 14, color: colors.textMuted, margin: 0 }}>No active session</p>
          )}
        </StatCard>
      </div>

      {/* Recent Registrations */}
      <div style={{ background: colors.surface, borderRadius: 20, padding: '24px', boxShadow: '0 12px 40px rgba(97,0,164,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontFamily: fonts.jakarta, fontSize: 16, fontWeight: 700, color: colors.text, margin: 0 }}>Recent Registrations</h2>
          <Link href="/owner/registrations" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 13, color: colors.primary, fontFamily: fonts.vietnam, textDecoration: 'none', fontWeight: 600 }}>
            View all <IconChevronRight size={14} />
          </Link>
        </div>

        {isLoading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
            <span style={{ width: 24, height: 24, border: '3px solid rgba(123,44,191,0.15)', borderTop: `3px solid ${colors.primary}`, borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
          </div>
        )}

        {!isLoading && registrations?.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <IconPaw size={36} color={colors.textMuted} />
            <p style={{ fontFamily: fonts.vietnam, color: colors.textMuted, marginTop: 12 }}>No registrations yet.</p>
            <Link href="/events" style={{ display: 'inline-block', marginTop: 8, fontSize: 14, color: colors.primary, fontFamily: fonts.vietnam, textDecoration: 'none', fontWeight: 600 }}>
              Browse open events →
            </Link>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {registrations?.slice(0, 5).map((reg: {
            registration_id: string;
            events?: { event_name: string; event_date: string };
            checkin_status: string;
            queue_number?: number;
          }) => (
            <Link
              key={reg.registration_id}
              href={`/owner/registrations/${reg.registration_id}`}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderRadius: 12, background: colors.bg, textDecoration: 'none', transition: 'background 0.15s' }}
            >
              <div>
                <p style={{ fontFamily: fonts.jakarta, fontSize: 14, fontWeight: 700, color: colors.text, margin: 0 }}>
                  {reg.events?.event_name ?? 'Event'}
                </p>
                <p style={{ fontFamily: fonts.vietnam, fontSize: 12, color: colors.textMuted, margin: '4px 0 0' }}>
                  {reg.events?.event_date ? new Date(reg.events.event_date).toLocaleDateString('en-PH', { dateStyle: 'medium' }) : ''}
                  {reg.queue_number ? ` · Queue #${reg.queue_number}` : ''}
                </p>
              </div>
              <StatusBadge status={reg.checkin_status} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}