// app/(public)/events/[id]/page.tsx
'use client';

import { use } from 'react';
import useSWR from 'swr';
import { supabase } from '@/lib/supabase-client';
import { StatusBadge } from '@/components/StatusBadge';

const IconCalendar = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const IconMapPin = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const IconUsers = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const IconCheck = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IconArrowRight = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);
const IconChevronRight = ({ size = 13 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const IconPaw = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C10.34 2 9 3.34 9 5s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm-5 4C5.34 6 4 7.34 4 9s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm10 0c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zM5.5 14C3.57 14 2 15.57 2 17.5S3.57 21 5.5 21c.96 0 1.83-.38 2.48-1H16c.65.62 1.52 1 2.48 1C20.43 21 22 19.43 22 17.5S20.43 14 18.48 14c-1.5 0-2.78.87-3.43 2.13C14.57 16.05 13.82 16 13 16h-2c-.82 0-1.57.05-2.05.13C8.3 14.87 7.02 14 5.5 14z" />
  </svg>
);
const IconArrowLeft = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
);

const WHAT_TO_BRING = [
  { text: 'Your pet (dog or cat)', note: 'Dogs and cats only for this program' },
  { text: 'Valid ID of the pet owner', note: 'Any government-issued ID' },
  { text: 'Your registration QR code', note: 'Printed or on your phone screen' },
  { text: 'Cage or carrier', note: 'Recommended for safety and comfort' },
  { text: 'Pet must be fasted 8+ hours', note: 'No food or water before the procedure' },
];

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: event, isLoading, error } = useSWR(`event-${id}`, async () => {
  const { data } = await supabase.from('events').select('*').eq('event_id', id).single();
  return data;
  });

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-PH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const remaining = event?.max_capacity ? event.max_capacity - event.registered_count : null;
  const isFull = event?.max_capacity && (remaining ?? 0) <= 0;
  const isRegisterable = event?.status === 'Open' && (!event.max_capacity || (remaining ?? 0) > 0);
  const pct = event?.max_capacity ? Math.min(100, (event.registered_count / event.max_capacity) * 100) : 0;

  if (isLoading) return (
    <div style={{ minHeight: '100vh', background: '#EDEDED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 40, height: 40, border: '3px solid #F3E8FF', borderTopColor: '#7B2CBF', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (error || !event) return (
    <div style={{ minHeight: '100vh', background: '#EDEDED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', padding: 40 }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%', background: '#F3E8FF', color: '#7B2CBF',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px',
        }}>
          <IconCalendar size={28} />
        </div>
        <p style={{ color: '#C0392B', fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: 15, marginBottom: 12 }}>Event not found.</p>
        <a href="/events" style={{ color: '#7B2CBF', fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>← Back to Events</a>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#EDEDED', fontFamily: "'Be Vietnam Pro', sans-serif" }}>

      {/* ── Hero ── */}
      <div style={{
        background: 'linear-gradient(160deg, #1a0230 0%, #7B2CBF 45%, #4a1070 70%, #2d0650 100%)',
        padding: '64px 24px 56px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '32px 32px', pointerEvents: 'none',
        }} />
        <div style={{ position: 'absolute', top: -20, right: 80, opacity: 0.05, color: 'white' }}>
          <IconPaw size={180} />
        </div>

        <div style={{ maxWidth: 860, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          {/* Breadcrumb */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24,
            fontSize: 12, color: 'rgba(255,255,255,0.45)',
            fontFamily: "'Be Vietnam Pro', sans-serif",
          }}>
            <a href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</a>
            <IconChevronRight size={11} />
            <a href="/events" style={{ color: 'inherit', textDecoration: 'none' }}>Events</a>
            <IconChevronRight size={11} />
            <span style={{ color: 'rgba(255,255,255,0.75)' }}>{event.event_name}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 280 }}>
              <div style={{ marginBottom: 16 }}>
                <StatusBadge status={event.status} />
              </div>
              <h1 style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 800,
                color: '#fff', margin: '0 0 16px', lineHeight: 1.15,
              }}>
                {event.event_name}
              </h1>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: 'rgba(255,255,255,0.65)', fontSize: 14 }}>
                  <span style={{ color: '#A66DD4' }}><IconCalendar size={15} /></span>
                  {formatDate(event.event_date)}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: 'rgba(255,255,255,0.65)', fontSize: 14 }}>
                  <span style={{ color: '#A66DD4' }}><IconMapPin size={15} /></span>
                  {event.location_address}
                </div>
              </div>
            </div>

            {/* Glassmorphism capacity widget */}
            {event.max_capacity && (
              <div style={{
                background: 'rgba(255,255,255,0.07)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 20,
                padding: '20px 28px',
                textAlign: 'center',
                minWidth: 160, flexShrink: 0,
              }}>
                <div style={{
                  fontSize: 42, fontWeight: 800,
                  color: isFull ? '#F87171' : '#7ED957',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  lineHeight: 1,
                }}>
                  {isFull ? '0' : remaining}
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 4, fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                  slots available
                </div>
                {/* Mini bar */}
                <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 100, marginTop: 14, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: `${pct}%`,
                    background: isFull ? '#F87171' : 'linear-gradient(90deg, #7ED957, #5BB832)',
                    borderRadius: 100,
                  }} />
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 6, fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                  {event.registered_count} of {event.max_capacity} filled
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px 24px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20 }}>

          {/* Event details card */}
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, boxShadow: '0 12px 40px rgba(97,0,164,0.04)' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 11, fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '1.5px',
              color: '#7B2CBF', marginBottom: 8,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              <IconPaw size={11} />
              Event Details
            </div>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 18, fontWeight: 700, color: '#3A3A3A', margin: '0 0 24px' }}>
              What You Need to Know
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
              {[
                { icon: <IconCalendar size={18} />, label: 'Date', value: formatDate(event.event_date) },
                { icon: <IconMapPin size={18} />, label: 'Location', value: event.location_address },
                { icon: <IconUsers size={18} />, label: 'Capacity', value: event.max_capacity ? `${event.max_capacity} pets` : 'Unlimited' },
              ].map(({ icon, label, value }) => (
                <div key={label} style={{
                  display: 'flex', gap: 14, alignItems: 'flex-start',
                  background: '#FAFAFA',
                  borderRadius: 12, padding: '16px 18px',
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: '#F3E8FF', color: '#7B2CBF',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    {icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: '#A8A8A8', fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 3 }}>
                      {label}
                    </div>
                    <div style={{ fontSize: 14, color: '#3A3A3A', fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 500, lineHeight: 1.4 }}>
                      {value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* What to bring */}
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, boxShadow: '0 12px 40px rgba(97,0,164,0.04)' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 11, fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '1.5px',
              color: '#7B2CBF', marginBottom: 8,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              <IconPaw size={11} />
              Checklist
            </div>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 18, fontWeight: 700, color: '#3A3A3A', margin: '0 0 20px' }}>
              What to Bring
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {WHAT_TO_BRING.map((item, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 14,
                  padding: '14px 16px',
                  background: i === 4 ? '#FEF9EC' : '#F9F5FF',
                  borderRadius: 10,
                  borderLeft: `3px solid ${i === 4 ? '#F59E0B' : '#7B2CBF'}`,
                }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: '50%',
                    background: i === 4 ? '#FEF3C7' : '#E8F8E0',
                    color: i === 4 ? '#D97706' : '#5BB832',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, marginTop: 1,
                  }}>
                    <IconCheck size={12} />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, color: '#3A3A3A', fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 500, lineHeight: 1.4 }}>
                      {item.text}
                    </div>
                    <div style={{ fontSize: 12, color: '#A8A8A8', fontFamily: "'Be Vietnam Pro', sans-serif", marginTop: 2 }}>
                      {item.note}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA card */}
          <div style={{
            background: isRegisterable
              ? 'linear-gradient(160deg, #1a0230 0%, #7B2CBF 45%, #4a1070 70%, #2d0650 100%)'
              : '#fff',
            borderRadius: 16, padding: 36,
            boxShadow: '0 12px 40px rgba(97,0,164,0.04)',
            textAlign: 'center',
            position: 'relative', overflow: 'hidden',
          }}>
            {isRegisterable && (
              <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)',
                backgroundSize: '24px 24px',
                pointerEvents: 'none',
              }} />
            )}
            <div style={{ position: 'relative', zIndex: 1 }}>
              {isRegisterable ? (
                <>
                  <div style={{
                    width: 56, height: 56, borderRadius: '50%',
                    background: 'rgba(126,217,87,0.15)', color: '#7ED957',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 20px',
                  }}>
                    <IconPaw size={26} />
                  </div>
                  <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 22, fontWeight: 800, color: '#fff', margin: '0 0 10px' }}>
                    Ready to register?
                  </h3>
                  <p style={{ color: 'rgba(255,255,255,0.65)', fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: 14, margin: '0 0 28px', lineHeight: 1.6 }}>
                    No account needed. Fill out the form and receive your QR code instantly.
                  </p>
                  <a
                    href={`/register/${event.event_id}`}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 8,
                      padding: '15px 36px',
                      background: 'linear-gradient(135deg, #5BB832, #7ED957)',
                      color: '#1A3A00', borderRadius: 12, fontSize: 15, fontWeight: 700,
                      textDecoration: 'none', fontFamily: "'Plus Jakarta Sans', sans-serif",
                      boxShadow: '0 6px 24px rgba(91,184,50,0.3)',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 32px rgba(91,184,50,0.4)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 24px rgba(91,184,50,0.3)';
                    }}
                  >
                    Register Your Pet <IconArrowRight size={15} />
                  </a>
                </>
              ) : (
                <>
                  <div style={{
                    width: 56, height: 56, borderRadius: '50%',
                    background: '#F3E8FF', color: '#7B2CBF',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 16px',
                  }}>
                    <IconCalendar size={24} />
                  </div>
                  <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 18, fontWeight: 700, color: '#3A3A3A', margin: '0 0 8px' }}>
                    {isFull ? 'This event is fully booked' : `Registration is ${event.status}`}
                  </h3>
                  <p style={{ color: '#6B6B6B', fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: 14, margin: '0 0 24px', lineHeight: 1.6 }}>
                    Follow our Facebook page for announcements on future outreach events.
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
                </>
              )}
            </div>
          </div>

          {/* Back link */}
          <a href="/events" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            color: '#7B2CBF', fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 600, fontSize: 13, textDecoration: 'none',
          }}>
            <IconArrowLeft size={14} />
            Back to all events
          </a>
        </div>
      </div>
    </div>
  );
}