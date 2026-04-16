// app/(public)/register/confirm/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase-client';
import { QRDisplay } from '@/components/QRDisplay';

type State = 'loading' | 'guest' | 'owner' | 'fallback';

const IconPaw = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C10.34 2 9 3.34 9 5s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm-5 4C5.34 6 4 7.34 4 9s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm10 0c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zM5.5 14C3.57 14 2 15.57 2 17.5S3.57 21 5.5 21c.96 0 1.83-.38 2.48-1H16c.65.62 1.52 1 2.48 1C20.43 21 22 19.43 22 17.5S20.43 14 18.48 14c-1.5 0-2.78.87-3.43 2.13C14.57 16.05 13.82 16 13 16h-2c-.82 0-1.57.05-2.05.13C8.3 14.87 7.02 14 5.5 14z" />
  </svg>
);
const IconCheck = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IconArrowRight = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);
const IconMail = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);
const IconQr = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
    <line x1="14" y1="14" x2="14" y2="14" /><line x1="17" y1="14" x2="17" y2="14" /><line x1="20" y1="14" x2="20" y2="14" />
    <line x1="14" y1="17" x2="14" y2="17" /><line x1="17" y1="17" x2="17" y2="17" /><line x1="20" y1="17" x2="20" y2="17" />
    <line x1="14" y1="20" x2="14" y2="20" /><line x1="17" y1="20" x2="17" y2="20" /><line x1="20" y1="20" x2="20" y2="20" />
  </svg>
);

export default function ConfirmPage() {
  const searchParams = useSearchParams();
  const registrationId = searchParams.get('registration_id') ?? '';
  const [state, setState] = useState<State>('loading');
  const [qrCodeData, setQrCodeData] = useState('');
  const [ownerName, setOwnerName] = useState('');

  useEffect(() => {
    if (!registrationId) { setState('fallback'); return; }
    const stored = sessionStorage.getItem('nhvc_reg');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.registration_id === registrationId && parsed.qr_code_data) {
          setQrCodeData(parsed.qr_code_data);
          setState('guest');
          return;
        }
      } catch { /* ignore */ }
    }
    supabase.auth.getUser().then(async ({ data }) => {
      if (data?.user?.user_metadata?.role === 'Owner') {
        const { data: reg } = await supabase
          .from('registrations')
          .select('qr_code_data')
          .eq('registration_id', registrationId)
          .single();
        if (reg?.qr_code_data) setQrCodeData(reg.qr_code_data);
        setState('owner');
      } else {
        setState('fallback');
      }
    }).catch(() => setState('fallback'));
  }, [registrationId]);

  if (state === 'loading') {
    return (
      <div style={{ minHeight: '100vh', background: '#EDEDED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 48, height: 48, border: '3px solid #F3E8FF',
            borderTopColor: '#7B2CBF', borderRadius: '50%',
            animation: 'spin 0.8s linear infinite', margin: '0 auto',
          }} />
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#EDEDED', fontFamily: "'Be Vietnam Pro', sans-serif" }}>

      {/* ── Topbar ── */}
      <header style={{
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(123,44,191,0.08)',
        height: 64, display: 'flex', alignItems: 'center',
        padding: '0 24px', gap: 10,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 9,
          background: 'linear-gradient(135deg, #7B2CBF, #A66DD4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
        }}>
          <IconPaw size={17} />
        </div>
        <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: 13, color: '#7B2CBF' }}>
          Northern Hills Veterinary Clinic
        </span>
      </header>

      {/* ── Hero stripe ── */}
      <div style={{
        background: 'linear-gradient(160deg, #1a0230 0%, #7B2CBF 45%, #4a1070 70%, #2d0650 100%)',
        padding: '48px 24px 80px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '28px 28px', pointerEvents: 'none',
        }} />
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          {/* Animated check ring */}
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'rgba(126,217,87,0.15)',
            border: '2px solid rgba(126,217,87,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
            color: '#7ED957',
          }}>
            <IconCheck size={36} />
          </div>
          <h1 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 800,
            color: '#fff', margin: '0 0 10px',
          }}>
            Registration Confirmed!
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, margin: 0, fontFamily: "'Be Vietnam Pro', sans-serif" }}>
            You're all set for the outreach event.
          </p>
        </div>
      </div>

      {/* ── Main card — pulled up over the hero ── */}
      <main style={{ maxWidth: 520, margin: '-40px auto 0', padding: '0 24px 80px' }}>
        <div style={{
          background: '#fff',
          borderRadius: 20,
          boxShadow: '0 16px 48px rgba(97,0,164,0.10)',
          overflow: 'hidden',
        }}>

          {state === 'guest' && (
            <>
              {/* Info strip */}
              <div style={{ padding: '24px 28px', background: '#F9F5FF', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { icon: <IconQr size={14} />, text: 'Your QR code is ready below — save or screenshot it.' },
                  { icon: <IconMail size={14} />, text: 'A copy has also been sent to your email address.' },
                ].map(({ icon, text }, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: '#6B6B6B', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                    <span style={{ color: '#7B2CBF', marginTop: 1, flexShrink: 0 }}>{icon}</span>
                    {text}
                  </div>
                ))}
              </div>

              {/* QR area */}
              <div style={{ padding: '32px 28px', textAlign: 'center' }}>
                <div style={{
                  display: 'inline-block',
                  padding: 16,
                  background: '#fff',
                  borderRadius: 16,
                  border: '2px solid rgba(123,44,191,0.1)',
                  boxShadow: '0 8px 32px rgba(97,0,164,0.06)',
                  marginBottom: 16,
                }}>
                  <QRDisplay qrCodeData={qrCodeData} />
                </div>

                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: '#F3E8FF', borderRadius: 100,
                  padding: '6px 14px',
                  fontSize: 12, color: '#7B2CBF',
                  fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600,
                }}>
                  <IconQr size={12} />
                  Show this at the check-in station
                </div>
              </div>
            </>
          )}

          {state === 'owner' && (
            <>
              <div style={{ padding: '24px 28px', background: '#F9F5FF' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#6B6B6B', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                  <span style={{ color: '#7B2CBF' }}><IconQr size={14} /></span>
                  Your QR code is ready below. Show it at the check-in station.
                </div>
              </div>
              <div style={{ padding: '32px 28px', textAlign: 'center' }}>
                <div style={{
                  display: 'inline-block', padding: 16,
                  background: '#fff', borderRadius: 16,
                  border: '2px solid rgba(123,44,191,0.1)',
                  boxShadow: '0 8px 32px rgba(97,0,164,0.06)',
                  marginBottom: 20,
                }}>
                  <QRDisplay qrCodeData={qrCodeData} />
                </div>
                <div>
                  <Link href="/owner/registrations" style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '10px 20px',
                    background: '#F3E8FF', color: '#7B2CBF',
                    borderRadius: 10, fontSize: 13, fontWeight: 600,
                    textDecoration: 'none', fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}>
                    View My Registrations <IconArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </>
          )}

          {state === 'fallback' && (
            <div style={{ padding: '40px 28px', textAlign: 'center' }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: '#E8F8E0', color: '#5BB832',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px', fontSize: 26,
              }}>
                <IconCheck size={28} />
              </div>
              <p style={{ color: '#3A3A3A', fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: 14, lineHeight: 1.6, margin: '0 0 8px' }}>
                Registration submitted! Check your email for your QR code.
              </p>
              <p style={{ color: '#A8A8A8', fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: 13, margin: 0 }}>
                Present it at the event for check-in.
              </p>
            </div>
          )}

          {/* Footer row */}
          <div style={{
            padding: '16px 28px',
            background: '#FAFAFA',
            display: 'flex', justifyContent: 'center',
            borderTop: '1px solid rgba(123,44,191,0.06)',
          }}>
            <Link href="/events" style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              color: '#7B2CBF', fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 13, fontWeight: 600, textDecoration: 'none',
            }}>
              ← View Other Events
            </Link>
          </div>
        </div>

        {/* Clinic footer note */}
        <p style={{
          textAlign: 'center', fontSize: 11, color: '#A8A8A8',
          fontFamily: "'Be Vietnam Pro', sans-serif",
          margin: '20px 0 0', lineHeight: 1.6,
        }}>
          Northern Hills Veterinary Clinic<br />
          Adeline Arcade, Unit 12, Quirino Highway · Caloocan City
        </p>
      </main>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}