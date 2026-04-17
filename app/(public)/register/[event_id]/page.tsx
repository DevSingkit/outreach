// app/(public)/register/[event_id]/page.tsx
'use client';

import { useState, use } from 'react';
import { useForm, useFieldArray, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase-client';

// ─── Icons ───────────────────────────────────────────────────────────────────

const IconPaw = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2C10.34 2 9 3.34 9 5s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm-5 4C5.34 6 4 7.34 4 9s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm10 0c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zM5.5 14C3.57 14 2 15.57 2 17.5S3.57 21 5.5 21c.96 0 1.83-.38 2.48-1H16c.65.62 1.52 1 2.48 1C20.43 21 22 19.43 22 17.5S20.43 14 18.48 14c-1.5 0-2.78.87-3.43 2.13C14.57 16.05 13.82 16 13 16h-2c-.82 0-1.57.05-2.05.13C8.3 14.87 7.02 14 5.5 14z" />
  </svg>
);
const IconArrowLeft = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
);
const IconPlus = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const IconTrash = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);
const IconUser = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);
const IconShield = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const IconAlertCircle = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);
const IconCheck = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// ─── Schema ───────────────────────────────────────────────────────────────────

const petSchema = z.object({
  pet_name:       z.string().min(1, 'Pet name is required'),
  species:        z.enum(['Dog', 'Cat', 'Other']),
  sex:            z.enum(['Male', 'Female']),
  breed:          z.string().optional(),
  age_years:      z.coerce.number().min(0).nullish().transform(v => v ?? undefined),
  age_months:     z.coerce.number().min(0).max(11).nullish().transform(v => v ?? undefined),
  weight_kg:      z.coerce.number().min(0).nullish().transform(v => v ?? undefined),
  health_notes:   z.string().optional(),
  color_markings: z.string().optional(),
});

const schema = z.object({
  first_name:     z.string().min(1, 'First name is required'),
  last_name:      z.string().min(1, 'Last name is required'),
  email:          z.string().email('Enter a valid email'),
  contact_number: z.string().optional(),
  address:        z.string().optional(),
  pets:           z.array(petSchema).min(1, 'Add at least one pet'),
  create_account: z.boolean().optional(),
  password:       z.string().optional(),
}).refine(d => {
  if (d.create_account) {
    if (!d.password || d.password.length < 10) return false;
    if (!/[A-Z]/.test(d.password)) return false;
    if (!/[0-9]/.test(d.password)) return false;
  }
  return true;
}, { message: 'Password must be 10+ chars with 1 uppercase and 1 number', path: ['password'] });

type FormValues = z.infer<typeof schema>;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const inputStyle = (focused: boolean, hasError: boolean): React.CSSProperties => ({
  width: '100%',
  padding: '12px 14px',
  background: focused ? '#FFFFFF' : '#F5F5F7',
  border: `2px solid ${hasError ? '#C0392B' : focused ? '#7B2CBF' : 'transparent'}`,
  borderRadius: 8,
  fontSize: 14,
  color: '#3A3A3A',
  fontFamily: "'Be Vietnam Pro', sans-serif",
  outline: 'none',
  transition: 'all 0.18s',
  boxSizing: 'border-box' as const,
});

function Field({ label, error, required, hint, children }: {
  label: string; error?: string; required?: boolean; hint?: string; children: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: 11, fontWeight: 700,
        color: error ? '#C0392B' : '#6B6B6B',
        textTransform: 'uppercase', letterSpacing: '0.6px',
        display: 'flex', alignItems: 'center', gap: 4,
      }}>
        {label}
        {required && <span style={{ color: '#C0392B' }}>*</span>}
        {hint && <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: '#A8A8A8', fontSize: 10 }}>({hint})</span>}
      </label>
      {children}
      {error && (
        <span style={{
          display: 'flex', alignItems: 'center', gap: 4,
          fontFamily: "'Be Vietnam Pro', sans-serif",
          fontSize: 11, color: '#C0392B',
        }}>
          <IconAlertCircle size={11} /> {error}
        </span>
      )}
    </div>
  );
}

function SectionLabel({ text }: { text: string }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px',
      color: '#7B2CBF', marginBottom: 6,
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>
      <IconPaw size={9} /> {text}
    </div>
  );
}

// ─── Step indicator ───────────────────────────────────────────────────────────

function StepBadge({ step, label, active }: { step: number; label: string; active?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{
        width: 26, height: 26, borderRadius: '50%',
        background: active ? 'linear-gradient(135deg, #7B2CBF, #A66DD4)' : '#E8E8E8',
        color: active ? 'white' : '#A8A8A8',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 11, fontWeight: 800,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        flexShrink: 0,
        boxShadow: active ? '0 2px 8px rgba(123,44,191,0.3)' : 'none',
        transition: 'all 0.2s',
      }}>
        {step}
      </div>
      <span style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: 12, fontWeight: active ? 700 : 500,
        color: active ? '#3A3A3A' : '#A8A8A8',
      }}>
        {label}
      </span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RegisterPage({ params }: { params: Promise<{ event_id: string }> }) {
  const { event_id } = use(params);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [focused, setFocused] = useState<string | null>(null);

  const { register, control, handleSubmit, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: {
      pets: [{ pet_name: '', species: 'Dog', sex: 'Male', age_years: undefined, age_months: undefined, weight_kg: undefined }],
      create_account: false,
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'pets' });
  const createAccount = watch('create_account');
  const password = watch('password') ?? '';

  const pwChecks = {
    length: password.length >= 10,
    upper: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
  };
  const pwScore = Object.values(pwChecks).filter(Boolean).length;

  const fp = (name: string) => ({
    onFocus: () => setFocused(name),
    onBlur: () => setFocused(null),
    style: inputStyle(focused === name, false),
  });
  const fpe = (name: string, err: boolean) => ({
    onFocus: () => setFocused(name),
    onBlur: () => setFocused(null),
    style: inputStyle(focused === name, err),
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setServerError('');
    try {
      const { data: owner, error: ownerError } = await supabase
        .from('owners')
        .upsert({
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          contact_number: data.contact_number ?? null,
          address: data.address ?? null,
        }, { onConflict: 'email' })
        .select()
        .single();
      if (ownerError) throw new Error(ownerError.message);

      const { data: existing } = await supabase
        .from('registrations')
        .select('registration_id')
        .eq('event_id', event_id)
        .eq('owner_id', owner.owner_id)
        .maybeSingle();
      if (existing) throw new Error('already registered');

      const { data: event, error: eventError } = await supabase
        .from('events')
        .select('max_capacity, registered_count')
        .eq('event_id', event_id)
        .single();
      if (eventError) throw new Error(eventError.message);
      if (event.max_capacity !== null && event.registered_count >= event.max_capacity) {
        throw new Error('capacity');
      }

      const qr_code_data = `NHVC-${event_id}-${owner.owner_id}-${Date.now()}`;
      const { data: registration, error: regError } = await supabase
        .from('registrations')
        .insert({ event_id, owner_id: owner.owner_id, qr_code_data, registration_type: 'Pre-registered' })
        .select()
        .single();
      if (regError) throw new Error(regError.message);

      for (const pet of data.pets) {
        const { data: insertedPet, error: petError } = await supabase
          .from('pets')
          .insert({
            owner_id: owner.owner_id,
            pet_name: pet.pet_name,
            species: pet.species,
            sex: pet.sex,
            breed: pet.breed ?? null,
            age_years: pet.age_years ?? null,
            age_months: pet.age_months ?? null,
            weight_kg: pet.weight_kg ?? null,
            health_notes: pet.health_notes ?? null,
            color_markings: pet.color_markings ?? null,
          })
          .select()
          .single();
        if (petError) throw new Error(petError.message);

        const { error: linkError } = await supabase
          .from('registration_pets')
          .insert({ registration_id: registration.registration_id, pet_id: insertedPet.pet_id });
        if (linkError) throw new Error(linkError.message);
      }

      if (data.create_account && data.password) {
        await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: { data: { role: 'Owner', owner_id: owner.owner_id } },
        });
      }

      sessionStorage.setItem('nhvc_reg', JSON.stringify({
        registration_id: registration.registration_id,
        qr_code_data,
      }));
      router.push(`/register/confirm?registration_id=${registration.registration_id}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong.';
      if (msg.toLowerCase().includes('already registered')) {
        setServerError('You are already registered for this event.');
      } else if (msg.toLowerCase().includes('capacity') || msg.toLowerCase().includes('full')) {
        setServerError('This event is full. No slots are available.');
      } else {
        setServerError(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#EDEDED', fontFamily: "'Be Vietnam Pro', sans-serif" }}>

      {/* ── Topbar ── */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 64,
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(123,44,191,0.08)',
        zIndex: 100, display: 'flex', alignItems: 'center',
        padding: '0 24px', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: 'linear-gradient(135deg, #7B2CBF, #A66DD4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white',
          }}>
            <IconPaw size={18} />
          </div>
          <div style={{ lineHeight: 1.15 }}>
            <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, fontWeight: 700, color: '#7B2CBF' }}>
              Northern Hills Vet
            </div>
            <div style={{ fontSize: 10, color: '#A8A8A8' }}>Caloocan City, Metro Manila</div>
          </div>
        </div>
        <Link href="/events" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: 13, fontWeight: 600, color: '#6B6B6B',
          textDecoration: 'none', padding: '7px 14px', borderRadius: 8,
          background: '#F5F5F7', transition: 'all 0.18s',
        }}>
          <IconArrowLeft size={14} /> Back to Events
        </Link>
      </header>

      {/* ── Hero ── */}
      <div style={{
        background: 'linear-gradient(160deg, #1a0230 0%, #7B2CBF 45%, #4a1070 70%, #2d0650 100%)',
        paddingTop: 64, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '32px 32px', pointerEvents: 'none',
        }} />
        <div style={{ position: 'absolute', top: 16, right: 40, opacity: 0.05, color: 'white', transform: 'rotate(20deg)' }}>
          <IconPaw size={160} />
        </div>

        <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px 0', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 100, padding: '4px 14px',
            fontSize: 10, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '1.5px',
            color: '#C4A0E8', marginBottom: 16,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}>
            <IconPaw size={9} /> Outreach Registration
          </div>

          <h1 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 800,
            color: '#FFFFFF', margin: '0 0 10px', lineHeight: 1.15,
          }}>
            Register for the Event
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, margin: '0 0 36px', maxWidth: 460, lineHeight: 1.7 }}>
            Fill in your details and your pet&apos;s information. You&apos;ll receive a QR code via email upon successful registration.
          </p>

          {/* Step progress pills — inside hero, bottom */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 14, padding: '14px 20px',
            flexWrap: 'wrap', rowGap: 10,
          }}>
            <StepBadge step={1} label="Owner Info" active />
            <div style={{ width: 24, height: 1, background: 'rgba(255,255,255,0.15)', flexShrink: 0 }} />
            <StepBadge step={2} label="Pet Details" active />
            <div style={{ width: 24, height: 1, background: 'rgba(255,255,255,0.15)', flexShrink: 0 }} />
            <StepBadge step={3} label="Account (optional)" />
          </div>
        </div>

        {/* Curved bottom */}
        <div style={{
          height: 40, marginTop: 32,
          background: '#EDEDED',
          borderRadius: '24px 24px 0 0',
        }} />
      </div>

      {/* ── Form ── */}
      <main style={{ maxWidth: 720, margin: '-8px auto 0', padding: '0 24px 80px' }}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* ── Owner card ── */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: 20,
            padding: '28px 28px 32px',
            boxShadow: '0 12px 40px rgba(97,0,164,0.04)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 13,
                background: 'linear-gradient(135deg, #7B2CBF, #A66DD4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', flexShrink: 0,
                boxShadow: '0 4px 14px rgba(123,44,191,0.28)',
              }}>
                <IconUser size={20} />
              </div>
              <div>
                <SectionLabel text="Step 1" />
                <h2 style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 17, fontWeight: 800, color: '#3A3A3A', margin: 0,
                }}>
                  Owner Information
                </h2>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Field label="First Name" error={errors.first_name?.message} required>
                <input placeholder="Juan" {...register('first_name')} {...fpe('first_name', !!errors.first_name)} />
              </Field>
              <Field label="Last Name" error={errors.last_name?.message} required>
                <input placeholder="dela Cruz" {...register('last_name')} {...fpe('last_name', !!errors.last_name)} />
              </Field>
              <Field label="Email" error={errors.email?.message} required>
                <input type="email" placeholder="you@example.com" {...register('email')} {...fpe('email', !!errors.email)} />
              </Field>
              <Field label="Contact Number" hint="optional">
                <input placeholder="+63 9XX XXX XXXX" {...register('contact_number')} {...fp('contact_number')} />
              </Field>
            </div>
            <div style={{ marginTop: 14 }}>
              <Field label="Home Address" hint="optional">
                <input placeholder="Barangay, City" {...register('address')} {...fp('address')} />
              </Field>
            </div>
          </div>

          {/* ── Divider label ── */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '4px 0',
          }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(123,44,191,0.08)' }} />
            <span style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 11, fontWeight: 700, color: '#A8A8A8',
              textTransform: 'uppercase', letterSpacing: '1px',
            }}>
              Pet Details
            </span>
            <div style={{ flex: 1, height: 1, background: 'rgba(123,44,191,0.08)' }} />
          </div>

          {/* ── Pet cards ── */}
          {fields.map((field, idx) => (
            <div key={field.id} style={{
              background: '#FFFFFF',
              borderRadius: 20,
              padding: '28px 28px 32px',
              boxShadow: '0 12px 40px rgba(97,0,164,0.04)',
              position: 'relative',
            }}>
              {/* Top accent bar */}
              <div style={{
                position: 'absolute', top: 0, left: 28, right: 28, height: 3,
                background: 'linear-gradient(90deg, #7B2CBF, #A66DD4)',
                borderRadius: '0 0 4px 4px',
              }} />

              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 13,
                    background: 'linear-gradient(135deg, #7B2CBF, #A66DD4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', flexShrink: 0,
                    boxShadow: '0 4px 14px rgba(123,44,191,0.28)',
                  }}>
                    <IconPaw size={20} />
                  </div>
                  <div>
                    <SectionLabel text={`Pet ${idx + 1} of ${fields.length}`} />
                    <h2 style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: 17, fontWeight: 800, color: '#3A3A3A', margin: 0,
                    }}>
                      Pet Information
                    </h2>
                  </div>
                </div>

                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(idx)}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '7px 13px',
                      background: '#FEF2F2', color: '#C0392B',
                      border: 'none', borderRadius: 8,
                      fontSize: 12, fontWeight: 600, cursor: 'pointer',
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      flexShrink: 0,
                    }}
                  >
                    <IconTrash size={13} /> Remove
                  </button>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <Field label="Pet Name" error={errors.pets?.[idx]?.pet_name?.message} required>
                  <input
                    placeholder="Bantay"
                    {...register(`pets.${idx}.pet_name`)}
                    {...fpe(`pets.${idx}.pet_name`, !!errors.pets?.[idx]?.pet_name)}
                  />
                </Field>

                <Field label="Species" error={errors.pets?.[idx]?.species?.message} required>
                  <select
                    {...register(`pets.${idx}.species`)}
                    onFocus={() => setFocused(`pets.${idx}.species`)}
                    onBlur={() => setFocused(null)}
                    style={inputStyle(focused === `pets.${idx}.species`, !!errors.pets?.[idx]?.species)}
                  >
                    <option value="Dog">🐶 Dog</option>
                    <option value="Cat">🐱 Cat</option>
                  </select>
                </Field>

                <Field label="Sex" error={errors.pets?.[idx]?.sex?.message} required>
                  <select
                    {...register(`pets.${idx}.sex`)}
                    onFocus={() => setFocused(`pets.${idx}.sex`)}
                    onBlur={() => setFocused(null)}
                    style={inputStyle(focused === `pets.${idx}.sex`, !!errors.pets?.[idx]?.sex)}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </Field>

                <Field label="Breed" hint="optional">
                  <input placeholder="Aspin, Persian…" {...register(`pets.${idx}.breed`)} {...fp(`pets.${idx}.breed`)} />
                </Field>

                <Field label="Age — Years" hint="optional">
                  <input type="number" min="0" placeholder="0" {...register(`pets.${idx}.age_years`)} {...fp(`pets.${idx}.age_years`)} />
                </Field>

                <Field label="Age — Months" hint="0–11">
                  <input type="number" min="0" max="11" placeholder="0" {...register(`pets.${idx}.age_months`)} {...fp(`pets.${idx}.age_months`)} />
                </Field>

                <Field label="Weight (kg)" hint="optional">
                  <input type="number" min="0" step="0.1" placeholder="5.5" {...register(`pets.${idx}.weight_kg`)} {...fp(`pets.${idx}.weight_kg`)} />
                </Field>

                <Field label="Color / Markings" hint="optional">
                  <input
                    placeholder="Brown with white spots"
                    {...register(`pets.${idx}.color_markings`)}
                    {...fp(`pets.${idx}.color_markings`)}
                  />
                </Field>
              </div>

              <div style={{ marginTop: 14 }}>
                <Field label="Health Notes" hint="conditions, allergies, medications">
                  <textarea
                    rows={2}
                    placeholder="e.g. currently on antibiotics, history of skin allergy…"
                    {...register(`pets.${idx}.health_notes`)}
                    onFocus={() => setFocused(`pets.${idx}.health_notes`)}
                    onBlur={() => setFocused(null)}
                    style={{ ...inputStyle(focused === `pets.${idx}.health_notes`, false), resize: 'vertical' }}
                  />
                </Field>
              </div>
            </div>
          ))}

          {/* ── Add pet button ── */}
          <button
            type="button"
            onClick={() => append({ pet_name: '', species: 'Dog', sex: 'Male', age_years: undefined, age_months: undefined, weight_kg: undefined })}
            style={{
              width: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              padding: '18px',
              background: 'transparent',
              border: '2px dashed rgba(123,44,191,0.2)',
              borderRadius: 16,
              color: '#7B2CBF',
              fontSize: 14, fontWeight: 700,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              cursor: 'pointer', transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = '#7B2CBF';
              (e.currentTarget as HTMLButtonElement).style.background = '#F9F5FF';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(123,44,191,0.2)';
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
            }}
          >
            <div style={{
              width: 30, height: 30, background: '#F3E8FF', borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7B2CBF',
            }}>
              <IconPlus size={14} />
            </div>
            Add Another Pet
          </button>

          {/* ── Account card ── */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: 20,
            padding: '28px 28px 32px',
            boxShadow: '0 12px 40px rgba(97,0,164,0.04)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 13,
                background: 'linear-gradient(135deg, #7B2CBF, #A66DD4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', flexShrink: 0,
                boxShadow: '0 4px 14px rgba(123,44,191,0.28)',
              }}>
                <IconShield size={20} />
              </div>
              <div>
                <SectionLabel text="Optional" />
                <h2 style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 17, fontWeight: 800, color: '#3A3A3A', margin: 0,
                }}>
                  Create an Account
                </h2>
              </div>
            </div>

            <label style={{
              display: 'flex', alignItems: 'flex-start', gap: 14, cursor: 'pointer',
              padding: '16px 18px', borderRadius: 12,
              background: createAccount ? '#F9F5FF' : '#FAFAFA',
              border: `1.5px solid ${createAccount ? 'rgba(123,44,191,0.2)' : 'rgba(0,0,0,0.05)'}`,
              transition: 'all 0.2s',
            }}>
              <div style={{ position: 'relative', marginTop: 2, flexShrink: 0 }}>
                <input
                  type="checkbox"
                  {...register('create_account')}
                  style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
                />
                <div style={{
                  width: 22, height: 22, borderRadius: 7,
                  background: createAccount ? 'linear-gradient(135deg, #7B2CBF, #A66DD4)' : '#EDEDED',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', transition: 'all 0.2s',
                  boxShadow: createAccount ? '0 2px 8px rgba(123,44,191,0.3)' : 'none',
                }}>
                  {createAccount && <IconCheck size={12} />}
                </div>
              </div>
              <div>
                <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, fontWeight: 700, color: '#3A3A3A', margin: '0 0 4px' }}>
                  Save my details for easy access
                </p>
                <p style={{ fontSize: 13, color: '#6B6B6B', margin: 0, lineHeight: 1.55 }}>
                  Track registrations, view your QR code anytime, and access the post-op care chatbot from your dashboard.
                </p>
              </div>
            </label>

            {createAccount && (
              <div style={{ marginTop: 18 }}>
                <Field label="Password" error={errors.password?.message} required>
                  <input
                    type="password"
                    placeholder="Min. 10 characters"
                    {...register('password')}
                    {...fpe('password', !!errors.password)}
                  />
                </Field>

                {password.length > 0 && (
                  <div style={{ marginTop: 12 }}>
                    <div style={{ display: 'flex', gap: 5, marginBottom: 10 }}>
                      {[1, 2, 3].map(i => (
                        <div key={i} style={{
                          flex: 1, height: 4, borderRadius: 100,
                          background: i <= pwScore
                            ? pwScore === 1 ? '#C0392B' : pwScore === 2 ? '#F59E0B' : '#5BB832'
                            : '#EDEDED',
                          transition: 'background 0.3s',
                        }} />
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                      {[
                        { check: pwChecks.length, label: '10+ characters' },
                        { check: pwChecks.upper, label: '1 uppercase letter' },
                        { check: pwChecks.number, label: '1 number' },
                      ].map(({ check, label }) => (
                        <span key={label} style={{
                          display: 'flex', alignItems: 'center', gap: 5,
                          fontSize: 11, fontFamily: "'Be Vietnam Pro', sans-serif",
                          color: check ? '#5BB832' : '#A8A8A8',
                          transition: 'color 0.2s',
                        }}>
                          <div style={{
                            width: 15, height: 15, borderRadius: '50%',
                            background: check ? '#E8F8E0' : '#EDEDED',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: check ? '#5BB832' : '#C0C0C0',
                            transition: 'all 0.2s',
                          }}>
                            <IconCheck size={8} />
                          </div>
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Server error ── */}
          {serverError && (
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: 12,
              padding: '16px 20px',
              background: '#FEF2F2', borderRadius: 12,
              borderLeft: '4px solid #C0392B',
            }}>
              <div style={{ color: '#C0392B', flexShrink: 0, marginTop: 1 }}>
                <IconAlertCircle size={16} />
              </div>
              <span style={{ fontSize: 14, color: '#C0392B', fontFamily: "'Be Vietnam Pro', sans-serif", lineHeight: 1.5 }}>
                {serverError}
              </span>
            </div>
          )}

          {/* ── Submit ── */}
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              padding: '18px 28px',
              background: isSubmitting
                ? 'rgba(123,44,191,0.45)'
                : 'linear-gradient(135deg, #7B2CBF, #A66DD4)',
              color: 'white',
              border: 'none', borderRadius: 14,
              fontSize: 15, fontWeight: 800,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              boxShadow: isSubmitting ? 'none' : '0 6px 24px rgba(123,44,191,0.28)',
              letterSpacing: '0.2px',
            }}
            onMouseEnter={e => {
              if (!isSubmitting) {
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 10px 30px rgba(123,44,191,0.35)';
              }
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'none';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 24px rgba(123,44,191,0.28)';
            }}
          >
            {isSubmitting ? (
              <>
                <span style={{
                  width: 16, height: 16,
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%', display: 'inline-block',
                  animation: 'spin 0.7s linear infinite',
                }} />
                Submitting Registration…
              </>
            ) : (
              'Submit Registration'
            )}
          </button>

          <p style={{
            textAlign: 'center', fontSize: 11, color: '#A8A8A8',
            fontFamily: "'Be Vietnam Pro', sans-serif", margin: '-4px 0 0',
            lineHeight: 1.6,
          }}>
            Northern Hills Veterinary Clinic · Adeline Arcade, Caloocan City
          </p>
        </form>
      </main>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 560px) {
          form > div > div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}