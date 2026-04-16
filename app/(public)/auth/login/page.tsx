'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase-client';

// ─── Inline SVG Icons ───────────────────────────────────────────────────────

const IconPaw = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
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

const IconLogIn = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" />
  </svg>
);

const IconAlertCircle = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

// ─── Schema ─────────────────────────────────────────────────────────────────

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});
type FormValues = z.infer<typeof schema>;

// ─── Component ──────────────────────────────────────────────────────────────

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setServerError('');
    try {
  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });
  if (error) throw new Error(error.message);

  const { data: staff } = await supabase
    .from('staff_accounts')
    .select('role')
    .eq('supabase_uid', authData.user.id)
    .maybeSingle();

  if (staff?.role === 'Admin') {
    router.push('/admin/dashboard');
  } else if (staff?.role === 'Staff' || staff?.role === 'Vet') {
    router.push('/staff/dashboard');
  } else {
    const { data: owner } = await supabase
      .from('owners')
      .select('owner_id')
      .eq('supabase_uid', authData.user.id)
      .maybeSingle();

    if (owner) router.push('/owner/dashboard');
    else throw new Error('Account not found. Please contact support.');
  }
} catch (err: unknown) {
  setServerError(err instanceof Error ? err.message : 'Invalid email or password.');
} finally {
  setIsSubmitting(false);
}
  };
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #1a0230 0%, #7B2CBF 45%, #4a1070 70%, #2d0650 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 16px',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Be Vietnam Pro', sans-serif",
    }}>

      {/* Dot grid overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
        pointerEvents: 'none',
      }} />

      {/* Ambient glow orbs */}
      <div style={{
        position: 'absolute', top: '-20%', right: '-10%',
        width: 500, height: 500,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(166,109,212,0.18) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-15%', left: '-10%',
        width: 400, height: 400,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(126,217,87,0.10) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }}>

        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 68, height: 68,
            background: 'linear-gradient(135deg, #7B2CBF, #A66DD4)',
            borderRadius: 20,
            marginBottom: 20,
            boxShadow: '0 8px 32px rgba(123,44,191,0.40)',
          }}>
            <IconPaw size={32} className="" />
          </div>

          <h1 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 22,
            fontWeight: 800,
            color: '#FFFFFF',
            margin: '0 0 6px',
            letterSpacing: '-0.3px',
          }}>
            Northern Hills Veterinary Clinic
          </h1>
          <p style={{
            fontSize: 13,
            color: 'rgba(255,255,255,0.55)',
            margin: 0,
            fontWeight: 400,
            letterSpacing: '0.5px',
          }}>
            Outreach Management System
          </p>
        </div>

        {/* Glass Card */}
        <div style={{
          background: 'rgba(255,255,255,0.07)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 24,
          padding: '40px 36px',
        }}>
          {/* Section label */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 11, fontWeight: 600,
            textTransform: 'uppercase' as const, letterSpacing: '1.5px',
            color: '#A66DD4', marginBottom: 8,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}>
            <IconPaw size={11} />
            Staff & Admin Portal
          </div>

          <h2 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 24,
            fontWeight: 800,
            color: '#FFFFFF',
            margin: '0 0 28px',
            letterSpacing: '-0.3px',
          }}>
            Sign In
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Email */}
            <div>
              <label style={{
                display: 'block',
                fontSize: 13,
                fontWeight: 600,
                color: 'rgba(255,255,255,0.80)',
                marginBottom: 8,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}>
                Email Address
              </label>
              <input
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                onFocus={() => setEmailFocused(true)}
                style={{
                  width: '100%',
                  padding: '13px 16px',
                  background: emailFocused ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.08)',
                  border: errors.email
                    ? '2px solid #C0392B'
                    : emailFocused
                    ? '2px solid rgba(166,109,212,0.70)'
                    : '2px solid rgba(255,255,255,0.10)',
                  borderRadius: 10,
                  fontSize: 14,
                  color: '#FFFFFF',
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                  outline: 'none',
                  transition: 'all 0.2s',
                  boxSizing: 'border-box' as const,
                }}
                {...register('email')}
              />
              {errors.email && (
                <p style={{ color: '#f87171', fontSize: 12, marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <IconAlertCircle size={12} /> {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <label style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.80)',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}>
                  Password
                </label>
                <Link
                  href="/auth/forgot-password"
                  style={{
                    fontSize: 12,
                    color: '#A66DD4',
                    textDecoration: 'none',
                    fontWeight: 500,
                    transition: 'color 0.2s',
                  }}
                >
                  Forgot password?
                </Link>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••••"
                  onFocus={() => setPasswordFocused(true)}
                  style={{
                    width: '100%',
                    padding: '13px 48px 13px 16px',
                    background: passwordFocused ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.08)',
                    border: errors.password
                      ? '2px solid #C0392B'
                      : passwordFocused
                      ? '2px solid rgba(166,109,212,0.70)'
                      : '2px solid rgba(255,255,255,0.10)',
                    borderRadius: 10,
                    fontSize: 14,
                    color: '#FFFFFF',
                    fontFamily: "'Be Vietnam Pro', sans-serif",
                    outline: 'none',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box' as const,
                  }}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  style={{
                    position: 'absolute',
                    right: 14,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'rgba(255,255,255,0.45)',
                    display: 'flex',
                    alignItems: 'center',
                    padding: 0,
                  }}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p style={{ color: '#f87171', fontSize: 12, marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <IconAlertCircle size={12} /> {errors.password.message}
                </p>
              )}
            </div>

            {/* Server error */}
            {serverError && (
              <div style={{
                background: 'rgba(192,57,43,0.15)',
                border: '1px solid rgba(192,57,43,0.40)',
                borderRadius: 10,
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                color: '#fca5a5',
                fontSize: 13,
              }}>
                <IconAlertCircle size={15} />
                {serverError}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '14px 24px',
                background: isSubmitting
                  ? 'rgba(123,44,191,0.5)'
                  : 'linear-gradient(135deg, #5BB832, #7ED957)',
                color: isSubmitting ? 'rgba(255,255,255,0.6)' : '#1A3A00',
                border: 'none',
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 700,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                marginTop: 4,
              }}
            >
              {isSubmitting ? (
                <span style={{
                  width: 16, height: 16,
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTop: '2px solid rgba(255,255,255,0.8)',
                  borderRadius: '50%',
                  display: 'inline-block',
                  animation: 'nhvc-spin 0.7s linear infinite',
                }} />
              ) : (
                <IconLogIn size={16} />
              )}
              {isSubmitting ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Back link */}
        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>
          <Link href="/" style={{ color: 'rgba(255,255,255,0.55)', textDecoration: 'none', transition: 'color 0.2s' }}>
            Back to Northern Hills Veterinary Clinic
          </Link>
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Be+Vietnam+Pro:wght@300;400;500;600&display=swap');
        @keyframes nhvc-spin { to { transform: rotate(360deg); } }
        input::placeholder { color: rgba(255,255,255,0.28); }
      `}</style>
    </div>
  );
}
