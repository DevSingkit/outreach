'use client';

import { useState, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase-client';

// ─── Inline SVG Icons ───────────────────────────────────────────────────────

const IconPaw = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C10.34 2 9 3.34 9 5s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm-5 4C5.34 6 4 7.34 4 9s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm10 0c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zM5.5 14C3.57 14 2 15.57 2 17.5S3.57 21 5.5 21c.96 0 1.83-.38 2.48-1H16c.65.62 1.52 1 2.48 1C20.43 21 22 19.43 22 17.5S20.43 14 18.48 14c-1.5 0-2.78.87-3.43 2.13C14.57 16.05 13.82 16 13 16h-2c-.82 0-1.57.05-2.05.13C8.3 14.87 7.02 14 5.5 14z" />
  </svg>
);

const IconEye = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
);

const IconEyeOff = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const IconAlertCircle = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const IconShield = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const IconCheck = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconCheckCircle = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const IconArrowLeft = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
);

// ─── Schema ─────────────────────────────────────────────────────────────────

const schema = z.object({
  password: z
    .string()
    .min(10, 'Minimum 10 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
  confirm: z.string(),
}).refine(d => d.password === d.confirm, {
  message: 'Passwords do not match',
  path: ['confirm'],
});
type FormValues = z.infer<typeof schema>;

// ─── Password Strength Requirements ─────────────────────────────────────────

function PasswordRequirements({ value }: { value: string }) {
  const checks = [
    { label: 'At least 10 characters', met: value.length >= 10 },
    { label: 'One uppercase letter', met: /[A-Z]/.test(value) },
    { label: 'One number', met: /[0-9]/.test(value) },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10 }}>
      {checks.map(c => (
        <div key={c.label} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          fontSize: 12,
          color: c.met ? '#7ED957' : 'rgba(255,255,255,0.40)',
          transition: 'color 0.2s',
        }}>
          <div style={{
            width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
            background: c.met ? 'rgba(126,217,87,0.20)' : 'rgba(255,255,255,0.08)',
            border: c.met ? '1px solid rgba(126,217,87,0.50)' : '1px solid rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s',
          }}>
            {c.met && <IconCheck size={9} />}
          </div>
          {c.label}
        </div>
      ))}
    </div>
  );
}

// ─── Component ──────────────────────────────────────────────────────────────

function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = true; 

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmFocused, setConfirmFocused] = useState(false);
  const [passwordValue, setPasswordValue] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const sharedInputStyle = (focused: boolean, hasError: boolean) => ({
    width: '100%',
    padding: '13px 48px 13px 16px',
    background: focused ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.08)',
    border: hasError
      ? '2px solid #C0392B'
      : focused
      ? '2px solid rgba(166,109,212,0.70)'
      : '2px solid rgba(255,255,255,0.10)',
    borderRadius: 10,
    fontSize: 14,
    color: '#FFFFFF',
    fontFamily: "'Be Vietnam Pro', sans-serif",
    outline: 'none',
    transition: 'all 0.2s',
    boxSizing: 'border-box' as const,
  });

  // Invalid token state
  if (!token) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #1a0230 0%, #7B2CBF 45%, #4a1070 70%, #2d0650 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16, fontFamily: "'Be Vietnam Pro', sans-serif",
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '32px 32px', pointerEvents: 'none',
        }} />
        <div style={{
          background: 'rgba(255,255,255,0.07)',
          backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 24, padding: '40px 36px',
          textAlign: 'center', maxWidth: 400, width: '100%',
          position: 'relative', zIndex: 1,
        }}>
          <div style={{
            width: 60, height: 60, borderRadius: '50%',
            background: 'rgba(192,57,43,0.15)',
            border: '1px solid rgba(192,57,43,0.30)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px', color: '#f87171',
          }}>
            <IconAlertCircle size={26} />
          </div>
          <h2 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 20, fontWeight: 800, color: '#FFFFFF', margin: '0 0 10px',
          }}>
            Invalid Reset Link
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', margin: '0 0 28px', lineHeight: 1.6 }}>
            This password reset link is invalid or has expired.
          </p>
          <Link href="/auth/forgot-password" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #7B2CBF, #A66DD4)',
            color: '#FFFFFF', borderRadius: 10,
            fontSize: 14, fontWeight: 700,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            textDecoration: 'none',
          }}>
            Request a new link
          </Link>
        </div>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&family=Be+Vietnam+Pro:wght@400&display=swap');`}</style>
      </div>
    );
  }

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setServerError('');
    try {
      const { error } = await supabase.auth.updateUser({ password: data.password });
      if (error) throw new Error(error.message);
      setDone(true);
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : 'Failed to reset password. The link may have expired.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #1a0230 0%, #7B2CBF 45%, #4a1070 70%, #2d0650 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '48px 16px', position: 'relative', overflow: 'hidden',
      fontFamily: "'Be Vietnam Pro', sans-serif",
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
        backgroundSize: '32px 32px', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: '-20%', right: '-10%',
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(166,109,212,0.18) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-15%', left: '-10%',
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(126,217,87,0.10) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }}>

        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 68, height: 68,
            background: 'linear-gradient(135deg, #7B2CBF, #A66DD4)',
            borderRadius: 20, marginBottom: 20,
            boxShadow: '0 8px 32px rgba(123,44,191,0.40)',
          }}>
            <IconPaw size={32} />
          </div>
          <h1 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 22, fontWeight: 800, color: '#FFFFFF',
            margin: '0 0 6px', letterSpacing: '-0.3px',
          }}>
            Northern Hills Veterinary Clinic
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', margin: 0 }}>
            Outreach Management System
          </p>
        </div>

        {/* Glass Card */}
        <div style={{
          background: 'rgba(255,255,255,0.07)',
          backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 24, padding: '40px 36px',
        }}>
          {done ? (
            // ── Success State ─────────────────────────────────────────────
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 72, height: 72,
                background: 'rgba(126,217,87,0.15)',
                border: '1px solid rgba(126,217,87,0.30)',
                borderRadius: '50%', marginBottom: 24,
                color: '#7ED957',
              }}>
                <IconCheckCircle size={32} />
              </div>
              <h2 style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 22, fontWeight: 800, color: '#FFFFFF', margin: '0 0 12px',
              }}>
                Password Updated
              </h2>
              <p style={{
                fontSize: 14, color: 'rgba(255,255,255,0.60)',
                lineHeight: 1.7, margin: '0 0 32px',
              }}>
                Your password has been reset successfully. You can now sign in with your new password.
              </p>
              <button
                onClick={() => router.push('/auth/login')}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '14px 28px',
                  background: 'linear-gradient(135deg, #5BB832, #7ED957)',
                  color: '#1A3A00', border: 'none', borderRadius: 12,
                  fontSize: 15, fontWeight: 700,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                Sign In
              </button>
            </div>
          ) : (
            // ── Form State ───────────────────────────────────────────────
            <>
              {/* Section label */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontSize: 11, fontWeight: 600,
                textTransform: 'uppercase' as const, letterSpacing: '1.5px',
                color: '#A66DD4', marginBottom: 8,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}>
                <IconShield size={11} />
                Account Security
              </div>

              <h2 style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 24, fontWeight: 800, color: '#FFFFFF', margin: '0 0 10px',
              }}>
                Set New Password
              </h2>
              <p style={{
                fontSize: 14, color: 'rgba(255,255,255,0.55)',
                lineHeight: 1.6, margin: '0 0 28px',
              }}>
                Choose a strong password to secure your account.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                {/* New Password */}
                <div>
                  <label style={{
                    display: 'block', fontSize: 13, fontWeight: 600,
                    color: 'rgba(255,255,255,0.80)', marginBottom: 8,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}>
                    New Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="Min. 10 characters"
                      onFocus={() => setPasswordFocused(true)}
                      style={sharedInputStyle(passwordFocused, !!errors.password)}
                      {...register('password', {
                        onChange: (e) => setPasswordValue(e.target.value),
                        onBlur: () => setPasswordFocused(false),
                      })}
                    />
                    <button type="button" onClick={() => setShowPassword(v => !v)} style={{
                      position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'rgba(255,255,255,0.45)', display: 'flex', alignItems: 'center', padding: 0,
                    }}>
                      {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p style={{ color: '#f87171', fontSize: 12, marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <IconAlertCircle size={12} /> {errors.password.message}
                    </p>
                  )}
                  <PasswordRequirements value={passwordValue} />
                </div>

                {/* Confirm Password */}
                <div>
                  <label style={{
                    display: 'block', fontSize: 13, fontWeight: 600,
                    color: 'rgba(255,255,255,0.80)', marginBottom: 8,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}>
                    Confirm Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="Min. 10 characters"
                      onFocus={() => setPasswordFocused(true)}
                      style={sharedInputStyle(passwordFocused, !!errors.password)}
                      {...register('password', {
                        onChange: (e) => setPasswordValue(e.target.value),
                        onBlur: () => setPasswordFocused(false),
                      })}
                    />
                    <button type="button" onClick={() => setShowConfirm(v => !v)} style={{
                      position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'rgba(255,255,255,0.45)', display: 'flex', alignItems: 'center', padding: 0,
                    }}>
                      {showConfirm ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                    </button>
                  </div>
                  {errors.confirm && (
                    <p style={{ color: '#f87171', fontSize: 12, marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <IconAlertCircle size={12} /> {errors.confirm.message}
                    </p>
                  )}
                </div>

                {/* Server error */}
                {serverError && (
                  <div style={{
                    background: 'rgba(192,57,43,0.15)',
                    border: '1px solid rgba(192,57,43,0.40)',
                    borderRadius: 10, padding: '12px 16px',
                    display: 'flex', alignItems: 'center', gap: 10,
                    color: '#fca5a5', fontSize: 13,
                  }}>
                    <IconAlertCircle size={15} />
                    {serverError}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    width: '100%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    padding: '14px 24px',
                    background: isSubmitting
                      ? 'rgba(123,44,191,0.5)'
                      : 'linear-gradient(135deg, #5BB832, #7ED957)',
                    color: isSubmitting ? 'rgba(255,255,255,0.6)' : '#1A3A00',
                    border: 'none', borderRadius: 12,
                    fontSize: 15, fontWeight: 700,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s', marginTop: 4,
                  }}
                >
                  {isSubmitting && (
                    <span style={{
                      width: 16, height: 16,
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTop: '2px solid rgba(255,255,255,0.8)',
                      borderRadius: '50%', display: 'inline-block',
                      animation: 'nhvc-spin 0.7s linear infinite',
                    }} />
                  )}
                  {isSubmitting ? 'Updating…' : 'Reset Password'}
                </button>

                <div style={{ textAlign: 'center' }}>
                  <Link href="/auth/login" style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    fontSize: 13, color: 'rgba(255,255,255,0.50)', textDecoration: 'none',
                  }}>
                    <IconArrowLeft size={13} />
                    Back to Sign In
                  </Link>
                </div>
              </form>
            </>
          )}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Be+Vietnam+Pro:wght@300;400;500;600&display=swap');
        @keyframes nhvc-spin { to { transform: rotate(360deg); } }
        input::placeholder { color: rgba(255,255,255,0.28); }
      `}</style>
    </div>
    
  );
  
}
        export default function ResetPasswordPageWrapper() {
          return (
            <Suspense>
              <ResetPasswordPage />
            </Suspense>
          );
        }