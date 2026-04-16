// staff/participants/page.tsx
'use client';

import useSWR from 'swr';
import { supabase } from '@/lib/supabase-client';
import { useState } from 'react';

const IconUsers = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const colors = {
  primary: '#7B2CBF',
  surface: '#FFFFFF',
  text: '#3A3A3A',
  textMuted: '#A8A8A8',
  border: 'rgba(123,44,191,0.12)',
};

const cardStyle: React.CSSProperties = {
  background: colors.surface,
  borderRadius: 20,
  padding: 28,
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span style={{ padding: '3px 10px', borderRadius: 100, background: '#eee', fontSize: 12 }}>
      {status}
    </span>
  );
}

export default function ParticipantsPage() {
  const { data: events } = useSWR('events', eventsApi.list);
  const [search, setSearch] = useState('');

  const activeEvent = events?.find(
    (e) => e.status === 'Ongoing' || e.status === 'Open'
  );

  const { data: participants, isLoading } = useSWR(
    activeEvent ? `participants-${activeEvent.event_id}` : null,
    () => checkinApi.eventList(activeEvent!.event_id)
  );

  const filtered = participants?.filter((p) => {
    // FIX: use p.owners (joined relation) — not p.owner_id which is a UUID string
    const name = `${p.owners?.first_name ?? ''} ${p.owners?.last_name ?? ''}`.toLowerCase();
    const q = `#${p.queue_number}`;
    return name.includes(search.toLowerCase()) || q.includes(search.toLowerCase());
  });

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <IconUsers size={12} /> Staff Portal
        </div>
        <h1>All Participants</h1>
      </div>

      <div style={{ marginBottom: 16 }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or queue #"
          style={{
            padding: '10px 14px',
            background: '#E8E8E8',
            borderRadius: 8,
            fontSize: 14,
            border: 'none',
            width: 280,
          }}
        />
      </div>

      {isLoading && <div>Loading...</div>}

      {!isLoading && (!filtered || filtered.length === 0) && (
        <div style={cardStyle}>No participants found.</div>
      )}

      {!isLoading && filtered && filtered.length > 0 && (
        <div style={cardStyle}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Queue #', 'Owner Name', 'Pets', 'Status', 'Check-in Time'].map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: 12, color: colors.textMuted }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((reg: Registration) => (
                <tr key={reg.registration_id}>
                  <td style={{ padding: '10px 12px' }}>
                    {reg.queue_number != null ? `#${reg.queue_number}` : '—'}
                  </td>

                  {/* FIX: use reg.owners (joined public.owners row), not reg.owner_id */}
                  <td style={{ padding: '10px 12px' }}>
                    {reg.owners
                      ? `${reg.owners.first_name} ${reg.owners.last_name}`
                      : '—'}
                  </td>

                  {/* FIX: use reg.registration_pets (joined), then pet.pet_name (DB column name) */}
                  <td style={{ padding: '10px 12px' }}>
                    {reg.registration_pets && reg.registration_pets.length > 0
                      ? reg.registration_pets.map((rp) => rp.pet.pet_name).join(', ')
                      : '—'}
                  </td>

                  <td style={{ padding: '10px 12px' }}>
                    <StatusBadge status={reg.checkin_status} />
                  </td>

                  <td style={{ padding: '10px 12px' }}>
                    {reg.checkin_timestamp
                      ? new Date(reg.checkin_timestamp).toLocaleTimeString('en-PH', { timeStyle: 'short' })
                      : '—'}
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