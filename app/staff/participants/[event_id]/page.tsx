// app/staff/participants/[event_id]/page.tsx
'use client';

import { use, useState } from 'react';
import useSWR from 'swr';
import { supabase } from '@/lib/supabase-client';
import Link from 'next/link';

// ─── Types ────────────────────────────────────────────────────────────────────
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
  registration_type: string;
  owners: { first_name: string; last_name: string } | null;
  registration_pets: RegistrationPet[];
};

type Event = {
  event_id: string;
  event_name: string;
  event_date: string;
  status: string;
  registered_count: number | null;
  max_capacity: number | null;
};

// ─── Icons ────────────────────────────────────────────────────────────────────
const IconArrowLeft = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
);
const IconSearch = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const IconPaw = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <ellipse cx="6" cy="7" rx="2" ry="3" />
    <ellipse cx="12" cy="5" rx="2" ry="3" />
    <ellipse cx="18" cy="7" rx="2" ry="3" />
    <ellipse cx="3.5" cy="14" rx="2" ry="2.5" />
    <path d="M12 22c-4 0-8-3-8-7 0-2 1.5-3.5 4-4.5 1-.4 2.5-.5 4-.5s3 .1 4 .5c2.5 1 4 2.5 4 4.5 0 4-4 7-8 7z" />
  </svg>
);
const IconUsers = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

// ─── Badges ───────────────────────────────────────────────────────────────────
const checkinColors: Record<string, { bg: string; color: string; dot: string }> = {
  'Checked-in': { bg: '#D4EDDA', color: '#155724', dot: '#28A745' },
  'Pending':    { bg: '#FFF3CD', color: '#856404', dot: '#FFC107' },
  'No-show':    { bg: '#F8D7DA', color: '#721C24', dot: '#DC3545' },
};

function CheckinBadge({ status }: { status: string }) {
  const s = checkinColors[status] ?? { bg: '#E2E3E5', color: '#383D41', dot: '#6C757D' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 10px', borderRadius: 100,
      background: s.bg, color: s.color,
      fontSize: 11, fontWeight: 700,
      fontFamily: "'Be Vietnam Pro', sans-serif",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot, flexShrink: 0 }} />
      {status}
    </span>
  );
}

const procedureColors: Record<string, { bg: string; color: string }> = {
  Pending:   { bg: '#E8F4FD', color: '#0C5460' },
  Accepted:  { bg: '#D4EDDA', color: '#155724' },
  Rejected:  { bg: '#F8D7DA', color: '#721C24' },
  Completed: { bg: '#E2D9F3', color: '#4A1A8B' },
};

function ProcedureBadge({ status }: { status: string }) {
  const s = procedureColors[status] ?? { bg: '#E2E3E5', color: '#383D41' };
  return (
    <span style={{
      padding: '2px 7px', borderRadius: 6,
      background: s.bg, color: s.color,
      fontSize: 10, fontWeight: 700,
      fontFamily: "'Be Vietnam Pro', sans-serif",
    }}>
      {status}
    </span>
  );
}

const eventStatusMap: Record<string, { bg: string; color: string }> = {
  Draft:   { bg: '#E2E3E5', color: '#383D41' },
  Open:    { bg: '#D4EDDA', color: '#155724' },
  Ongoing: { bg: '#D1ECF1', color: '#0C5460' },
  Closed:  { bg: '#F8D7DA', color: '#721C24' },
};
function EventStatusBadge({ status }: { status: string }) {
  const s = eventStatusMap[status] ?? { bg: '#E2E3E5', color: '#383D41' };
  return (
    <span style={{
      padding: '4px 14px', borderRadius: 100, fontSize: 12, fontWeight: 700,
      background: s.bg, color: s.color,
      fontFamily: "'Be Vietnam Pro', sans-serif",
    }}>
      {status}
    </span>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, accent }: { label: string; value: string | number; accent?: string }) {
  return (
    <div style={{
      background: '#FFFFFF', borderRadius: 16, padding: '16px 20px',
      boxShadow: '0 4px 16px rgba(97,0,164,0.05)',
      borderLeft: `4px solid ${accent ?? '#7B2CBF'}`,
    }}>
      <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px', color: '#A8A8A8', margin: '0 0 4px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        {label}
      </p>
      <p style={{ fontSize: 22, fontWeight: 800, color: '#3A3A3A', margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        {value}
      </p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function EventParticipantsPage({ params }: { params: Promise<{ event_id: string }> }) {
  const { event_id } = use(params);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  // Fetch event details
  const { data: event } = useSWR(
    `event-detail-${event_id}`,
    async (): Promise<Event | null> => {
      const { data } = await supabase
        .from('events')
        .select('*')
        .eq('event_id', event_id)
        .single();
      return data;
    }
  );

  // Fetch participants for this event
  const { data: participants, isLoading } = useSWR(
    `event-participants-${event_id}`,
    async (): Promise<Registration[] | null> => {
      const { data } = await supabase
        .from('registrations')
        .select('*, owners(*), registration_pets(*, pet:pets(pet_name, species))')
        .eq('event_id', event_id)
        .order('queue_number', { ascending: true });
      return data;
    }
  );

  const checkedIn   = participants?.filter(p => p.checkin_status === 'Checked-in').length ?? 0;
  const pending     = participants?.filter(p => p.checkin_status === 'Pending').length ?? 0;
  const noShow      = participants?.filter(p => p.checkin_status === 'No-show').length ?? 0;
  const totalPets   = participants?.reduce((acc, p) => acc + (p.registration_pets?.length ?? 0), 0) ?? 0;

  const filtered = participants?.filter((p) => {
    const name = `${p.owners?.first_name ?? ''} ${p.owners?.last_name ?? ''}`.toLowerCase();
    const q = `#${p.queue_number}`;
    const matchesSearch = name.includes(search.toLowerCase()) || q.includes(search.toLowerCase());
    const matchesFilter = filterStatus === 'All' || p.checkin_status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <Link href={`/staff/dashboard/${event_id}`} style={{
          width: 40, height: 40, borderRadius: 10,
          background: '#FFFFFF', color: '#6B6B6B',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          textDecoration: 'none', boxShadow: '0 4px 12px rgba(97,0,164,0.06)',
          flexShrink: 0,
        }}>
          <IconArrowLeft size={18} />
        </Link>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#A8A8A8', margin: '0 0 2px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Participants
          </p>
          <h1 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 22, fontWeight: 800, color: '#3A3A3A',
            margin: 0, lineHeight: 1.2,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {event?.event_name ?? '—'}
          </h1>
        </div>
        {event && <EventStatusBadge status={event.status} />}
      </div>

      {/* ── Stat Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        <StatCard label="Total"      value={participants?.length ?? '—'} accent="#7B2CBF" />
        <StatCard label="Checked In" value={checkedIn}                   accent="#28A745" />
        <StatCard label="Pending"    value={pending}                     accent="#FFC107" />
        <StatCard label="Total Pets" value={totalPets}                   accent="#17A2B8" />
      </div>

      {/* ── Search + Filter ── */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#A8A8A8', pointerEvents: 'none' }}>
            <IconSearch size={15} />
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or queue #"
            style={{
              width: '100%', boxSizing: 'border-box',
              padding: '10px 14px 10px 36px',
              background: '#FFFFFF', borderRadius: 10,
              fontSize: 14, border: '1.5px solid rgba(123,44,191,0.12)',
              fontFamily: "'Be Vietnam Pro', sans-serif",
              color: '#3A3A3A', outline: 'none',
            }}
          />
        </div>
        {['All', 'Pending', 'Checked-in', 'No-show'].map((s) => (
          <button key={s} onClick={() => setFilterStatus(s)} style={{
            padding: '9px 16px', borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: 'pointer',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            border: filterStatus === s ? 'none' : '1.5px solid rgba(123,44,191,0.15)',
            background: filterStatus === s ? '#7B2CBF' : '#FFFFFF',
            color: filterStatus === s ? '#FFFFFF' : '#6B6B6B',
            transition: 'all 0.15s',
          }}>
            {s}
          </button>
        ))}
      </div>

      {/* ── Loading ── */}
      {isLoading && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
          <span style={{ width: 32, height: 32, border: '3px solid rgba(123,44,191,0.15)', borderTop: '3px solid #7B2CBF', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
        </div>
      )}

      {/* ── Empty ── */}
      {!isLoading && (!filtered || filtered.length === 0) && (
        <div style={{
          background: '#FFFFFF', borderRadius: 20, padding: '48px 28px',
          textAlign: 'center', boxShadow: '0 4px 16px rgba(97,0,164,0.05)',
        }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🐾</div>
          <p style={{ color: '#A8A8A8', fontFamily: "'Be Vietnam Pro', sans-serif", margin: 0 }}>
            No participants found.
          </p>
        </div>
      )}

      {/* ── Table ── */}
      {!isLoading && filtered && filtered.length > 0 && (
        <div style={{
          background: '#FFFFFF', borderRadius: 20,
          boxShadow: '0 4px 16px rgba(97,0,164,0.05)',
          overflow: 'hidden',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#FAFAFA', borderBottom: '1.5px solid #F0F0F0' }}>
                {['Queue #', 'Owner', 'Type', 'Pets', 'Check-in Status', 'Check-in Time'].map((h) => (
                  <th key={h} style={{
                    textAlign: 'left', padding: '12px 16px',
                    fontSize: 11, fontWeight: 700, color: '#A8A8A8',
                    textTransform: 'uppercase', letterSpacing: '1px',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((reg, i) => (
                <tr key={reg.registration_id} style={{
                  borderBottom: i < filtered.length - 1 ? '1px solid #F5F5F5' : 'none',
                  transition: 'background 0.1s',
                }}>
                  {/* Queue # */}
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontWeight: 800, fontSize: 14, color: '#7B2CBF',
                    }}>
                      {reg.queue_number != null ? `#${reg.queue_number}` : '—'}
                    </span>
                  </td>

                  {/* Owner */}
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #7B2CBF, #A66DD4)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontSize: 12, fontWeight: 700, flexShrink: 0,
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                      }}>
                        {reg.owners ? reg.owners.first_name[0].toUpperCase() : '?'}
                      </div>
                      <span style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: 14, fontWeight: 600, color: '#3A3A3A' }}>
                        {reg.owners ? `${reg.owners.first_name} ${reg.owners.last_name}` : '—'}
                      </span>
                    </div>
                  </td>

                  {/* Registration Type */}
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      fontSize: 11, fontWeight: 700,
                      color: reg.registration_type === 'Walk-in' ? '#856404' : '#0C5460',
                      fontFamily: "'Be Vietnam Pro', sans-serif",
                    }}>
                      {reg.registration_type}
                    </span>
                  </td>

                  {/* Pets */}
                  <td style={{ padding: '14px 16px' }}>
                    {reg.registration_pets && reg.registration_pets.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {reg.registration_pets.map((rp) => (
                          <div key={rp.reg_pet_id} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <span style={{ color: '#7B2CBF' }}><IconPaw size={12} /></span>
                            <span style={{ fontSize: 13, color: '#3A3A3A', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                              {rp.pet?.pet_name ?? '—'}
                            </span>
                            <ProcedureBadge status={rp.procedure_status} />
                          </div>
                        ))}
                      </div>
                    ) : '—'}
                  </td>

                  {/* Check-in Status */}
                  <td style={{ padding: '14px 16px' }}>
                    <CheckinBadge status={reg.checkin_status} />
                  </td>

                  {/* Check-in Time */}
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontSize: 13, color: '#6B6B6B', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                      {reg.checkin_timestamp
                        ? new Date(reg.checkin_timestamp).toLocaleTimeString('en-PH', { timeStyle: 'short' })
                        : '—'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── useState import fix ───────────────────────────────────────────────────────
// Make sure to add this at the top of the file:
// import { use, useState } from 'react';