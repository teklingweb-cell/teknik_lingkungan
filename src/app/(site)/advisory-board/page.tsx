import type { Metadata } from 'next';
import Link from 'next/link';
import { pageMetadata } from '@/lib/seo';
import './advisory.css';

export const metadata: Metadata = pageMetadata({
  title: 'Advisory Board',
  description:
    'Badan Penasihat Pendidikan (Advisory Board) Program Studi Teknik Lingkungan Universitas Tanjungpura — unsur pakar, pemerintah, praktisi, dan dunia usaha.',
  path: '/advisory-board',
});

const PRODI = 'Program Studi Teknik Lingkungan, Fakultas Teknik, Universitas Tanjungpura';

/**
 * Anggota Badan Penasihat Pendidikan.
 *
 * Sengaja dibiarkan kosong. Contoh yang dijadikan acuan berisi nama-nama
 * anggota advisory board UIN Walisongo — orang sungguhan dari institusi lain.
 * Menyalinnya ke sini sama saja menyatakan mereka penasihat prodi ini, jadi
 * daftarnya harus diisi dengan anggota yang benar-benar ditunjuk. Selama masih
 * kosong, halaman menampilkan pemberitahuan, bukan tabel kosong.
 */
type Anggota = {
  nama: string;
  unsur: string;
  instansi: string;
};

const ANGGOTA: Anggota[] = [
  // Contoh bentuk pengisian — hapus tanda komentar lalu ganti datanya:
  // { nama: 'Prof. Dr. Ir. …, M.T.', unsur: 'Pakar/Asosiasi', instansi: '…' },
];

const PERIODE = '2023–2027';

const PERAN = [
  `Mewadahi dan menyalurkan aspirasi serta prakarsa dari masyarakat dalam pengembangan kebijakan dan program penyelenggaraan pendidikan tinggi pada ${PRODI}.`,
  `Meningkatkan tanggung jawab dan peran serta masyarakat dalam penyelenggaraan pendidikan tinggi pada ${PRODI}.`,
  `Menciptakan suasana dan kondisi yang demokratis, transparan, dan akuntabel dalam penyelenggaraan dan pelayanan mutu pendidikan tinggi pada ${PRODI}.`,
];

const TUPOKSI = [
  {
    label: 'Advisory',
    judul: 'Pemberi pertimbangan',
    isi: `Memberi pertimbangan dalam penentuan dan pelaksanaan kebijakan pendidikan tinggi pada ${PRODI}.`,
  },
  {
    label: 'Supporting',
    judul: 'Pendukung',
    isi: `Memberi dukungan, baik dalam bentuk pemikiran, tenaga, maupun finansial, dalam pengembangan keilmuan dan kelembagaan ${PRODI}.`,
  },
  {
    label: 'Controlling',
    judul: 'Pengontrol',
    isi: `Menjalankan prinsip good university governance, seperti transparansi dan akuntabilitas dalam penyelenggaraan pendidikan tinggi, khususnya pada ${PRODI}.`,
  },
];

export default function AdvisoryBoardPage() {
  return (
    <>
      <div className="page-hero">
        <div className="page-hero-glow" />
        <div className="container" style={{ position: 'relative' }}>
          <div className="page-hero-tag">Tentang Prodi</div>
          <h1 className="page-hero-title">Advisory Board</h1>
          <p className="page-hero-subtitle">
            Badan Penasihat Pendidikan yang memberi masukan atas pengembangan akademik dan keilmuan
            Program Studi Teknik Lingkungan.
          </p>
          <div className="breadcrumb">
            <Link href="/">Beranda</Link>
            <span>›</span>
            <Link href="/profile">Tentang Prodi</Link>
            <span>›</span>
            <span>Advisory Board</span>
          </div>
        </div>
      </div>

      {/* PENGANTAR */}
      <section className="section">
        <div className="container">
          <div className="fade-up" style={{ marginBottom: 32 }}>
            {/* Sama seperti di visi-misi: judulnya dulu mengulang <h1> hero
                tepat di atasnya. Sekarang menyebutkan isi seksinya. */}
            <div className="section-tag">— Badan Penasihat Pendidikan</div>
            <h2 className="section-title">Apa Itu dan Siapa Saja</h2>
            <div className="gold-divider" />
          </div>

          <p className="advisory-intro fade-up">
            Badan Penasihat Pendidikan (<em>Advisory Board</em>) {PRODI} adalah badan yang berperan
            memberi masukan terkait pengembangan akademik dan keilmuan pada program studi, yang
            terdiri dari berbagai pihak berkepentingan (<em>stakeholders</em>), baik dari unsur
            pakar, pemerintah, praktisi, maupun dunia usaha/industri.
          </p>

          {/* ANGGOTA */}
          <div className="fade-up" style={{ marginTop: 40 }}>
            <h3 className="advisory-subtitle">Anggota Periode {PERIODE}</h3>

            {ANGGOTA.length > 0 ? (
              <div className="advisory-table-wrap">
                <table className="advisory-table">
                  <thead>
                    <tr>
                      <th scope="col" className="col-no">
                        No.
                      </th>
                      <th scope="col">Nama</th>
                      <th scope="col">Unsur</th>
                      <th scope="col">Instansi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ANGGOTA.map((a, i) => (
                      <tr key={a.nama}>
                        <td className="col-no">{i + 1}.</td>
                        <td className="col-nama">{a.nama}</td>
                        <td>
                          <span className="advisory-unsur">{a.unsur}</span>
                        </td>
                        <td className="col-instansi">{a.instansi}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="advisory-empty">
                <div className="advisory-empty-title">Daftar anggota belum ditetapkan</div>
                <p>
                  Susunan Badan Penasihat Pendidikan periode {PERIODE} akan diumumkan pada halaman
                  ini. Untuk informasi lebih lanjut, silakan hubungi prodi melalui halaman{' '}
                  <Link href="/kontak">Kontak</Link>.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* PERAN */}
      <section className="section bg-navy">
        <div className="container">
          <div className="fade-up" style={{ marginBottom: 32 }}>
            <div className="section-tag">— Peran</div>
            <h2 className="section-title light">Peran Advisory Board</h2>
          </div>

          <ol className="advisory-roles fade-up">
            {PERAN.map((teks, i) => (
              <li key={i}>
                <span className="advisory-roles-num">{i + 1}</span>
                <span>{teks}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* TUGAS POKOK DAN FUNGSI */}
      <section className="section">
        <div className="container">
          <div className="fade-up" style={{ marginBottom: 32 }}>
            <div className="section-tag">— Tugas Pokok dan Fungsi</div>
            <h2 className="section-title">Tiga Fungsi Utama</h2>
            <div className="gold-divider" />
          </div>

          <div className="grid-3">
            {TUPOKSI.map((t) => (
              <article key={t.label} className="card card-fill" style={{ padding: 26 }}>
                <span className="advisory-tag">{t.label}</span>
                <div className="card-title">{t.judul}</div>
                <div className="card-desc">{t.isi}</div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
