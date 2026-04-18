// staff/participants/page.tsx
'use client';

import useSWR from 'swr';
import { supabase } from '@/lib/supabase-client';
import { useState } from 'react';

// ─── TYPES ───────────────────────────────────────────────────

type ExaminationRecord = {
  acceptance_status: string | null;
  rejection_reason: string | null;
};

type MedicalRecord = {
  procedure_type: string | null;
  completed_at: string | null;
};

type BillingRecord = {
  payment_status: string | null;
  total_amount: number | null;
};

type RegistrationPet = {
  reg_pet_id: string;
  procedure_status: string;
  pet: { pet_name: string; species: string } | null;
  examination_records: ExaminationRecord | null;
  medical_records: MedicalRecord | null;
};

type Registration = {
  registration_id: string;
  queue_number: number | null;
  checkin_status: string;
  checkin_timestamp: string | null;
  discharge_timestamp: string | null;
  registered_at: string;
  owners: { first_name: string; last_name: string; email: string } | null;
  registration_pets: RegistrationPet[];
  billing_records: BillingRecord | null;
};

type Event = {
  event_id: string;
  event_name: string;
  event_date: string;
  status: string;
  location_address: string;
};

// ─── ICONS ───────────────────────────────────────────────────

const IconUsers = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IconSearch = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const IconChevronDown = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const IconChevronRight = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const IconPaw = ({ size = 13 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C10.34 2 9 3.34 9 5s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm-5 4C5.34 6 4 7.34 4 9s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm10 0c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zM5.5 14C3.57 14 2 15.57 2 17.5S3.57 21 5.5 21c.96 0 1.83-.38 2.48-1H16c.65.62 1.52 1 2.48 1C20.43 21 22 19.43 22 17.5S20.43 14 18.48 14c-1.5 0-2.78.87-3.43 2.13C14.57 16.05 13.82 16 13 16h-2c-.82 0-1.57.05-2.05.13C8.3 14.87 7.02 14 5.5 14z" />
  </svg>
);

// ─── STYLE TOKENS ─────────────────────────────────────────────

const colors = {
  primary: '#7B2CBF',
  primaryLight: '#F3E8FF',
  secondary: '#7ED957',
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

// ─── STATUS BADGE ─────────────────────────────────────────────

const statusMap: Record<string, { bg: string; color: string }> = {
  Pending:      { bg: '#FFF3CD', color: '#856404' },
  'Checked-in': { bg: '#D1ECF1', color: '#0C5460' },
  'No-show':    { bg: '#F8D7DA', color: '#721C24' },
  Accepted:     { bg: '#D4EDDA', color: '#155724' },
  Rejected:     { bg: '#F8D7DA', color: '#721C24' },
  Completed:    { bg: '#7B2CBF', color: '#FFFFFF' },
  Paid:         { bg: '#7ED957', color: '#1A4D00' },
  Waived:       { bg: '#E2D9F3', color: '#4A1D96' },
  Unpaid:       { bg: '#FFF3CD', color: '#856404' },
  Discharged:   { bg: '#3A3A3A', color: '#FFFFFF' },
  Open:         { bg: '#D4EDDA', color: '#155724' },
  Ongoing:      { bg: '#D1ECF1', color: '#0C5460' },
  Closed:       { bg: '#F8D7DA', color: '#721C24' },
  Draft:        { bg: '#E2E3E5', color: '#383D41' },
};

function StatusBadge({ status }: { status: string }) {
  const s = statusMap[status] ?? { bg: '#E2E3E5', color: '#383D41' };
  return (
    <span style={{ padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 600, background: s.bg, color: s.color, fontFamily: fonts.vietnam, whiteSpace: 'nowrap' }}>
      {status}
    </span>
  );
}

// ─── STEP INDICATOR ──────────────────────────────────────────
// Shows the canonical flow: Check-in → Examination → Procedure → Billing → Discharge

type StepStatus = 'done' | 'active' | 'rejected' | 'pending';

function StepDot({ status }: { status: StepStatus }) {
  const styleMap: Record<StepStatus, { bg: string; border: string }> = {
    done:     { bg: colors.secondary,    border: colors.secondary },
    active:   { bg: colors.primary,      border: colors.primary },
    rejected: { bg: colors.error,        border: colors.error },
    pending:  { bg: 'transparent',       border: colors.border },
  };
  const s = styleMap[status];
  return (
    <div style={{ width: 10, height: 10, borderRadius: '50%', background: s.bg, border: `2px solid ${s.border}`, flexShrink: 0 }} />
  );
}

function FlowSteps({ reg }: { reg: Registration }) {
  // Derive step statuses from data
  const checkinDone   = reg.checkin_status === 'Checked-in' || reg.checkin_status === 'Discharged';
  const checkinActive = reg.checkin_status === 'Checked-in';

  // Per-pet examination — if any pet rejected, show rejected; if all accepted, done
  const pets = reg.registration_pets ?? [];
  const examStatuses = pets.map(p => p.examination_records?.acceptance_status ?? null);
  const anyExamRejected = examStatuses.some(s => s === 'Rejected');
  const allExamDone     = pets.length > 0 && examStatuses.every(s => s === 'Accepted' || s === 'Rejected');
  const anyExamDone     = examStatuses.some(s => s !== null);

  // Procedure
  const procStatuses = pets.map(p => p.procedure_status);
  const allProcDone  = pets.length > 0 && procStatuses.every(s => s === 'Completed' || s === 'Rejected');
  const anyProcDone  = procStatuses.some(s => s === 'Completed');

  // Billing
  const billing        = reg.billing_records;
  const billingPaid    = billing?.payment_status === 'Paid' || billing?.payment_status === 'Waived';
  const billingStarted = !!billing;

  // Discharge
  const discharged = !!reg.discharge_timestamp || reg.checkin_status === 'Discharged';

  function examStep(): StepStatus {
    if (!checkinDone) return 'pending';
    if (anyExamRejected) return 'rejected';
    if (allExamDone) return 'done';
    if (anyExamDone) return 'active';
    return 'pending';
  }

  function procStep(): StepStatus {
    if (!allExamDone) return 'pending';
    if (allProcDone) return 'done';
    if (anyProcDone) return 'active';
    return 'pending';
  }

  function billingStep(): StepStatus {
    if (!anyProcDone) return 'pending';
    if (billingPaid) return 'done';
    if (billingStarted) return 'active';
    return 'pending';
  }

  function dischargeStep(): StepStatus {
    if (discharged) return 'done';
    if (billingPaid) return 'active';
    return 'pending';
  }

  const steps: { label: string; status: StepStatus }[] = [
    { label: 'Check-in',    status: checkinDone ? 'done' : checkinActive ? 'active' : 'pending' },
    { label: 'Examination', status: examStep() },
    { label: 'Procedure',   status: procStep() },
    { label: 'Billing',     status: billingStep() },
    { label: 'Discharge',   status: dischargeStep() },
  ];

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
      {steps.map((step, i) => (
        <div key={step.label} style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <StepDot status={step.status} />
            <span style={{
              fontFamily: fonts.vietnam, fontSize: 10, fontWeight: 500,
              color: step.status === 'pending' ? colors.textMuted : step.status === 'rejected' ? colors.error : colors.text,
              whiteSpace: 'nowrap',
            }}>
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div style={{ width: 24, height: 1, background: colors.border, margin: '0 2px', marginBottom: 14, flexShrink: 0 }} />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── EXPANDED PET DETAIL ──────────────────────────────────────

function PetDetailRow({ rp }: { rp: RegistrationPet }) {
  const exam    = rp.examination_records;
  const medical = rp.medical_records;

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 14px', borderRadius: 10, background: colors.bg }}>
      <div style={{ width: 28, height: 28, borderRadius: 8, background: colors.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.primary, flexShrink: 0, marginTop: 2 }}>
        <IconPaw size={13} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <p style={{ fontFamily: fonts.jakarta, fontSize: 13, fontWeight: 700, color: colors.text, margin: 0 }}>
            {rp.pet?.pet_name ?? 'Unknown'}
          </p>
          <span style={{ fontFamily: fonts.vietnam, fontSize: 11, color: colors.textMuted }}>{rp.pet?.species}</span>
          <StatusBadge status={rp.procedure_status} />
        </div>

        <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: '4px 20px' }}>
          {/* Examination result */}
          <span style={{ fontFamily: fonts.vietnam, fontSize: 11, color: colors.textSoft }}>
            Exam:{' '}
            <span style={{ fontWeight: 600, color: exam?.acceptance_status === 'Accepted' ? '#155724' : exam?.acceptance_status === 'Rejected' ? colors.error : colors.textMuted }}>
              {exam?.acceptance_status ?? '—'}
            </span>
            {exam?.acceptance_status === 'Rejected' && exam.rejection_reason && (
              <span style={{ color: colors.error }}> · {exam.rejection_reason}</span>
            )}
          </span>

          {/* Procedure */}
          {medical?.procedure_type && (
            <span style={{ fontFamily: fonts.vietnam, fontSize: 11, color: colors.textSoft }}>
              Procedure: <span style={{ fontWeight: 600, color: colors.text }}>{medical.procedure_type}</span>
            </span>
          )}
          {medical?.completed_at && (
            <span style={{ fontFamily: fonts.vietnam, fontSize: 11, color: colors.textMuted }}>
              Done {new Date(medical.completed_at).toLocaleTimeString('en-PH', { timeStyle: 'short' })}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── EXPANDED REGISTRATION ROW ────────────────────────────────

function ExpandedRow({ reg }: { reg: Registration }) {
  const billing = reg.billing_records;

  return (
    <tr>
      <td colSpan={6} style={{ padding: '0 20px 16px', background: colors.primaryLight }}>
        <div style={{ borderRadius: 14, background: colors.surface, padding: '18px 20px', boxShadow: '0 4px 16px rgba(97,0,164,0.06)' }}>

          {/* Flow steps */}
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontFamily: fonts.jakarta, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px', color: colors.textMuted, margin: '0 0 10px' }}>
              Patient Flow
            </p>
            <FlowSteps reg={reg} />
          </div>

          {/* Per-pet breakdown */}
          {reg.registration_pets.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontFamily: fonts.jakarta, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px', color: colors.textMuted, margin: '0 0 8px' }}>
                Pets
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {reg.registration_pets.map(rp => (
                  <PetDetailRow key={rp.reg_pet_id} rp={rp} />
                ))}
              </div>
            </div>
          )}

          {/* Billing + Discharge summary */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, paddingTop: 14, borderTop: `1px solid ${colors.border}` }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <p style={{ fontFamily: fonts.jakarta, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px', color: colors.textMuted, margin: 0 }}>Billing</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {billing ? (
                  <>
                    <StatusBadge status={billing.payment_status ?? 'Unpaid'} />
                    <span style={{ fontFamily: fonts.jakarta, fontSize: 13, fontWeight: 700, color: colors.primary }}>
                      ₱{billing.total_amount?.toFixed(2) ?? '0.00'}
                    </span>
                  </>
                ) : (
                  <span style={{ fontFamily: fonts.vietnam, fontSize: 12, color: colors.textMuted }}>Not yet billed</span>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <p style={{ fontFamily: fonts.jakarta, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px', color: colors.textMuted, margin: 0 }}>Discharge</p>
              <span style={{ fontFamily: fonts.vietnam, fontSize: 12, color: reg.discharge_timestamp ? colors.text : colors.textMuted }}>
                {reg.discharge_timestamp
                  ? new Date(reg.discharge_timestamp).toLocaleString('en-PH', { dateStyle: 'medium', timeStyle: 'short' })
                  : 'Not yet discharged'}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <p style={{ fontFamily: fonts.jakarta, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px', color: colors.textMuted, margin: 0 }}>Registered</p>
              <span style={{ fontFamily: fonts.vietnam, fontSize: 12, color: colors.textSoft }}>
                {new Date(reg.registered_at).toLocaleString('en-PH', { dateStyle: 'medium', timeStyle: 'short' })}
              </span>
            </div>
          </div>

        </div>
      </td>
    </tr>
  );
}

// ─── EVENT SECTION ────────────────────────────────────────────

function EventSection({ event, search }: { event: Event; search: string }) {
  const [open, setOpen] = useState(true);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const { data: participants, isLoading } = useSWR(
    `participants-all-${event.event_id}`,
    async () => {
      const { data } = await supabase
        .from('registrations')
        .select(`
          *,
          owners(*),
          billing_records(*),
          registration_pets(
            *,
            pet:pets(*),
            examination_records(*),
            medical_records(*)
          )
        `)
        .eq('event_id', event.event_id)
        .order('queue_number', { ascending: true, nullsFirst: false });
      return data as Registration[];
    }
  );

  const filtered = participants?.filter(p => {
    const name = `${p.owners?.first_name ?? ''} ${p.owners?.last_name ?? ''}`.toLowerCase();
    const q = `#${p.queue_number}`;
    return name.includes(search.toLowerCase()) || q.includes(search.toLowerCase());
  }) ?? [];

  const totalCount     = participants?.length ?? 0;
  const checkedInCount = participants?.filter(p => p.checkin_status === 'Checked-in' || p.checkin_status === 'Discharged').length ?? 0;
  const dischargedCount = participants?.filter(p => !!p.discharge_timestamp || p.checkin_status === 'Discharged').length ?? 0;

  return (
    <div style={{ background: colors.surface, borderRadius: 20, boxShadow: '0 12px 40px rgba(97,0,164,0.04)', overflow: 'hidden', marginBottom: 16 }}>

      {/* Event header */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', background: 'transparent', border: 'none', cursor: 'pointer', borderBottom: open ? `1.5px solid ${colors.border}` : 'none' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left' }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: colors.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.primary, flexShrink: 0 }}>
            <IconUsers size={18} />
          </div>
          <div>
            <p style={{ fontFamily: fonts.jakarta, fontSize: 14, fontWeight: 700, color: colors.text, margin: 0 }}>{event.event_name}</p>
            <p style={{ fontFamily: fonts.vietnam, fontSize: 12, color: colors.textMuted, margin: '2px 0 0' }}>
              {new Date(event.event_date).toLocaleDateString('en-PH', { dateStyle: 'medium' })} · {event.location_address}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <StatusBadge status={event.status} />
          {!isLoading && (
            <>
              <span style={{ fontFamily: fonts.vietnam, fontSize: 12, color: colors.textSoft }}>{checkedInCount}/{totalCount} checked in</span>
              <span style={{ fontFamily: fonts.vietnam, fontSize: 12, color: colors.textSoft }}>·</span>
              <span style={{ fontFamily: fonts.vietnam, fontSize: 12, color: colors.textSoft }}>{dischargedCount} discharged</span>
            </>
          )}
          <span style={{ color: colors.textMuted, display: 'flex', alignItems: 'center', transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>
            <IconChevronDown size={16} />
          </span>
        </div>
      </button>

      {open && (
        <>
          {isLoading && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 36 }}>
              <span style={{ width: 22, height: 22, border: '3px solid rgba(123,44,191,0.15)', borderTop: '3px solid #7B2CBF', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
            </div>
          )}

          {!isLoading && filtered.length === 0 && (
            <p style={{ fontFamily: fonts.vietnam, fontSize: 13, color: colors.textMuted, textAlign: 'center', padding: '28px 0', margin: 0 }}>
              No participants found.
            </p>
          )}

          {!isLoading && filtered.length > 0 && (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Queue #', 'Owner', 'Pets', 'Check-in', 'Flow', ''].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '12px 20px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px', color: colors.textMuted, fontFamily: fonts.jakarta }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((reg) => {
                  const isExpanded = expandedRow === reg.registration_id;
                  return (
                    <>
                      <tr
                        key={reg.registration_id}
                        style={{ borderTop: `1px solid ${colors.border}`, background: isExpanded ? colors.primaryLight : 'transparent', transition: 'background 0.15s' }}
                        onMouseEnter={e => { if (!isExpanded) e.currentTarget.style.background = colors.primaryLight; }}
                        onMouseLeave={e => { if (!isExpanded) e.currentTarget.style.background = 'transparent'; }}
                      >
                        {/* Queue # */}
                        <td style={{ padding: '13px 20px', fontFamily: fonts.jakarta, fontSize: 13, fontWeight: 700, color: colors.primary }}>
                          {reg.queue_number != null ? `#${reg.queue_number}` : '—'}
                        </td>

                        {/* Owner */}
                        <td style={{ padding: '13px 20px' }}>
                          <p style={{ fontFamily: fonts.vietnam, fontSize: 13, fontWeight: 600, color: colors.text, margin: 0 }}>
                            {reg.owners ? `${reg.owners.first_name} ${reg.owners.last_name}` : '—'}
                          </p>
                          {reg.owners?.email && (
                            <p style={{ fontFamily: fonts.vietnam, fontSize: 11, color: colors.textMuted, margin: '1px 0 0' }}>
                              {reg.owners.email}
                            </p>
                          )}
                        </td>

                        {/* Pets */}
                        <td style={{ padding: '13px 20px', fontFamily: fonts.vietnam, fontSize: 13, color: colors.textSoft }}>
                          {reg.registration_pets?.length > 0
                            ? reg.registration_pets.map(rp => rp.pet?.pet_name).join(', ')
                            : '—'}
                        </td>

                        {/* Check-in status + time */}
                        <td style={{ padding: '13px 20px' }}>
                          <StatusBadge status={reg.checkin_status} />
                          {reg.checkin_timestamp && (
                            <p style={{ fontFamily: fonts.vietnam, fontSize: 11, color: colors.textMuted, margin: '3px 0 0' }}>
                              {new Date(reg.checkin_timestamp).toLocaleTimeString('en-PH', { timeStyle: 'short' })}
                            </p>
                          )}
                        </td>

                        {/* Flow mini-steps */}
                        <td style={{ padding: '13px 20px' }}>
                          <FlowSteps reg={reg} />
                        </td>

                        {/* Expand toggle */}
                        <td style={{ padding: '13px 20px' }}>
                          <button
                            onClick={() => setExpandedRow(prev => prev === reg.registration_id ? null : reg.registration_id)}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '6px 12px', borderRadius: 10, background: isExpanded ? colors.primary : colors.bg, color: isExpanded ? '#fff' : colors.textSoft, fontFamily: fonts.jakarta, fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}
                          >
                            {isExpanded ? 'Close' : 'Details'}
                            <span style={{ display: 'inline-flex', transition: 'transform 0.2s', transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>
                              <IconChevronRight size={13} />
                            </span>
                          </button>
                        </td>
                      </tr>

                      {isExpanded && (
                        <ExpandedRow key={`expand-${reg.registration_id}`} reg={reg} />
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────

export default function ParticipantsPage() {
  const [search, setSearch] = useState('');

  const { data: events, isLoading: eventsLoading } = useSWR('events', async () => {
    const { data } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: false });
    return data as Event[];
  });

  return (
    <div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Page header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px', color: colors.primary, marginBottom: 10, fontFamily: fonts.jakarta }}>
          <IconUsers size={12} /> Staff Portal
        </div>
        <h1 style={{ fontFamily: fonts.jakarta, fontSize: 26, fontWeight: 800, color: colors.text, margin: 0 }}>
          All Participants
        </h1>
        <p style={{ fontFamily: fonts.vietnam, fontSize: 14, color: colors.textSoft, marginTop: 6 }}>
          Full tracker across all events — check-in to discharge.
        </p>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 24, position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
        <span style={{ position: 'absolute', left: 12, color: colors.textMuted, display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
          <IconSearch size={15} />
        </span>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or queue #"
          style={{ paddingLeft: 36, paddingRight: 14, paddingTop: 10, paddingBottom: 10, background: colors.surface, borderRadius: 10, fontSize: 13, fontFamily: fonts.vietnam, border: `1.5px solid ${colors.border}`, color: colors.text, width: 280, outline: 'none', boxShadow: '0 2px 8px rgba(123,44,191,0.04)' }}
        />
      </div>

      {/* Events loading */}
      {eventsLoading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
          <span style={{ width: 24, height: 24, border: '3px solid rgba(123,44,191,0.15)', borderTop: '3px solid #7B2CBF', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
        </div>
      )}

      {!eventsLoading && (!events || events.length === 0) && (
        <div style={{ background: colors.surface, borderRadius: 20, padding: '32px 28px', boxShadow: '0 12px 40px rgba(97,0,164,0.04)', textAlign: 'center' }}>
          <p style={{ fontFamily: fonts.vietnam, fontSize: 14, color: colors.textMuted, margin: 0 }}>No events found.</p>
        </div>
      )}

      {!eventsLoading && events?.map(event => (
        <EventSection key={event.event_id} event={event} search={search} />
      ))}
    </div>
  );
}