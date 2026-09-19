import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kebijakan Privasi | Teknik Lingkungan',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="section" style={{ minHeight: '60vh', padding: '60px 20px', background: '#fff' }}>
      <div className="container" style={{ maxWidth: 800 }}>
        <h1 style={{ fontSize: '2rem', color: 'var(--navy)', marginBottom: '24px' }}>Kebijakan Privasi</h1>
        <div className="prose" style={{ color: 'var(--text-main)', lineHeight: 1.8 }}>
          <p>
            Selamat datang di situs web resmi Program Studi Teknik Lingkungan. Kami sangat menghargai privasi pengunjung kami. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi Anda saat menggunakan situs web kami (<strong>tekniklingkungan.com</strong>).
          </p>
          
          <h2 style={{ fontSize: '1.25rem', marginTop: '24px', color: 'var(--navy)' }}>1. Informasi yang Kami Kumpulkan</h2>
          <p>
            Situs ini berfokus sebagai media profil dan informasi akademik. Kami tidak secara aktif mengumpulkan data pribadi yang sensitif dari pengunjung tanpa persetujuan. Beberapa informasi yang mungkin kami kumpulkan meliputi:
          </p>
          <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
            <li><strong>Informasi Log:</strong> Alamat IP, jenis peramban (browser), waktu akses, dan halaman yang dikunjungi untuk keperluan analisis statistik.</li>
            <li><strong>Cookies:</strong> Situs kami menggunakan <em>cookies</em> secara terbatas untuk meningkatkan pengalaman navigasi pengguna. Penggunaan cookie di sini murni untuk mendukung performa teknis situs dan bukan untuk pelacakan pihak ketiga. Anda dapat mengatur peramban Anda untuk menolak <em>cookies</em> jika Anda menginginkannya (Cookie Policy).</li>
          </ul>

          <h2 style={{ fontSize: '1.25rem', marginTop: '24px', color: 'var(--navy)' }}>2. Penggunaan Informasi</h2>
          <p>
            Informasi yang dikumpulkan hanya akan digunakan untuk keperluan internal, seperti menganalisis lalu lintas situs, memantau performa halaman, dan memastikan keamanan layanan kami. Kami tidak pernah menjual atau mendistribusikan data pengunjung ke pihak ketiga untuk tujuan komersial.
          </p>

          <h2 style={{ fontSize: '1.25rem', marginTop: '24px', color: 'var(--navy)' }}>3. Keamanan Data</h2>
          <p>
            Kami menerapkan berbagai langkah keamanan teknis untuk melindungi data pengunjung dari akses yang tidak sah. Meskipun demikian, perlu dipahami bahwa tidak ada metode transmisi data melalui internet yang sepenuhnya aman.
          </p>

          <h2 style={{ fontSize: '1.25rem', marginTop: '24px', color: 'var(--navy)' }}>4. Perubahan Kebijakan Privasi</h2>
          <p>
            Program Studi Teknik Lingkungan berhak untuk memperbarui Kebijakan Privasi ini kapan saja. Segala bentuk perubahan akan dipublikasikan pada halaman ini.
          </p>

          <h2 style={{ fontSize: '1.25rem', marginTop: '24px', color: 'var(--navy)' }}>5. Hubungi Kami</h2>
          <p>
            Jika Anda memiliki pertanyaan mengenai Kebijakan Privasi ini, silakan hubungi kami melalui menu Kontak yang tersedia di situs web ini.
          </p>
        </div>
      </div>
    </div>
  );
}
