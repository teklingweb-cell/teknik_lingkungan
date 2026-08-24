'use client';

import { useState } from 'react';
import { submitContactMessage } from '@/app/(site)/kontak/actions';

/** maxLength hints; the authoritative check lives in the server action. */
const LIMITS = {
  nama: 200,
  email: 320,
  phone: 50,
  unit: 200,
  subjek: 300,
  pesan: 5000,
} as const;

const UNITS = [
  'Biro Akademik',
  'Biro Keuangan',
  'Pusat Riset & Inovasi',
  'Humas & Kemitraan',
  'Laboratorium Terpadu',
  'Lainnya',
];

const CONTACT_EMAIL = 'tl.ft@untan.ac.id';

type Status =
  | { kind: 'idle' }
  | { kind: 'sending' }
  | { kind: 'sent' }
  | { kind: 'mailto' }
  | { kind: 'error'; message: string };

const empty = { nama: '', email: '', phone: '', unit: '', subjek: '', pesan: '' };

export default function ContactForm() {
  const [values, setValues] = useState(empty);
  const [status, setStatus] = useState<Status>({ kind: 'idle' });

  const set = (key: keyof typeof empty) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setValues((v) => ({ ...v, [key]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus({ kind: 'sending' });

    const result = await submitContactMessage(values);

    if (result.ok) {
      setValues(empty);
      setStatus({ kind: 'sent' });
      return;
    }

    if (result.reason === 'validation') {
      setStatus({ kind: 'error', message: result.message });
      return;
    }

    // Supabase unreachable: hand the message to the visitor's mail client
    // instead. Note this is NOT reported as a success — the old page showed the
    // green banner either way, telling people their message had been delivered
    // when nothing had actually been saved.
    const { nama, email, phone, unit, subjek, pesan } = values;
    const body = encodeURIComponent(
      `Nama: ${nama}\nEmail: ${email}\nHP: ${phone}\nUnit: ${unit}\n\n${pesan}`
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subjek)}&body=${body}`;
    setStatus({ kind: 'mailto' });
  }

  const sending = status.kind === 'sending';

  return (
    <div className="kform-card">
      <div className="kform-header">
        <h3>Kirim Pesan</h3>
        <p>Kami akan merespons dalam 1×24 jam kerja.</p>
      </div>
      <form className="kform-body" onSubmit={handleSubmit}>
        <div className="kform-row">
          <div className="kform-field">
            <label htmlFor="cf-nama">Nama Lengkap *</label>
            <input
              id="cf-nama"
              placeholder="Nama Anda"
              required
              maxLength={LIMITS.nama}
              value={values.nama}
              onChange={set('nama')}
            />
          </div>
          <div className="kform-field">
            <label htmlFor="cf-email">Email *</label>
            <input
              id="cf-email"
              type="email"
              placeholder="email@domain.com"
              required
              maxLength={LIMITS.email}
              value={values.email}
              onChange={set('email')}
            />
          </div>
        </div>

        <div className="kform-row">
          <div className="kform-field">
            <label htmlFor="cf-phone">Nomor HP</label>
            <input
              id="cf-phone"
              placeholder="08xx-xxxx-xxxx"
              maxLength={LIMITS.phone}
              value={values.phone}
              onChange={set('phone')}
            />
          </div>
          <div className="kform-field">
            <label htmlFor="cf-unit">Unit yang Dituju</label>
            <select id="cf-unit" value={values.unit} onChange={set('unit')}>
              <option value="">Pilih unit</option>
              {UNITS.map((u) => (
                <option key={u}>{u}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="kform-field">
          <label htmlFor="cf-subjek">Subjek *</label>
          <input
            id="cf-subjek"
            placeholder="Topik pesan Anda"
            required
            maxLength={LIMITS.subjek}
            value={values.subjek}
            onChange={set('subjek')}
          />
        </div>

        <div className="kform-field">
          <label htmlFor="cf-pesan">Pesan *</label>
          <textarea
            id="cf-pesan"
            rows={6}
            placeholder="Tuliskan pesan Anda di sini..."
            required
            maxLength={LIMITS.pesan}
            value={values.pesan}
            onChange={set('pesan')}
          />
        </div>

        <div className="kform-footer">
          <span className="kform-note">* Wajib diisi</span>
          <button type="submit" className="btn-primary" style={{ gap: 8 }} disabled={sending}>
            {sending ? 'Mengirim...' : 'Kirim Pesan'}
          </button>
        </div>

        {status.kind === 'sent' && (
          <div className="kform-success" style={{ display: 'flex' }}>
            <span style={{ color: '#16a34a', fontSize: '1rem' }}>✓</span>
            <div>
              <div
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: '#15803d',
                  fontFamily: 'var(--font-body)',
                }}
              >
                Pesan berhasil terkirim!
              </div>
              <div
                style={{
                  fontSize: '0.78rem',
                  color: '#16a34a',
                  fontFamily: 'var(--font-body)',
                  marginTop: 4,
                }}
              >
                Kami akan menghubungi Anda dalam 1×24 jam kerja.
              </div>
            </div>
          </div>
        )}

        {status.kind === 'mailto' && (
          <div className="kform-success" style={{ display: 'flex' }}>
            <span style={{ color: '#16a34a', fontSize: '1rem' }}>✉</span>
            <div>
              <div
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: '#15803d',
                  fontFamily: 'var(--font-body)',
                }}
              >
                Membuka aplikasi email Anda…
              </div>
              <div
                style={{
                  fontSize: '0.78rem',
                  color: '#16a34a',
                  fontFamily: 'var(--font-body)',
                  marginTop: 4,
                }}
              >
                Pengiriman langsung sedang bermasalah. Silakan kirim pesan melalui email ke{' '}
                {CONTACT_EMAIL}.
              </div>
            </div>
          </div>
        )}

        {status.kind === 'error' && (
          <div className="kform-success" style={{ display: 'flex' }}>
            <span style={{ color: '#dc2626', fontSize: '1rem' }}>!</span>
            <div>
              <div
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: '#dc2626',
                  fontFamily: 'var(--font-body)',
                }}
              >
                {status.message}
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
