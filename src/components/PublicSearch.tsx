'use client';

/**
 * Kotak pencarian untuk daftar di halaman publik.
 *
 * Penelitian sudah berisi seratusan judul dan hanya bisa disaring lewat tab
 * kategori — menemukan satu judul berarti menggulir seluruh halaman. Filter
 * berjalan di sisi klien atas data yang memang sudah dimuat, jadi hasilnya
 * muncul seketika tanpa permintaan tambahan ke database.
 */
export default function PublicSearch({
  value,
  onChange,
  placeholder = 'Cari…',
  resultCount,
  totalCount,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  /** Jumlah yang cocok, ditampilkan saat kotak terisi. */
  resultCount?: number;
  totalCount?: number;
}) {
  const searching = value.trim().length > 0;

  return (
    <div className="public-search">
      <div className="public-search-box">
        <svg
          className="public-search-icon"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>

        <input
          type="search"
          className="public-search-input"
          value={value}
          placeholder={placeholder}
          aria-label={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />

        {searching && (
          <button
            type="button"
            className="public-search-clear"
            aria-label="Hapus pencarian"
            onClick={() => onChange('')}
          >
            ✕
          </button>
        )}
      </div>

      {searching && resultCount !== undefined && (
        <div className="public-search-count">
          {resultCount === 0
            ? 'Tidak ada hasil yang cocok'
            : `${resultCount} dari ${totalCount ?? resultCount} hasil`}
        </div>
      )}
    </div>
  );
}
