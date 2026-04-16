// app/(public)/register/[event_id]/page.tsx
'use client';

import { useState, use } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
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
const IconUser = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);
const IconShield = ({ size = 16 }: { size?: number }) => (
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
const IconHeart = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

// ─── Zod schema ───────────────────────────────────────────────────────────────
// FIX: field names now match DB column names exactly:
//   pet_name        (was: name)
//   health_notes    (was: health_notes — correct, kept)
//   color_markings  (was: color)
// REMOVED: is_vaccinated — no such column in public.pets

const petSchema = z.object({
  pet_name:       z.string().min(1, 'Pet name is required'),   // DB: pet_name
  species:        z.enum(['Dog', 'Cat', 'Other']),
  sex:            z.enum(['Male', 'Female']),
  breed:          z.string().optional(),
  age_years:  z.coerce.number().min(0).nullish().transform(v => v ?? undefined),
  age_months: z.coerce.number().min(0).max(11).nullish().transform(v => v ?? undefined),
  weight_kg:  z.coerce.number().min(0).nullish().transform(v => v ?? undefined),
  health_notes:   z.string().optional(),                       // DB: health_notes
  color_markings: z.string().optional(),                       // DB: color_markings (was: color)
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

// ─── Shared input style helper ────────────────────────────────────────────────

const baseInput = (focused: boolean, hasError: boolean): React.CSSProperties => ({
  width: '100%',
  padding: '11px 14px',
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

// ─── Field wrapper ────────────────────────────────────────────────────────────

function Field({ label, error, required, children }: {
  label: string; error?: string; required?: boolean; children: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: 11, fontWeight: 700,
        color: error ? '#C0392B' : '#6B6B6B',
        textTransform: 'uppercase', letterSpacing: '0.5px',
      }}>
        {label}
        {required && <span style={{ color: '#C0392B', marginLeft: 2 }}>*</span>}
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

// ─── Card ─────────────────────────────────────────────────────────────────────

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: '#FFFFFF',
      borderRadius: 16,
      padding: '28px 32px',
      boxShadow: '0 12px 40px rgba(97,0,164,0.04)',
      ...style,
    }}>
      {children}
    </div>
  );
}

// ─── Card header ──────────────────────────────────────────────

function CardHeader({ icon, eyebrow, title, action }: {
  icon: React.ReactNode; eyebrow: string; title: string; action?: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: 'linear-gradient(135deg, #7B2CBF, #A66DD4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', flexShrink: 0,
          boxShadow: '0 4px 12px rgba(123,44,191,0.25)',
        }}>
          {icon}
        </div>
        <div>
          <div style={{
            fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px',
            color: '#A8A8A8', fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 2,
          }}>
            {eyebrow}
          </div>
          <h2 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 17, fontWeight: 700, color: '#3A3A3A', margin: 0,
          }}>
            {title}
          </h2>
        </div>
      </div>
      {action}
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
    resolver: zodResolver(schema) as any,
    // FIX: default value key is now pet_name to match DB
    defaultValues: { pets: [{ pet_name: '', species: 'Dog', sex: 'Male', age_years: undefined, age_months: undefined, weight_kg: undefined }], create_account: false },
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
    style: baseInput(focused === name, false),
  });
  const fpe = (name: string, err: boolean) => ({
    onFocus: () => setFocused(name),
    onBlur: () => setFocused(null),
    style: baseInput(focused === name, err),
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setServerError('');
    try {
      // 1. Upsert owner by email
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

      // 2. Check for duplicate registration
      const { data: existing } = await supabase
        .from('registrations')
        .select('registration_id')
        .eq('event_id', event_id)
        .eq('owner_id', owner.owner_id)
        .maybeSingle();
      if (existing) throw new Error('already registered');

      // 3. Check event capacity
      const { data: event, error: eventError } = await supabase
        .from('events')
        .select('max_pets, registered_pets_count')
        .eq('event_id', event_id)
        .single();
      if (eventError) throw new Error(eventError.message);
      if (event.max_pets !== null && event.registered_pets_count + data.pets.length > event.max_pets) {
        throw new Error('capacity');
      }

      // 4. Create registration
      const qr_code_data = `NHVC-${event_id}-${owner.owner_id}-${Date.now()}`;
      const { data: registration, error: regError } = await supabase
        .from('registrations')
        .insert({
          event_id,
          owner_id: owner.owner_id,
          qr_code_data,
          registration_type: 'Pre-registered',
          checkin_status: 'Not checked in',
        })
        .select()
        .single();
      if (regError) throw new Error(regError.message);

      // 5. Insert pets and link to registration
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
          .insert({
            registration_id: registration.registration_id,
            pet_id: insertedPet.pet_id,
          });
        if (linkError) throw new Error(linkError.message);
      }

      // 6. Optionally create Supabase auth account
      if (data.create_account && data.password) {
        await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: { role: 'Owner', owner_id: owner.owner_id },
          },
        });
        // Don't throw on auth error — registration already succeeded
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
        <div style={{ position: 'absolute', top: 20, right: 60, opacity: 0.05, color: 'white', transform: 'rotate(20deg)' }}>
          <IconPaw size={140} />
        </div>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '52px 24px 56px', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 100, padding: '4px 12px',
            fontSize: 10, fontWeight: 600,
            textTransform: 'uppercase', letterSpacing: '1.5px',
            color: '#A66DD4', marginBottom: 14,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}>
            <IconPaw size={9} /> Outreach Registration
          </div>
          <h1 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 800,
            color: '#FFFFFF', margin: '0 0 12px', lineHeight: 1.15,
          }}>
            Register for the Event
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, margin: 0, maxWidth: 480, lineHeight: 1.7 }}>
            Fill in your details and your pet's information below. You'll receive a QR code upon successful registration.
          </p>
        </div>
      </div>

      {/* ── Form ── */}
      <main style={{ maxWidth: 720, margin: '0 auto', padding: '40px 24px 80px' }}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* ── Owner card ── */}
          <Card>
            <CardHeader icon={<IconUser size={18} />} eyebrow="Step 1" title="Owner Information" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Field label="First Name" error={errors.first_name?.message} required>
                <input placeholder="Juan" {...register('first_name')} {...fpe('first_name', !!errors.first_name)} />
              </Field>
              <Field label="Last Name" error={errors.last_name?.message} required>
                <input placeholder="dela Cruz" {...register('last_name')} {...fpe('last_name', !!errors.last_name)} />
              </Field>
              <Field label="Email Address" error={errors.email?.message} required>
                <input type="email" placeholder="you@example.com" {...register('email')} {...fpe('email', !!errors.email)} />
              </Field>
              <Field label="Contact Number">
                <input placeholder="+63 9XX XXX XXXX" {...register('contact_number')} {...fp('contact_number')} />
              </Field>
            </div>
            <div style={{ marginTop: 16 }}>
              <Field label="Address">
                <input placeholder="Barangay, City" {...register('address')} {...fp('address')} />
              </Field>
            </div>
          </Card>

          {/* ── Pet cards ── */}
          {fields.map((field, idx) => (
            <Card key={field.id}>
              <CardHeader
                icon={<IconPaw size={18} />}
                eyebrow={`Pet ${idx + 1} of ${fields.length}`}
                title="Pet Information"
                action={fields.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => remove(idx)}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '7px 14px',
                      background: '#FEF2F2', color: '#C0392B',
                      border: 'none', borderRadius: 8,
                      fontSize: 12, fontWeight: 600, cursor: 'pointer',
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}
                  >
                    <IconTrash size={13} /> Remove
                  </button>
                ) : undefined}
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

                {/* FIX: field key is pet_name (DB column), not name */}
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
                    style={baseInput(focused === `pets.${idx}.species`, !!errors.pets?.[idx]?.species)}
                  >
                    <option value="Dog">🐶 Dog</option>
                    <option value="Cat">🐱 Cat</option>
                    <option value="Other">🐾 Other</option>
                  </select>
                </Field>

                <Field label="Sex" error={errors.pets?.[idx]?.sex?.message} required>
                  <select
                    {...register(`pets.${idx}.sex`)}
                    onFocus={() => setFocused(`pets.${idx}.sex`)}
                    onBlur={() => setFocused(null)}
                    style={baseInput(focused === `pets.${idx}.sex`, !!errors.pets?.[idx]?.sex)}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </Field>

                <Field label="Breed">
                  <input placeholder="Aspin, Persian, etc." {...register(`pets.${idx}.breed`)} {...fp(`pets.${idx}.breed`)} />
                </Field>

                <Field label="Age — Years">
                  <input type="number" min="0" placeholder="0" {...register(`pets.${idx}.age_years`)} {...fp(`pets.${idx}.age_years`)} />
                </Field>

                <Field label="Age — Months">
                  <input type="number" min="0" max="11" placeholder="0–11" {...register(`pets.${idx}.age_months`)} {...fp(`pets.${idx}.age_months`)} />
                </Field>

                <Field label="Weight (kg)">
                  <input type="number" min="0" step="0.1" placeholder="5.5" {...register(`pets.${idx}.weight_kg`)} {...fp(`pets.${idx}.weight_kg`)} />
                </Field>

                {/* FIX: field key is color_markings (DB column), was: color */}
                <Field label="Color / Markings">
                  <input
                    placeholder="Brown with white spots"
                    {...register(`pets.${idx}.color_markings`)}
                    {...fp(`pets.${idx}.color_markings`)}
                  />
                </Field>

              </div>

              <div style={{ marginTop: 16 }}>
                {/* health_notes is already the correct DB column name */}
                <Field label="Health Notes">
                  <textarea
                    rows={2}
                    placeholder="Any known conditions, allergies, or current medications…"
                    {...register(`pets.${idx}.health_notes`)}
                    onFocus={() => setFocused(`pets.${idx}.health_notes`)}
                    onBlur={() => setFocused(null)}
                    style={{ ...baseInput(focused === `pets.${idx}.health_notes`, false), resize: 'vertical' }}
                  />
                </Field>
              </div>
            </Card>
          ))}

          {/* Add another pet */}
          <button
            type="button"
            // FIX: default value key is pet_name
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
          <Card>
            <CardHeader icon={<IconShield size={18} />} eyebrow="Optional" title="Create an Account" />

            <label style={{
              display: 'flex', alignItems: 'flex-start', gap: 14, cursor: 'pointer',
              padding: 16, borderRadius: 12,
              background: createAccount ? '#F9F5FF' : '#FAFAFA',
              border: `1px solid ${createAccount ? 'rgba(123,44,191,0.15)' : 'rgba(0,0,0,0.05)'}`,
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
                <p style={{ fontSize: 13, color: '#6B6B6B', margin: 0, lineHeight: 1.5 }}>
                  Track registrations, view your QR code anytime, and access the post-op care chatbot.
                </p>
              </div>
            </label>

            {createAccount && (
              <div style={{ marginTop: 20 }}>
                <Field label="Password" error={errors.password?.message} required>
                  <input
                    type="password"
                    placeholder="Min. 10 characters"
                    {...register('password')}
                    {...fpe('password', !!errors.password)}
                  />
                </Field>

                {password.length > 0 && (
                  <div style={{ marginTop: 10 }}>
                    <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
                      {[1, 2, 3].map(i => (
                        <div key={i} style={{
                          flex: 1, height: 3, borderRadius: 100,
                          background: i <= pwScore
                            ? pwScore === 1 ? '#C0392B' : pwScore === 2 ? '#F59E0B' : '#5BB832'
                            : '#EDEDED',
                          transition: 'background 0.3s',
                        }} />
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                      {[
                        { check: pwChecks.length, label: '10+ chars' },
                        { check: pwChecks.upper, label: '1 uppercase' },
                        { check: pwChecks.number, label: '1 number' },
                      ].map(({ check, label }) => (
                        <span key={label} style={{
                          display: 'flex', alignItems: 'center', gap: 4,
                          fontSize: 11, fontFamily: "'Be Vietnam Pro', sans-serif",
                          color: check ? '#5BB832' : '#A8A8A8',
                          transition: 'color 0.2s',
                        }}>
                          <div style={{
                            width: 14, height: 14, borderRadius: '50%',
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
          </Card>

          {/* Server error */}
          {serverError && (
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: 12,
              padding: '16px 20px',
              background: '#FEF2F2', borderRadius: 12,
              borderLeft: '4px solid #C0392B',
            }}>
              <IconAlertCircle size={18} />
              <span style={{ fontSize: 14, color: '#C0392B', fontFamily: "'Be Vietnam Pro', sans-serif", lineHeight: 1.5 }}>
                {serverError}
              </span>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              padding: '17px 28px',
              background: isSubmitting
                ? 'rgba(123,44,191,0.45)'
                : 'linear-gradient(135deg, #7B2CBF, #A66DD4)',
              color: 'white',
              border: 'none', borderRadius: 12,
              fontSize: 15, fontWeight: 700,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              boxShadow: isSubmitting ? 'none' : '0 6px 24px rgba(123,44,191,0.25)',
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
                Submitting…
              </>
            ) : (
              <>
                <IconHeart size={16} /> Submit Registration
              </>
            )}
          </button>

          <p style={{
            textAlign: 'center', fontSize: 11, color: '#A8A8A8',
            fontFamily: "'Be Vietnam Pro', sans-serif", margin: '-8px 0 0',
          }}>
            Northern Hills Veterinary Clinic · Adeline Arcade, Caloocan City
          </p>
        </form>
      </main>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 580px) {
          form > div > div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}