'use client';

import { useState, use } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { supabase } from '@/lib/supabase-client';

/* ─── ICONS ─── */

const IconArrowLeft = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
);

const IconScissors = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" />
    <line x1="20" y1="4" x2="8.12" y2="15.88" /><line x1="14.47" y1="14.48" x2="20" y2="20" /><line x1="8.12" y1="8.12" x2="12" y2="12" />
  </svg>
);

const IconAlertTriangle = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const IconSave = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" />
  </svg>
);

const IconPaw = ({ size = 13 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C10.34 2 9 3.34 9 5s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm-5 4C5.34 6 4 7.34 4 9s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm10 0c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zM5.5 14C3.57 14 2 15.57 2 17.5S3.57 21 5.5 21c.96 0 1.83-.38 2.48-1H16c.65.62 1.52 1 2.48 1C20.43 21 22 19.43 22 17.5S20.43 14 18.48 14c-1.5 0-2.78.87-3.43 2.13C14.57 16.05 13.82 16 13 16h-2c-.82 0-1.57.05-2.05.13C8.3 14.87 7.02 14 5.5 14z" />
  </svg>
);

/* ─── STYLE TOKENS ─── */

const colors = {
  primary: '#7B2CBF',
  primaryLight: '#F3E8FF',
  surface: '#FFFFFF',
  bg: '#EDEDED',
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
  width: '100%', padding: '11px 14px', background: '#E8E8E8',
  border: '2px solid transparent', borderRadius: 8, fontSize: 14,
  color: colors.text, fontFamily: fonts.vietnam, outline: 'none',
  transition: 'all 0.2s', boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  display: 'block', fontFamily: fonts.jakarta, fontSize: 11, fontWeight: 600,
  textTransform: 'uppercase' as const, letterSpacing: '1.2px',
  color: colors.textMuted, marginBottom: 6,
};

/* ─── TYPES ─── */

type ProcedureFormValues = {
  procedure_type: 'Spay' | 'Neuter' | 'Other' | '';
  medications_given: string;
  procedure_notes: string;
  procedure_date: string;
};

/* ─── SPINNER ─── */

const Spinner = () => (
  <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.35)', borderTop: '2px solid white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
);

/* ─── PAGE ─── */

export default function ProcedurePage({ params }: { params: Promise<{ reg_pet_id: string }> }) {
  const { reg_pet_id } = use(params);
  const router = useRouter();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch pet info
  const { data: regPet } = useSWR(`reg-pet-proc-${reg_pet_id}`, async () => {
    const { data } = await supabase
      .from('registration_pets')
      .select('*, pet:pets(*), registration:registrations(*, owners(*))')
      .eq('reg_pet_id', reg_pet_id)
      .single();
    return data;
  });

  // Fetch existing medical record
  const { data: existing } = useSWR(`medical-${reg_pet_id}`, async () => {
    const { data } = await supabase
      .from('medical_records')
      .select('*')
      .eq('reg_pet_id', reg_pet_id)
      .maybeSingle();
    return data;
  });

  const { register, handleSubmit } = useForm<ProcedureFormValues>({
    values: existing ? {
      procedure_type: existing.procedure_type ?? '',
      medications_given: Array.isArray(existing.medications_given) ? existing.medications_given.join(', ') : (existing.medications_given ?? ''),
      procedure_notes: existing.procedure_notes ?? '',
      procedure_date: existing.procedure_date ?? new Date().toISOString().split('T')[0],
    } : {
      procedure_type: '',
      medications_given: '',
      procedure_notes: '',
      procedure_date: new Date().toISOString().split('T')[0],
    },
  });

  const onSubmit = async (data: ProcedureFormValues) => {
    if (!data.procedure_type) { setError('Please select a procedure type.'); return; }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError('Not authenticated.'); return; }
    const { data: staff } = await supabase.from('staff_accounts').select('staff_id').eq('supabase_uid', user.id).single();
    if (!staff) { setError('Staff account not found.'); return; }

    setIsSubmitting(true);
    setError('');

    try {
      const medications = data.medications_given
        ? data.medications_given.split(',').map(m => m.trim()).filter(Boolean)
        : [];

      const { error: upsertError } = await supabase
        .from('medical_records')
        .upsert({
          reg_pet_id,
          procedure_type: data.procedure_type,
          medications_given: medications,
          procedure_notes: data.procedure_notes || null,
          performed_by: staff.staff_id,
          procedure_date: data.procedure_date,
          completed_at: new Date().toISOString(),
        }, { onConflict: 'reg_pet_id' });

      if (upsertError) throw new Error(upsertError.message);

      // Mark procedure as completed
      await supabase
        .from('registration_pets')
        .update({ procedure_status: 'Completed' })
        .eq('reg_pet_id', reg_pet_id);

      router.push('/staff/queue');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save procedure record.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const pet = regPet?.pet;
  const owner = regPet?.registration?.owners;

  return (
    <div style={{ maxWidth: 560 }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input:focus, select:focus, textarea:focus { background: #fff !important; border-color: #7B2CBF !important; }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <a href="/staff/queue" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: colors.textMuted, textDecoration: 'none', fontFamily: fonts.vietnam, fontSize: 14 }}>
          <IconArrowLeft size={16} /> Back to Queue
        </a>
        <div style={{ marginTop: 14 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px', color: colors.primary, marginBottom: 6, fontFamily: fonts.jakarta }}>
            <IconScissors size={12} /> Procedure
          </div>
          <h1 style={{ fontFamily: fonts.jakarta, fontSize: 22, fontWeight: 800, color: colors.text, margin: 0 }}>
            Record Procedure
          </h1>
        </div>
      </div>

      {/* Pet info card */}
      {regPet && (
        <div style={{ background: colors.surface, borderRadius: 20, padding: '18px 24px', boxShadow: '0 12px 40px rgba(97,0,164,0.04)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: colors.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.primary, flexShrink: 0 }}>
            <IconPaw size={22} />
          </div>
          <div>
            <p style={{ fontFamily: fonts.jakarta, fontSize: 16, fontWeight: 800, color: colors.text, margin: 0 }}>
              {pet?.pet_name ?? '—'}
            </p>
            <p style={{ fontFamily: fonts.vietnam, fontSize: 12, color: colors.textSoft, margin: '2px 0 0' }}>
              {pet?.species ?? '—'} · {pet?.sex ?? '—'} · {pet?.breed ?? 'Unknown breed'}
            </p>
            {owner && (
              <p style={{ fontFamily: fonts.vietnam, fontSize: 12, color: colors.textMuted, margin: '2px 0 0' }}>
                Owner: {owner.first_name} {owner.last_name}
              </p>
            )}
          </div>
          {existing && (
            <div style={{ marginLeft: 'auto' }}>
              <span style={{ padding: '3px 11px', borderRadius: 100, fontSize: 11, fontWeight: 600, background: '#7B2CBF', color: '#fff', fontFamily: fonts.vietnam }}>
                Completed
              </span>
            </div>
          )}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ background: colors.surface, borderRadius: 20, padding: 28, boxShadow: '0 12px 40px rgba(97,0,164,0.04)', display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Procedure type + date */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={labelStyle}>Procedure Type *</label>
              <select style={inputStyle} {...register('procedure_type')}>
                <option value="">Select…</option>
                <option value="Spay">Spay</option>
                <option value="Neuter">Neuter</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Procedure Date</label>
              <input type="date" style={inputStyle} {...register('procedure_date')} />
            </div>
          </div>

          {/* Medications */}
          <div>
            <label style={labelStyle}>Medications Given</label>
            <input
              type="text"
              placeholder="Comma-separated e.g. Amoxicillin, Meloxicam"
              style={inputStyle}
              {...register('medications_given')}
            />
            <p style={{ fontFamily: fonts.vietnam, fontSize: 11, color: colors.textMuted, margin: '5px 0 0' }}>
              Separate multiple medications with a comma.
            </p>
          </div>

          {/* Notes */}
          <div>
            <label style={labelStyle}>Procedure Notes</label>
            <textarea
              rows={4}
              placeholder="Describe the procedure, any complications, observations…"
              style={{ ...inputStyle, resize: 'none' as const }}
              {...register('procedure_notes')}
            />
          </div>

          {/* Error */}
          {error && (
            <div style={{ background: '#FDF2F2', borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, color: colors.error, fontSize: 13, fontFamily: fonts.vietnam }}>
              <IconAlertTriangle size={15} /> {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '13px 24px', background: 'linear-gradient(135deg, #7B2CBF, #A66DD4)', color: 'white', borderRadius: 12, fontSize: 14, fontWeight: 700, fontFamily: fonts.jakarta, border: 'none', cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.7 : 1, width: '100%' }}
          >
            {isSubmitting ? <Spinner /> : <IconSave size={15} />}
            {isSubmitting ? 'Saving…' : existing ? 'Update Procedure' : 'Save Procedure Record'}
          </button>

        </div>
      </form>
    </div>
  );
}