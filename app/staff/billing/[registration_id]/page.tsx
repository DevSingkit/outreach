'use client';

import { use, useState } from 'react';
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

const IconCreditCard = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);

const IconPlus = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const IconTrash = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" />
  </svg>
);

const IconAlertTriangle = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
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
  border: `1px solid ${colors.border}`,
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

const Spinner = () => (
  <span style={{
    width: 16, height: 16,
    border: '2px solid rgba(255,255,255,0.35)',
    borderTop: '2px solid white',
    borderRadius: '50%',
    display: 'inline-block',
    animation: 'spin 0.7s linear infinite',
  }} />
);

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    Paid:   { bg: '#7ED957', color: '#1A4D00' },
    Unpaid: { bg: '#FFF3CD', color: '#856404' },
    Waived: { bg: '#E2D9F3', color: '#4A1D96' },
  };
  const s = map[status] ?? { bg: '#E2E3E5', color: '#383D41' };
  return (
    <span style={{ padding: '3px 11px', borderRadius: 100, fontSize: 11, fontWeight: 600, background: s.bg, color: s.color, fontFamily: fonts.vietnam }}>
      {status}
    </span>
  );
}

/* ─── SERVICE ITEM TYPE ─── */
// Matches the jsonb objects stored in billing_records.service_items
type ServiceItem = {
  description: string;
  amount: number;
};

/* ─── FORM VALUES ─── */
type BillingFormValues = {
  payment_status: 'Unpaid' | 'Paid' | 'Waived';
  payment_method: 'Cash' | 'GCash' | 'Other' | '';
};

/* ─── COMPONENT ─── */

export default function BillingPage({ params }: { params: Promise<{ registration_id: string }> }) {
  const { registration_id } = use(params);
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // service_items is a required jsonb array — manage it locally
  const [serviceItems, setServiceItems] = useState<ServiceItem[]>([
    { description: '', amount: 0 },
  ]);

  // Fetch current staff for processed_by (required UUID FK)
  const { data: me } = useSWR('auth-me', () => authApi.me());

  // Fetch existing billing record for this registration
  const { data: existing, mutate } = useSWR(
    `billing-${registration_id}`,
    () => billingApi.getByRegId(registration_id),
    {
      // Populate local service items from existing record
      onSuccess: (data) => {
        if (data?.service_items?.length) {
          setServiceItems(data.service_items as ServiceItem[]);
        }
      },
    }
  );

  const { register, handleSubmit, watch } = useForm<BillingFormValues>({
    values: {
      payment_status: existing?.payment_status ?? 'Unpaid',
      payment_method: existing?.payment_method ?? '',
    },
  });

  const paymentStatus = watch('payment_status');

  /* ─── Service item helpers ─── */

  const addItem = () =>
    setServiceItems(prev => [...prev, { description: '', amount: 0 }]);

  const removeItem = (i: number) =>
    setServiceItems(prev => prev.filter((_, idx) => idx !== i));

  const updateItem = (i: number, field: keyof ServiceItem, value: string | number) =>
    setServiceItems(prev =>
      prev.map((item, idx) =>
        idx === i ? { ...item, [field]: field === 'amount' ? Number(value) : value } : item
      )
    );

  const totalAmount = serviceItems.reduce((sum, item) => sum + (item.amount || 0), 0);

  /* ─── Submit ─── */

  const onSubmit = async (data: BillingFormValues) => {
    if (!me?.userId) {
      setError('Could not resolve staff identity. Please refresh.');
      return;
    }

    const validItems = serviceItems.filter(item => item.description.trim());
    if (validItems.length === 0) {
      setError('At least one service item with a description is required.');
      return;
    }

    if (data.payment_status === 'Paid' && !data.payment_method) {
      setError('Payment method is required when marking as Paid.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      if (existing?.billing_id) {
        // Record already exists — only update payment status/method
        await billingApi.recordPayment(existing.billing_id, {
          payment_method: data.payment_method as 'Cash' | 'GCash' | 'Other',
          payment_status: data.payment_status as 'Paid' | 'Waived',
        });
      } else {
        // Create new billing record with all required fields
        await billingApi.create({
          registration_id,
          service_items: validItems,        // required jsonb array
          total_amount: totalAmount,        // required
          payment_status: data.payment_status,
          payment_method: data.payment_method || undefined,
          processed_by: me.userId,          // required UUID FK
        });
      }

      await mutate();
      router.push('/staff/queue');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Billing failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isReadOnly = !!existing?.billing_id && existing.payment_status === 'Paid';

  return (
    <div style={{ maxWidth: 560 }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input:focus, select:focus, textarea:focus {
          background: #fff !important;
          border-color: #7B2CBF !important;
        }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <a
          href="/staff/queue"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            color: colors.textMuted, textDecoration: 'none',
            fontFamily: fonts.vietnam, fontSize: 14,
          }}
        >
          <IconArrowLeft size={16} /> Back to Queue
        </a>
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px', color: colors.primary, fontFamily: fonts.jakarta, marginBottom: 4 }}>
            Billing
          </div>
          <h1 style={{ fontFamily: fonts.jakarta, fontSize: 22, fontWeight: 800, color: colors.text, margin: 0 }}>
            Billing &amp; Payment
          </h1>
        </div>
      </div>

      {/* Existing record summary */}
      {existing?.billing_id && (
        <div style={{ ...cardStyle, marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <strong style={{ fontFamily: fonts.jakarta, fontSize: 14 }}>Existing Billing Record</strong>
            <StatusBadge status={existing.payment_status} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13, color: colors.textSoft, fontFamily: fonts.vietnam }}>
            <div><strong>Billing ID:</strong> {existing.billing_id}</div>
            <div><strong>Total Amount:</strong> ₱{existing.total_amount?.toFixed(2) ?? '0.00'}</div>
            <div><strong>Payment Method:</strong> {existing.payment_method ?? '—'}</div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* Service Items — only editable when creating (not yet saved) */}
          {!existing?.billing_id && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <label style={{ ...labelStyle, marginBottom: 0 }}>Service Items *</label>
                <button
                  type="button"
                  onClick={addItem}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    background: colors.primaryLight, color: colors.primary,
                    border: 'none', borderRadius: 8, padding: '5px 10px',
                    fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: fonts.jakarta,
                  }}
                >
                  <IconPlus size={12} /> Add Item
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {serviceItems.map((item, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 120px 36px', gap: 8, alignItems: 'center' }}>
                    <input
                      type="text"
                      placeholder="Service description"
                      value={item.description}
                      onChange={e => updateItem(i, 'description', e.target.value)}
                      style={inputStyle}
                    />
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="₱ Amount"
                      value={item.amount || ''}
                      onChange={e => updateItem(i, 'amount', e.target.value)}
                      style={inputStyle}
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(i)}
                      disabled={serviceItems.length === 1}
                      style={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        width: 36, height: 42, border: 'none', borderRadius: 8,
                        background: '#FDF2F2', color: colors.error,
                        cursor: serviceItems.length === 1 ? 'not-allowed' : 'pointer',
                        opacity: serviceItems.length === 1 ? 0.4 : 1,
                      }}
                    >
                      <IconTrash size={14} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div style={{
                marginTop: 12, display: 'flex', justifyContent: 'flex-end',
                fontFamily: fonts.jakarta, fontSize: 14, fontWeight: 700, color: colors.primary,
              }}>
                Total: ₱{totalAmount.toFixed(2)}
              </div>
            </div>
          )}

          {/* Payment Status + Method */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={labelStyle}>Payment Status</label>
              <select style={inputStyle} {...register('payment_status')} disabled={isReadOnly}>
                <option value="Unpaid">Unpaid</option>
                <option value="Paid">Paid</option>
                <option value="Waived">Waived</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Payment Method</label>
              {/* Only required / relevant when status is Paid */}
              <select
                style={{ ...inputStyle, opacity: paymentStatus === 'Waived' ? 0.5 : 1 }}
                {...register('payment_method')}
                disabled={isReadOnly || paymentStatus === 'Waived'}
              >
                <option value="">Select…</option>
                <option value="Cash">Cash</option>
                <option value="GCash">GCash</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: '#FDF2F2', border: '1px solid rgba(192,57,43,0.2)',
              borderRadius: 10, padding: '12px 16px',
              display: 'flex', alignItems: 'center', gap: 10,
              color: colors.error, fontSize: 13, fontFamily: fonts.vietnam,
            }}>
              <IconAlertTriangle size={16} /> {error}
            </div>
          )}

          {/* Submit */}
          {!isReadOnly && (
            <button type="submit" style={{ ...primaryBtn, opacity: isSubmitting ? 0.7 : 1 }} disabled={isSubmitting}>
              {isSubmitting ? <Spinner /> : <IconCreditCard size={16} />}
              {isSubmitting ? 'Saving…' : existing?.billing_id ? 'Update Payment' : 'Save Billing Record'}
            </button>
          )}

          {isReadOnly && (
            <p style={{ textAlign: 'center', fontSize: 13, color: colors.textMuted, fontFamily: fonts.vietnam, margin: 0 }}>
              This billing record has been marked as <strong>Paid</strong> and cannot be edited.
            </p>
          )}

        </div>
      </form>
    </div>
  );
}