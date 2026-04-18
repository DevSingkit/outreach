// app/staff/dashboard/[event_id]/page.tsx
'use client';

import { use } from 'react';
import useSWR from 'swr';
import { supabase } from '@/lib/supabase-client';
import Link from 'next/link';

// ─── Icons ────────────────────────────────────────────────────────────────────
const IconArrowLeft = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
);
const IconCalendar = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const IconMapPin = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const IconUsers = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const IconClock = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);

// ─── Status Badge ─────────────────────────────────────────────────────────────
const statusMap: Record<string, { bg: string; color: string }> = {
  Draft:   { bg: '#E2E3E5', color: '#383D41' },
  Open:    { bg: '#D4EDDA', color: '#155724' },
  Ongoing: { bg: '#D1ECF1', color: '#0C5460' },
  Closed:  { bg: '#F8D7DA', color: '#721C24' },
};
function StatusBadge({ status }: { status: string }) {
  const s = statusMap[status] ?? { bg: '#E2E3E5', color: '#383D41' };
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

// ─── Info Row ─────────────────────────────────────────────────────────────────
function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '16px 0', borderBottom: '1px solid #F0F0F0' }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: '#F3E8FF',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#7B2CBF', flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px', color: '#A8A8A8', margin: '0 0 3px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {label}
        </p>
        <p style={{ fontSize: 15, fontWeight: 600, color: '#3A3A3A', margin: 0, fontFamily: "'Be Vietnam Pro', sans-serif" }}>
          {value}
        </p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function StaffEventDetailPage({ params }: { params: Promise<{ event_id: string }> }) {
  const { event_id: event_id } = use(params);

  // Change this:
const { data: event, isLoading } = useSWR(`staff-event-${event_id}`, async () => {
    const { data } = await supabase
      .from('events')
      .select('*')
      .eq('event_id', event_id)
      .single();
    return data;
  });

  if (isLoading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 320 }}>
      <span style={{ width: 32, height: 32, border: '3px solid rgba(123,44,191,0.15)', borderTop: '3px solid #7B2CBF', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!event) return (
    <p style={{ color: '#6B6B6B', fontFamily: "'Be Vietnam Pro', sans-serif" }}>Event not found.</p>
  );

  const formattedDate = event.event_date
    ? new Date(event.event_date).toLocaleDateString('en-PH', { dateStyle: 'long' })
    : '—';

  const formattedTime = event.event_time
    ? new Date(`1970-01-01T${event.event_time}`).toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' })
    : '—';

  const capacityText = event.max_capacity
    ? `${event.registered_count ?? 0} / ${event.max_capacity} registered`
    : `${event.registered_count ?? 0} registered (no cap)`;

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Back + title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
        <Link href="/staff/dashboard" style={{
          width: 40, height: 40, borderRadius: 10,
          background: '#FFFFFF', color: '#6B6B6B',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          textDecoration: 'none', boxShadow: '0 4px 12px rgba(97,0,164,0.06)',
          transition: 'all 0.15s', flexShrink: 0,
        }}>
          <IconArrowLeft size={18} />
        </Link>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 22, fontWeight: 800, color: '#3A3A3A',
            margin: 0, lineHeight: 1.2,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {event.event_name}
          </h1>
        </div>
        <StatusBadge status={event.status} />
      </div>

      {/* Details card */}
      <div style={{
        background: '#FFFFFF', borderRadius: 24,
        boxShadow: '0 12px 40px rgba(97,0,164,0.04)',
        overflow: 'hidden', marginBottom: 20,
      }}>
        {/* Card header */}
        <div style={{
          background: 'linear-gradient(160deg, #1a0230 0%, #7B2CBF 100%)',
          padding: '20px 28px', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '24px 24px', pointerEvents: 'none',
          }} />
          <div style={{ position: 'relative' }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: 'rgba(255,255,255,0.5)', marginBottom: 4, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Event Overview
            </div>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 18, fontWeight: 800, color: 'white', margin: 0 }}>
              Event Details
            </h2>
          </div>
        </div>

        {/* Info rows */}
        <div style={{ padding: '4px 28px 12px' }}>
          <InfoRow icon={<IconCalendar size={16} />} label="Date" value={formattedDate} />
          <InfoRow icon={<IconClock size={16} />} label="Time" value={formattedTime} />
          <InfoRow icon={<IconMapPin size={16} />} label="Location" value={event.location_address} />
          <div style={{ borderBottom: 'none' }}>
            <InfoRow icon={<IconUsers size={16} />} label="Capacity" value={capacityText} />
          </div>
        </div>
      </div>

      {/* View registrations link */}
      <Link
        href={`/staff/participants/${event_id}`}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 24px',
          background: '#FFFFFF', borderRadius: 16,
          boxShadow: '0 4px 16px rgba(97,0,164,0.05)',
          textDecoration: 'none', transition: 'box-shadow 0.2s',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: 'linear-gradient(135deg, #7B2CBF, #A66DD4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', flexShrink: 0,
          }}>
            <IconUsers size={18} />
          </div>
          <div>
            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, fontWeight: 700, color: '#3A3A3A', margin: 0 }}>
              View Registrations
            </p>
            <p style={{ fontSize: 12, color: '#A8A8A8', margin: '2px 0 0', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
              See all participants for this event
            </p>
          </div>
        </div>
        <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#A8A8A8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </Link>
    </div>
  );
}