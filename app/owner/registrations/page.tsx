'use client';

import useSWR from 'swr';
import Link from 'next/link';
import { supabase } from '@/lib/supabase-client';
import { StatusBadge } from '@/components/StatusBadge';
import { PawPrint, ChevronRight } from 'lucide-react';

export default function OwnerRegistrationsPage() {
  const { data: registrations, isLoading } = useSWR('my-regs', async () => {
  const { data } = await supabase
    .from('registrations')
    .select('*, events(*)');
  return data;
});
  return (
    <div className="space-y-6">
      <h1 className="font-jakarta text-2xl font-bold text-text">My Registrations</h1>

      {isLoading && (
        <div className="flex justify-center py-16">
          <span className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      )}

      {!isLoading && registrations?.length === 0 && (
        <div className="bg-surface rounded-card p-10 text-center shadow-sm">
          <PawPrint size={40} className="mx-auto mb-3 text-muted opacity-40" />
          <p className="text-muted font-dm">No registrations yet.</p>
          <Link href="/events" className="inline-block mt-4 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-btn px-5 py-2.5 transition">
            Browse Events
          </Link>
        </div>
      )}

      {/* Mobile card list */}
      <div className="space-y-3">
        {registrations?.map((reg: {
          registration_id: string; event?: { name: string; event_date: string; location_address: string };
          checkin_status: string; queue_number?: number;
        }) => (
          <Link
            key={reg.registration_id}
            href={`/owner/registrations/${reg.registration_id}`}
            className="bg-surface rounded-card p-5 shadow-sm flex items-center justify-between hover:shadow transition"
          >
            <div className="flex-1 min-w-0 pr-4">
              <p className="font-jakarta font-semibold text-text truncate">{reg.event?.name ?? 'Event'}</p>
              <p className="text-xs text-muted font-dm mt-1">
                {reg.event?.event_date
                  ? new Date(reg.event.event_date).toLocaleDateString('en-PH', { dateStyle: 'medium' })
                  : ''}
                {reg.queue_number ? ` · Queue #${reg.queue_number}` : ''}
              </p>
              <div className="mt-2">
                <StatusBadge status={reg.checkin_status} />
              </div>
            </div>
            <ChevronRight size={18} className="text-muted shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}