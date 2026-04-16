// app/admin/dashboard/page.tsx
'use client';

import useSWR from 'swr';
import Link from 'next/link';
import { supabase } from '@/lib/supabase-client';
import { useState } from 'react';

// ─── Icons ───────────────────────────────────────────────────────────────────
const IconPaw = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C10.34 2 9 3.34 9 5s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm-5 4C5.34 6 4 7.34 4 9s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm10 0c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zM5.5 14C3.57 14 2 15.57 2 17.5S3.57 21 5.5 21c.96 0 1.83-.38 2.48-1H16c.65.62 1.52 1 2.48 1C20.43 21 22 19.43 22 17.5S20.43 14 18.48 14c-1.5 0-2.78.87-3.43 2.13C14.57 16.05 13.82 16 13 16h-2c-.82 0-1.57.05-2.05.13C8.3 14.87 7.02 14 5.5 14z" />
  </svg>
);
const IconCalendar = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const IconUsers = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const IconBarChart = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="20" x2="12" y2="10" /><line x1="18" y1="20" x2="18" y2="4" /><line x1="6" y1="20" x2="6" y2="16" />
  </svg>
);
const IconPlus = ({ size = 17 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const IconChevronRight = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const IconMapPin = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
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
      padding: '3px 12px', borderRadius: 100,
      fontSize: 11, fontWeight: 700,
      background: s.bg, color: s.color,
      fontFamily: "'Be Vietnam Pro', sans-serif",
      whiteSpace: 'nowrap',
    }}>{status}</span>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, accent, isLoading }: { label: string; value: number; icon: React.ReactNode; accent: string; isLoading: boolean }) {
  return (
    <div style={{
      background: '#FFFFFF', borderRadius: 24, padding: 28,
      boxShadow: '0 12px 40px rgba(97,0,164,0.04)',
      display: 'flex', alignItems: 'center', gap: 20,
      transition: 'all 0.25s',
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 16px 40px rgba(123,44,191,0.08)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 40px rgba(97,0,164,0.04)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; }}
    >
      <div style={{
        width: 56, height: 56, borderRadius: 16,
        background: '#F3E8FF', color: accent,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#A8A8A8', fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 4 }}>
          {label}
        </div>
        <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 36, fontWeight: 800, color: '#3A3A3A', lineHeight: 1 }}>
          {isLoading ? '—' : value}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminDashboardPage() {
  const { data: events, isLoading } = useSWR('admin-events', async () => {
  const { data } = await supabase.from('events').select('*').order('event_date', { ascending: false });
  return data;
});
  const [hovered, setHovered] = useState<string | null>(null);

  const total   = events?.length ?? 0;
  const open    = events?.filter((e: { status: string }) => e.status === 'Open').length ?? 0;
  const ongoing = events?.filter((e: { status: string }) => e.status === 'Ongoing').length ?? 0;

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 36 }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#7B2CBF', marginBottom: 8, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <IconPaw size={12} /> Admin Portal
          </div>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 800, color: '#3A3A3A', margin: 0, lineHeight: 1.1 }}>
            Dashboard
          </h1>
          <p style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: 14, color: '#6B6B6B', marginTop: 6 }}>
            Northern Hills Veterinary Clinic — Outreach Management
          </p>
        </div>
        <Link href="/admin/events" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '12px 24px',
          background: 'linear-gradient(135deg, #7B2CBF, #A66DD4)',
          color: 'white', borderRadius: 12,
          fontSize: 14, fontWeight: 700,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          textDecoration: 'none', transition: 'all 0.2s',
          boxShadow: '0 4px 16px rgba(123,44,191,0.2)',
        }}
          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 10px 30px rgba(123,44,191,0.3)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 4px 16px rgba(123,44,191,0.2)'; }}
        >
          <IconPlus size={17} /> New Event
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 32 }} className="stats-grid">
        <StatCard label="Total Events"   value={total}   icon={<IconCalendar size={24} />} accent="#7B2CBF" isLoading={isLoading} />
        <StatCard label="Open Events"    value={open}    icon={<IconUsers size={24} />}    accent="#7ED957" isLoading={isLoading} />
        <StatCard label="Ongoing Events" value={ongoing} icon={<IconBarChart size={24} />} accent="#7B2CBF" isLoading={isLoading} />
      </div>

      {/* Event list card */}
      <div style={{ background: '#FFFFFF', borderRadius: 24, boxShadow: '0 12px 40px rgba(97,0,164,0.04)', overflow: 'hidden' }}>
        {/* Card header */}
        <div style={{
          background: 'linear-gradient(160deg, #1a0230 0%, #7B2CBF 45%, #4a1070 70%, #2d0650 100%)',
          padding: '28px 32px', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'rgba(255,255,255,0.5)', marginBottom: 4, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                All Events
              </div>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 20, fontWeight: 800, color: 'white', margin: 0 }}>
                Outreach Events
              </h2>
            </div>
            <Link href="/admin/events" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '8px 16px',
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'white', borderRadius: 10,
              fontSize: 13, fontWeight: 600,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              textDecoration: 'none',
            }}>
              Manage <IconChevronRight size={14} />
            </Link>
          </div>
        </div>

        {/* List */}
        <div style={{ padding: '8px 0' }}>
          {isLoading && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
              <span style={{ width: 24, height: 24, border: '3px solid rgba(123,44,191,0.15)', borderTop: '3px solid #7B2CBF', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
            </div>
          )}
          {events?.map((event: { event_id: string; event_name: string; event_date: string; location_address: string; status: string; max_capacity: number; registered_count?: number }) => (
            <Link
              key={event.event_id}
              href={`/admin/events/${event.event_id}`}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '18px 32px', textDecoration: 'none',
                background: hovered === event.event_id ? '#F3E8FF' : 'transparent',
                transition: 'background 0.15s',
                gap: 16,
              }}
              onMouseEnter={() => setHovered(event.event_id)}
              onMouseLeave={() => setHovered(null)}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, fontWeight: 700, color: '#3A3A3A', marginBottom: 4 }}>
                  {event.event_name}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: 12, color: '#6B6B6B' }}>
                    {new Date(event.event_date).toLocaleDateString('en-PH', { dateStyle: 'medium' })}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: 12, color: '#6B6B6B' }}>
                    <IconMapPin size={12} /> {event.location_address}
                  </span>
                  <span style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: 12, color: '#6B6B6B' }}>
                    {event.registered_count ?? 0}/{event.max_capacity} registered
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <StatusBadge status={event.status} />
                <span style={{ color: '#7B2CBF' }}><IconChevronRight size={16} /></span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  );
}