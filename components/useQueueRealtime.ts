import { useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';

export function useQueueRealtime(eventId: string, onUpdate: () => void) {
  useEffect(() => {
    if (!eventId) return;

    const queueChannel = supabase
      .channel(`event-${eventId}-queue`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'registrations' },
        () => onUpdate()
      )
      .subscribe();

    const procedureChannel = supabase
      .channel(`event-${eventId}-procedures`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'registration_pets' },
        () => onUpdate()
      )
      .subscribe();

    const participantsChannel = supabase
      .channel(`event-${eventId}-participants`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'registrations' },
        () => onUpdate()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(queueChannel);
      supabase.removeChannel(procedureChannel);
      supabase.removeChannel(participantsChannel);
    };
  }, [eventId]);
}