import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ padding: '80px 0' }} className="container">
      <div className="detail-error">
        <h2>Penelitian tidak ditemukan</h2>
        <p>Data yang kamu cari tidak tersedia atau telah dihapus.</p>
        <Link href="/penelitian" className="btn">
          ← ke Daftar Penelitian
        </Link>
      </div>
    </div>
  );
}
