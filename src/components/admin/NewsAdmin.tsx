'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import type { News } from '@/lib/types';
import { formatDateShort } from '@/lib/utils';
import AdminShell from './AdminShell';
import DeleteModal from './DeleteModal';
import EmptyState from './EmptyState';
import SearchBox from './SearchBox';
import { AlertBox, useAlert } from './useAlert';
import { revalidatePublic } from './revalidate';
import { slugOf } from '@/lib/utils';

const CAT_COLORS: Record<string, string> = {
  Penelitian: '#2563eb',
  Pencapaian: '#16a34a',
  Acara: '#9333ea',
  Pengumuman: '#d97706',
  Beasiswa: '#0891b2',
};

export default function NewsAdmin({ flash }: { flash?: string }) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const { alert, show } = useAlert();

  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<News | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      show('error', 'Gagal memuat data: ' + error.message);
      setLoading(false);
      return;
    }
    setNews((data ?? []) as News[]);
    setLoading(false);
  }, [supabase, show]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (flash === 'added') show('success', '✓ Berita berhasil ditambahkan.');
    if (flash === 'updated') show('success', '✓ Berita berhasil diperbarui.');
  }, [flash, show]);

  const q = query.trim().toLowerCase();
  const view = q
    ? news.filter((item) =>
        [item.title, item.excerpt, item.category, item.author, item.date].some((v) =>
          String(v ?? '').toLowerCase().includes(q)
        )
      )
    : news;

  const stats = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const n of news) {
      const key = n.category ?? '–';
      counts[key] = (counts[key] ?? 0) + 1;
    }
    const topCat = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    return {
      total: news.length,
      featured: news.filter((n) => n.featured).length,
      topCat,
      newest: news[0],
    };
  }, [news]);

  /**
   * Featured is exclusive: clear the flag everywhere, then set it on the target.
   * Turning the current one off just leaves nothing featured.
   */
  async function toggleFeatured(item: News) {
    const turningOn = !item.featured;

    const { error: clearError } = await supabase
      .from('news')
      .update({ featured: false })
      .neq('id', -1);
    if (clearError) {
      show('error', 'Gagal mengubah featured.');
      return;
    }

    if (turningOn) {
      const { error: setError } = await supabase
        .from('news')
        .update({ featured: true })
        .eq('id', item.id);
      if (setError) {
        show('error', 'Gagal mengaktifkan featured.');
        return;
      }
    }

    await revalidatePublic('news');
    await load();
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    const deleted = deleteTarget;
    setDeleting(true);

    // .select() makes Supabase return the deleted rows. Without it an RLS
    // denial is indistinguishable from success: DELETE filters non-permitted
    // rows out rather than raising, so zero rows would go by unnoticed.
    const { data, error } = await supabase
      .from('news')
      .delete()
      .eq('id', deleteTarget.id)
      .select();

    setDeleting(false);
    setDeleteTarget(null);

    if (error) {
      show('error', 'Gagal menghapus berita: ' + error.message);
      return;
    }
    if (!data?.length) {
      show('error', 'Gagal menghapus: tidak punya izin atau data sudah terhapus.');
      return;
    }

    show('success', '✓ Berita berhasil dihapus.');
    // Name the deleted article's own page too, so it stops answering 200 on
    // the very next request rather than one request later.
    await revalidatePublic('news', [`/berita/${slugOf(deleted)}`]);
    await load();
  }

  return (
    <AdminShell
      title="Manajemen Berita"
      actions={
        <Link href="/admin/add" className="btn btn-green">
          <svg
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Tambah Berita
        </Link>
      }
    >
      <AlertBox alert={alert} />

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-label">Total Berita</div>
          <div className="stat-value">{loading ? '–' : stats.total}</div>
          <div className="stat-sub">Semua kategori</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Featured</div>
          <div className="stat-value">{loading ? '–' : stats.featured}</div>
          <div className="stat-sub">Ditampilkan di atas</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Kategori Terbanyak</div>
          <div className="stat-value" style={{ fontSize: '1.3rem', paddingTop: 4 }}>
            {stats.topCat ? stats.topCat[0] : '–'}
          </div>
          <div className="stat-sub">{stats.topCat ? stats.topCat[1] : 0} berita</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Berita Terbaru</div>
          <div className="stat-value" style={{ fontSize: '1rem', paddingTop: 6 }}>
            {stats.newest ? formatDateShort(stats.newest.date) : '–'}
          </div>
          <div className="stat-sub">{stats.newest ? stats.newest.category : ''}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Daftar Berita</div>
          <span className="card-count">
            {q ? `${view.length} dari ${news.length} item` : `${news.length} item`}
          </span>
          <SearchBox value={query} onChange={setQuery} placeholder="Cari judul, kategori, penulis…" />
        </div>

        {loading ? (
          <div style={{ padding: 24 }}>
            <div className="skeleton" style={{ height: 44, marginBottom: 8 }} />
            <div className="skeleton" style={{ height: 44, marginBottom: 8 }} />
            <div className="skeleton" style={{ height: 44 }} />
          </div>
        ) : !news.length ? (
          <EmptyState
            title="Belum ada berita"
            sub={'Klik "Tambah Berita" untuk menambahkan berita pertama.'}
          />
        ) : !view.length ? (
          <EmptyState icon="🔍" title={`Tidak ada hasil untuk “${query}”`} />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>★</th>
                  <th>Judul</th>
                  <th className="hide-mobile">Kategori</th>
                  <th className="hide-mobile">Tanggal</th>
                  <th className="hide-mobile">Penulis</th>
                  <th style={{ textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {view.map((item) => {
                  const color = CAT_COLORS[item.category ?? ''] ?? '#6b7a6c';
                  return (
                    <tr key={item.id}>
                      <td>
                        <button
                          className={`featured-star${item.featured ? ' on' : ''}`}
                          onClick={() => toggleFeatured(item)}
                          title="Toggle Featured"
                        >
                          ⭐
                        </button>
                      </td>
                      <td>
                        <div className="news-title-cell">{item.title}</div>
                        <div className="news-excerpt-cell">{item.excerpt}</div>
                      </td>
                      <td className="hide-mobile">
                        <span className="badge" style={{ background: `${color}18`, color }}>
                          {item.category}
                        </span>
                      </td>
                      <td className="hide-mobile" style={{ color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                        {formatDateShort(item.date)}
                      </td>
                      <td className="hide-mobile" style={{ color: 'var(--muted)' }}>
                        {item.author}
                      </td>
                      <td>
                        <div className="actions-cell">
                          <Link href={`/admin/add?edit=${item.id}`} className="btn btn-ghost btn-sm">
                            Edit
                          </Link>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => setDeleteTarget(item)}
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <DeleteModal
        open={!!deleteTarget}
        body={`Apakah Anda yakin ingin menghapus "${deleteTarget?.title ?? ''}"?`}
        busy={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </AdminShell>
  );
}
