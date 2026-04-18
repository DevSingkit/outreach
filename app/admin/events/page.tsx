// app/admin/events/page.tsx
'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { useForm, type Resolver } from 'react-hook-form';
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

// ─── Design Tokens (from staff/dashboard) ────────────────────────────────────
const colors = {
  primary:      '#7B2CBF',
  primaryHover: '#A66DD4',
  primaryLight: '#F3E8FF',
  secondary:    '#7ED957',
  bg:           '#EDEDED',
  surface:      '#FFFFFF',
  text:         '#3A3A3A',
  textSoft:     '#6B6B6B',
  textMuted:    '#A8A8A8',
  border:       'rgba(123,44,191,0.12)',
  error:        '#C0392B',
};

const fonts = {
  jakarta: "'Plus Jakarta Sans', sans-serif",
  vietnam: "'Be Vietnam Pro', sans-serif",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
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
      padding: '3px 11px',
      borderRadius: 100,
      fontSize: 11,
      fontWeight: 600,
      background: s.bg,
      color: s.color,
      fontFamily: fonts.vietnam,
      whiteSpace: 'nowrap',
    }}>
      {status}
    </span>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  background: '#E8E8E8',
  border: '2px solid transparent',
  borderRadius: 8,
  fontSize: 14,
  color: colors.text,
  fontFamily: fonts.vietnam,
  outline: 'none',
  transition: 'all 0.2s',
  boxSizing: 'border-box',
};

// ─── Schema ───────────────────────────────────────────────────────────────────
const eventSchema = z.object({
  event_name:       z.string().min(1, 'Name is required'),
  event_date:       z.string().min(1, 'Date is required'),
  event_time:       z.string().optional(),
  location_address: z.string().min(1, 'Location is required'),
  max_capacity:     z.coerce.number().int().min(1, 'Capacity must be at least 1'),
});
type EventForm = z.infer<typeof eventSchema>;

interface AdminEvent {
  event_id: string;
  event_name: string;
  event_date: string;
  location_address: string;
  status: string;
  max_capacity: number;
  registered_count?: number;
}

// ─── Focused Input ────────────────────────────────────────────────────────────
function FocusInput({ as: Tag = 'input', ...props }: { as?: 'input' | 'textarea'; [key: string]: unknown }) {
  const [focused, setFocused] = useState(false);
  return (
    <Tag
      {...props}
      style={{
        ...inputStyle,
        background: focused ? '#FFFFFF' : '#E8E8E8',
        border: focused ? `2px solid ${colors.primary}` : '2px solid transparent',
        ...(props.style as object ?? {}),
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
}

// ─── Section Label (matches staff/dashboard) ──────────────────────────────────
function SectionLabel({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      fontSize: 12, fontWeight: 600,
      textTransform: 'uppercase', letterSpacing: '1.5px',
      color: colors.primary, marginBottom: 10,
      fontFamily: fonts.jakarta,
    }}>
      {icon} {text}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminEventsPage() {
  const { data: events, isLoading, mutate } = useSWR('admin-events', async () => {
    const { data } = await supabase.from('events').select('*').order('event_date', { ascending: false });
    return data as AdminEvent[] | null;
  });

  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [hovered, setHovered] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<EventForm>({
    resolver: zodResolver(eventSchema) as Resolver<EventForm>,
  });

  const onSubmit = async (data: EventForm) => {
    setIsSubmitting(true);
    setError('');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated.');
      const { data: staff, error: staffError } = await supabase
        .from('staff_accounts').select('staff_id')
        .eq('supabase_uid', session.user.id).single();
      if (staffError || !staff) throw new Error('Staff account not found.');
      const { error: createError } = await supabase.from('events').insert({
        event_name:       data.event_name,
        event_date:       data.event_date,
        event_time:       data.event_time ?? null,
        location_address: data.location_address,
        max_capacity:     data.max_capacity,
        status:           'Draft',
        created_by:       staff.staff_id,
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
      .from('events').update({ status }).eq('event_id', id);
    if (statusError) throw new Error(statusError.message);
    mutate();
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'flex-start',
        justifyContent: 'space-between', flexWrap: 'wrap',
        gap: 16, marginBottom: 28,
      }}>
        <div>
          <SectionLabel icon={<IconPaw size={12} />} text="Admin Portal" />
          <h1 style={{
            fontFamily: fonts.jakarta,
            fontSize: 26, fontWeight: 800,
            color: colors.text, margin: 0,
          }}>
            Manage Events
          </h1>
          <p style={{
            fontFamily: fonts.vietnam,
            fontSize: 14, color: colors.textSoft, marginTop: 6,
          }}>
            Create and manage outreach events.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #7B2CBF, #A66DD4)',
            color: 'white', borderRadius: 12, border: 'none', cursor: 'pointer',
            fontSize: 14, fontWeight: 700,
            fontFamily: fonts.jakarta,
            boxShadow: '0 4px 16px rgba(123,44,191,0.2)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 10px 30px rgba(123,44,191,0.3)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 16px rgba(123,44,191,0.2)';
          }}
        >
          <IconPlus size={17} /> Create Event
        </button>
      </div>

      {/* Loading */}
      {isLoading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
          <span style={{
            width: 24, height: 24,
            border: '3px solid rgba(123,44,191,0.15)',
            borderTop: `3px solid ${colors.primary}`,
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            display: 'inline-block',
          }} />
        </div>
      )}

      {/* Event list */}
      <div style={{ marginBottom: 12 }}>
        <SectionLabel icon={<IconPaw size={12} />} text="Events" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {!isLoading && events?.length === 0 && (
          <p style={{ fontFamily: fonts.vietnam, color: colors.textMuted, fontSize: 14 }}>
            No events found.
          </p>
        )}

        {events?.map((event: AdminEvent) => (
          <div
            key={event.event_id}
            style={{
              background: colors.surface,
              borderRadius: 20,
              boxShadow: hovered === event.event_id
                ? '0 16px 40px rgba(123,44,191,0.08)'
                : '0 12px 40px rgba(97,0,164,0.04)',
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
              transition: 'all 0.2s',
              transform: hovered === event.event_id ? 'translateY(-2px)' : 'translateY(0)',
              border: `1px solid ${hovered === event.event_id ? colors.border : 'transparent'}`,
            }}
            onMouseEnter={() => setHovered(event.event_id)}
            onMouseLeave={() => setHovered(null)}
          >
            {/* Info */}
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{
                  fontFamily: fonts.jakarta, fontSize: 15,
                  fontWeight: 700, color: colors.text,
                }}>
                  {event.event_name}
                </span>
                <StatusBadge status={event.status} />
              </div>
              <span style={{ fontFamily: fonts.vietnam, fontSize: 12, color: colors.textMuted }}>
                {new Date(event.event_date).toLocaleDateString('en-PH', { dateStyle: 'medium' })}
                {' · '}
                <IconMapPin size={11} />
                {' '}{event.location_address}
              </span>
              {event.max_capacity && (
                <span style={{ fontFamily: fonts.vietnam, fontSize: 12, color: colors.textSoft }}>
                  {event.registered_count ?? 0} / {event.max_capacity} registered
                </span>
              )}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              {event.status === 'Draft' && (
                <button
                  onClick={() => handleStatusChange(event.event_id, 'Open')}
                  style={{
                    padding: '7px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
                    background: '#D4EDDA', color: '#155724',
                    fontSize: 12, fontWeight: 700, fontFamily: fonts.jakarta,
                  }}
                >
                  Open
                </button>
              )}
              {event.status === 'Open' && (
                <button
                  onClick={() => handleStatusChange(event.event_id, 'Ongoing')}
                  style={{
                    padding: '7px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
                    background: '#D1ECF1', color: '#0C5460',
                    fontSize: 12, fontWeight: 700, fontFamily: fonts.jakarta,
                  }}
                >
                  Start
                </button>
              )}
              {event.status === 'Ongoing' && (
                <button
                  onClick={() => handleStatusChange(event.event_id, 'Closed')}
                  style={{
                    padding: '7px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
                    background: '#F8D7DA', color: '#721C24',
                    fontSize: 12, fontWeight: 700, fontFamily: fonts.jakarta,
                  }}
                >
                  Close
                </button>
              )}
              <Link
                href={`/admin/events/${event.event_id}`}
                style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: colors.primaryLight, color: colors.primary,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  textDecoration: 'none', transition: 'background 0.15s',
                }}
              >
                <IconChevronRight size={16} />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Create Event Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(26,2,48,0.6)', zIndex: 300,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 16, backdropFilter: 'blur(4px)',
        }}>
          <div style={{
            background: colors.surface, borderRadius: 24,
            boxShadow: '0 24px 80px rgba(123,44,191,0.25)',
            width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto',
          }}>
            {/* Modal header */}
            <div style={{
              background: 'linear-gradient(160deg, #1a0230 0%, #7B2CBF 45%, #4a1070 70%, #2d0650 100%)',
              padding: '24px 28px', borderRadius: '24px 24px 0 0',
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)',
                backgroundSize: '24px 24px', pointerEvents: 'none',
              }} />
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{
                    fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
                    letterSpacing: '2px', color: 'rgba(255,255,255,0.5)',
                    marginBottom: 4, fontFamily: fonts.jakarta,
                  }}>
                    New Event
                  </div>
                  <h2 style={{
                    fontFamily: fonts.jakarta, fontSize: 20,
                    fontWeight: 800, color: 'white', margin: 0,
                  }}>
                    Create Outreach Event
                  </h2>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  style={{
                    background: 'rgba(255,255,255,0.12)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: 10, width: 36, height: 36,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', color: 'white',
                  }}
                >
                  <IconX size={18} />
                </button>
              </div>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}
            >
              {/* Event Name */}
              <div>
                <label style={{
                  display: 'block', fontSize: 11, fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '1.5px',
                  color: colors.textMuted, marginBottom: 8, fontFamily: fonts.jakarta,
                }}>
                  Event Name *
                </label>
                <FocusInput placeholder="Barangay 182 Spay & Neuter Day" {...register('event_name')} />
                {errors.event_name && (
                  <p style={{ color: colors.error, fontSize: 12, marginTop: 4, fontFamily: fonts.vietnam }}>
                    {errors.event_name.message}
                  </p>
                )}
              </div>

              {/* Date + Time */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{
                    display: 'block', fontSize: 11, fontWeight: 700,
                    textTransform: 'uppercase', letterSpacing: '1.5px',
                    color: colors.textMuted, marginBottom: 8, fontFamily: fonts.jakarta,
                  }}>
                    Date *
                  </label>
                  <FocusInput type="date" {...register('event_date')} />
                  {errors.event_date && (
                    <p style={{ color: colors.error, fontSize: 12, marginTop: 4, fontFamily: fonts.vietnam }}>
                      {errors.event_date.message}
                    </p>
                  )}
                </div>
                <div>
                  <label style={{
                    display: 'block', fontSize: 11, fontWeight: 700,
                    textTransform: 'uppercase', letterSpacing: '1.5px',
                    color: colors.textMuted, marginBottom: 8, fontFamily: fonts.jakarta,
                  }}>
                    Time
                  </label>
                  <FocusInput type="time" {...register('event_time')} />
                </div>
              </div>

              {/* Location */}
              <div>
                <label style={{
                  display: 'block', fontSize: 11, fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '1.5px',
                  color: colors.textMuted, marginBottom: 8, fontFamily: fonts.jakarta,
                }}>
                  Location *
                </label>
                <FocusInput placeholder="Barangay Hall, Caloocan City" {...register('location_address')} />
                {errors.location_address && (
                  <p style={{ color: colors.error, fontSize: 12, marginTop: 4, fontFamily: fonts.vietnam }}>
                    {errors.location_address.message}
                  </p>
                )}
              </div>

              {/* Capacity */}
              <div>
                <label style={{
                  display: 'block', fontSize: 11, fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '1.5px',
                  color: colors.textMuted, marginBottom: 8, fontFamily: fonts.jakarta,
                }}>
                  Max Capacity *
                </label>
                <FocusInput type="number" min="1" placeholder="100" {...register('max_capacity')} />
                {errors.max_capacity && (
                  <p style={{ color: colors.error, fontSize: 12, marginTop: 4, fontFamily: fonts.vietnam }}>
                    {errors.max_capacity.message}
                  </p>
                )}
              </div>

              {/* Error banner */}
              {error && (
                <div style={{
                  background: '#FFF0EE', borderLeft: `4px solid ${colors.error}`,
                  borderRadius: 8, padding: '12px 16px',
                  display: 'flex', alignItems: 'center', gap: 10,
                  color: colors.error, fontSize: 13, fontFamily: fonts.vietnam,
                }}>
                  <IconAlertCircle size={16} /> {error}
                </div>
              )}

              {/* Buttons */}
              <div style={{ display: 'flex', gap: 12, paddingTop: 4 }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    flex: 1, padding: '13px 0', borderRadius: 12,
                    border: 'none', cursor: 'pointer',
                    background: colors.bg, color: colors.textSoft,
                    fontSize: 14, fontWeight: 700, fontFamily: fonts.jakarta,
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', gap: 8,
                    padding: '13px 0', borderRadius: 12, border: 'none',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    background: 'linear-gradient(135deg, #7B2CBF, #A66DD4)',
                    color: 'white', fontSize: 14, fontWeight: 700,
                    fontFamily: fonts.jakarta,
                    opacity: isSubmitting ? 0.7 : 1,
                  }}
                >
                  {isSubmitting && (
                    <span style={{
                      width: 16, height: 16,
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite',
                      display: 'inline-block',
                    }} />
                  )}
                  {isSubmitting ? 'Creating…' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}