'use client';

import { supabase } from '@/lib/supabase-client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';

/* ─── ICONS ─── */

const IconArrowLeft = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const IconSave = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 21H5V3h11l3 3z" />
  </svg>
);

const IconAlertTriangle = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

/* ─── STYLES ─── */

const colors = {
  primary: '#7B2CBF',
  primaryLight: '#F3E8FF',
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
  textTransform: 'uppercase' as const,
  letterSpacing: '1.2px',
  color: colors.textMuted,
  marginBottom: 6,
};

const cardStyle: React.CSSProperties = {
  background: colors.surface,
  borderRadius: 20,
  padding: 28,
  boxShadow: '0 12px 40px rgba(97,0,164,0.04)',
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
  width: '100%',
};

/* ─── STATUS BADGE ─── */

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    Accepted: { bg: '#D4EDDA', color: '#155724' },
    Rejected: { bg: '#F8D7DA', color: '#721C24' },
  };
  const s = map[status] ?? { bg: '#E2E3E5', color: '#383D41' };
  return (
    <span style={{
      padding: '3px 11px',
      borderRadius: 100,
      fontSize: 11,
      fontWeight: 600,
      background: s.bg,
      color: s.color,
      fontFamily: fonts.vietnam,
    }}>
      {status}
    </span>
  );
}

/* ─── TYPES ─── */

// Mirrors ExaminationRecord from api.ts
type ExamFormValues = {
  actual_weight_kg?: number;
  body_condition?: string;
  acceptance_status: 'Accepted' | 'Rejected' | '';
  rejection_reason?: string;
};

/* ─── COMPONENT ─── */

export default function ExaminationPage({ params }: { params: { reg_pet_id: string } }) {
  const { reg_pet_id } = params;
  const router = useRouter();

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch current staff user — examined_by is a required UUID FK
  const { data: me } = useSWR('auth-me', () => authApi.me());

  // Fetch existing examination record for this reg_pet
  const { data: existing, mutate } = useSWR(
    `exam-${reg_pet_id}`,
    () => examinationApi.getById(reg_pet_id)
  );

  const { register, handleSubmit, watch, reset } = useForm<ExamFormValues>({
    // Populate form with existing data when it loads
    values: existing
      ? {
          actual_weight_kg: existing.actual_weight_kg,
          body_condition: existing.body_condition ?? '',
          acceptance_status: existing.acceptance_status,
          rejection_reason: existing.rejection_reason ?? '',
        }
      : undefined,
  });

  const status = watch('acceptance_status');

  const onSubmit = async (data: ExamFormValues) => {
    if (!me?.userId) {
      setError('Could not resolve staff identity. Please refresh.');
      return;
    }

    if (data.acceptance_status === 'Rejected' && !data.rejection_reason?.trim()) {
      setError('Rejection reason is required when rejecting.');
      return;
    }

    if (!data.acceptance_status) {
      setError('Please select a decision.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await examinationApi.submit({
        reg_pet_id,
        actual_weight_kg: data.actual_weight_kg ? Number(data.actual_weight_kg) : undefined,
        body_condition: data.body_condition || undefined,
        acceptance_status: data.acceptance_status as 'Accepted' | 'Rejected',
        rejection_reason: data.acceptance_status === 'Rejected' ? data.rejection_reason : undefined,
        examined_by: me.userId, // required UUID FK → staff_accounts.staff_id
      });

      await mutate(); // revalidate existing record
      router.push('/staff/queue');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save examination record.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isReadOnly = !!existing?.exam_id; // already submitted — show read-only view

  return (
    <div style={{ maxWidth: 600 }}>
      <style>{`
        input:focus, select:focus, textarea:focus {
          background: #fff !important;
          border-color: #7B2CBF !important;
        }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <a
          href="/staff/queue"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            color: colors.textMuted,
            textDecoration: 'none',
            fontFamily: fonts.vietnam,
            fontSize: 14,
          }}
        >
          <IconArrowLeft size={16} /> Back to Queue
        </a>
        <h1 style={{ fontFamily: fonts.jakarta, fontSize: 22, fontWeight: 800, color: colors.text, marginTop: 12 }}>
          Pre-op Examination
        </h1>
      </div>

      {/* Existing record summary (read-only) */}
      {existing?.exam_id && (
        <div style={{
          ...cardStyle,
          marginBottom: 20,
          border: `1px solid ${colors.border}`,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <strong style={{ fontFamily: fonts.jakarta, fontSize: 14 }}>Examination Record</strong>
            <StatusBadge status={existing.acceptance_status} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, color: colors.textSoft, fontFamily: fonts.vietnam }}>
            <div><strong>Exam ID:</strong> {existing.exam_id}</div>
            <div><strong>Weight:</strong> {existing.actual_weight_kg != null ? `${existing.actual_weight_kg} kg` : '—'}</div>
            <div><strong>Body Condition:</strong> {existing.body_condition ?? '—'}</div>
            {existing.rejection_reason && (
              <div><strong>Rejection Reason:</strong> {existing.rejection_reason}</div>
            )}
            <div>
              <strong>Examined:</strong>{' '}
              {existing.examined_at ? new Date(existing.examined_at).toLocaleString() : '—'}
            </div>
            <div><strong>Staff ID:</strong> {existing.examined_by}</div>
          </div>
        </div>
      )}

      {/* Form — hidden if already submitted */}
      {!isReadOnly && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: 18 }}
        >
          {/* Weight */}
          <div>
            <label style={labelStyle}>Actual Weight (kg)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              style={inputStyle}
              placeholder="e.g. 4.5"
              {...register('actual_weight_kg')}
            />
          </div>

          {/* Body Condition */}
          <div>
            <label style={labelStyle}>Body Condition</label>
            <select style={inputStyle} {...register('body_condition')}>
              <option value="">Select…</option>
              <option>Good</option>
              <option>Fair</option>
              <option>Poor</option>
            </select>
          </div>

          {/* Decision */}
          <div>
            <label style={labelStyle}>Decision *</label>
            <select style={inputStyle} {...register('acceptance_status')} required>
              <option value="">Select…</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Rejection Reason — only shown when Rejected */}
          {status === 'Rejected' && (
            <div>
              <label style={labelStyle}>Rejection Reason *</label>
              <textarea
                rows={3}
                style={{ ...inputStyle, resize: 'vertical' }}
                placeholder="Describe why the pet cannot proceed…"
                {...register('rejection_reason')}
              />
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: '#FDF2F2',
              border: '1px solid rgba(192,57,43,0.2)',
              borderRadius: 10,
              padding: '12px 16px',
              color: colors.error,
              fontSize: 13,
              fontFamily: fonts.vietnam,
            }}>
              <IconAlertTriangle size={16} /> {error}
            </div>
          )}

          {/* Submit */}
          <button type="submit" style={{ ...primaryBtn, opacity: isSubmitting ? 0.7 : 1 }} disabled={isSubmitting}>
            <IconSave size={16} />
            {isSubmitting ? 'Saving…' : 'Save Examination'}
          </button>
        </form>
      )}

      {/* If already submitted, show re-submit option (e.g. correction) */}
      {isReadOnly && (
        <div style={{ marginTop: 16, textAlign: 'center', fontSize: 13, color: colors.textMuted, fontFamily: fonts.vietnam }}>
          Examination already recorded.{' '}
          <button
            onClick={() => reset()}
            style={{ background: 'none', border: 'none', color: colors.primary, cursor: 'pointer', fontFamily: fonts.vietnam, fontSize: 13, textDecoration: 'underline' }}
          >
            Submit correction
          </button>
        </div>
      )}
    </div>
  );
}