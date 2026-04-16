// app/admin/events/[id]/page.tsx
'use client';

import { use, useState } from 'react';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';
import { supabase } from '@/lib/supabase-client';
import Link from 'next/link';

// ─── Icons ────────────────────────────────────────────────────────────────────
const IconArrowLeft = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
);
const IconSave = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" />
  </svg>
);
const IconCheck = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IconAlertCircle = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
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
  return <span style={{ padding: '4px 14px', borderRadius: 100, fontSize: 12, fontWeight: 700, background: s.bg, color: s.color, fontFamily: "'Be Vietnam Pro', sans-serif" }}>{status}</span>;
}

// ─── Focused Input ────────────────────────────────────────────────────────────
function FocusInput({ as: Tag = 'input', ...props }: { as?: 'input' | 'textarea'; [key: string]: unknown }) {
  const [focused, setFocused] = useState(false);
  const base: React.CSSProperties = {
    width: '100%', padding: '12px 16px',
    background: focused ? '#FFFFFF' : '#E8E8E8',
    border: focused ? '2px solid #7B2CBF' : '2px solid transparent',
    borderRadius: 8, fontSize: 14, color: '#3A3A3A',
    fontFamily: "'Be Vietnam Pro', sans-serif",
    outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box',
    ...(props.style as object ?? {}),
  };
  return <Tag {...props} style={base} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />;
}

// ─── Page ─────────────────────────────────────────────────────────────────────
const STATUS_FLOW = ['Draft', 'Open', 'Ongoing', 'Closed'];

export default function AdminEventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: event, isLoading, mutate } = useSWR(`event-${id}`, async () => {
  const { data } = await supabase.from('events').select('*').eq('event_id', id).single();
  return data;
});
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: Record<string, unknown>) => {
    const { error: updateError } = await supabase
      .from('events')
      .update({
        event_name: data.name,
        event_date: data.event_date,
        location_address: data.location_address,
        max_capacity: data.max_capacity ? Number(data.max_capacity) : null,
        description: data.description ?? null,
      })
      .eq('event_id', id);
    if (updateError) throw new Error(updateError.message);
    await mutate();

  const handleStatusChange = async (status: string) => {
    const { error: statusError } = await supabase
      .from('events')
      .update({ status })
      .eq('event_id', id);
    if (statusError) throw new Error(statusError.message);
    await mutate();
  };

  if (isLoading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 320 }}>
      <span style={{ width: 32, height: 32, border: '3px solid rgba(123,44,191,0.15)', borderTop: '3px solid #7B2CBF', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
  if (!event) return <p style={{ color: '#6B6B6B', fontFamily: "'Be Vietnam Pro', sans-serif" }}>Event not found.</p>;

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      {/* Back + title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
        <Link href="/admin/events" style={{
          width: 40, height: 40, borderRadius: 10,
          background: '#FFFFFF', color: '#6B6B6B',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          textDecoration: 'none', boxShadow: '0 4px 12px rgba(97,0,164,0.06)',
          transition: 'all 0.15s',
        }}>
          <IconArrowLeft size={18} />
        </Link>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 22, fontWeight: 800, color: '#3A3A3A', margin: 0, lineHeight: 1.2 }}>
            {event.event_name}
          </h1>
        </div>
        <StatusBadge status={event.status} />
      </div>

      {/* Status pipeline */}
      <div style={{ background: '#FFFFFF', borderRadius: 24, boxShadow: '0 12px 40px rgba(97,0,164,0.04)', padding: '24px 28px', marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#A8A8A8', marginBottom: 16, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Event Status
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {STATUS_FLOW.map((s, i) => {
            const isActive = event.status === s;
            const isPast = STATUS_FLOW.indexOf(event.status) > i;
            return (
              <button key={s} onClick={() => handleStatusChange(s)} disabled={isActive} style={{
                padding: '10px 20px', borderRadius: 10, border: 'none', cursor: isActive ? 'default' : 'pointer',
                fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, fontWeight: 700,
                display: 'flex', alignItems: 'center', gap: 6,
                transition: 'all 0.2s',
                background: isActive
                  ? 'linear-gradient(135deg, #7B2CBF, #A66DD4)'
                  : isPast ? '#F3E8FF' : '#EDEDED',
                color: isActive ? 'white' : isPast ? '#7B2CBF' : '#6B6B6B',
                boxShadow: isActive ? '0 4px 16px rgba(123,44,191,0.25)' : 'none',
              }}>
                {isPast && <IconCheck size={13} />}
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Success toast */}
      {saved && (
        <div style={{
          background: 'linear-gradient(135deg, #D4EDDA, #c3e6cb)',
          borderRadius: 12, padding: '14px 20px', marginBottom: 20,
          display: 'flex', alignItems: 'center', gap: 10,
          color: '#155724', fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: 14, fontWeight: 600,
        }}>
          <IconCheck size={18} /> Event details saved successfully.
        </div>
      )}

      {/* Edit form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ background: '#FFFFFF', borderRadius: 24, boxShadow: '0 12px 40px rgba(97,0,164,0.04)', overflow: 'hidden' }}>
          {/* Form header */}
          <div style={{
            background: 'linear-gradient(160deg, #1a0230 0%, #7B2CBF 100%)',
            padding: '20px 28px', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '24px 24px', pointerEvents: 'none' }} />
            <div style={{ position: 'relative' }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: 'rgba(255,255,255,0.5)', marginBottom: 4, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Editing</div>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 18, fontWeight: 800, color: 'white', margin: 0 }}>Event Details</h2>
            </div>
          </div>

          <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#A8A8A8', marginBottom: 8, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Event Name</label>
              <FocusInput defaultValue={event.event_name} {...register('name')} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#A8A8A8', marginBottom: 8, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Date</label>
                <FocusInput type="date" defaultValue={event.event_date?.slice(0, 10)} {...register('event_date')} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#A8A8A8', marginBottom: 8, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Time</label>
                <FocusInput type="time" defaultValue={event.event_time ?? ''} {...register('event_time')} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#A8A8A8', marginBottom: 8, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Location</label>
              <FocusInput defaultValue={event.location_address} {...register('location_address')} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#A8A8A8', marginBottom: 8, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Max Capacity</label>
              <FocusInput type="number" min="1" defaultValue={event.max_capacity} {...register('max_capacity')} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#A8A8A8', marginBottom: 8, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Description</label>
              <FocusInput as="textarea" rows={4} style={{ resize: 'none' }} defaultValue={event.description ?? ''} {...register('description')} />
            </div>

            {error && (
              <div style={{ background: '#FFF0EE', borderLeft: '4px solid #C0392B', borderRadius: 8, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, color: '#C0392B', fontSize: 13, fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                <IconAlertCircle size={16} /> {error}
              </div>
            )}

            <button type="submit" disabled={isSaving} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '14px 0', borderRadius: 12, border: 'none',
              cursor: isSaving ? 'not-allowed' : 'pointer',
              background: 'linear-gradient(135deg, #7B2CBF, #A66DD4)',
              color: 'white', fontSize: 15, fontWeight: 700,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              opacity: isSaving ? 0.7 : 1,
              boxShadow: '0 4px 16px rgba(123,44,191,0.2)',
              transition: 'all 0.2s',
            }}>
              {isSaving
                ? <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                : <IconSave size={16} />}
              {isSaving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}}