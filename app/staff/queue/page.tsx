'use client';

import useSWR from 'swr';
import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { supabase } from '@/lib/supabase-client';
import Link from 'next/link';

/* ─── ICONS ─── */

const IconList = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);

const IconCheck = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconChevronDown = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const IconSearch = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const IconUsers = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IconStethoscope = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
    <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" /><circle cx="20" cy="10" r="2" />
  </svg>
);

const IconScissors = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" />
    <line x1="20" y1="4" x2="8.12" y2="15.88" /><line x1="14.47" y1="14.48" x2="20" y2="20" /><line x1="8.12" y1="8.12" x2="12" y2="12" />
  </svg>
);

const IconCreditCard = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);

const IconLogOut = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const IconPaw = ({ size = 13 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C10.34 2 9 3.34 9 5s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm-5 4C5.34 6 4 7.34 4 9s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm10 0c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zM5.5 14C3.57 14 2 15.57 2 17.5S3.57 21 5.5 21c.96 0 1.83-.38 2.48-1H16c.65.62 1.52 1 2.48 1C20.43 21 22 19.43 22 17.5S20.43 14 18.48 14c-1.5 0-2.78.87-3.43 2.13C14.57 16.05 13.82 16 13 16h-2c-.82 0-1.57.05-2.05.13C8.3 14.87 7.02 14 5.5 14z" />
  </svg>
);

/* ─── STYLE TOKENS ─── */

const colors = {
  primary: '#7B2CBF',
  primaryLight: '#F3E8FF',
  primaryHover: '#A66DD4',
  secondary: '#7ED957',
  secondaryLight: '#E8F8E0',
  bg: '#EDEDED',
  surface: '#FFFFFF',
  text: '#3A3A3A',
  textSoft: '#6B6B6B',
  textMuted: '#A8A8A8',
  border: 'rgba(123,44,191,0.12)',
};

const fonts = {
  jakarta: "'Plus Jakarta Sans', sans-serif",
  vietnam: "'Be Vietnam Pro', sans-serif",
};

/* ─── TYPES ─── */

type RegistrationPet = {
  reg_pet_id: string;
  procedure_status: string;
  pet: { pet_name: string; species: string } | null;
};

type Registration = {
  registration_id: string;
  queue_number: number | null;
  checkin_status: string;
  checkin_timestamp: string | null;
  registered_at: string;
  owners: { first_name: string; last_name: string } | null;
  registration_pets: RegistrationPet[];
};

type Event = {
  event_id: string;
  event_name: string;
  event_date: string;
  status: string;
  location_address: string;
};

/* ─── STATUS BADGE ─── */

const statusMap: Record<string, { bg: string; color: string }> = {
  'Pending':    { bg: '#FFF3CD', color: '#856404' },
  'Checked-in': { bg: '#D1ECF1', color: '#0C5460' },
  'No-show':    { bg: '#F8D7DA', color: '#721C24' },
  'Completed':  { bg: '#7B2CBF', color: '#FFFFFF' },
  'Paid':       { bg: '#7ED957', color: '#1A4D00' },
  'Waived':     { bg: '#E2D9F3', color: '#4A1D96' },
  'Rejected':   { bg: '#F8D7DA', color: '#721C24' },
  'Accepted':   { bg: '#D4EDDA', color: '#155724' },
  'Open':       { bg: '#D4EDDA', color: '#155724' },
  'Ongoing':    { bg: '#D1ECF1', color: '#0C5460' },
  'Closed':     { bg: '#F8D7DA', color: '#721C24' },
  'Draft':      { bg: '#E2E3E5', color: '#383D41' },
};

function StatusBadge({ status }: { status: string }) {
  const s = statusMap[status] ?? { bg: '#E2E3E5', color: '#383D41' };
  return (
    <span style={{ padding: '3px 11px', borderRadius: 100, fontSize: 11, fontWeight: 600, background: s.bg, color: s.color, fontFamily: fonts.vietnam, whiteSpace: 'nowrap' }}>
      {status}
    </span>
  );
}

/* ─── CONFIRM BUTTON ─── */

function ConfirmCheckinButton({ registration, onSuccess }: { registration: Registration; onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(registration.checkin_status === 'Checked-in');

  async function handleConfirm() {
    setLoading(true);
    const { error } = await supabase
      .from('registrations')
      .update({ checkin_status: 'Checked-in', checkin_timestamp: new Date().toISOString() })
      .eq('registration_id', registration.registration_id);
    setLoading(false);
    if (!error) { setDone(true); onSuccess(); }
  }

  if (done) {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 10, background: '#D1ECF1', color: '#0C5460', fontFamily: fonts.jakarta, fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>
        <IconCheck size={12} /> Checked In
      </span>
    );
  }

  return (
    <button onClick={handleConfirm} disabled={loading} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 10, background: loading ? colors.primaryLight : colors.primary, color: loading ? colors.primary : '#fff', fontFamily: fonts.jakarta, fontSize: 12, fontWeight: 600, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>
      <IconCheck size={12} />
      {loading ? 'Confirming...' : 'Confirm Check-in'}
    </button>
  );
}

/* ─── PET ACTION ROW (expanded) ─── */

function PetActionsRow({ reg, onClose }: { reg: Registration; onClose: () => void }) {
  const isCheckedIn = reg.checkin_status === 'Checked-in';

  return (
    <tr>
      <td colSpan={6} style={{ padding: '0 20px 16px', background: colors.primaryLight }}>
        <div style={{ borderRadius: 14, background: colors.surface, padding: '16px 20px', boxShadow: '0 4px 16px rgba(97,0,164,0.06)' }}>

          {/* Per-pet examine + procedure links */}
          {reg.registration_pets.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <p style={{ fontFamily: fonts.jakarta, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px', color: colors.textMuted, margin: '0 0 4px' }}>
                Pets
              </p>
              {reg.registration_pets.map(rp => (
                <div key={rp.reg_pet_id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 10, background: colors.bg, gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: colors.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.primary, flexShrink: 0 }}>
                      <IconPaw size={13} />
                    </div>
                    <div>
                      <p style={{ fontFamily: fonts.jakarta, fontSize: 13, fontWeight: 700, color: colors.text, margin: 0 }}>
                        {rp.pet?.pet_name ?? 'Unknown Pet'}
                      </p>
                      <p style={{ fontFamily: fonts.vietnam, fontSize: 11, color: colors.textMuted, margin: 0 }}>
                        {rp.pet?.species ?? '—'}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <StatusBadge status={rp.procedure_status} />
                    <Link
                      href={`/staff/examination/${rp.reg_pet_id}`}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 10, background: colors.primaryLight, color: colors.primary, fontFamily: fonts.jakarta, fontSize: 12, fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}
                    >
                      <IconStethoscope size={13} /> Examine
                    </Link>
                    <Link
                      href={`/staff/procedure/${rp.reg_pet_id}`}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 10, background: '#E8F8E0', color: '#2D6A00', fontFamily: fonts.jakarta, fontSize: 12, fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}
                    >
                      <IconScissors size={13} /> Procedure
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontFamily: fonts.vietnam, fontSize: 13, color: colors.textMuted, margin: 0 }}>No pets registered.</p>
          )}

          {/* Registration-level actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14, paddingTop: 14, borderTop: `1px solid ${colors.border}` }}>
            <p style={{ fontFamily: fonts.jakarta, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px', color: colors.textMuted, margin: 0, marginRight: 4 }}>
              Registration
            </p>
            <Link
              href={`/staff/billing/${reg.registration_id}`}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 14px', borderRadius: 10, background: colors.primary, color: '#fff', fontFamily: fonts.jakarta, fontSize: 12, fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}
            >
              <IconCreditCard size={13} /> Billing
            </Link>
            <Link
              href={`/staff/discharge/${reg.registration_id}`}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 14px', borderRadius: 10, background: '#FFF3CD', color: '#856404', fontFamily: fonts.jakarta, fontSize: 12, fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}
            >
              <IconLogOut size={13} /> Discharge
            </Link>
          </div>
        </div>
      </td>
    </tr>
  );
}

/* ─── EVENT SECTION ─── */

function EventSection({ event, search }: { event: Event; search: string }) {
  const [open, setOpen] = useState(true);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const { data: participants, mutate, isLoading } = useSWR(
    `queue-all-${event.event_id}`,
    async () => {
      const { data } = await supabase
        .from('registrations')
        .select('*, owners(*), registration_pets(*, pet:pets(*))')
        .eq('event_id', event.event_id)
        .order('queue_number', { ascending: true, nullsFirst: false });
      return data as Registration[];
    }
  );

  useEffect(() => {
    const client = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const channel = client
      .channel(`queue-all-event-${event.event_id}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'registrations' }, () => mutate())
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'registrations' }, () => mutate())
      .subscribe();
    return () => { client.removeChannel(channel); };
  }, [event.event_id, mutate]);

  const filtered = participants?.filter((p) => {
    const name = `${p.owners?.first_name ?? ''} ${p.owners?.last_name ?? ''}`.toLowerCase();
    const q = `#${p.queue_number}`;
    return name.includes(search.toLowerCase()) || q.includes(search.toLowerCase());
  }) ?? [];

  const checkedInCount = participants?.filter(p => p.checkin_status === 'Checked-in').length ?? 0;
  const totalCount = participants?.length ?? 0;

  function toggleRow(id: string) {
    setExpandedRow(prev => prev === id ? null : id);
  }

  return (
    <div style={{ background: colors.surface, borderRadius: 20, boxShadow: '0 12px 40px rgba(97,0,164,0.04)', overflow: 'hidden', marginBottom: 16 }}>

      {/* Event header */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', background: 'transparent', border: 'none', cursor: 'pointer', borderBottom: open ? `1.5px solid ${colors.border}` : 'none' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left' }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: colors.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.primary, flexShrink: 0 }}>
            <IconUsers size={18} />
          </div>
          <div>
            <p style={{ fontFamily: fonts.jakarta, fontSize: 14, fontWeight: 700, color: colors.text, margin: 0 }}>{event.event_name}</p>
            <p style={{ fontFamily: fonts.vietnam, fontSize: 12, color: colors.textMuted, margin: '2px 0 0' }}>
              {new Date(event.event_date).toLocaleDateString('en-PH', { dateStyle: 'medium' })} · {event.location_address}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <StatusBadge status={event.status} />
          {!isLoading && (
            <span style={{ fontFamily: fonts.vietnam, fontSize: 12, color: colors.textSoft }}>
              {checkedInCount}/{totalCount} checked in
            </span>
          )}
          <span style={{ color: colors.textMuted, display: 'flex', alignItems: 'center', transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>
            <IconChevronDown size={16} />
          </span>
        </div>
      </button>

      {/* Table */}
      {open && (
        <>
          {isLoading && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 36 }}>
              <span style={{ width: 22, height: 22, border: '3px solid rgba(123,44,191,0.15)', borderTop: '3px solid #7B2CBF', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
            </div>
          )}

          {!isLoading && filtered.length === 0 && (
            <p style={{ fontFamily: fonts.vietnam, fontSize: 13, color: colors.textMuted, textAlign: 'center', padding: '28px 0', margin: 0 }}>
              No participants found.
            </p>
          )}

          {!isLoading && filtered.length > 0 && (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Queue #', 'Owner Name', 'Pets', 'Status', 'Check-in Time', 'Actions'].map((h) => (
                    <th key={h} style={{ textAlign: 'left', padding: '12px 20px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px', color: colors.textMuted, fontFamily: fonts.jakarta }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((reg) => {
                  const isExpanded = expandedRow === reg.registration_id;
                  return (
                    <>
                      <tr
                        key={reg.registration_id}
                        style={{ borderTop: `1px solid ${colors.border}`, background: isExpanded ? colors.primaryLight : 'transparent', transition: 'background 0.15s', cursor: 'pointer' }}
                        onMouseEnter={e => { if (!isExpanded) e.currentTarget.style.background = colors.primaryLight; }}
                        onMouseLeave={e => { if (!isExpanded) e.currentTarget.style.background = 'transparent'; }}
                      >
                        <td style={{ padding: '13px 20px', fontFamily: fonts.jakarta, fontSize: 13, fontWeight: 700, color: colors.primary }}>
                          {reg.queue_number != null ? `#${reg.queue_number}` : '—'}
                        </td>
                        <td style={{ padding: '13px 20px', fontFamily: fonts.vietnam, fontSize: 13, fontWeight: 600, color: colors.text }}>
                          {reg.owners ? `${reg.owners.first_name} ${reg.owners.last_name}` : '—'}
                        </td>
                        <td style={{ padding: '13px 20px', fontFamily: fonts.vietnam, fontSize: 13, color: colors.textSoft }}>
                          {reg.registration_pets?.length > 0
                            ? reg.registration_pets.map(rp => rp.pet?.pet_name).join(', ')
                            : '—'}
                        </td>
                        <td style={{ padding: '13px 20px' }}>
                          <StatusBadge status={reg.checkin_status} />
                        </td>
                        <td style={{ padding: '13px 20px', fontFamily: fonts.vietnam, fontSize: 13, color: colors.textSoft }}>
                          {reg.checkin_timestamp
                            ? new Date(reg.checkin_timestamp).toLocaleTimeString('en-PH', { timeStyle: 'short' })
                            : '—'}
                        </td>
                        <td style={{ padding: '13px 20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <ConfirmCheckinButton registration={reg} onSuccess={mutate} />
                            <button
                              onClick={() => toggleRow(reg.registration_id)}
                              style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 10, background: isExpanded ? colors.primary : colors.bg, color: isExpanded ? '#fff' : colors.textSoft, fontFamily: fonts.jakarta, fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
                            >
                              <IconStethoscope size={13} />
                              {isExpanded ? 'Close' : 'Examine'}
                              <span style={{ display: 'inline-flex', transition: 'transform 0.2s', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                                <IconChevronDown size={12} />
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expanded pet actions row */}
                      {isExpanded && (
                        <PetActionsRow
                          key={`expand-${reg.registration_id}`}
                          reg={reg}
                          onClose={() => setExpandedRow(null)}
                        />
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}

/* ─── PAGE ─── */

export default function QueuePage() {
  const [search, setSearch] = useState('');

  const { data: events, isLoading: eventsLoading } = useSWR('events', async () => {
    const { data } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: false });
    return data as Event[];
  });

  return (
    <div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px', color: colors.primary, marginBottom: 10, fontFamily: fonts.jakarta }}>
          <IconList size={12} /> Staff Portal
        </div>
        <h1 style={{ fontFamily: fonts.jakarta, fontSize: 26, fontWeight: 800, color: colors.text, margin: 0 }}>Queue Management</h1>
        <p style={{ fontFamily: fonts.vietnam, fontSize: 14, color: colors.textSoft, marginTop: 6 }}>
          All events and their participants. Confirm check-ins and manage patient flow.
        </p>
      </div>

      <div style={{ marginBottom: 24, position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
        <span style={{ position: 'absolute', left: 12, color: colors.textMuted, display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
          <IconSearch size={15} />
        </span>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or queue #"
          style={{ paddingLeft: 36, paddingRight: 14, paddingTop: 10, paddingBottom: 10, background: colors.surface, borderRadius: 10, fontSize: 13, fontFamily: fonts.vietnam, border: `1.5px solid ${colors.border}`, color: colors.text, width: 280, outline: 'none', boxShadow: '0 2px 8px rgba(123,44,191,0.04)' }}
        />
      </div>

      {eventsLoading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
          <span style={{ width: 24, height: 24, border: '3px solid rgba(123,44,191,0.15)', borderTop: '3px solid #7B2CBF', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
        </div>
      )}

      {!eventsLoading && (!events || events.length === 0) && (
        <div style={{ background: colors.surface, borderRadius: 20, padding: '32px 28px', boxShadow: '0 12px 40px rgba(97,0,164,0.04)', textAlign: 'center' }}>
          <p style={{ fontFamily: fonts.vietnam, fontSize: 14, color: colors.textMuted, margin: 0 }}>No events found.</p>
        </div>
      )}

      {!eventsLoading && events?.map(event => (
        <EventSection key={event.event_id} event={event} search={search} />
      ))}
    </div>
  );
}