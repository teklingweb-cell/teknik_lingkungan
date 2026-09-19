'use server';

import { supabasePublic } from '@/lib/supabase/public';

/**
 * Field limits mirroring the `contact_messages_length_guard` constraint in
 * SUPABASE_SECURITY.sql. Checked here as well so an over-long field returns a
 * readable message instead of a raw Postgres constraint violation.
 */
const LIMITS = {
  nama: 200,
  email: 320,
  phone: 50,
  unit: 200,
  subjek: 300,
  pesan: 5000,
} as const;

export type ContactResult =
  | { ok: true }
  | { ok: false; reason: 'validation'; message: string }
  | { ok: false; reason: 'unavailable' };

export type ContactInput = {
  nama: string;
  email: string;
  phone: string;
  unit: string;
  subjek: string;
  pesan: string;
};

export async function submitContactMessage(input: ContactInput): Promise<ContactResult> {
  const nama = input.nama.trim();
  const email = input.email.trim();
  const phone = input.phone.trim();
  const unit = input.unit.trim();
  const subjek = input.subjek.trim();
  const pesan = input.pesan.trim();

  if (!nama || !subjek || !pesan) {
    return { ok: false, reason: 'validation', message: 'Nama, subjek, dan pesan wajib diisi.' };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, reason: 'validation', message: 'Format email tidak valid.' };
  }
  if (phone && !/^[\d\s+\-()]{6,20}$/.test(phone)) {
    return { ok: false, reason: 'validation', message: 'Format nomor telepon tidak valid.' };
  }

  for (const [field, max] of Object.entries(LIMITS) as [keyof typeof LIMITS, number][]) {
    const value = { nama, email, phone, unit, subjek, pesan }[field];
    if (value.length > max) {
      return {
        ok: false,
        reason: 'validation',
        message: `Isian ${field} terlalu panjang (maksimal ${max} karakter).`,
      };
    }
  }

  const { error } = await supabasePublic
    .from('contact_messages')
    .insert([{ nama, email, phone, unit, subjek, pesan }]);

  if (error) {
    console.error('contact_messages insert failed:', error.message);
    return { ok: false, reason: 'unavailable' };
  }

  return { ok: true };
}
