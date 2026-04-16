'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { supabase } from '@/lib/supabase-client';
// ─── Inline SVG Icons ───────────────────────────────────────────────────────

const IconPaw = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C10.34 2 9 3.34 9 5s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm-5 4C5.34 6 4 7.34 4 9s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm10 0c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zM5.5 14C3.57 14 2 15.57 2 17.5S3.57 21 5.5 21c.96 0 1.83-.38 2.48-1H16c.65.62 1.52 1 2.48 1C20.43 21 22 19.43 22 17.5S20.43 14 18.48 14c-1.5 0-2.78.87-3.43 2.13C14.57 16.05 13.82 16 13 16h-2c-.82 0-1.57.05-2.05.13C8.3 14.87 7.02 14 5.5 14z" />
  </svg>
);

const IconMail = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
  </svg>
);

const IconAlertCircle = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const IconCheckCircle = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

// ─── Schema ─────────────────────────────────────────────────────────────────

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
});
type FormValues = z.infer<typeof schema>;

// ─── Component ──────────────────────────────────────────────────────────────

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset-password`,
      });
    } catch {
      // Always show success — don't leak whether email exists
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
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

      {/* Ambient orbs */}
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
            borderRadius: 20,
            marginBottom: 20,
            boxShadow: '0 8px 32px rgba(123,44,191,0.40)',
          }}>
            <IconPaw size={32} />
          </div>
          <h1 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 22, fontWeight: 800,
            color: '#FFFFFF', margin: '0 0 6px', letterSpacing: '-0.3px',
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
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 24,
          padding: '40px 36px',
        }}>
          {submitted ? (
            // ── Success State ─────────────────────────────────────────────
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 72, height: 72,
                background: 'rgba(126,217,87,0.15)',
                border: '1px solid rgba(126,217,87,0.30)',
                borderRadius: '50%',
                marginBottom: 24,
                color: '#7ED957',
              }}>
                <IconCheckCircle size={32} />
              </div>
              <h2 style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 22, fontWeight: 800,
                color: '#FFFFFF', margin: '0 0 12px',
              }}>
                Check your email
              </h2>
              <p style={{
                fontSize: 14, color: 'rgba(255,255,255,0.60)',
                lineHeight: 1.7, margin: '0 0 32px',
              }}>
                If an account exists for that email address, we've sent password reset instructions. Check your spam folder if you don't see it.
              </p>
              <Link href="/auth/login" style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #7B2CBF, #A66DD4)',
                color: '#FFFFFF',
                borderRadius: 10,
                fontSize: 14, fontWeight: 700,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}>
                Back to Sign In
              </Link>
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
                <IconPaw size={11} />
                Account Recovery
              </div>

              <h2 style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 24, fontWeight: 800,
                color: '#FFFFFF', margin: '0 0 10px',
              }}>
                Reset Password
              </h2>
              <p style={{
                fontSize: 14, color: 'rgba(255,255,255,0.55)',
                lineHeight: 1.6, margin: '0 0 28px',
              }}>
                Enter your email and we&apos;ll send you a link to reset your password.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <label style={{
                    display: 'block', fontSize: 13, fontWeight: 600,
                    color: 'rgba(255,255,255,0.80)', marginBottom: 8,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}>
                    Email Address
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      onFocus={() => setEmailFocused(true)}
                      {...register('email', {
                        onBlur: () => setEmailFocused(false),
                      })}
                      style={{
                        width: '100%',
                        padding: '13px 16px 13px 44px',
                        background: emailFocused ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.08)',
                        border: errors.email
                          ? '2px solid #C0392B'
                          : emailFocused
                          ? '2px solid rgba(166,109,212,0.70)'
                          : '2px solid rgba(255,255,255,0.10)',
                        borderRadius: 10,
                        fontSize: 14, color: '#FFFFFF',
                        fontFamily: "'Be Vietnam Pro', sans-serif",
                        outline: 'none', transition: 'all 0.2s',
                        boxSizing: 'border-box' as const,
                      }}
                    />
                    {/* Mail icon inside input */}
                    <div style={{
                      position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                      color: 'rgba(255,255,255,0.35)', pointerEvents: 'none',
                    }}>
                      <IconMail size={17} />
                    </div>
                  </div>
                  {errors.email && (
                    <p style={{ color: '#f87171', fontSize: 12, marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <IconAlertCircle size={12} /> {errors.email.message}
                    </p>
                  )}
                </div>

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
                    transition: 'all 0.2s',
                  }}
                >
                  {isSubmitting && (
                    <span style={{
                      width: 16, height: 16,
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTop: '2px solid rgba(255,255,255,0.8)',
                      borderRadius: '50%',
                      display: 'inline-block',
                      animation: 'nhvc-spin 0.7s linear infinite',
                    }} />
                  )}
                  {isSubmitting ? 'Sending…' : 'Send Reset Link'}
                </button>

                <div style={{ textAlign: 'center' }}>
                  <Link href="/auth/login" style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    fontSize: 13, color: 'rgba(255,255,255,0.50)',
                    textDecoration: 'none', transition: 'color 0.2s',
                  }}>
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