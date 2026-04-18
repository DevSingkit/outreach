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

const IconStethoscope = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
    <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" /><circle cx="20" cy="10" r="2" />
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

type ExamFormValues = {
  actual_weight_kg: string;
  body_condition: string;
  acceptance_status: 'Accepted' | 'Rejected' | '';
  rejection_reason: string;
};

/* ─── SPINNER ─── */

const Spinner = () => (
  <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.35)', borderTop: '2px solid white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
);

/* ─── PAGE ─── */

export default function ExaminationPage({ params }: { params: Promise<{ reg_pet_id: string }> }) {
  const { reg_pet_id } = use(params);
  const router = useRouter();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch pet info for the header
  const { data: regPet } = useSWR(`reg-pet-${reg_pet_id}`, async () => {
    const { data } = await supabase
      .from('registration_pets')
      .select('*, pet:pets(*), registration:registrations(*, owners(*))')
      .eq('reg_pet_id', reg_pet_id)
      .single();
    return data;
  });

  // Fetch existing exam record
  const { data: existing } = useSWR(`exam-${reg_pet_id}`, async () => {
    const { data } = await supabase
      .from('examination_records')
      .select('*')
      .eq('reg_pet_id', reg_pet_id)
      .maybeSingle();
    return data;
  });

  const { register, handleSubmit, watch, reset } = useForm<ExamFormValues>({
    values: existing ? {
      actual_weight_kg: existing.actual_weight_kg?.toString() ?? '',
      body_condition: existing.body_condition ?? '',
      acceptance_status: existing.acceptance_status ?? '',
      rejection_reason: existing.rejection_reason ?? '',
    } : {
      actual_weight_kg: '',
      body_condition: '',
      acceptance_status: '',
      rejection_reason: '',
    },
  });

  const status = watch('acceptance_status');

  const onSubmit = async (data: ExamFormValues) => {
    if (!data.acceptance_status) { setError('Please select a decision.'); return; }
    if (data.acceptance_status === 'Rejected' && !data.rejection_reason?.trim()) {
      setError('Rejection reason is required when rejecting.'); return;
    }

    // Fetch current staff
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError('Not authenticated.'); return; }
    const { data: staff } = await supabase.from('staff_accounts').select('staff_id').eq('supabase_uid', user.id).single();
    if (!staff) { setError('Staff account not found.'); return; }

    setIsSubmitting(true);
    setError('');

    try {
      const { error: upsertError } = await supabase
        .from('examination_records')
        .upsert({
          reg_pet_id,
          actual_weight_kg: data.actual_weight_kg ? Number(data.actual_weight_kg) : null,
          body_condition: data.body_condition || null,
          acceptance_status: data.acceptance_status,
          rejection_reason: data.acceptance_status === 'Rejected' ? data.rejection_reason : null,
          examined_by: staff.staff_id,
          examined_at: new Date().toISOString(),
        }, { onConflict: 'reg_pet_id' });

      if (upsertError) throw new Error(upsertError.message);

      // Update procedure_status on registration_pets
      await supabase
        .from('registration_pets')
        .update({ procedure_status: data.acceptance_status })
        .eq('reg_pet_id', reg_pet_id);

      router.push('/staff/queue');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save examination record.');
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
            <IconStethoscope size={12} /> Examination
          </div>
          <h1 style={{ fontFamily: fonts.jakarta, fontSize: 22, fontWeight: 800, color: colors.text, margin: 0 }}>
            Pre-op Examination
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
          {existing?.acceptance_status && (
            <div style={{ marginLeft: 'auto' }}>
              <span style={{ padding: '3px 11px', borderRadius: 100, fontSize: 11, fontWeight: 600, background: existing.acceptance_status === 'Accepted' ? '#D4EDDA' : '#F8D7DA', color: existing.acceptance_status === 'Accepted' ? '#155724' : '#721C24', fontFamily: fonts.vietnam }}>
                {existing.acceptance_status}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ background: colors.surface, borderRadius: 20, padding: 28, boxShadow: '0 12px 40px rgba(97,0,164,0.04)', display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Weight + Body Condition */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={labelStyle}>Actual Weight (kg)</label>
              <input
                type="number" step="0.01" min="0" placeholder="e.g. 4.5"
                style={inputStyle} {...register('actual_weight_kg')}
              />
            </div>
            <div>
              <label style={labelStyle}>Body Condition</label>
              <select style={inputStyle} {...register('body_condition')}>
                <option value="">Select…</option>
                <option value="Underweight">Underweight</option>
                <option value="Ideal">Ideal</option>
                <option value="Overweight">Overweight</option>
                <option value="Obese">Obese</option>
              </select>
            </div>
          </div>

          {/* Decision */}
          <div>
            <label style={labelStyle}>Decision *</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {(['Accepted', 'Rejected'] as const).map(val => (
                <label
                  key={val}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '12px 16px', borderRadius: 10, cursor: 'pointer',
                    border: `2px solid ${status === val ? (val === 'Accepted' ? '#28A745' : colors.error) : colors.border}`,
                    background: status === val ? (val === 'Accepted' ? '#D4EDDA' : '#FDF2F2') : colors.bg,
                    transition: 'all 0.15s',
                  }}
                >
                  <input type="radio" value={val} {...register('acceptance_status')} style={{ accentColor: val === 'Accepted' ? '#28A745' : colors.error }} />
                  <span style={{ fontFamily: fonts.jakarta, fontSize: 13, fontWeight: 700, color: status === val ? (val === 'Accepted' ? '#155724' : colors.error) : colors.textSoft }}>
                    {val}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Rejection reason — only shown when Rejected */}
          {status === 'Rejected' && (
            <div>
              <label style={labelStyle}>Rejection Reason *</label>
              <textarea
                rows={3}
                placeholder="Explain why this pet cannot proceed with the procedure…"
                style={{ ...inputStyle, resize: 'none' as const }}
                {...register('rejection_reason')}
              />
            </div>
          )}

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
            {isSubmitting ? 'Saving…' : existing ? 'Update Examination' : 'Save Examination'}
          </button>

        </div>
      </form>
    </div>
  );
}