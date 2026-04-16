// staff/procedure/[reg_pet_id]/page.tsx
'use client';
import { useState, use } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

interface ProcedureForm {
  procedure_type: string;
  medications_given: string;
  procedure_notes: string;
}


const inputCls =
  'w-full bg-[#EDEDED] rounded-input px-4 py-2.5 text-sm font-dm text-text placeholder:text-muted outline-none transition focus:bg-white focus:ring-2 focus:ring-primary/30';

export default function ProcedurePage({
  params,
}: {
  params: Promise<{ reg_pet_id: string }>;
}) {
  const { reg_pet_id } = use(params);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [authError, setAuthError] = useState('');

  const { register, handleSubmit } = useForm<ProcedureForm>();

  const onSubmit = async (data: ProcedureForm) => {
    setIsSubmitting(true);
    setError('');

  };

  if (authError) {
    return (
      <div className="max-w-lg">
        <div className="bg-red-50 border-l-4 border-error rounded px-4 py-4 text-error text-sm font-dm">
          <strong>Access Denied:</strong> {authError}
        </div>
        <Link
          href="/staff/queue"
          className="inline-flex items-center gap-2 mt-4 text-primary text-sm font-dm"
        >
          <ArrowLeft size={16} /> Back to Queue
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/staff/queue" className="text-muted hover:text-primary">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-jakarta text-xl font-bold text-text">
          Record Procedure
        </h1>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-surface rounded-card p-6 shadow-sm space-y-4"
      >
        <div>
          <label className="text-xs font-semibold uppercase text-muted">
            Procedure Type
          </label>
          <select className={inputCls} {...register('procedure_type')}>
            <option value="">Select…</option>
            <option value="Spay">Spay</option>
            <option value="Neuter">Neuter</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold uppercase text-muted">
            Medications Given
          </label>
          <input
            className={inputCls}
            placeholder="Comma separated e.g. Amoxicillin, Meloxicam"
            {...register('medications_given')}
          />
        </div>

        <div>
          <label className="text-xs font-semibold uppercase text-muted">
            Procedure Notes
          </label>
          <textarea
            rows={4}
            className={inputCls + ' resize-none'}
            placeholder="Write procedure details..."
            {...register('procedure_notes')}
          />
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-error text-error text-sm px-4 py-3">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 bg-primary text-white font-semibold text-sm rounded-btn px-6 py-3.5"
        >
          {isSubmitting ? (
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          ) : (
            <Save size={16} />
          )}
          {isSubmitting ? 'Saving…' : 'Save Procedure Record'}
        </button>
      </form>
    </div>
  );
}