// app/(public)/events/page.tsx
'use client';

import useSWR from 'swr';
import { supabase } from '@/lib/supabase-client';
import { StatusBadge } from '@/components/StatusBadge';
import Link from 'next/link';

interface Event {
  event_id: string;
  event_name: string;
  event_date: string;
  location_address: string;
  status: string;
  max_capacity: number | null;
  registered_count: number;
}

const IconPaw = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2C10.34 2 9 3.34 9 5s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm-5 4C5.34 6 4 7.34 4 9s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm10 0c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zM5.5 14C3.57 14 2 15.57 2 17.5S3.57 21 5.5 21c.96 0 1.83-.38 2.48-1H16c.65.62 1.52 1 2.48 1C20.43 21 22 19.43 22 17.5S20.43 14 18.48 14c-1.5 0-2.78.87-3.43 2.13C14.57 16.05 13.82 16 13 16h-2c-.82 0-1.57.05-2.05.13C8.3 14.87 7.02 14 5.5 14z" />
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
const IconArrowRight = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);

const IconArrowLeft = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
);
const IconFacebook = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

function SkeletonCard() {
  return (
    <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 12px 40px rgba(97,0,164,0.04)' }}>
      <div style={{ height: 4, background: '#F3E8FF' }} />
      <div style={{ padding: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ height: 22, width: 72, background: '#F3E8FF', borderRadius: 100 }} />
          <div style={{ height: 22, width: 80, background: '#EDEDED', borderRadius: 100 }} />
        </div>
        <div style={{ height: 20, width: '82%', background: '#EDEDED', borderRadius: 6, marginBottom: 10 }} />
        <div style={{ height: 14, width: '55%', background: '#EDEDED', borderRadius: 6, marginBottom: 20 }} />
        <div style={{ height: 5, background: '#EDEDED', borderRadius: 100, marginBottom: 18 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
          <div style={{ height: 13, width: '68%', background: '#EDEDED', borderRadius: 6 }} />
          <div style={{ height: 13, width: '52%', background: '#EDEDED', borderRadius: 6 }} />
        </div>
        <div style={{ height: 44, background: '#F3E8FF', borderRadius: 10 }} />
      </div>
    </div>
  );
}

export default function EventsPage() {
  const { data: events, isLoading, error } = useSWR('events', async () => {
    const { data } = await supabase
      .from('events')
      .select('*')
      .in('status', ['Open', 'Ongoing'])
      .order('event_date', { ascending: true });
    return data as Event[] | null;
  });

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-PH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div style={{ minHeight: '100vh', background: '#EDEDED', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      <style>{`
        @keyframes shimmer { 0%,100%{opacity:1} 50%{opacity:0.5} }
        .skeleton-pulse > * { animation: shimmer 1.6s ease-in-out infinite; }
        .event-card { transition: transform 0.25s, box-shadow 0.25s, border-color 0.25s; }
        .event-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(123,44,191,0.10) !important; border-color: rgba(123,44,191,0.12) !important; }
        .cta-btn { transition: transform 0.2s, box-shadow 0.2s; }
        .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(123,44,191,0.30) !important; }
        @media (max-width: 600px) {
          .hero-pills { flex-direction: column; align-items: flex-start; }
          .events-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

{/* ── Topbar ── */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 64,
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(123,44,191,0.08)',
        zIndex: 100, display: 'flex', alignItems: 'center',
        padding: '0 24px', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: 'linear-gradient(135deg, #7B2CBF, #A66DD4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white',
          }}>
            <IconPaw size={18} />
          </div>
          <div style={{ lineHeight: 1.15 }}>
            <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, fontWeight: 700, color: '#7B2CBF' }}>
              Northern Hills Vet
            </div>
            <div style={{ fontSize: 10, color: '#A8A8A8' }}>Caloocan City, Metro Manila</div>
          </div>
        </div>
        <Link href="/" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: 13, fontWeight: 600, color: '#6B6B6B',
          textDecoration: 'none', padding: '7px 14px', borderRadius: 8,
          background: '#F5F5F7', transition: 'all 0.18s',
        }}>
          <IconArrowLeft size={14} /> Back to Homepage
        </Link>
      </header>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(160deg, #1a0230 0%, #7B2CBF 45%, #4a1070 70%, #2d0650 100%)',
        padding: 'clamp(52px, 8vw, 88px) 24px clamp(48px, 7vw, 80px)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '32px 32px', pointerEvents: 'none',
        }} />
        <div style={{ position: 'absolute', top: -24, right: 60, opacity: 0.04, color: 'white', transform: 'rotate(20deg)', pointerEvents: 'none' }}>
          <IconPaw size={220} />
        </div>
        <div style={{ position: 'absolute', bottom: -40, left: 0, opacity: 0.03, color: 'white', transform: 'rotate(-12deg)', pointerEvents: 'none' }}>
          <IconPaw size={180} />
        </div>

        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            background: 'rgba(126,217,87,0.15)', border: '1px solid rgba(126,217,87,0.3)',
            borderRadius: 100, padding: '5px 14px',
            fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px',
            color: '#7ED957', marginBottom: 18,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}>
            <IconPaw size={10} />
            Free Spay &amp; Neuter Outreach
          </div>

          <h1 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 'clamp(1.8rem, 5vw, 3rem)', fontWeight: 800,
            color: '#fff', margin: '0 0 14px', lineHeight: 1.15,
          }}>
            Upcoming Outreach Events
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.60)', fontSize: 15,
            maxWidth: 500, margin: '0 0 32px', lineHeight: 1.75,
          }}>
            Register your pet for a free spay or neuter procedure. Slots are limited — secure yours early.
          </p>

          <div className="hero-pills" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {['No account needed', 'QR code instantly', 'Dogs & cats welcome'].map(label => (
              <div key={label} style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 100, padding: '6px 14px',
                fontSize: 12, color: 'rgba(255,255,255,0.70)',
              }}>
                <span style={{ color: '#7ED957', fontSize: 13, lineHeight: 1 }}>✓</span>
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px 88px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 7,
          fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px',
          color: '#7B2CBF', marginBottom: 28,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}>
          <IconPaw size={11} />
          Open for Registration
        </div>

        {/* Loading skeletons */}
        {isLoading && (
          <div className="skeleton-pulse events-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
            {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{
            background: '#fff', borderRadius: 16, padding: '56px 32px',
            textAlign: 'center', boxShadow: '0 12px 40px rgba(97,0,164,0.04)',
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: '#FEF2F2', color: '#C0392B',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px', fontSize: 22, fontWeight: 700,
            }}>!</div>
            <p style={{ color: '#C0392B', fontSize: 15, margin: '0 0 4px', fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Could not load events
            </p>
            <p style={{ color: '#6B6B6B', fontSize: 13, margin: 0 }}>Please refresh the page and try again.</p>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !error && events?.length === 0 && (
          <div style={{
            background: '#fff', borderRadius: 24, padding: '72px 32px',
            textAlign: 'center', boxShadow: '0 12px 40px rgba(97,0,164,0.04)',
          }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: '#F3E8FF', color: '#7B2CBF',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
            }}>
              <IconCalendar size={32} />
            </div>
            <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 20, fontWeight: 700, color: '#3A3A3A', margin: '0 0 8px' }}>
              No open events right now
            </h3>
            <p style={{ color: '#6B6B6B', fontSize: 14, margin: '0 0 28px', lineHeight: 1.7, maxWidth: 340, marginLeft: 'auto', marginRight: 'auto' }}>
              Check back soon or follow us on Facebook for the next outreach announcement.
            </p>
            <a
              href="https://www.facebook.com/NorthernHillsVeterinaryClinic"
              target="_blank" rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '12px 24px', background: '#1877F2', color: '#fff',
                borderRadius: 10, fontSize: 14, fontWeight: 600,
                textDecoration: 'none', fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              <IconFacebook size={16} />
              Follow on Facebook
            </a>
          </div>
        )}

        {/* Event grid */}
        {!isLoading && !error && events && events.length > 0 && (
          <div className="events-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
            {events.map(event => {
              const remaining = event.max_capacity != null ? event.max_capacity - event.registered_count : null;
              const isFull = event.max_capacity != null && (remaining ?? 0) <= 0;
              const isOpen = event.status === 'Open';
              const isLow = remaining != null && remaining <= 5 && !isFull;
              const pct = event.max_capacity ? Math.min(100, (event.registered_count / event.max_capacity) * 100) : 0;
              const barColor = isFull ? '#C0392B' : pct > 75 ? 'linear-gradient(90deg,#7B2CBF,#C0392B)' : 'linear-gradient(90deg,#7B2CBF,#A66DD4)';

              return (
                <div
                  key={event.event_id}
                  className="event-card"
                  style={{
                    background: '#fff', borderRadius: 16, overflow: 'hidden',
                    border: '1px solid transparent',
                    boxShadow: '0 12px 40px rgba(97,0,164,0.04)',
                    display: 'flex', flexDirection: 'column',
                  }}
                >
                  {/* Top stripe */}
                  <div style={{
                    height: 4,
                    background: isFull ? '#EDEDED' : isOpen
                      ? 'linear-gradient(90deg, #7B2CBF, #A66DD4)'
                      : 'linear-gradient(90deg, #A66DD4, #C4B5FD)',
                  }} />

                  <div style={{ padding: 28, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* Status row */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                      <StatusBadge status={event.status} />
                      {event.max_capacity != null && (
                        <span style={{
                          fontSize: 12, fontWeight: 600,
                          color: isFull ? '#C0392B' : isLow ? '#D97706' : '#6B6B6B',
                          fontFamily: "'Be Vietnam Pro', sans-serif",
                        }}>
                          {isFull ? 'Fully booked' : isLow ? `Only ${remaining} left!` : `${remaining} slots left`}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: 17, fontWeight: 700, color: '#3A3A3A',
                      margin: '0 0 14px', lineHeight: 1.35,
                    }}>
                      {event.event_name}
                    </h3>

                    {/* Capacity bar */}
                    {event.max_capacity != null && (
                      <div style={{ marginBottom: 18 }}>
                        <div style={{ height: 5, background: '#EDEDED', borderRadius: 100, overflow: 'hidden' }}>
                          <div style={{
                            height: '100%', width: `${pct}%`,
                            background: barColor, borderRadius: 100,
                            transition: 'width 0.4s ease',
                          }} />
                        </div>
                        <p style={{ fontSize: 11, color: '#A8A8A8', margin: '5px 0 0', textAlign: 'right' }}>
                          {event.registered_count} / {event.max_capacity} registered
                        </p>
                      </div>
                    )}

                    {/* Meta */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, marginBottom: 24 }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9, fontSize: 13, color: '#6B6B6B' }}>
                        <span style={{ color: '#7B2CBF', marginTop: 1, flexShrink: 0 }}><IconCalendar size={14} /></span>
                        {formatDate(event.event_date)}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9, fontSize: 13, color: '#6B6B6B' }}>
                        <span style={{ color: '#7B2CBF', marginTop: 1, flexShrink: 0 }}><IconMapPin size={14} /></span>
                        {event.location_address}
                      </div>
                    </div>

                    {/* CTA */}
                    {isOpen && !isFull ? (
                      <a
                        href={`/register/${event.event_id}`}
                        className="cta-btn"
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                          padding: '13px 20px',
                          background: 'linear-gradient(135deg, #7B2CBF, #A66DD4)',
                          color: '#fff', borderRadius: 10, fontSize: 14, fontWeight: 700,
                          textDecoration: 'none', fontFamily: "'Plus Jakarta Sans', sans-serif",
                          boxShadow: '0 4px 16px rgba(123,44,191,0.20)',
                        }}
                      >
                        Register Now <IconArrowRight size={15} />
                      </a>
                    ) : (
                      <a
                        href={`/events/${event.event_id}`}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                          padding: '13px 20px',
                          background: '#F3E8FF', color: '#7B2CBF',
                          borderRadius: 10, fontSize: 14, fontWeight: 700,
                          textDecoration: 'none', fontFamily: "'Plus Jakarta Sans', sans-serif",
                        }}
                      >
                        View Details <IconArrowRight size={15} />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}