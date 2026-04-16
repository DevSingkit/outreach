// app/admin/events/page.tsx
'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { supabase } from '@/lib/supabase-client';

// ─── Icons ────────────────────────────────────────────────────────────────────
const IconPaw = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C10.34 2 9 3.34 9 5s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm-5 4C5.34 6 4 7.34 4 9s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm10 0c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zM5.5 14C3.57 14 2 15.57 2 17.5S3.57 21 5.5 21c.96 0 1.83-.38 2.48-1H16c.65.62 1.52 1 2.48 1C20.43 21 22 19.43 22 17.5S20.43 14 18.48 14c-1.5 0-2.78.87-3.43 2.13C14.57 16.05 13.82 16 13 16h-2c-.82 0-1.57.05-2.05.13C8.3 14.87 7.02 14 5.5 14z" />
  </svg>
);
const IconPlus = ({ size = 17 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const IconX = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const IconChevronRight = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const IconMapPin = ({ size = 13 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const IconAlertCircle = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

// ─── Helpers ──────────────────────────────────────────────────────────────────
const statusMap: Record<string, { bg: string; color: string }> = {
  Draft:   { bg: '#E2E3E5', color: '#383D41' },
  Open:    { bg: '#D4EDDA', color: '#155724' },
  Ongoing: { bg: '#D1ECF1', color: '#0C5460' },
  Closed:  { bg: '#F8D7DA', color: '#721C24' },
};
function StatusBadge({ status }: { status: string }) {
  const s = statusMap[status] ?? { bg: '#E2E3E5', color: '#383D41' };
  return <span style={{ padding: '3px 12px', borderRadius: 100, fontSize: 11, fontWeight: 700, background: s.bg, color: s.color, fontFamily: "'Be Vietnam Pro', sans-serif", whiteSpace: 'nowrap' }}>{status}</span>;
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px 16px',
  background: '#E8E8E8', border: '2px solid transparent',
  borderRadius: 8, fontSize: 14, color: '#3A3A3A',
  fontFamily: "'Be Vietnam Pro', sans-serif",
  outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box',
};

// ─── Schema ───────────────────────────────────────────────────────────────────
const eventSchema = z.object({
  event_name:             z.string().min(1, 'Name is required'),
  event_date:       z.string().min(1, 'Date is required'),
  event_time:       z.string().optional(),
  location_address: z.string().min(1, 'Location is required'),
  max_capacity:     z.coerce.number().int().min(1, 'Capacity must be at least 1'),
  description:      z.string().optional(),
});
type EventForm = z.infer<typeof eventSchema>;

// ─── Focused Input ────────────────────────────────────────────────────────────
function FocusInput({ as: Tag = 'input', ...props }: { as?: 'input' | 'textarea'; [key: string]: unknown }) {
  const [focused, setFocused] = useState(false);
  return (
    <Tag
      {...props}
      style={{ ...inputStyle, background: focused ? '#FFFFFF' : '#E8E8E8', border: focused ? '2px solid #7B2CBF' : '2px solid transparent', ...(props.style as object ?? {}) }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminEventsPage() {
  const { data: events, isLoading, mutate } = useSWR('admin-events', async () => {
  const { data } = await supabase.from('events').select('*').order('event_date', { ascending: false });
  return data;
    });
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [hovered, setHovered] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<EventForm>({
    resolver: zodResolver(eventSchema) as any,
  });

  const onSubmit = async (data: EventForm) => {
    setIsSubmitting(true);
    setError('');
    try {
      const { error: createError } = await supabase.from('events').insert({
        event_name: data.event_name,
        event_date: data.event_date,
        event_time: data.event_time ?? null,
        location_address: data.location_address,
        max_capacity: data.max_capacity,
        description: data.description ?? null,
        status: 'Draft',
      });
      if (createError) throw new Error(createError.message);
      mutate();
      reset();
      setShowModal(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    const { error: statusError } = await supabase
      .from('events')
      .update({ status })
      .eq('event_id', id);
    if (statusError) throw new Error(statusError.message);
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 36 }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#7B2CBF', marginBottom: 8, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <IconPaw size={12} /> Events
          </div>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 800, color: '#3A3A3A', margin: 0 }}>
            Manage Events
          </h1>
        </div>
        <button onClick={() => setShowModal(true)} style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '12px 24px',
          background: 'linear-gradient(135deg, #7B2CBF, #A66DD4)',
          color: 'white', borderRadius: 12, border: 'none', cursor: 'pointer',
          fontSize: 14, fontWeight: 700,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          boxShadow: '0 4px 16px rgba(123,44,191,0.2)',
          transition: 'all 0.2s',
        }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 10px 30px rgba(123,44,191,0.3)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 16px rgba(123,44,191,0.2)'; }}
        >
          <IconPlus size={17} /> Create Event
        </button>
      </div>

      {/* Loading */}
      {isLoading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 64 }}>
          <span style={{ width: 28, height: 28, border: '3px solid rgba(123,44,191,0.15)', borderTop: '3px solid #7B2CBF', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
        </div>
      )}

      {/* Event cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {events?.map((event: { event_id: string; event_name: string; event_date: string; location_address: string; status: string; max_capacity: number; registered_count?: number }) => (
          <div key={event.event_id} style={{
            background: '#FFFFFF', borderRadius: 16,
            boxShadow: hovered === event.event_id ? '0 16px 40px rgba(123,44,191,0.08)' : '0 12px 40px rgba(97,0,164,0.04)',
            padding: '20px 28px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
            transition: 'all 0.2s',
            transform: hovered === event.event_id ? 'translateY(-2px)' : 'translateY(0)',
            border: '1px solid ' + (hovered === event.event_id ? 'rgba(123,44,191,0.12)' : 'transparent'),
          }}
            onMouseEnter={() => setHovered(event.event_id)}
            onMouseLeave={() => setHovered(null)}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
                <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, fontWeight: 700, color: '#3A3A3A' }}>
                  {event.event_name}
                </span>
                <StatusBadge status={event.status} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: 12, color: '#6B6B6B' }}>
                  {new Date(event.event_date).toLocaleDateString('en-PH', { dateStyle: 'medium' })}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: 12, color: '#6B6B6B' }}>
                  <IconMapPin size={12} /> {event.location_address}
                </span>
                <span style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: 12, color: '#A8A8A8' }}>
                  {event.registered_count ?? 0} / {event.max_capacity} slots
                </span>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              {event.status === 'Draft' && (
                <button onClick={() => handleStatusChange(event.event_id, 'Open')} style={{
                  padding: '7px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
                  background: '#D4EDDA', color: '#155724',
                  fontSize: 12, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}>Open</button>
              )}
              {event.status === 'Open' && (
                <button onClick={() => handleStatusChange(event.event_id, 'Ongoing')} style={{
                  padding: '7px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
                  background: '#D1ECF1', color: '#0C5460',
                  fontSize: 12, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}>Start</button>
              )}
              {event.status === 'Ongoing' && (
                <button onClick={() => handleStatusChange(event.event_id, 'Closed')} style={{
                  padding: '7px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
                  background: '#F8D7DA', color: '#721C24',
                  fontSize: 12, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}>Close</button>
              )}
              <Link href={`/admin/events/${event.event_id}`} style={{
                width: 36, height: 36, borderRadius: 10,
                background: '#F3E8FF', color: '#7B2CBF',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                textDecoration: 'none', transition: 'background 0.15s',
              }}>
                <IconChevronRight size={16} />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Create Event Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(26,2,48,0.6)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, backdropFilter: 'blur(4px)' }}>
          <div style={{
            background: '#FFFFFF', borderRadius: 24,
            boxShadow: '0 24px 80px rgba(123,44,191,0.25)',
            width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto',
          }}>
            {/* Modal header */}
            <div style={{
              background: 'linear-gradient(160deg, #1a0230 0%, #7B2CBF 45%, #4a1070 70%, #2d0650 100%)',
              padding: '24px 28px', borderRadius: '24px 24px 0 0', position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '24px 24px', pointerEvents: 'none' }} />
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: 'rgba(255,255,255,0.5)', marginBottom: 4, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>New Event</div>
                  <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 20, fontWeight: 800, color: 'white', margin: 0 }}>Create Outreach Event</h2>
                </div>
                <button onClick={() => setShowModal(false)} style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}>
                  <IconX size={18} />
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#A8A8A8', marginBottom: 8, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Event Name *</label>
                <FocusInput placeholder="Barangay 182 Spay & Neuter Day" {...register('event_name')} />
                {errors.event_name && <p style={{ color: '#C0392B', fontSize: 12, marginTop: 4, fontFamily: "'Be Vietnam Pro', sans-serif" }}>{errors.event_name.message}</p>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#A8A8A8', marginBottom: 8, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Date *</label>
                  <FocusInput type="date" {...register('event_date')} />
                  {errors.event_date && <p style={{ color: '#C0392B', fontSize: 12, marginTop: 4, fontFamily: "'Be Vietnam Pro', sans-serif" }}>{errors.event_date.message}</p>}
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#A8A8A8', marginBottom: 8, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Time</label>
                  <FocusInput type="time" {...register('event_time')} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#A8A8A8', marginBottom: 8, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Location *</label>
                <FocusInput placeholder="Barangay Hall, Caloocan City" {...register('location_address')} />
                {errors.location_address && <p style={{ color: '#C0392B', fontSize: 12, marginTop: 4, fontFamily: "'Be Vietnam Pro', sans-serif" }}>{errors.location_address.message}</p>}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#A8A8A8', marginBottom: 8, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Max Capacity *</label>
                <FocusInput type="number" min="1" placeholder="100" {...register('max_capacity')} />
                {errors.max_capacity && <p style={{ color: '#C0392B', fontSize: 12, marginTop: 4, fontFamily: "'Be Vietnam Pro', sans-serif" }}>{errors.max_capacity.message}</p>}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#A8A8A8', marginBottom: 8, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Description</label>
                <FocusInput as="textarea" rows={3} style={{ resize: 'none' }} {...register('description')} />
              </div>

              {error && (
                <div style={{ background: '#FFF0EE', borderLeft: '4px solid #C0392B', borderRadius: 8, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, color: '#C0392B', fontSize: 13, fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                  <IconAlertCircle size={16} /> {error}
                </div>
              )}

              <div style={{ display: 'flex', gap: 12, paddingTop: 4 }}>
                <button type="button" onClick={() => setShowModal(false)} style={{
                  flex: 1, padding: '13px 0', borderRadius: 12, border: 'none', cursor: 'pointer',
                  background: '#EDEDED', color: '#6B6B6B', fontSize: 14, fontWeight: 700,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}>Cancel</button>
                <button type="submit" disabled={isSubmitting} style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '13px 0', borderRadius: 12, border: 'none', cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  background: 'linear-gradient(135deg, #7B2CBF, #A66DD4)',
                  color: 'white', fontSize: 14, fontWeight: 700,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  opacity: isSubmitting ? 0.7 : 1,
                }}>
                  {isSubmitting && <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />}
                  {isSubmitting ? 'Creating…' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}