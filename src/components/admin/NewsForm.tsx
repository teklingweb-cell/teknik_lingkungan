'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import type { News } from '@/lib/types';
import { todayISO, slugOf } from '@/lib/utils';
import { uniqueSlug } from './uniqueSlug';
import { revalidatePublic } from './revalidate';
import AdminShell from './AdminShell';
import FormCard, { ErrorList } from './FormCard';
import GDriveField from './GDriveField';
import { FileTextIcon, HomeIcon, SaveIcon } from '../icons';

const CATEGORIES = ['Penelitian', 'Pencapaian', 'Acara', 'Pengumuman', 'Beasiswa'];

type FormValues = {
  title: string;
  excerpt: string;
  category: string;
  date: string;
  author: string;
  featured: boolean;
  show_on_home: boolean;
  link_url: string;
};

const blank: FormValues = {
  title: '',
  excerpt: '',
  category: '',
  date: '',
  author: '',
  featured: false,
  show_on_home: false,
  link_url: '',
};

export default function NewsForm({ editId }: { editId: number | null }) {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const [values, setValues] = useState<FormValues>({ ...blank, date: todayISO() });
  const [imageRaw, setImageRaw] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(editId !== null);

  const set = <K extends keyof FormValues>(key: K, value: FormValues[K]) =>
    setValues((v) => ({ ...v, [key]: value }));

  const handleResolved = useCallback((direct: string | null) => setImageUrl(direct), []);

  /** Slug the row had when the form opened; empty for a new article. */
  const previousSlug = useRef<string>('');

  useEffect(() => {
    if (editId === null) return;

    let cancelled = false;
    (async () => {
      const { data, error } = await supabase.from('news').select('*').eq('id', editId).single();
      if (cancelled) return;

      if (error || !data) {
        router.replace('/admin');
        return;
      }

      const row = data as News;
      // Remembered so a rename can purge the address the article used to live
      // at, not only the new one.
      previousSlug.current = slugOf(row);
      setValues({
        title: row.title ?? '',
        excerpt: row.excerpt ?? '',
        category: row.category ?? '',
        date: row.date ?? '',
        author: row.author ?? '',
        featured: !!row.featured,
        show_on_home: !!row.show_on_home,
        link_url: row.link_url ?? '',
      });
      if (row.image_url) {
        setImageRaw(row.image_url);
        setImageUrl(row.image_url);
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [editId, supabase, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const problems: string[] = [];
    if (!values.title.trim()) problems.push('Judul wajib diisi.');
    if (!values.excerpt.trim()) problems.push('Ringkasan wajib diisi.');
    if (!values.category) problems.push('Kategori wajib dipilih.');
    if (!values.date) problems.push('Tanggal wajib diisi.');
    if (!values.author.trim()) problems.push('Penulis wajib diisi.');

    if (problems.length) {
      setErrors(problems);
      return;
    }

    setErrors([]);
    setSaving(true);

    // The public URL is /berita/<slug>. It is stored rather than derived at
    // read time so that renaming an article later does not silently break the
    // link people already shared, and so two articles cannot collide on one
    // address — a taken slug gets -2, -3 and so on.
    const title = values.title.trim();
    const slug = await uniqueSlug(supabase, 'news', title, editId, 'berita');

    const payload = {
      slug,
      title,
      excerpt: values.excerpt.trim(),
      category: values.category,
      date: values.date,
      author: values.author.trim(),
      featured: values.featured,
      show_on_home: values.show_on_home,
      image_url: imageUrl,
      link_url: values.link_url.trim() || null,
    };

    // Only one row may be featured, so clear the flag before setting it here.
    if (values.featured) {
      await supabase.from('news').update({ featured: false }).neq('id', -1);
    }

    const { error } =
      editId !== null
        ? await supabase.from('news').update(payload).eq('id', editId)
        : await supabase.from('news').insert([payload]);

    if (error) {
      setSaving(false);
      setErrors(['Gagal menyimpan: ' + error.message]);
      return;
    }

    // Drop the cached public pages so the change is live immediately rather
    // than after the 60-second ISR window.
    await revalidatePublic(
      'news',
      [`/berita/${slug}`, previousSlug.current && `/berita/${previousSlug.current}`].filter(
        Boolean
      ) as string[]
    );

    router.push(`/admin?msg=${editId !== null ? 'updated' : 'added'}`);
    router.refresh();
  }

  const isEdit = editId !== null;
  // The edit label lost its icon in the original source; the create label
  // always rendered a literal "+".
  const submitLabel = saving ? (
    'Menyimpan…'
  ) : isEdit ? (
    <>
      <SaveIcon size={14} strokeWidth={1.75} />
      Simpan Perubahan
    </>
  ) : (
    '+ Tambahkan Berita'
  );

  return (
    <AdminShell
      title={isEdit ? 'Edit Berita' : 'Tambah Berita Baru'}
      actions={
        <Link href="/admin" className="btn btn-ghost">
          ← Kembali
        </Link>
      }
    >
      <ErrorList errors={errors} />

      <form onSubmit={handleSubmit}>
        <FormCard
          icon={<FileTextIcon size={18} strokeWidth={1.75} style={{ color: 'var(--green)' }} />}
          title={isEdit ? 'Edit Berita' : 'Berita Baru'}
          footer={
            <>
              <Link href="/admin" className="btn btn-ghost">
                Batal
              </Link>
              <button className="btn btn-green" type="submit" disabled={saving || loading}>
                {submitLabel}
              </button>
            </>
          }
        >
          <div className="field">
            <label htmlFor="f_title">
              Judul <span className="req">*</span>
            </label>
            <input
              id="f_title"
              type="text"
              placeholder="Judul berita yang menarik…"
              maxLength={200}
              value={values.title}
              onChange={(e) => set('title', e.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="f_excerpt">
              Ringkasan <span className="req">*</span>
            </label>
            <textarea
              id="f_excerpt"
              placeholder="Ringkasan singkat (2–3 kalimat) yang tampil di daftar berita…"
              maxLength={500}
              value={values.excerpt}
              onChange={(e) => set('excerpt', e.target.value)}
            />
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="f_category">
                Kategori <span className="req">*</span>
              </label>
              <select
                id="f_category"
                value={values.category}
                onChange={(e) => set('category', e.target.value)}
              >
                <option value="">Pilih kategori…</option>
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="f_date">
                Tanggal <span className="req">*</span>
              </label>
              <input
                id="f_date"
                type="date"
                value={values.date}
                onChange={(e) => set('date', e.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="f_author">
              Penulis / Unit <span className="req">*</span>
            </label>
            <input
              id="f_author"
              type="text"
              placeholder="cth: Dr. Hendra Wahyudi / Humas"
              maxLength={100}
              value={values.author}
              onChange={(e) => set('author', e.target.value)}
            />
          </div>

          <GDriveField value={imageRaw} onChange={setImageRaw} onResolved={handleResolved} />

          <div className="field">
            <label htmlFor="f_link_url">
              Link Artikel Lengkap{' '}
              <span style={{ fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 400 }}>
                (opsional — jika ada sumber eksternal)
              </span>
            </label>
            <input
              id="f_link_url"
              type="url"
              placeholder="https://... (kosongkan jika tidak ada)"
              autoComplete="off"
              value={values.link_url}
              onChange={(e) => set('link_url', e.target.value)}
            />
          </div>

          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={values.featured}
              onChange={(e) => set('featured', e.target.checked)}
            />
            <div>
              <div className="checkbox-label">⭐ Jadikan Featured</div>
              <div className="checkbox-sub">
                Berita ini akan tampil sebagai artikel utama. Hanya satu berita yang dapat menjadi
                featured.
              </div>
            </div>
          </label>

          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={values.show_on_home}
              onChange={(e) => set('show_on_home', e.target.checked)}
            />
            <div>
              <div className="checkbox-label">
                <HomeIcon size={14} style={{ verticalAlign: '-2px', marginRight: 6 }} />
                Tampilkan di Beranda
              </div>
              <div className="checkbox-sub">
                Berita ini akan muncul di seksi berita halaman utama (maks. 3 berita terbaru yang
                dipilih).
              </div>
            </div>
          </label>
        </FormCard>
      </form>
    </AdminShell>
  );
}
