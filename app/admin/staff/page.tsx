// app/admin/staff/page.tsx
'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/lib/supabase-client';

// ─── Icons ────────────────────────────────────────────────────────────────────
const IconPaw = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C10.34 2 9 3.34 9 5s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm-5 4C5.34 6 4 7.34 4 9s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm10 0c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zM5.5 14C3.57 14 2 15.57 2 17.5S3.57 21 5.5 21c.96 0 1.83-.38 2.48-1H16c.65.62 1.52 1 2.48 1C20.43 21 22 19.43 22 17.5S20.43 14 18.48 14c-1.5 0-2.78.87-3.43 2.13C14.57 16.05 13.82 16 13 16h-2c-.82 0-1.57.05-2.05.13C8.3 14.87 7.02 14 5.5 14z" />
  </svg>
);
const IconPlus = ({ size = 17 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const IconX = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const IconAlertCircle = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);
const IconUser = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);

// ─── Schema ───────────────────────────────────────────────────────────────────
const staffSchema = z.object({
  first_name: z.string().min(1, 'Required'),
  last_name:  z.string().min(1, 'Required'),
  email:      z.string().email('Invalid email'),
  role:       z.enum(['Staff', 'Vet', 'Admin']),
  password:   z.string().min(10, 'Min 10 characters').regex(/[A-Z]/, '1 uppercase required').regex(/[0-9]/, '1 number required'),
});
type StaffForm = z.infer<typeof staffSchema>;

async function fetchStaff() {
  const res = await fetch('/api/admin/staff');
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

// ─── Focused Input ────────────────────────────────────────────────────────────
function FocusInput({ as: Tag = 'input', ...props }: { as?: 'input' | 'select' | 'textarea'; [key: string]: unknown }) {
  const [focused, setFocused] = useState(false);
  const base: React.CSSProperties = {
    width: '100%', padding: '12px 16px',
    background: focused ? '#FFFFFF' : '#E8E8E8',
    border: focused ? '2px solid #7B2CBF' : '2px solid transparent',
    borderRadius: 8, fontSize: 14, color: '#3A3A3A',
    fontFamily: "'Be Vietnam Pro', sans-serif",
    outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box',
    ...(props.style as object ?? {}),
  };
  return <Tag {...props} style={base} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />;
}

// ─── Role badge colours ───────────────────────────────────────────────────────
const roleColours: Record<string, { bg: string; color: string }> = {
  Admin: { bg: '#F3E8FF', color: '#7B2CBF' },
  Vet:   { bg: '#D1ECF1', color: '#0C5460' },
  Staff: { bg: '#E2E3E5', color: '#383D41' },
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminStaffPage() {
  const { data, isLoading, mutate } = useSWR('admin-staff', fetchStaff);
  const staffList = data?.staff;
  
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm<StaffForm>({
    resolver: zodResolver(staffSchema),
    defaultValues: { role: 'Staff' },
  });

  const onSubmit = async (data: StaffForm) => {
    setIsSubmitting(true); setError('');
    try {
      await adminApi.createStaff(data); await mutate(); setShowModal(false); reset();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create staff.');
    } finally { setIsSubmitting(false); }
  };

  const toggleActive = async (id: string, current: boolean) => {
    try { await adminApi.updateStaff(id, { is_active: !current }); await mutate(); }
    catch (err: unknown) { alert(err instanceof Error ? err.message : 'Failed to update'); }
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 36 }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#7B2CBF', marginBottom: 8, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <IconPaw size={12} /> Team
          </div>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 800, color: '#3A3A3A', margin: 0 }}>
            Staff Management
          </h1>
        </div>
        <button onClick={() => setShowModal(true)} style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '12px 24px',
          background: 'linear-gradient(135deg, #7B2CBF, #A66DD4)',
          color: 'white', borderRadius: 12, border: 'none', cursor: 'pointer',
          fontSize: 14, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif",
          boxShadow: '0 4px 16px rgba(123,44,191,0.2)', transition: 'all 0.2s',
        }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 10px 30px rgba(123,44,191,0.3)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 16px rgba(123,44,191,0.2)'; }}
        >
          <IconPlus size={17} /> Add Staff
        </button>
      </div>

      {isLoading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 64 }}>
          <span style={{ width: 28, height: 28, border: '3px solid rgba(123,44,191,0.15)', borderTop: '3px solid #7B2CBF', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
        </div>
      )}

      {/* Table */}
      <div style={{ background: '#FFFFFF', borderRadius: 24, boxShadow: '0 12px 40px rgba(97,0,164,0.04)', overflow: 'hidden' }}>
        <div style={{
          background: 'linear-gradient(160deg, #1a0230 0%, #7B2CBF 100%)',
          padding: '20px 28px', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '24px 24px', pointerEvents: 'none' }} />
          <div style={{ position: 'relative' }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: 'rgba(255,255,255,0.5)', marginBottom: 4, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Directory</div>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 18, fontWeight: 800, color: 'white', margin: 0 }}>Clinic Staff</h2>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F9F4FF' }}>
                {['Member', 'Email', 'Role', 'Status', 'Joined'].map(h => (
                  <th key={h} style={{
                    padding: '14px 24px', textAlign: 'left',
                    fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px',
                    color: '#7B2CBF', fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {staffList?.map((s: { id: string; first_name: string; last_name: string; email: string; role: string; is_active: boolean; created_at: string }) => {
                const rc = roleColours[s.role] ?? roleColours.Staff;
                return (
                  <tr key={s.id} style={{ transition: 'background 0.15s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLTableRowElement).style.background = '#F9F4FF'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'; }}
                  >
                    {/* Member */}
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                          width: 38, height: 38, borderRadius: '50%',
                          background: 'linear-gradient(135deg, #7B2CBF, #A66DD4)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'white', flexShrink: 0,
                        }}>
                          <IconUser size={16} />
                        </div>
                        <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, fontWeight: 700, color: '#3A3A3A' }}>
                          {s.first_name} {s.last_name}
                        </span>
                      </div>
                    </td>
                    {/* Email */}
                    <td style={{ padding: '16px 24px', fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: 13, color: '#6B6B6B' }}>
                      {s.email}
                    </td>
                    {/* Role */}
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{ padding: '4px 12px', borderRadius: 100, fontSize: 12, fontWeight: 700, background: rc.bg, color: rc.color, fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                        {s.role}
                      </span>
                    </td>
                    {/* Toggle */}
                    <td style={{ padding: '16px 24px' }}>
                      <button onClick={() => toggleActive(s.id, s.is_active)} style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '6px 14px', borderRadius: 100, border: 'none', cursor: 'pointer',
                        background: s.is_active ? '#D4EDDA' : '#EDEDED',
                        color: s.is_active ? '#155724' : '#6B6B6B',
                        fontSize: 12, fontWeight: 700,
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        transition: 'all 0.2s',
                      }}>
                        <span style={{
                          width: 8, height: 8, borderRadius: '50%',
                          background: s.is_active ? '#7ED957' : '#A8A8A8',
                          display: 'inline-block',
                        }} />
                        {s.is_active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    {/* Date */}
                    <td style={{ padding: '16px 24px', fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: 12, color: '#A8A8A8' }}>
                      {new Date(s.created_at).toLocaleDateString('en-PH', { dateStyle: 'medium' })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(26,2,48,0.6)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, backdropFilter: 'blur(4px)' }}>
          <div style={{
            background: '#FFFFFF', borderRadius: 24,
            boxShadow: '0 24px 80px rgba(123,44,191,0.25)',
            width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto',
          }}>
            {/* Header */}
            <div style={{
              background: 'linear-gradient(160deg, #1a0230 0%, #7B2CBF 100%)',
              padding: '24px 28px', borderRadius: '24px 24px 0 0', position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '24px 24px', pointerEvents: 'none' }} />
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: 'rgba(255,255,255,0.5)', marginBottom: 4, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Team</div>
                  <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 20, fontWeight: 800, color: 'white', margin: 0 }}>Add Staff Member</h2>
                </div>
                <button onClick={() => setShowModal(false)} style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}>
                  <IconX size={18} />
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#A8A8A8', marginBottom: 8, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>First Name *</label>
                  <FocusInput {...register('first_name')} />
                  {errors.first_name && <p style={{ color: '#C0392B', fontSize: 12, marginTop: 4, fontFamily: "'Be Vietnam Pro', sans-serif" }}>{errors.first_name.message}</p>}
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#A8A8A8', marginBottom: 8, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Last Name *</label>
                  <FocusInput {...register('last_name')} />
                  {errors.last_name && <p style={{ color: '#C0392B', fontSize: 12, marginTop: 4, fontFamily: "'Be Vietnam Pro', sans-serif" }}>{errors.last_name.message}</p>}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#A8A8A8', marginBottom: 8, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Email *</label>
                <FocusInput type="email" {...register('email')} />
                {errors.email && <p style={{ color: '#C0392B', fontSize: 12, marginTop: 4, fontFamily: "'Be Vietnam Pro', sans-serif" }}>{errors.email.message}</p>}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#A8A8A8', marginBottom: 8, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Role *</label>
                <FocusInput as="select" {...register('role')}>
                  <option value="Staff">Staff</option>
                  <option value="Vet">Vet</option>
                  <option value="Admin">Admin</option>
                </FocusInput>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#A8A8A8', marginBottom: 8, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Password *</label>
                <FocusInput type="password" placeholder="Min 10 chars, 1 uppercase, 1 number" {...register('password')} />
                {errors.password && <p style={{ color: '#C0392B', fontSize: 12, marginTop: 4, fontFamily: "'Be Vietnam Pro', sans-serif" }}>{errors.password.message}</p>}
              </div>

              {error && (
                <div style={{ background: '#FFF0EE', borderLeft: '4px solid #C0392B', borderRadius: 8, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, color: '#C0392B', fontSize: 13, fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                  <IconAlertCircle size={16} /> {error}
                </div>
              )}

              <div style={{ display: 'flex', gap: 12, paddingTop: 4 }}>
                <button type="button" onClick={() => setShowModal(false)} style={{
                  flex: 1, padding: '13px 0', borderRadius: 12, border: 'none', cursor: 'pointer',
                  background: '#EDEDED', color: '#6B6B6B', fontSize: 14, fontWeight: 700,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}>Cancel</button>
                <button type="submit" disabled={isSubmitting} style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '13px 0', borderRadius: 12, border: 'none',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  background: 'linear-gradient(135deg, #7B2CBF, #A66DD4)',
                  color: 'white', fontSize: 14, fontWeight: 700,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  opacity: isSubmitting ? 0.7 : 1,
                }}>
                  {isSubmitting && <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />}
                  {isSubmitting ? 'Creating…' : 'Create Staff'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
