// staff/discharge/[registration_id]/page.tsx
'use client';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';
import { DischargeBlocker } from '@/components/DischargeBlocker';
import { use, useState } from 'react';

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
 


 
export default function DischargePage({ params }: { params: Promise<{ registration_id: string }> }) {
  const { registration_id } = use(params);
  const router = useRouter();
  const [isDischarging, setIsDischarging] = useState(false);
  const [blockerCode, setBlockerCode] = useState('');
  const [success, setSuccess] = useState(false);
 
  const handleDischarge = async () => {
    // Check all pets are completed
    const { data: regPets, error: regPetsError } = await supabase
      .from('registration_pets')
      .select('procedure_status, billing_status')
      .eq('registration_id', registration_id);
    if (regPetsError) throw new Error(regPetsError.message);

    const incomplete = regPets?.find(p => p.procedure_status !== 'Completed');
    if (incomplete) throw new Error('incomplete_procedures');

    const unpaid = regPets?.find(p => p.billing_status !== 'Paid' && p.billing_status !== 'Waived');
    if (unpaid) throw new Error('unpaid_billing');

    const { error: dischargeError } = await supabase
      .from('registrations')
      .update({ checkin_status: 'Discharged' })
      .eq('registration_id', registration_id);
    if (dischargeError) throw new Error(dischargeError.message);
  };
 
  return (
    <div style={{ maxWidth: 500 }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
 
      <div style={{ marginBottom: 28 }}>
        <BackLink href="/staff/queue" />
        <div style={{ marginTop: 16 }}>
          {sectionLabel(<IconLogOut size={12} />, 'Patient Flow')}
          <h1 style={{ fontFamily: fonts.jakarta, fontSize: 22, fontWeight: 800, color: colors.text, margin: 0 }}>Discharge Patient</h1>
        </div>
      </div>
 
      {success ? (
        <div style={{ ...cardStyle, textAlign: 'center', padding: 48 }}>
          <div style={{ width: 72, height: 72, borderRadius: 24, background: colors.secondaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 32 }}>✓</div>
          <p style={{ fontFamily: fonts.jakarta, fontWeight: 800, color: colors.text, fontSize: 20, marginBottom: 8 }}>Discharged Successfully</p>
          <p style={{ color: colors.textMuted, fontSize: 14, fontFamily: fonts.vietnam, margin: 0 }}>Redirecting to queue…</p>
        </div>
      ) : (
        <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: 20 }}>
 
          {/* Warning notice */}
          <div style={{ background: '#FFFBEB', borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'flex-start', gap: 10, color: '#92400E', fontFamily: fonts.vietnam, fontSize: 14 }}>
            <IconAlertTriangle size={16} />
            <span>Ensure all procedures are complete and payment is settled before discharging.</span>
          </div>
 
          {blockerCode && <DischargeBlocker blockerCode={blockerCode} />}
 
          <button onClick={handleDischarge} disabled={isDischarging}
            style={{ ...primaryBtn, opacity: isDischarging ? 0.7 : 1 }}>
            {isDischarging ? <Spinner /> : <IconLogOut size={16} />}
            {isDischarging ? 'Processing…' : 'Confirm Discharge'}
          </button>
 
          <a href="/staff/queue" style={{ textAlign: 'center', color: colors.primary, fontFamily: fonts.vietnam, fontSize: 14, fontWeight: 600, textDecoration: 'none', display: 'block' }}>
            Cancel — Back to Queue
          </a>
        </div>
      )}
    </div>
  );
}