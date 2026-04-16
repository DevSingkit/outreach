// staff/checkin/page.tsx
'use client';
import { useState } from 'react';
import  useSWR  from 'swr';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/lib/supabase-client';
import { QRScanner } from '@/components/QRScanner';
import { QRDisplay } from '@/components/QRDisplay';
 
const walkinSchema = z.object({
  first_name: z.string().min(1, 'Required'),
  last_name: z.string().min(1, 'Required'),
  email: z.string().email('Invalid email'),
  contact_number: z.string().optional(),
  pets: z.array(z.object({
    name: z.string().min(1, 'Required'),
    species: z.enum(['Dog', 'Cat', 'Other']),
    sex: z.enum(['Male', 'Female']),
  })).min(1),
});
type WalkinForm = z.infer<typeof walkinSchema>;
 
const IconPaw = ({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) => (
<svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
<path d="M12 2C10.34 2 9 3.34 9 5s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm-5 4C5.34 6 4 7.34 4 9s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm10 0c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zM5.5 14C3.57 14 2 15.57 2 17.5S3.57 21 5.5 21c.96 0 1.83-.38 2.48-1H16c.65.62 1.52 1 2.48 1C20.43 21 22 19.43 22 17.5S20.43 14 18.48 14c-1.5 0-2.78.87-3.43 2.13C14.57 16.05 13.82 16 13 16h-2c-.82 0-1.57.05-2.05.13C8.3 14.87 7.02 14 5.5 14z" />
</svg>
);
 
const IconHome = ({ size = 20 }: { size?: number }) => (
<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
</svg>
);
const IconQr = ({ size = 20 }: { size?: number }) => (
<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
<rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="5" y="5" width="3" height="3" /><rect x="16" y="5" width="3" height="3" /><rect x="16" y="16" width="3" height="3" /><rect x="5" y="16" width="3" height="3" />
</svg>
);
const IconList = ({ size = 20 }: { size?: number }) => (
<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
<line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
</svg>
);
const IconUsers = ({ size = 20 }: { size?: number }) => (
<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
</svg>
);
const IconArrowLeft = ({ size = 20 }: { size?: number }) => (
<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
<line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
</svg>
);
const IconCreditCard = ({ size = 16 }: { size?: number }) => (
<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
<rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
</svg>
);
const IconLogOut = ({ size = 16 }: { size?: number }) => (
<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
</svg>
);
const IconStethoscope = ({ size = 20 }: { size?: number }) => (
<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
<path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" /><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" /><circle cx="20" cy="10" r="2" />
</svg>
);
const IconScissors = ({ size = 16 }: { size?: number }) => (
<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
<circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><line x1="20" y1="4" x2="8.12" y2="15.88" /><line x1="14.47" y1="14.48" x2="20" y2="20" /><line x1="8.12" y1="8.12" x2="12" y2="12" />
</svg>
);
const IconSave = ({ size = 16 }: { size?: number }) => (
<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" />
</svg>
);
const IconSearch = ({ size = 16 }: { size?: number }) => (
<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
<circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
</svg>
);
const IconUserPlus = ({ size = 16 }: { size?: number }) => (
<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" />
</svg>
);
const IconPlus = ({ size = 16 }: { size?: number }) => (
<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
<line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
</svg>
);
const IconTrash = ({ size = 14 }: { size?: number }) => (
<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
<polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" />
</svg>
);
const IconX = ({ size = 18 }: { size?: number }) => (
<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
<line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
</svg>
);
const IconActivity = ({ size = 20 }: { size?: number }) => (
<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
<polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
</svg>
);
const IconBell = ({ size = 20 }: { size?: number }) => (
<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
</svg>
);
const IconUser = ({ size = 20 }: { size?: number }) => (
<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
</svg>
);
const IconAlertTriangle = ({ size = 18 }: { size?: number }) => (
<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
</svg>
);
 
// ─── SHARED STYLE TOKENS ────────────────────────────────────
 
const colors = {
primary: '#7B2CBF',
primaryHover: '#A66DD4',
primaryLight: '#F3E8FF',
secondary: '#7ED957',
secondaryDark: '#5BB832',
secondaryLight: '#E8F8E0',
bg: '#EDEDED',
surface: '#FFFFFF',
text: '#3A3A3A',
textSoft: '#6B6B6B',
textMuted: '#A8A8A8',
border: 'rgba(123,44,191,0.12)',
error: '#C0392B',
};
 
const fonts = {
jakarta: "'Plus Jakarta Sans', sans-serif",
vietnam: "'Be Vietnam Pro', sans-serif",
};
 
const inputStyle: React.CSSProperties = {
width: '100%',
padding: '11px 14px',
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
 
const labelStyle: React.CSSProperties = {
display: 'block',
fontFamily: fonts.jakarta,
fontSize: 11,
fontWeight: 600,
textTransform: 'uppercase',
letterSpacing: '1.2px',
color: colors.textMuted,
marginBottom: 6,
};
 
const cardStyle: React.CSSProperties = {
background: colors.surface,
borderRadius: 20,
padding: 28,
boxShadow: '0 12px 40px rgba(97,0,164,0.04)',
border: '1px solid transparent',
};
 
const primaryBtn: React.CSSProperties = {
display: 'inline-flex',
alignItems: 'center',
justifyContent: 'center',
gap: 8,
padding: '13px 24px',
background: 'linear-gradient(135deg, #7B2CBF, #A66DD4)',
color: 'white',
borderRadius: 12,
fontSize: 14,
fontWeight: 700,
fontFamily: fonts.jakarta,
border: 'none',
cursor: 'pointer',
transition: 'all 0.2s',
width: '100%',
};
 
const sectionLabel = (icon: React.ReactNode, text: string) => (
<div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px', color: colors.primary, marginBottom: 10, fontFamily: fonts.jakarta }}>
{icon} {text}
</div>
);
 
// ─── STATUS BADGE ────────────────────────────────────────────
 
const statusMap: Record<string, { bg: string; color: string }> = {
pending: { bg: '#FFF3CD', color: '#856404' },
'checked-in': { bg: '#D1ECF1', color: '#0C5460' },
'Checked-in': { bg: '#D1ECF1', color: '#0C5460' },
accepted: { bg: '#D4EDDA', color: '#155724' },
Accepted: { bg: '#D4EDDA', color: '#155724' },
rejected: { bg: '#F8D7DA', color: '#721C24' },
Rejected: { bg: '#F8D7DA', color: '#721C24' },
completed: { bg: '#7B2CBF', color: '#FFFFFF' },
Completed: { bg: '#7B2CBF', color: '#FFFFFF' },
paid: { bg: '#7ED957', color: '#1A4D00' },
Paid: { bg: '#7ED957', color: '#1A4D00' },
waived: { bg: '#E2D9F3', color: '#4A1D96' },
Waived: { bg: '#E2D9F3', color: '#4A1D96' },
unpaid: { bg: '#FFF3CD', color: '#856404' },
Unpaid: { bg: '#FFF3CD', color: '#856404' },
open: { bg: '#D4EDDA', color: '#155724' },
Open: { bg: '#D4EDDA', color: '#155724' },
ongoing: { bg: '#D1ECF1', color: '#0C5460' },
Ongoing: { bg: '#D1ECF1', color: '#0C5460' },
closed: { bg: '#F8D7DA', color: '#721C24' },
};
 
function StatusBadge({ status }: { status: string }) {
const s = statusMap[status] ?? { bg: '#E2E3E5', color: '#383D41' };
return (
<span style={{ padding: '3px 11px', borderRadius: 100, fontSize: 11, fontWeight: 600, background: s.bg, color: s.color, fontFamily: fonts.vietnam, whiteSpace: 'nowrap' }}>
{status}
</span>
);
}
 
// ─── BACK LINK ───────────────────────────────────────────────
 
function BackLink({ href, label = 'Back to Queue' }: { href: string; label?: string }) {
return (
<a href={href} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: colors.textMuted, textDecoration: 'none', fontFamily: fonts.vietnam, fontSize: 14, transition: 'color 0.2s' }}
onMouseEnter={e => (e.currentTarget.style.color = colors.primary)}
onMouseLeave={e => (e.currentTarget.style.color = colors.textMuted)}>
<IconArrowLeft size={16} /> {label}
</a>
);
}
 
// ─── SPINNER ─────────────────────────────────────────────────
 
const Spinner = () => (
<span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.35)', borderTop: '2px solid white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
);
 




export default function CheckinPage() {
  const { data: events } = useSWR('events', async () => {
  const { data } = await supabase.from('events').select('*');
  return data;
});
  const activeEvent = events?.find((e: { status: string }) => e.status === 'Ongoing' || e.status === 'Open');
  const [mode, setMode] = useState<'scan' | 'walkin'>('scan');
  const [scanResult, setScanResult] = useState<string>('');
  const [walkinResult, setWalkinResult] = useState<{ registration_id: string; queue_number: number } | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
 
  const showToast = (msg: string, type: 'success' | 'error') => { setToast({ msg, type }); setTimeout(() => setToast(null), 4000); };
 
  const { register, control, handleSubmit, reset, formState: { errors } } = useForm<WalkinForm>({
    resolver: zodResolver(walkinSchema),
    defaultValues: { pets: [{ name: '', species: 'Dog', sex: 'Male' }] },
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'pets' });
 
  const handleScan = async (token: string) => {
  if (!activeEvent) return;
  try {
    const { data: reg, error } = await supabase
      .from('registrations')
      .select('registration_id, queue_number')
      .eq('qr_code_data', token)
      .eq('event_id', activeEvent.event_id)
      .single();
    if (error || !reg) throw new Error('Registration not found');
    await supabase.from('registrations').update({ checkin_status: 'Checked-in' }).eq('registration_id', reg.registration_id);
    setScanResult(token);
    showToast(`Queue #${reg.queue_number} — Checked in!`, 'success');
  } catch (err: unknown) { showToast(err instanceof Error ? err.message : 'Scan failed', 'error'); }
};
 
  const onWalkinSubmit = async (data: WalkinForm) => {
    if (!activeEvent) return;
    setIsSubmitting(true);
    try {
      const { data: owner, error: ownerError } = await supabase
        .from('owners')
        .upsert({ first_name: data.first_name, last_name: data.last_name, email: data.email, contact_number: data.contact_number ?? null }, { onConflict: 'email' })
        .select().single();
      if (ownerError) throw new Error(ownerError.message);

      const qr_code_data = `NHVC-${activeEvent.event_id}-${owner.owner_id}-${Date.now()}`;
      const { data: reg, error: regError } = await supabase
        .from('registrations')
        .insert({ event_id: activeEvent.event_id, owner_id: owner.owner_id, qr_code_data, registration_type: 'Walk-in', checkin_status: 'Checked-in' })
        .select().single();
      if (regError) throw new Error(regError.message);

      for (const pet of data.pets) {
        const { data: insertedPet, error: petError } = await supabase
          .from('pets')
          .insert({ owner_id: owner.owner_id, pet_name: pet.name, species: pet.species, sex: pet.sex })
          .select().single();
        if (petError) throw new Error(petError.message);
        await supabase.from('registration_pets').insert({ registration_id: reg.registration_id, pet_id: insertedPet.pet_id });
      }

      setWalkinResult({ registration_id: reg.registration_id, queue_number: reg.queue_number });
      setShowModal(true);
      reset();
    } catch (err: unknown) { showToast(err instanceof Error ? err.message : 'Walk-in failed', 'error'); }
    finally { setIsSubmitting(false); }
  };
  
  return (
    <div style={{ maxWidth: 680 }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } } input:focus, select:focus { background: #fff !important; border-color: #7B2CBF !important; }`}</style>
 
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        {sectionLabel(<IconQr size={12} />, 'Staff Operations')}
        <h1 style={{ fontFamily: fonts.jakarta, fontSize: 22, fontWeight: 800, color: colors.text, margin: 0 }}>Check-in</h1>
      </div>
 
      {!activeEvent && (
        <div style={{ background: '#FFFBEB', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, fontFamily: fonts.vietnam, fontSize: 14, color: '#92400E' }}>
          <IconAlertTriangle size={16} /> No active event. Waiting for an event to go Ongoing.
        </div>
      )}
 
      {/* Toast */}
      {toast && (
        <div
        style={{
          position: 'fixed',
          top: 20,
          right: 20,
          zIndex: 200,
          borderRadius: 12,
          padding: '13px 20px',
          fontSize: 14,
          fontFamily: fonts.vietnam,
          fontWeight: 600,
          background:
            toast.type === 'success'
              ? 'linear-gradient(135deg,#5BB832,#7ED957)'
              : 'linear-gradient(135deg,#C0392B,#E74C3C)',
          color: toast.type === 'success' ? '#1A3A00' : 'white',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
        }}
      >
        {toast.msg}
      </div>
      )}
 
      {/* Mode toggle */}
      <div style={{ display: 'flex', background: colors.surface, borderRadius: 12, padding: 4, marginBottom: 24, gap: 4, width: 'fit-content', boxShadow: '0 4px 16px rgba(97,0,164,0.06)' }}>
        {([['scan', <IconQr size={15} />, 'QR Scan'], ['walkin', <IconUserPlus size={15} />, 'Walk-in']] as const).map(([key, icon, label]) => (
          <button key={key} onClick={() => setMode(key as 'scan' | 'walkin')} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 20px', borderRadius: 9, border: 'none', cursor: 'pointer', fontFamily: fonts.jakarta, fontWeight: 600, fontSize: 13, transition: 'all 0.2s', background: mode === key ? 'linear-gradient(135deg,#7B2CBF,#A66DD4)' : 'transparent', color: mode === key ? 'white' : colors.textSoft }}>
            {icon} {label}
          </button>
        ))}
      </div>
 
      {/* QR Scanner Panel */}
      {mode === 'scan' && (
        <div style={cardStyle}>
          <h2 style={{ fontFamily: fonts.jakarta, fontWeight: 700, fontSize: 16, color: colors.text, marginBottom: 20, marginTop: 0 }}>Scan Participant QR Code</h2>
          <QRScanner onScan={handleScan} onError={() => showToast('Camera error — check permissions', 'error')} />
          {scanResult && <p style={{ marginTop: 12, fontSize: 12, color: colors.textMuted, fontFamily: fonts.vietnam }}>Last scan: {scanResult.slice(0, 24)}…</p>}
        </div>
      )}
 
      {/* Walk-in Form Panel */}
      {mode === 'walkin' && (
        <form onSubmit={handleSubmit(onWalkinSubmit)} noValidate style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <h2 style={{ fontFamily: fonts.jakarta, fontWeight: 700, fontSize: 16, color: colors.text, margin: 0 }}>Walk-in Registration</h2>
 
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={labelStyle}>First Name *</label>
              <input style={inputStyle} {...register('first_name')} />
              {errors.first_name && <p style={{ color: colors.error, fontSize: 12, marginTop: 4, fontFamily: fonts.vietnam }}>{errors.first_name.message}</p>}
            </div>
            <div>
              <label style={labelStyle}>Last Name *</label>
              <input style={inputStyle} {...register('last_name')} />
              {errors.last_name && <p style={{ color: colors.error, fontSize: 12, marginTop: 4, fontFamily: fonts.vietnam }}>{errors.last_name.message}</p>}
            </div>
          </div>
          <div>
            <label style={labelStyle}>Email *</label>
            <input type="email" style={inputStyle} {...register('email')} />
            {errors.email && <p style={{ color: colors.error, fontSize: 12, marginTop: 4, fontFamily: fonts.vietnam }}>{errors.email.message}</p>}
          </div>
          <div>
            <label style={labelStyle}>Contact Number</label>
            <input style={inputStyle} {...register('contact_number')} />
          </div>
 
          {/* Pets */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {fields.map((field, idx) => (
              <div key={field.id} style={{ background: colors.bg, borderRadius: 14, padding: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <span style={{ fontFamily: fonts.jakarta, fontWeight: 700, fontSize: 13, color: colors.primary }}>Pet #{idx + 1}</span>
                  {fields.length > 1 && (
                    <button type="button" onClick={() => remove(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.error, display: 'flex', alignItems: 'center' }}>
                      <IconTrash size={14} />
                    </button>
                  )}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={labelStyle}>Name *</label>
                    <input style={inputStyle} {...register(`pets.${idx}.name`)} />
                  </div>
                  <div>
                    <label style={labelStyle}>Species</label>
                    <select style={inputStyle} {...register(`pets.${idx}.species`)}>
                      <option>Dog</option><option>Cat</option><option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Sex</label>
                    <select style={inputStyle} {...register(`pets.${idx}.sex`)}>
                      <option>Male</option><option>Female</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
            <button type="button" onClick={() => append({ name: '', species: 'Dog', sex: 'Male' })}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: colors.primaryLight, color: colors.primary, border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: fonts.jakarta, fontWeight: 600, fontSize: 13, width: 'fit-content' }}>
              <IconPlus size={14} /> Add Pet
            </button>
          </div>
 
          <button type="submit" disabled={isSubmitting || !activeEvent} style={{ ...primaryBtn, opacity: isSubmitting || !activeEvent ? 0.7 : 1 }}>
            {isSubmitting ? <Spinner /> : <IconUserPlus size={16} />}
            {isSubmitting ? 'Processing…' : 'Check In Walk-in'}
          </button>
        </form>
      )}
 
      {/* Success Modal */}
      {showModal && walkinResult && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(26,2,48,0.6)', backdropFilter: 'blur(6px)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: colors.surface, borderRadius: 24, padding: 36, maxWidth: 380, width: '100%', textAlign: 'center', boxShadow: '0 32px 80px rgba(97,0,164,0.2)' }}>
            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', color: colors.textMuted }}>
              <IconX size={18} />
            </button>
            <div style={{ width: 64, height: 64, borderRadius: 20, background: colors.secondaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <span style={{ fontSize: 28 }}>✓</span>
            </div>
            <p style={{ fontFamily: fonts.jakarta, fontWeight: 800, color: colors.text, fontSize: 28, margin: '0 0 4px' }}>
              Queue #{walkinResult.queue_number}
            </p>
            <p style={{ color: colors.textMuted, fontSize: 14, fontFamily: fonts.vietnam, margin: '0 0 24px' }}>Walk-in registered successfully</p>
            <QRDisplay qrCodeData={walkinResult.registration_id} />
            <button onClick={() => setShowModal(false)} style={{ ...primaryBtn, marginTop: 20 }}>Done</button>
          </div>
        </div>
      )}
    </div>
  );
}