'use client';

import useSWR from 'swr';
import { use } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase-client';
import { QRDisplay } from '@/components/QRDisplay';
import { StatusBadge } from '@/components/StatusBadge';
import { ParticipantTimeline } from '@/components/ParticipantTimeline';
import { MessageCircle, ArrowLeft } from 'lucide-react';

export default function OwnerRegistrationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: reg, isLoading } = useSWR(`reg-${id}`, async () => {
  const { data } = await supabase
    .from('registrations')
    .select('*, events(*), chatbot_sessions(*), billing_record:billing_records(*), registration_pets(*, pets(*))')
    .eq('registration_id', id)
    .single();
  return data;
});
  if (isLoading) return (
    <div className="flex justify-center py-20">
      <span className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );

  if (!reg) return <p className="text-muted font-dm">Registration not found.</p>;

  // Check for active chatbot session
  const activeSession = reg.chatbot_sessions?.find(
    (s: { expires_at: string }) => new Date(s.expires_at) > new Date()
  );

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href="/owner/registrations" className="text-muted hover:text-primary transition">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-jakarta text-xl font-bold text-text">{reg.event?.name ?? 'Registration Detail'}</h1>
      </div>

      {/* Timeline */}
      <div className="bg-surface rounded-card p-6 shadow-sm">
        <h2 className="font-jakarta font-semibold text-text mb-5">Progress</h2>
        <ParticipantTimeline
          registeredAt={reg.created_at}
          checkinTimestamp={reg.checkin_timestamp}
          procedureDone={reg.registration_pets?.every((rp: any) => rp.procedure_status === 'Done')}
          paymentSettled={reg.billing_record?.payment_status === 'Paid'}
          dischargeTimestamp={reg.discharge_timestamp}
        />
      </div>

      {/* QR Code */}
      <div className="bg-surface rounded-card p-6 shadow-sm">
        <h2 className="font-jakarta font-semibold text-text mb-4">Your QR Code</h2>
        {/* Authenticated owner — no token needed */}
        <QRDisplay qrCodeData={reg.qr_code_data} />
      </div>

      {/* Pets */}
      <div className="bg-surface rounded-card p-6 shadow-sm">
        <h2 className="font-jakarta font-semibold text-text mb-4">Registered Pets</h2>
        <div className="space-y-3">
          {reg.registration_pets?.map((rp: any) => (
            <div key={rp.pets.pet_id} className="flex items-center justify-between p-3 bg-background rounded-xl">
              <div>
                <p className="text-sm font-semibold font-dm text-text">{rp.pets.pet_name}</p>
                <p className="text-xs text-muted font-dm">{rp.pets.species}</p>
              </div>
              {rp.procedure_status && <StatusBadge status={rp.procedure_status} />}
            </div>
          ))}
        </div>
      </div>

      {/* Billing */}
      {reg.billing_record && (
        <div className="bg-surface rounded-card p-6 shadow-sm">
          <h2 className="font-jakarta font-semibold text-text mb-4">Billing</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted font-dm">Amount</p>
              <p className="font-jakarta font-semibold text-text text-lg">
                ₱{reg.billing_record.amount?.toFixed(2) ?? '0.00'}
              </p>
            </div>
            <StatusBadge status={reg.billing_record.payment_status} />
          </div>
        </div>
      )}

      {/* Active Chatbot */}
      {activeSession && (
        <div className="bg-primary/5 border border-primary/20 rounded-card p-5 flex items-center justify-between">
          <div>
            <p className="font-jakarta font-semibold text-text text-sm">Post-op Care Chatbot</p>
            <p className="text-xs text-muted font-dm mt-0.5">
              Expires {new Date(activeSession.expires_at).toLocaleDateString('en-PH')}
            </p>
          </div>
          <Link
            href={`/chatbot/${activeSession.session_token}`}
            className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-btn px-4 py-2.5 transition"
          >
            <MessageCircle size={16} /> Open
          </Link>
        </div>
      )}
    </div>
  );
}