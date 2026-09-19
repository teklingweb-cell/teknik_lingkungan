import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sanggahan (Disclaimer) | Teknik Lingkungan',
};

export default function DisclaimerPage() {
  return (
    <div className="section" style={{ minHeight: '60vh', padding: '120px 20px 60px', background: '#fff' }}>
      <div className="container" style={{ maxWidth: 800 }}>
        <h1 style={{ fontSize: '2rem', color: 'var(--navy)', marginBottom: '24px' }}>Sanggahan (Disclaimer)</h1>
        <div className="prose" style={{ color: 'var(--text-main)', lineHeight: 1.8 }}>
          <p>
            Seluruh informasi yang disajikan di situs web <strong>tekniklingkungan.com</strong> diterbitkan dengan niat baik dan hanya bertujuan sebagai referensi, penyebaran informasi umum, dan transparansi akademik.
          </p>
          
          <h2 style={{ fontSize: '1.25rem', marginTop: '24px', color: 'var(--navy)' }}>Akurasi Informasi</h2>
          <p>
            Meskipun kami selalu berupaya memastikan bahwa seluruh data, berita, maupun dokumen akademik (seperti kurikulum, kalender akademik, pedoman tugas akhir) yang tersedia di situs ini adalah akurat dan terkini, Program Studi Teknik Lingkungan tidak memberikan jaminan mutlak terkait kelengkapan, keandalan, dan keakuratan informasi tersebut pada waktu Anda mengaksesnya. 
            Setiap tindakan yang Anda ambil berdasarkan informasi di situs web ini sepenuhnya merupakan risiko Anda sendiri.
          </p>

          <h2 style={{ fontSize: '1.25rem', marginTop: '24px', color: 'var(--navy)' }}>Status Dokumen Hukum/Resmi</h2>
          <p>
            Khusus untuk dokumen-dokumen akademik yang berkaitan dengan regulasi dan pedoman, perlu dipahami bahwa dokumen resmi yang sah adalah dokumen cetak (hardcopy) bertandatangan, atau surat edaran resmi dari pihak Universitas/Fakultas. Jika terdapat perbedaan antara informasi di situs ini dengan dokumen resmi fisik yang diterbitkan, maka dokumen resmi-lah yang berlaku. Kami sangat menyarankan mahasiswa dan pihak berkepentingan untuk selalu merujuk pada pengumuman resmi dan bagian administrasi tata usaha program studi.
          </p>

          <h2 style={{ fontSize: '1.25rem', marginTop: '24px', color: 'var(--navy)' }}>Batasan Tanggung Jawab (Kerugian)</h2>
          <p>
            Program Studi Teknik Lingkungan, beserta staf, dosen, dan pengelolanya, tidak bertanggung jawab atas segala kerugian materiil, immaterial, kerusakan (langsung maupun tidak langsung) sehubungan dengan penggunaan atau ketidakmampuan menggunakan situs web kami, maupun atas kesalahan informasi yang mungkin dimuat di dalamnya.
          </p>
        </div>
      </div>
    </div>
  );
}
