// app/(public)/events/page.tsx
'use client';

import useSWR from 'swr';
import { supabase } from '@/lib/supabase-client';
import { StatusBadge } from '@/components/StatusBadge';

const IconPaw = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2C10.34 2 9 3.34 9 5s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm-5 4C5.34 6 4 7.34 4 9s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm10 0c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zM5.5 14C3.57 14 2 15.57 2 17.5S3.57 21 5.5 21c.96 0 1.83-.38 2.48-1H16c.65.62 1.52 1 2.48 1C20.43 21 22 19.43 22 17.5S20.43 14 18.48 14c-1.5 0-2.78.87-3.43 2.13C14.57 16.05 13.82 16 13 16h-2c-.82 0-1.57.05-2.05.13C8.3 14.87 7.02 14 5.5 14z" />
  </svg>
);
const IconCalendar = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const IconMapPin = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const IconArrowRight = ({ size = 15, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);
const IconScissors = ({ size = 40, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><line x1="20" y1="4" x2="8.12" y2="15.88" /><line x1="14.47" y1="14.48" x2="20" y2="20" /><line x1="8.12" y1="8.12" x2="12" y2="12" />
  </svg>
);

function EventCardSkeleton() {
  return (
    <div style={{ background: '#fff', borderRadius: 16, padding: 28, boxShadow: '0 12px 40px rgba(97,0,164,0.04)', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ height: 26, width: 80, background: '#F3E8FF', borderRadius: 100 }} />
        <div style={{ height: 26, width: 60, background: '#EDEDED', borderRadius: 100 }} />
      </div>
      {['85%', '60%'].map((w, i) => (
        <div key={i} style={{ height: i === 0 ? 20 : 14, width: w, background: '#EDEDED', borderRadius: 6, marginBottom: 10 }} />
      ))}
      <div style={{ height: 1, background: '#F5F5F5', margin: '20px 0' }} />
      {['70%', '55%'].map((w, i) => (
        <div key={i} style={{ height: 13, width: w, background: '#EDEDED', borderRadius: 6, marginBottom: 10 }} />
      ))}
      <div style={{ height: 44, background: 'linear-gradient(135deg, #F3E8FF, #E9D5FF)', borderRadius: 10, marginTop: 24 }} />
    </div>
  );
}

export default function EventsPage() {
  const { data: events, isLoading, error } = useSWR('events', async () => {
  const { data } = await supabase.from('events').select('*').eq('status', 'Open');
  return data;
});

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-PH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div style={{ minHeight: '100vh', background: '#EDEDED', fontFamily: "'Be Vietnam Pro', sans-serif" }}>

      {/* ── Hero ── */}
      <div style={{
        background: 'linear-gradient(160deg, #1a0230 0%, #7B2CBF 45%, #4a1070 70%, #2d0650 100%)',
        padding: '80px 24px 72px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Dot grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          pointerEvents: 'none',
        }} />
        {/* Decorative paw shapes */}
        <div style={{ position: 'absolute', top: -20, right: 80, opacity: 0.05, color: 'white', transform: 'rotate(25deg)' }}>
          <IconPaw size={200} />
        </div>
        <div style={{ position: 'absolute', bottom: -30, left: 20, opacity: 0.04, color: 'white', transform: 'rotate(-10deg)' }}>
          <IconPaw size={150} />
        </div>
        {/* Scissors emblem */}
        <div style={{
          position: 'absolute', top: 48, right: 220,
          opacity: 0.08, color: 'white', transform: 'rotate(-15deg)',
        }}>
          <IconScissors size={80} />
        </div>

        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          {/* Eyebrow label */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            background: 'rgba(126,217,87,0.15)',
            border: '1px solid rgba(126,217,87,0.3)',
            borderRadius: 100,
            padding: '5px 14px',
            fontSize: 11, fontWeight: 600,
            textTransform: 'uppercase', letterSpacing: '1.5px',
            color: '#7ED957', marginBottom: 20,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}>
            <IconPaw size={10} />
            Free Spay & Neuter Outreach
          </div>

          <h1 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800,
            color: '#fff', margin: '0 0 16px', lineHeight: 1.15,
          }}>
            Upcoming Outreach Events
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.65)', fontSize: 16,
            maxWidth: 520, margin: '0 0 36px',
            fontFamily: "'Be Vietnam Pro', sans-serif", lineHeight: 1.7,
          }}>
            Register your pet for a free or low-cost spay / neuter procedure.<br />
            Slots are limited — secure your spot early.
          </p>

          {/* Stat pills */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {[
              { label: 'No account needed', icon: '✓' },
              { label: 'QR code instantly', icon: '✓' },
              { label: 'Dogs & cats welcome', icon: '✓' },
            ].map(item => (
              <div key={item.label} style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 100,
                padding: '6px 14px',
                fontSize: 12,
                color: 'rgba(255,255,255,0.75)',
                fontFamily: "'Be Vietnam Pro', sans-serif",
              }}>
                <span style={{ color: '#7ED957', fontSize: 13 }}>{item.icon}</span>
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '52px 24px 80px' }}>

        {/* Section label */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 7,
          fontSize: 11, fontWeight: 600,
          textTransform: 'uppercase', letterSpacing: '1.5px',
          color: '#7B2CBF', marginBottom: 28,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}>
          <IconPaw size={11} />
          Open for Registration
        </div>

        {/* Loading */}
        {isLoading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
            {[1, 2, 3].map(i => <EventCardSkeleton key={i} />)}
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
              margin: '0 auto 16px', fontSize: 24,
            }}>!</div>
            <p style={{ color: '#C0392B', fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: 15 }}>
              Could not load events. Please try again later.
            </p>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !error && events?.length === 0 && (
          <div style={{
            background: '#fff', borderRadius: 24, padding: '80px 32px',
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
            <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 20, fontWeight: 700, color: '#3A3A3A', margin: '0 0 10px' }}>
              No open events right now
            </h3>
            <p style={{ color: '#6B6B6B', fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: 14, marginBottom: 28, lineHeight: 1.6 }}>
              Check back soon or follow us on Facebook for the next outreach announcement.
            </p>
            <a
              href="https://www.facebook.com/NorthernHillsVeterinaryClinic"
              target="_blank" rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '12px 24px',
                background: '#1877F2', color: '#fff',
                borderRadius: 10, fontSize: 14, fontWeight: 600,
                textDecoration: 'none', fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              Follow on Facebook
            </a>
          </div>
        )}

        {/* Event grid */}
        {!isLoading && !error && events && events.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
            {events.map((event: any) => {
              const remaining = event.max_capacity ? event.max_capacity - event.registered_count : null;
              const isFull = event.max_capacity && (remaining ?? 0) <= 0;
              const isOpen = event.status === 'Open';
              const pct = event.max_capacity ? Math.min(100, (event.registered_count / event.max_capacity) * 100) : 0;

              return (
                <div
                  key={event.event_id}
                  style={{
                    background: '#fff',
                    borderRadius: 16,
                    overflow: 'hidden',
                    border: '1px solid transparent',
                    boxShadow: '0 12px 40px rgba(97,0,164,0.04)',
                    display: 'flex', flexDirection: 'column',
                    transition: 'all 0.25s',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(123,44,191,0.12)';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 16px 40px rgba(123,44,191,0.08)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'transparent';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(97,0,164,0.04)';
                  }}
                >
                  {/* Colored top stripe */}
                  <div style={{
                    height: 4,
                    background: isFull
                      ? '#EDEDED'
                      : isOpen
                        ? 'linear-gradient(90deg, #7B2CBF, #A66DD4)'
                        : '#EDEDED',
                  }} />

                  <div style={{ padding: 28, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* Status + slots */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                      <StatusBadge status={event.status} />
                      {event.max_capacity && (
                        <span style={{
                          fontSize: 12,
                          color: isFull ? '#C0392B' : '#6B6B6B',
                          fontFamily: "'Be Vietnam Pro', sans-serif",
                          fontWeight: 500,
                        }}>
                          {isFull ? 'Fully booked' : `${remaining} slots left`}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: 17, fontWeight: 700, color: '#3A3A3A',
                      margin: '0 0 16px', lineHeight: 1.35,
                    }}>
                      {event.event_name}
                    </h3>

                    {/* Capacity bar */}
                    {event.max_capacity && (
                      <div style={{ marginBottom: 18 }}>
                        <div style={{ height: 5, background: '#EDEDED', borderRadius: 100, overflow: 'hidden' }}>
                          <div style={{
                            height: '100%',
                            width: `${pct}%`,
                            background: isFull
                              ? '#C0392B'
                              : pct > 70
                                ? 'linear-gradient(90deg, #7B2CBF, #C0392B)'
                                : 'linear-gradient(90deg, #7B2CBF, #A66DD4)',
                            borderRadius: 100,
                            transition: 'width 0.4s ease',
                          }} />
                        </div>
                        <p style={{ fontSize: 11, color: '#A8A8A8', fontFamily: "'Be Vietnam Pro', sans-serif", margin: '5px 0 0', textAlign: 'right' }}>
                          {event.registered_count} / {event.max_capacity} registered
                        </p>
                      </div>
                    )}

                    {/* Meta */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 24, flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9, fontSize: 13, color: '#6B6B6B', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                        <span style={{ color: '#7B2CBF', marginTop: 1, flexShrink: 0 }}><IconCalendar size={14} /></span>
                        {formatDate(event.event_date)}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9, fontSize: 13, color: '#6B6B6B', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                        <span style={{ color: '#7B2CBF', marginTop: 1, flexShrink: 0 }}><IconMapPin size={14} /></span>
                        {event.location_address}
                      </div>
                    </div>

                    {/* CTA */}
                    {isOpen && !isFull ? (
                      <a
                        href={`/register/${event.event_id}`}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                          padding: '13px 20px',
                          background: 'linear-gradient(135deg, #7B2CBF, #A66DD4)',
                          color: '#fff', borderRadius: 10, fontSize: 14, fontWeight: 700,
                          textDecoration: 'none', fontFamily: "'Plus Jakarta Sans', sans-serif",
                          transition: 'all 0.2s',
                          boxShadow: '0 4px 16px rgba(123,44,191,0.2)',
                        }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                          (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 30px rgba(123,44,191,0.3)';
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                          (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(123,44,191,0.2)';
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

      <style>{`@media (max-width: 600px) { .nhvc-hero-stats { flex-direction: column; } }`}</style>
    </div>
  );
}