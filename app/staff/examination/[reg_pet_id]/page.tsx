'use client';

import { useState, use } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';

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

export default function ExaminationPage({ params }: { params: Promise<{ reg_pet_id: string }> }) {
  const { reg_pet_id } = use(params);
  const router = useRouter();

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);


  const { register, handleSubmit, watch } = useForm<ExamFormValues>({
    // Populate form with existing data when it loads
    
  });

  const status = watch('acceptance_status');

  const onSubmit = async (data: ExamFormValues) => {
    
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
      const { error: submitError } = await supabase
        .from('examinations')
        .upsert({
          reg_pet_id,
          actual_weight_kg: data.actual_weight_kg ? Number(data.actual_weight_kg) : null,
          body_condition: data.body_condition || null,
          acceptance_status: data.acceptance_status,
          rejection_reason: data.acceptance_status === 'Rejected' ? data.rejection_reason : null,
        }, { onConflict: 'reg_pet_id' });
      if (submitError) throw new Error(submitError.message);
      router.push('/staff/queue');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save examination record.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
    </div>
  );
}