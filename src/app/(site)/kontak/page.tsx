import type { Metadata } from 'next';
import './kontak.css';
import PageHero from '@/components/PageHero';
import ContactForm from '@/components/ContactForm';

export const metadata: Metadata = {
  title: 'Kontak & Informasi',
  description:
    'Kami siap membantu Anda. Temukan informasi kontak lengkap atau kirimkan pesan langsung kepada kami.',
};

const MAP_COORDS = '-0.056205852153042184,109.3471306253054';

const INFO_CARDS = [
  {
    label: 'Alamat',
    lines: [
      'Jl. Prof. Dr. H. Hadari Nawawi',
      'Budi Utomo, Pontianak Kota',
      'Kota Pontianak, Kalbar 78124',
    ],
    icon: (
      <>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </>
    ),
  },
  {
    label: 'Telepon',
    lines: [
      '(0561) 740186 (Pusat)',
      '(0561) 740187 (Akademik)',
      '(0561) 740188 (Kemahasiswaan)',
    ],
    icon: (
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.91 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.82 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    ),
  },
  {
    label: 'Email',
    lines: ['tl.ft@untan.ac.id', 'akademik.tl@untan.ac.id', 'humas.ft@untan.ac.id'],
    icon: (
      <>
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </>
    ),
  },
  {
    label: 'Jam Operasional',
    lines: ['Senin – Jumat: 08.00 – 16.00', 'Sabtu: 08.00 – 12.00 WIB', 'Minggu & Libur: Tutup'],
    icon: (
      <>
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </>
    ),
  },
];

const SOCIALS = [
  {
    href: 'https://www.instagram.com/tl.untan',
    label: '@tl.untan',
    icon: (
      <>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </>
    ),
  },
  {
    href: 'https://www.youtube.com/@TeknikLingkunganUntan',
    label: 'TL Untan',
    icon: (
      <>
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
      </>
    ),
  },
  {
    href: 'https://www.facebook.com/TeknikLingkunganUntan',
    label: 'Teknik Lingkungan Untan',
    icon: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
  },
];

export default function KontakPage() {
  return (
    <>
      <PageHero
        tag="Hubungi Kami"
        title="Kontak & Informasi"
        subtitle="Kami siap membantu Anda. Temukan informasi kontak lengkap atau kirimkan pesan langsung kepada kami."
        breadcrumb={[{ label: 'Kontak' }]}
      />

      <section className="section" style={{ paddingTop: 72, paddingBottom: 80 }}>
        <div className="container">
          <div className="kontak-main-grid">
            {/* LEFT: info, map, socials */}
            <div>
              <div className="fade-up" style={{ marginBottom: 40 }}>
                <div className="section-tag">— Informasi Kontak</div>
                <h2 className="section-title" style={{ marginBottom: 10 }}>
                  Temukan Kami
                </h2>
                <div className="gold-divider" />
              </div>

              <div className="kinfo-grid">
                {INFO_CARDS.map((card, i) => (
                  <div
                    key={card.label}
                    className={`kinfo-card fade-up${i ? ` delay-${i}` : ''}`}
                  >
                    <div className="kinfo-icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--moss)"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        {card.icon}
                      </svg>
                    </div>
                    <div className="kinfo-label">{card.label}</div>
                    {card.lines.map((line) => (
                      <div key={line} className="kinfo-line">
                        {line}
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <div className="kmap-block fade-up delay-1">
                <iframe
                  src={`https://maps.google.com/maps?q=${MAP_COORDS}&z=17&output=embed`}
                  width="100%"
                  height="340"
                  style={{ border: 0, display: 'block' }}
                  loading="lazy"
                  allowFullScreen
                  title="Lokasi Workshop Teknik Lingkungan UNTAN, Pontianak"
                />
                <div className="kmap-footer">
                  <div className="kmap-addr">
                    Jl. Prof. Dr. H. Hadari Nawawi
                    <br />
                    Pontianak 78124
                  </div>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${MAP_COORDS}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="kmap-link"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="3 11 22 2 13 21 11 13 3 11" />
                    </svg>
                    Buka Maps
                  </a>
                </div>
              </div>

              <div className="ksocial-wrap fade-up delay-2">
                <div className="ksocial-label">Media Sosial</div>
                <div className="ksocial-links">
                  {SOCIALS.map((s) => (
                    <a
                      key={s.href}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ksocial-btn"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--gold)"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        {s.icon}
                      </svg>
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT: form */}
            <div className="fade-up delay-1">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 48, paddingBottom: 80 }}>
        <div className="container">
          <div className="khelp-banner fade-up">
            <div>
              <div className="section-tag">— Butuh Bantuan Cepat?</div>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.9rem',
                  color: 'var(--cream)',
                  fontWeight: 300,
                  marginTop: 8,
                  marginBottom: 10,
                }}
              >
                Kunjungi Pusat Bantuan Kami
              </h3>
              <p
                style={{
                  color: 'rgba(242,245,239,0.55)',
                  fontSize: '0.9rem',
                  fontFamily: 'var(--font-body)',
                  maxWidth: 480,
                  lineHeight: 1.7,
                }}
              >
                Temukan jawaban atas pertanyaan umum Anda tanpa harus menunggu balasan.
              </p>
            </div>
            <a href="#" className="btn-gold">
              Buka Help Center
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
