import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Syarat dan Ketentuan | Teknik Lingkungan',
};

export default function TermsOfUsePage() {
  return (
    <div className="section" style={{ minHeight: '60vh', padding: '60px 20px', background: '#fff' }}>
      <div className="container" style={{ maxWidth: 800 }}>
        <h1 style={{ fontSize: '2rem', color: 'var(--navy)', marginBottom: '24px' }}>Syarat dan Ketentuan Penggunaan</h1>
        <div className="prose" style={{ color: 'var(--text-main)', lineHeight: 1.8 }}>
          <p>
            Dengan mengakses dan menggunakan situs web <strong>tekniklingkungan.com</strong>, Anda menyetujui untuk terikat dengan Syarat dan Ketentuan Penggunaan ini. Jika Anda tidak menyetujui syarat-syarat ini, kami mempersilakan Anda untuk tidak menggunakan situs ini.
          </p>
          
          <h2 style={{ fontSize: '1.25rem', marginTop: '24px', color: 'var(--navy)' }}>1. Penggunaan Konten dan Hak Cipta</h2>
          <p>
            Semua konten yang tersedia di situs web ini (termasuk namun tidak terbatas pada teks, gambar, logo, desain, dan dokumen akademik) adalah hak milik (<em>Copyright</em>) Program Studi Teknik Lingkungan atau pihak ketiga yang telah memberikan izin penggunaan yang sah.
            Anda diperbolehkan mengunduh atau menyalin konten semata-mata untuk keperluan informasi pribadi atau akademik, dengan tetap mencantumkan sumber. Modifikasi, reproduksi ulang, atau distribusi untuk kepentingan komersial tanpa izin tertulis dari pengelola situs sangat dilarang.
          </p>

          <h2 style={{ fontSize: '1.25rem', marginTop: '24px', color: 'var(--navy)' }}>2. Perilaku Pengguna</h2>
          <p>
            Saat menggunakan situs ini, Anda dilarang keras untuk:
          </p>
          <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
            <li>Melakukan tindakan yang dapat merusak, melumpuhkan, atau memberikan beban berlebih pada peladen (server) maupun infrastruktur kami.</li>
            <li>Mencoba mendapatkan akses tidak sah ke sistem administrasi situs, basis data, atau akun milik orang lain.</li>
            <li>Menggunakan situs untuk mendistribusikan materi berbahaya, spam, maupun tindakan yang melanggar hukum.</li>
          </ul>

          <h2 style={{ fontSize: '1.25rem', marginTop: '24px', color: 'var(--navy)' }}>3. Tautan Eksternal</h2>
          <p>
            Situs web ini mungkin berisi tautan ke situs web pihak ketiga. Kami menyediakan tautan tersebut hanya sebagai kemudahan bagi pengunjung. Kami tidak mengontrol dan tidak bertanggung jawab atas isi, kebijakan privasi, maupun praktik keamanan dari situs-situs eksternal tersebut. Kunjungan ke situs pihak ketiga sepenuhnya menjadi tanggung jawab dan risiko Anda sendiri.
          </p>

          <h2 style={{ fontSize: '1.25rem', marginTop: '24px', color: 'var(--navy)' }}>4. Hukum yang Berlaku</h2>
          <p>
            Syarat dan Ketentuan ini tunduk pada dan ditafsirkan sesuai dengan hukum yang berlaku di Negara Kesatuan Republik Indonesia. Setiap perselisihan yang timbul dari penggunaan situs ini akan diselesaikan di yurisdiksi pengadilan di Indonesia.
          </p>

          <p style={{ marginTop: '24px' }}>
            Program Studi Teknik Lingkungan berhak sewaktu-waktu mengubah, menambah, atau mengurangi bagian mana pun dari Syarat dan Ketentuan ini tanpa pemberitahuan sebelumnya. Pengguna diharapkan memeriksa halaman ini secara berkala.
          </p>
        </div>
      </div>
    </div>
  );
}
