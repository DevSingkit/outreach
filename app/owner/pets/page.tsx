'use client';

import useSWR from 'swr';
import Link from 'next/link';
import { supabase } from '@/lib/supabase-client';
import { PawPrint, ChevronRight } from 'lucide-react';

interface Pet {
  pet_id: string;
  pet_name: string;
  species: string;
  sex: string;
  breed?: string;
}

interface RegistrationPet {
  pets: Pet | null;
}

interface Registration {
  registration_pets: RegistrationPet[];
}

export default function OwnerPetsPage() {
  const { data: registrations, isLoading } = useSWR('my-regs', async () => {
  const { data } = await supabase
    .from('registrations')
    .select('*, registration_pets(*, pets(*))');
  return (data ?? []) as Registration[];
});

  const pets = registrations
  ? Object.values(
      registrations.flatMap((r: Registration) =>
          (r.registration_pets ?? []).map((rp: RegistrationPet) => rp.pets).filter(Boolean)
        ).filter((pet): pet is Pet => pet !== null).reduce<Record<string, Pet>>(
          (acc, pet) => { acc[pet.pet_id] = pet; return acc; },
        {}
      )
    )
  : [];
  return (
    <div className="space-y-6">
      <h1 className="font-jakarta text-2xl font-bold text-text">My Pets</h1>

      {isLoading && (
        <div className="flex justify-center py-16">
          <span className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      )}

      {!isLoading && pets.length === 0 && (
        <div className="bg-surface rounded-card p-10 text-center shadow-sm">
          <PawPrint size={40} className="mx-auto mb-3 text-muted opacity-40" />
          <p className="text-muted font-dm">No pets registered yet.</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {pets.map(pet => (
          <Link
            key={pet.pet_id}
            href={`/owner/pets/${pet.pet_id}`}
            className="bg-surface rounded-card p-5 shadow-sm flex items-center gap-4 hover:shadow transition"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <PawPrint size={20} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-jakarta font-semibold text-text">{pet.pet_name}</p>
              <p className="text-xs text-muted font-dm mt-0.5">{pet.species} · {pet.sex}{pet.breed ? ` · ${pet.breed}` : ''}</p>
            </div>
            <ChevronRight size={18} className="text-muted shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}