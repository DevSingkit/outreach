// app/admin/reports/page.tsx
'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { supabase } from '@/lib/supabase-client';

// ─── Icons ────────────────────────────────────────────────────────────────────
const IconPaw = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C10.34 2 9 3.34 9 5s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm-5 4C5.34 6 4 7.34 4 9s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm10 0c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zM5.5 14C3.57 14 2 15.57 2 17.5S3.57 21 5.5 21c.96 0 1.83-.38 2.48-1H16c.65.62 1.52 1 2.48 1C20.43 21 22 19.43 22 17.5S20.43 14 18.48 14c-1.5 0-2.78.87-3.43 2.13C14.57 16.05 13.82 16 13 16h-2c-.82 0-1.57.05-2.05.13C8.3 14.87 7.02 14 5.5 14z" />
  </svg>
);
const IconDownload = ({ size = 17 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);
const IconFilter = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

// ─── Helpers ──────────────────────────────────────────────────────────────────
function exportCSV(data: Record<string, unknown>[], filename: string) {
  if (!data || data.length === 0) return;
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(row => Object.values(row).map(v => `"${v ?? ''}"`).join(','));
  const csv = [headers, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

interface BillingRecord {
  registrations: {
    owners: { first_name: string; last_name: string } | null;
    events: { event_name: string } | null;
  } | null;
  amount: number;
  payment_status: string;
  payment_method: string;
  created_at: string;
}

const paymentStatusMap: Record<string, { bg: string; color: string }> = {
  Paid:   { bg: '#D4EDDA', color: '#155724' },
  Unpaid: { bg: '#FFF3CD', color: '#856404' },
  Waived: { bg: '#E2D9F3', color: '#4A1D96' },
};
function PaymentBadge({ status }: { status: string }) {
  const s = paymentStatusMap[status] ?? paymentStatusMap.Unpaid;
  return <span style={{ padding: '3px 12px', borderRadius: 100, fontSize: 11, fontWeight: 700, background: s.bg, color: s.color, fontFamily: "'Be Vietnam Pro', sans-serif", whiteSpace: 'nowrap' }}>{status}</span>;
}

// ─── Focused select/input ─────────────────────────────────────────────────────
function FocusInput({ as: Tag = 'input', ...props }: { as?: 'input' | 'select'; [key: string]: unknown }) {
  const [focused, setFocused] = useState(false);
  const base: React.CSSProperties = {
    padding: '10px 14px',
    background: focused ? '#FFFFFF' : '#EDEDED',
    border: focused ? '2px solid #7B2CBF' : '2px solid transparent',
    borderRadius: 10, fontSize: 13, color: '#3A3A3A',
    fontFamily: "'Be Vietnam Pro', sans-serif",
    outline: 'none', transition: 'all 0.2s',
    boxShadow: '0 4px 12px rgba(97,0,164,0.06)',
    boxSizing: 'border-box' as const,
  };
  return <Tag {...props} style={base} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />;
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminReportsPage() {
  const { data: events } = useSWR('events', async () => {
  const { data } = await supabase.from('events').select('event_id, event_name');
  return data;
});
  const [eventId, setEventId] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [rowHovered, setRowHovered] = useState<number | null>(null);

  const params = new URLSearchParams();
  if (eventId) params.set('event_id', eventId);
  if (from) params.set('from', from);
  if (to) params.set('to', to);
  params.set('page', '1');
  params.set('limit', '100');

  const { data: report, isLoading } = useSWR(`report-${params.toString()}`, async () => {
  let query = supabase
    .from('billing_records')
    .select('*, registrations(*, owners(*), events(*))');
  if (eventId) query = query.eq('registrations.event_id', eventId);
  if (from) query = query.gte('created_at', from);
  if (to) query = query.lte('created_at', to);
  const { data } = await query;
  return data?.map((r: BillingRecord) => ({
    owner_name: `${r.registrations?.owners?.first_name} ${r.registrations?.owners?.last_name}`,
    event_name: r.registrations?.events?.event_name,
    amount: r.amount,
    payment_status: r.payment_status,
    payment_method: r.payment_method,
    created_at: r.created_at,
  }));
});

  const totalAmount = report?.reduce((sum, row) => sum + Number(row.amount ?? 0), 0) ?? 0;
  const paidCount   = report?.filter(r => r.payment_status === 'Paid').length ?? 0;

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 36 }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#7B2CBF', marginBottom: 8, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <IconPaw size={12} /> Finance
          </div>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 800, color: '#3A3A3A', margin: 0 }}>
            Billing Reports
          </h1>
        </div>
        <button
          onClick={() => report && exportCSV(report, 'nhvc-billing-report.csv')}
          disabled={!report || report.length === 0}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '12px 24px', borderRadius: 12, border: 'none',
            cursor: (!report || report.length === 0) ? 'not-allowed' : 'pointer',
            background: (!report || report.length === 0) ? '#E0D0F5' : 'linear-gradient(135deg, #5BB832, #7ED957)',
            color: (!report || report.length === 0) ? '#A8A8A8' : '#1A3A00',
            fontSize: 14, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif",
            transition: 'all 0.2s',
            boxShadow: (!report || report.length === 0) ? 'none' : '0 4px 16px rgba(126,217,87,0.3)',
          }}
        >
          <IconDownload size={17} /> Export CSV
        </button>
      </div>

      {/* Summary cards */}
      {report && report.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 24 }} className="summary-grid">
          {[
            { label: 'Total Billed', value: `₱${totalAmount.toFixed(2)}` },
            { label: 'Paid Records', value: `${paidCount} / ${report.length}` },
          ].map(({ label, value }) => (
            <div key={label} style={{
              background: '#FFFFFF', borderRadius: 20, padding: '22px 28px',
              boxShadow: '0 12px 40px rgba(97,0,164,0.04)',
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#A8A8A8', marginBottom: 6, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{label}</div>
              <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 30, fontWeight: 800, color: '#3A3A3A' }}>{value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div style={{
        background: '#FFFFFF', borderRadius: 20,
        boxShadow: '0 12px 40px rgba(97,0,164,0.04)',
        padding: '20px 28px', marginBottom: 24,
        display: 'flex', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#7B2CBF' }}>
          <IconFilter size={16} />
          <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#7B2CBF' }}>Filter</span>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#A8A8A8', marginBottom: 6, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Event</label>
          <FocusInput as="select" value={eventId} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setEventId(e.target.value)}>
            <option value="">All Events</option>
            {events?.map((ev: { event_id: string; event_name: string }) => (
              <option key={ev.event_id} value={ev.event_id}>{ev.event_name}</option>
            ))}
          </FocusInput>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#A8A8A8', marginBottom: 6, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>From</label>
          <FocusInput type="date" value={from} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFrom(e.target.value)} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#A8A8A8', marginBottom: 6, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>To</label>
          <FocusInput type="date" value={to} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTo(e.target.value)} />
        </div>
        {(eventId || from || to) && (
          <button onClick={() => { setEventId(''); setFrom(''); setTo(''); }} style={{
            padding: '10px 16px', borderRadius: 10, border: 'none', cursor: 'pointer',
            background: '#F3E8FF', color: '#7B2CBF', fontSize: 13, fontWeight: 700,
            fontFamily: "'Plus Jakarta Sans', sans-serif", alignSelf: 'flex-end',
          }}>Clear</button>
        )}
      </div>

      {/* Loading */}
      {isLoading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 64 }}>
          <span style={{ width: 28, height: 28, border: '3px solid rgba(123,44,191,0.15)', borderTop: '3px solid #7B2CBF', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
        </div>
      )}

      {/* Empty state */}
      {!isLoading && (!report || report.length === 0) && (
        <div style={{ textAlign: 'center', padding: '64px 24px', color: '#A8A8A8' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📊</div>
          <p style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: 15 }}>No billing records found for the selected filters.</p>
        </div>
      )}

      {/* Table */}
      {report && report.length > 0 && (
        <div style={{ background: '#FFFFFF', borderRadius: 24, boxShadow: '0 12px 40px rgba(97,0,164,0.04)', overflow: 'hidden' }}>
          <div style={{
            background: 'linear-gradient(160deg, #1a0230 0%, #7B2CBF 100%)',
            padding: '20px 28px', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '24px 24px', pointerEvents: 'none' }} />
            <div style={{ position: 'relative', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: 'rgba(255,255,255,0.7)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {report.length} records
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F9F4FF' }}>
                  {['Owner', 'Event', 'Amount', 'Status', 'Method', 'Date'].map(h => (
                    <th key={h} style={{
                      padding: '14px 24px', textAlign: 'left',
                      fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px',
                      color: '#7B2CBF', fontFamily: "'Plus Jakarta Sans', sans-serif', whiteSpace: 'nowrap",
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {report.map((row, i) => (
                  <tr key={i}
                    style={{ background: rowHovered === i ? '#F9F4FF' : 'transparent', transition: 'background 0.15s' }}
                    onMouseEnter={() => setRowHovered(i)}
                    onMouseLeave={() => setRowHovered(null)}
                  >
                    <td style={{ padding: '16px 24px', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, fontWeight: 700, color: '#3A3A3A', whiteSpace: 'nowrap' }}>
                      {String(row.owner_name ?? '—')}
                    </td>
                    <td style={{ padding: '16px 24px', fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: 13, color: '#6B6B6B', whiteSpace: 'nowrap' }}>
                      {String(row.event_name ?? '—')}
                    </td>
                    <td style={{ padding: '16px 24px', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, fontWeight: 800, color: '#7B2CBF' }}>
                      ₱{Number(row.amount ?? 0).toFixed(2)}
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <PaymentBadge status={String(row.payment_status ?? 'Unpaid')} />
                    </td>
                    <td style={{ padding: '16px 24px', fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: 13, color: '#6B6B6B' }}>
                      {String(row.payment_method ?? '—')}
                    </td>
                    <td style={{ padding: '16px 24px', fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: 12, color: '#A8A8A8', whiteSpace: 'nowrap' }}>
                      {row.created_at ? new Date(String(row.created_at)).toLocaleDateString('en-PH', { dateStyle: 'medium' }) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 640px) { .summary-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}