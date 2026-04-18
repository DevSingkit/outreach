// app/(public)/register/confirm/page.tsx
'use client';

import { useEffect, useState, Suspense } from 'react';
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
const IconCheck = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IconArrowRight = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);
const IconMail = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);
const IconQr = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
    <rect x="5" y="5" width="3" height="3" /><rect x="16" y="5" width="3" height="3" /><rect x="16" y="16" width="3" height="3" /><rect x="5" y="16" width="3" height="3" />
  </svg>
);
const IconCalendar = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

function ConfirmPage() {
  const searchParams = useSearchParams();
  const registrationId = searchParams.get('registration_id') ?? '';
  const [state, setState] = useState<State>('loading');
  const [qrCodeData, setQrCodeData] = useState('');

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
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #1a0230 0%, #7B2CBF 45%, #4a1070 70%, #2d0650 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 52, height: 52,
            border: '3px solid rgba(255,255,255,0.15)',
            borderTopColor: '#7ED957',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 16px',
          }} />
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, fontFamily: "'Be Vietnam Pro', sans-serif", margin: 0 }}>
            Loading your registration…
          </p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#EDEDED', fontFamily: "'Be Vietnam Pro', sans-serif" }}>

      {/* ── Topbar ── */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        height: 64,
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(123,44,191,0.08)',
        zIndex: 100,
        display: 'flex', alignItems: 'center',
        padding: '0 24px', gap: 10,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: 'linear-gradient(135deg, #7B2CBF, #A66DD4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', flexShrink: 0,
        }}>
          <IconPaw size={20} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
          <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, fontWeight: 700, color: '#7B2CBF' }}>
            Northern Hills Vet
          </span>
          <span style={{ fontSize: 10, color: '#A8A8A8', fontWeight: 400 }}>
            Caloocan City, Metro Manila
          </span>
        </div>
      </header>

      {/* ── Dark hero stripe ── */}
      <div style={{
        paddingTop: 64,
        background: 'linear-gradient(160deg, #1a0230 0%, #7B2CBF 45%, #4a1070 70%, #2d0650 100%)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Dot grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '32px 32px', pointerEvents: 'none',
        }} />

        {/* Ambient glow blobs */}
        <div style={{
          position: 'absolute', top: -60, right: -60,
          width: 240, height: 240, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(126,217,87,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: -40, left: -40,
          width: 200, height: 200, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(166,109,212,0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1, padding: '52px 24px 96px' }}>
          {/* Success ring */}
          <div style={{
            width: 88, height: 88, borderRadius: '50%',
            background: 'rgba(126,217,87,0.12)',
            border: '2px solid rgba(126,217,87,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px',
            color: '#7ED957',
            boxShadow: '0 0 40px rgba(126,217,87,0.15)',
          }}>
            <IconCheck size={40} />
          </div>

          {/* Step label */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 11, fontWeight: 600,
            textTransform: 'uppercase', letterSpacing: '1.5px',
            color: '#7ED957', marginBottom: 14,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}>
            <IconPaw size={11} />
            Registration Complete
          </div>

          <h1 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 'clamp(2rem, 5vw, 2.8rem)', fontWeight: 800,
            color: '#fff', margin: '0 0 12px', lineHeight: 1.15,
          }}>
            You&apos;re confirmed!
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.55)', fontSize: 15,
            margin: 0, fontFamily: "'Be Vietnam Pro', sans-serif",
            maxWidth: 340, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6,
          }}>
            Your spot is reserved. Present your QR code at the event entry.
          </p>
        </div>
      </div>

      {/* ── Main card — pulled up over the hero ── */}
      <main style={{ maxWidth: 520, margin: '30px auto 0', padding: '0 20px 80px' }}>
        <div style={{
          background: '#fff',
          borderRadius: 24,
          boxShadow: '0 20px 60px rgba(97,0,164,0.12)',
          overflow: 'hidden',
        }}>

          {/* ── GUEST state ── */}
          {state === 'guest' && (
            <>
              {/* Info strips */}
              <div style={{ padding: '28px 28px 0' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    { icon: <IconQr size={18} />, title: 'Screenshot your QR code', desc: 'You\'ll need it to check in at the event.' },
                    { icon: <IconMail size={18} />, title: 'Check your email', desc: 'We sent a copy of your QR code and pre-op instructions.' },
                  ].map(({ icon, title, desc }, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'flex-start', gap: 14,
                      padding: '16px 18px',
                      background: i === 0 ? '#F3E8FF' : '#F9F5FF',
                      borderRadius: 14,
                    }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: 10,
                        background: '#fff', color: '#7B2CBF',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: '0 4px 12px rgba(123,44,191,0.10)',
                      }}>
                        {icon}
                      </div>
                      <div>
                        <p style={{ margin: '0 0 2px', fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: 13, color: '#3A3A3A' }}>
                          {title}
                        </p>
                        <p style={{ margin: 0, fontSize: 12, color: '#6B6B6B', lineHeight: 1.5 }}>
                          {desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* QR display */}
              <div style={{ padding: '32px 28px', textAlign: 'center' }}>
                <div style={{
                  display: 'inline-block',
                  padding: 20,
                  background: '#fff',
                  borderRadius: 20,
                  border: '2px solid rgba(123,44,191,0.10)',
                  boxShadow: '0 12px 40px rgba(97,0,164,0.08)',
                  marginBottom: 20,
                }}>
                  <QRDisplay qrCodeData={qrCodeData} />
                </div>

                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: '#E8F8E0',
                  borderRadius: 100,
                  padding: '8px 16px',
                  fontSize: 12, color: '#3A7A00',
                  fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600,
                }}>
                  <IconCheck size={13} />
                  Take a screenshot of your QR code
                </div>
              </div>
            </>
          )}

          {/* ── OWNER state ── */}
          {state === 'owner' && (
            <>
              <div style={{ padding: '28px 28px 0' }}>
                <div style={{
                  display: 'flex', alignItems: 'flex-start', gap: 14,
                  padding: '16px 18px',
                  background: '#F3E8FF',
                  borderRadius: 14,
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: '#fff', color: '#7B2CBF',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, boxShadow: '0 4px 12px rgba(123,44,191,0.10)',
                  }}>
                    <IconQr size={18} />
                  </div>
                  <div>
                    <p style={{ margin: '0 0 2px', fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: 13, color: '#3A3A3A' }}>
                      Your check-in QR code
                    </p>
                    <p style={{ margin: 0, fontSize: 12, color: '#6B6B6B', lineHeight: 1.5 }}>
                      Show this at the entry gate. It&apos;s also saved to your registrations.
                    </p>
                  </div>
                </div>
              </div>

              <div style={{ padding: '32px 28px', textAlign: 'center' }}>
                <div style={{
                  display: 'inline-block', padding: 20,
                  background: '#fff', borderRadius: 20,
                  border: '2px solid rgba(123,44,191,0.10)',
                  boxShadow: '0 12px 40px rgba(97,0,164,0.08)',
                  marginBottom: 20,
                }}>
                  <QRDisplay qrCodeData={qrCodeData} />
                </div>

                <div>
                  <Link href="/owner/registrations" style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '12px 22px',
                    background: 'linear-gradient(135deg, #7B2CBF, #A66DD4)',
                    color: 'white',
                    borderRadius: 12, fontSize: 13, fontWeight: 700,
                    textDecoration: 'none',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    boxShadow: '0 6px 20px rgba(123,44,191,0.25)',
                  }}>
                    View My Registrations <IconArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </>
          )}

          {/* ── FALLBACK state ── */}
          {state === 'fallback' && (
            <div style={{ padding: '48px 28px', textAlign: 'center' }}>
              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                background: '#E8F8E0',
                border: '2px solid rgba(91,184,50,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px',
                color: '#5BB832',
              }}>
                <IconCheck size={32} />
              </div>
              <h3 style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 18, fontWeight: 700,
                color: '#3A3A3A', margin: '0 0 10px',
              }}>
                Registration submitted!
              </h3>
              <p style={{ color: '#6B6B6B', fontSize: 14, lineHeight: 1.6, margin: '0 0 6px' }}>
                Check your email for your QR code and pre-op instructions.
              </p>
              <p style={{ color: '#A8A8A8', fontSize: 13, margin: 0 }}>
                Present it at the event entry gate for check-in.
              </p>
            </div>
          )}

          {/* ── Footer row ── */}
          <div style={{
            padding: '18px 28px',
            background: '#FAFAFA',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            <Link href="/" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              color: '#7B2CBF',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 13, fontWeight: 600, textDecoration: 'none',
            }}>
              Go back to Homepage
              <IconArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* Clinic note */}
        <p style={{
          textAlign: 'center', fontSize: 11, color: '#A8A8A8',
          fontFamily: "'Be Vietnam Pro', sans-serif",
          margin: '24px 0 0', lineHeight: 1.7,
        }}>
          Northern Hills Veterinary Clinic<br />
          Adeline Arcade, Unit 12, Quirino Highway<br />
          Caloocan City
        </p>
      </main>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function ConfirmPageWrapper() {
  return (
    <Suspense>
      <ConfirmPage />
    </Suspense>
  );
}