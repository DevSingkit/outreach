'use client';

import useSWR from 'swr';
import { useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase-client';

/* ─── ICONS ─── */

const IconList = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);

const IconAlertTriangle = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

/* ─── STYLE ─── */

const colors = {
  primary: '#7B2CBF',
  primaryLight: '#F3E8FF',
  bg: '#EDEDED',
  surface: '#FFFFFF',
  text: '#3A3A3A',
  textMuted: '#A8A8A8',
  border: 'rgba(123,44,191,0.12)',
};

const fonts = {
  jakarta: "'Plus Jakarta Sans', sans-serif",
  vietnam: "'Be Vietnam Pro', sans-serif",
};

const cardStyle: React.CSSProperties = {
  background: colors.surface,
  borderRadius: 20,
  padding: 28,
  border: '1px solid transparent',
};

/* ─── STATUS BADGE ─── */

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    'Pending': { bg: '#FFF3CD', color: '#856404' },
    'Checked-in': { bg: '#D1ECF1', color: '#0C5460' },
    'No-show': { bg: '#F8D7DA', color: '#721C24' },
  };

  const s = map[status] ?? { bg: '#E2E3E5', color: '#383D41' };

  return (
    <span style={{
      padding: '4px 10px',
      borderRadius: 20,
      background: s.bg,
      color: s.color,
      fontSize: 12,
      fontFamily: fonts.vietnam,
    }}>
      {status}
    </span>
  );
}

/* ─── PAGE ─── */

export default function QueuePage() {
  const { data: events } = useSWR('events', async () => {
  const { data } = await supabase.from('events').select('*');
  return data;
});

  const activeEvent = events?.find(
    (e) => e.status === 'Ongoing' || e.status === 'Open'
  );

  const { data: participants, mutate } = useSWR(
  activeEvent ? `queue-${activeEvent.event_id}` : null,
  async () => {
    const { data } = await supabase
      .from('registrations')
      .select('*, owners(*), registration_pets(*, pets(*))')
      .eq('event_id', activeEvent!.event_id);
    return data;
  }
);


  /* realtime refresh */
  useEffect(() => {
  if (!activeEvent) return;

  const channel = supabase
    .channel(`event-${activeEvent.event_id}`)
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'registrations' }, () => mutate())
    .subscribe();

  return () => { supabase.removeChannel(channel); };
}, [activeEvent, mutate]);


    const checkedIn = participants?.filter((p: { checkin_status: string }) => p.checkin_status === 'Checked-in') ?? [];

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <IconList size={14} />
          <span style={{ fontFamily: fonts.jakarta, fontWeight: 700 }}>
            Staff Portal
          </span>
        </div>

        <h1 style={{ fontFamily: fonts.jakarta, fontSize: 26, margin: 0 }}>
          Queue Management
        </h1>
      </div>

      {!activeEvent && (
        <div style={{ padding: 12, background: '#FFF3CD', borderRadius: 10 }}>
          <IconAlertTriangle size={14} /> No active event.
        </div>
      )}

      {checkedIn.length === 0 && activeEvent && (
        <div style={cardStyle}>
          No checked-in participants yet.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {checkedIn.map((reg: { registration_id: string; checkin_status: string; queue_number?: number; registered_at: string }) => (
          <div key={reg.registration_id} style={cardStyle}>

            {/* HEADER */}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 700 }}>
                  Registration ID
                </div>
                <div style={{ fontSize: 12, color: colors.textMuted }}>
                  {reg.registration_id}
                </div>
              </div>

              <StatusBadge status={reg.checkin_status} />
            </div>

            {/* BODY */}
            <div style={{ marginTop: 12, fontSize: 13 }}>
              <div>Queue #: {reg.queue_number ?? 'Not assigned'}</div>
              <div>Status: {reg.checkin_status}</div>
              <div>Registered: {new Date(reg.registered_at).toLocaleString()}</div>
            </div>

            {/* ACTIONS */}
            <div style={{ marginTop: 14, display: 'flex', gap: 10 }}>
              <Link href={`/staff/billing/${reg.registration_id}`}>
                Billing
              </Link>

              <Link href={`/staff/discharge/${reg.registration_id}`}>
                Discharge
              </Link>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}