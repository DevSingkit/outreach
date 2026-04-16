'use client';

import useSWR from 'swr';
import Link from 'next/link';
import { supabase } from '@/lib/supabase-client';
import { StatusBadge } from '@/components/StatusBadge';
import { Calendar, MessageCircle, ClipboardList, PawPrint, ChevronRight } from 'lucide-react';

export default function OwnerDashboardPage() {
  const { data: registrations, isLoading } = useSWR('my-regs', async () => {
    const { data } = await supabase
      .from('registrations')
      .select('*, events(*), chatbot_sessions(*)');
    return data;
  });

  const total = registrations?.length ?? 0;

  // Next upcoming: first with Pending status
  const upcoming = registrations?.find((r: { checkin_status: string }) => r.checkin_status === 'Pending');

  // Active chatbot: any session not yet expired
  const activeChatbot = registrations?.flatMap((r: { chatbot_sessions?: { session_token: string; expires_at: string }[] }) =>
    r.chatbot_sessions ?? []
  ).find((s: { expires_at: string }) => new Date(s.expires_at) > new Date());

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-jakarta text-2xl font-bold text-text">Dashboard</h1>
        <p className="text-muted text-sm font-dm">Welcome back! Here&apos;s a summary of your activity.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface rounded-card p-6 shadow-sm flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <ClipboardList size={20} className="text-primary" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-0.5">Total Registrations</p>
            <p className="font-jakarta text-3xl font-bold text-text">{isLoading ? '—' : total}</p>
          </div>
        </div>

        <div className="bg-surface rounded-card p-6 shadow-sm flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center shrink-0">
            <Calendar size={20} className="text-secondary" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-0.5">Next Event</p>
            {upcoming ? (
              <p className="font-dm text-sm text-text font-semibold mt-1">{(upcoming as { event?: { name: string } }).event?.name ?? 'Upcoming Event'}</p>
            ) : (
              <p className="font-dm text-sm text-muted mt-1">None scheduled</p>
            )}
          </div>
        </div>

        <div className="bg-surface rounded-card p-6 shadow-sm flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <MessageCircle size={20} className="text-primary" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-0.5">Post-op Chatbot</p>
            {activeChatbot ? (
              <Link href={`/chatbot/${activeChatbot.session_token}`}
                className="text-primary hover:text-primary-hover text-sm font-dm font-semibold flex items-center gap-1 mt-1">
                Open Chatbot <ChevronRight size={14} />
              </Link>
            ) : (
              <p className="font-dm text-sm text-muted mt-1">No active session</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Registrations */}
      <div className="bg-surface rounded-card p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-jakarta font-semibold text-text">Recent Registrations</h2>
          <Link href="/owner/registrations" className="text-primary hover:text-primary-hover text-sm font-dm transition flex items-center gap-1">
            View all <ChevronRight size={14} />
          </Link>
        </div>

        {isLoading && (
          <div className="flex justify-center py-8">
            <span className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        )}

        {!isLoading && registrations?.length === 0 && (
          <div className="text-center py-8 text-muted font-dm">
            <PawPrint size={36} className="mx-auto mb-2 opacity-30" />
            <p>No registrations yet.</p>
            <Link href="/events" className="text-primary hover:text-primary-hover text-sm transition inline-block mt-2">
              Browse open events →
            </Link>
          </div>
        )}

        <div className="space-y-3">
          {registrations?.slice(0, 5).map((reg: {
            registration_id: string; event?: { name: string; event_date: string };
            checkin_status: string; queue_number?: number;
          }) => (
            <Link
              key={reg.registration_id}
              href={`/owner/registrations/${reg.registration_id}`}
              className="flex items-center justify-between p-4 rounded-xl bg-background hover:bg-[#E8E8E8] transition"
            >
              <div>
                <p className="text-sm font-semibold font-dm text-text">{reg.event?.name ?? 'Event'}</p>
                <p className="text-xs text-muted font-dm mt-0.5">
                  {reg.event?.event_date
                    ? new Date(reg.event.event_date).toLocaleDateString('en-PH', { dateStyle: 'medium' })
                    : ''}
                  {reg.queue_number ? ` · Queue #${reg.queue_number}` : ''}
                </p>
              </div>
              <StatusBadge status={reg.checkin_status} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}