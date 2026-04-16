'use client';

import { use, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

// Pet edit form — data would normally be fetched from an owner pet detail API
// For now renders a standard edit form layout using the registration pet data
export default function PetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit } = useForm();

  const onSubmit = async () => {
    setIsSaving(true);
    // TODO: call pet update API when endpoint is available
    await new Promise(r => setTimeout(r, 800));
    setIsSaving(false);
    setSaved(true);
  };

  const inputCls = 'w-full bg-[#EDEDED] rounded-input px-4 py-2.5 text-sm font-dm text-text placeholder:text-muted outline-none transition focus:bg-white focus:ring-2 focus:ring-primary/30';

  return (
    <div className="max-w-lg space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/owner/pets" className="text-muted hover:text-primary transition">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-jakarta text-xl font-bold text-text">Edit Pet Profile</h1>
      </div>

      {saved && (
        <div className="bg-secondary/20 border border-secondary rounded px-4 py-3 text-sm font-dm text-text">
          ✅ Pet profile updated successfully.
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-surface rounded-card p-6 shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-medium font-dm text-text mb-1.5">Pet Name</label>
          <input className={inputCls} placeholder="Bantay" {...register('name')} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium font-dm text-text mb-1.5">Species</label>
            <select className={inputCls} {...register('species')}>
              <option>Dog</option><option>Cat</option><option>Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium font-dm text-text mb-1.5">Sex</label>
            <select className={inputCls} {...register('sex')}>
              <option>Male</option><option>Female</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium font-dm text-text mb-1.5">Breed</label>
          <input className={inputCls} placeholder="Aspin, etc." {...register('breed')} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium font-dm text-text mb-1.5">Age (Years)</label>
            <input type="number" min="0" className={inputCls} {...register('age_years')} />
          </div>
          <div>
            <label className="block text-sm font-medium font-dm text-text mb-1.5">Age (Months)</label>
            <input type="number" min="0" max="11" className={inputCls} {...register('age_months')} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium font-dm text-text mb-1.5">Color / Markings</label>
          <input className={inputCls} {...register('color_markings')} />
        </div>
        <div>
          <label className="block text-sm font-medium font-dm text-text mb-1.5">Health Notes</label>
          <textarea rows={3} className={inputCls + ' resize-none'} {...register('health_notes')} />
        </div>

        <button type="submit" disabled={isSaving}
          className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover disabled:opacity-60 text-white font-semibold text-sm rounded-btn px-6 py-3.5 transition">
          {isSaving ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
          {isSaving ? 'Saving…' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}