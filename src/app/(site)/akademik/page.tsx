import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { supabasePublic } from '@/lib/supabase/public';
import type { KalenderAkademik, Kurikulum, MataKuliah, Pencapaian } from '@/lib/types';
import PageHero from '@/components/PageHero';
import PencapaianList from '@/components/PencapaianList';
import CourseList from '@/components/CourseList';
import './akademik.css';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = pageMetadata({
  title: 'Akademik',
  description: 'Informasi akademik Program Studi Teknik Lingkungan Untan: pencapaian, kalender akademik, kurikulum, dan mata kuliah.',
  path: '/akademik',
});

function dateLabel(date: string): string {
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${date}T00:00:00`));
}

export default async function AkademikPage() {
  const [achievementResult, calendarResult, curriculumResult, courseResult] = await Promise.all([
    supabasePublic.from('pencapaian').select('*').order('year', { ascending: false }).order('tanggal', { ascending: false, nullsFirst: false }).limit(200),
    supabasePublic.from('kalender_akademik').select('*').order('start_date', { ascending: false }).limit(100),
    supabasePublic.from('kurikulum').select('*').order('is_active', { ascending: false }).order('created_at', { ascending: false }).limit(50),
    supabasePublic.from('mata_kuliah').select('*').order('semester', { ascending: true }).order('code', { ascending: true }).limit(300),
  ]);
  const achievements = (achievementResult.data ?? []) as Pencapaian[];
  const calendars = (calendarResult.data ?? []) as KalenderAkademik[];
  const curriculums = (curriculumResult.data ?? []) as Kurikulum[];
  const courses = (courseResult.data ?? []) as MataKuliah[];

  return <>
    <PageHero tag="Pembelajaran & Informasi" title="Akademik" subtitle="Satu pusat informasi untuk pencapaian, kalender akademik, kurikulum, dan mata kuliah Program Studi Teknik Lingkungan." breadcrumb={[{ label: 'Akademik' }]} />
    <nav className="academic-jump" aria-label="Bagian halaman Akademik"><div className="container academic-jump-inner"><a href="#pencapaian">Pencapaian</a><a href="#kalender">Kalender Akademik</a><a href="#kurikulum">Kurikulum</a><a href="#mata-kuliah">Mata Kuliah</a></div></nav>

    <section className="section academic-section" id="pencapaian" aria-labelledby="pencapaian-heading"><div className="container"><div className="academic-heading fade-up"><div className="section-tag">— Prestasi & Rekognisi</div><h2 className="section-title" id="pencapaian-heading">Pencapaian</h2><p>Rekam jejak prestasi, penghargaan, dan rekognisi Program Studi Teknik Lingkungan.</p></div><PencapaianList items={achievements} /></div></section>

    <section className="section academic-section academic-section-white" id="kalender" aria-labelledby="kalender-heading"><div className="container"><div className="academic-heading fade-up"><div className="section-tag">— Jadwal Kegiatan</div><h2 className="section-title" id="kalender-heading">Kalender Akademik</h2><p>Jadwal penting perkuliahan, evaluasi, dan layanan akademik.</p></div>{calendars.length ? <ol className="calendar-list">{calendars.map((item) => <li key={item.id}><div className="calendar-date"><time dateTime={item.start_date}>{dateLabel(item.start_date)}</time>{item.end_date && <><span>—</span><time dateTime={item.end_date}>{dateLabel(item.end_date)}</time></>}</div><div className="calendar-content"><div className="calendar-meta">{[item.academic_year, item.semester, item.category].filter(Boolean).join(' · ')}</div><h3>{item.title}</h3>{item.description && <p>{item.description}</p>}</div>{item.document_url && <a href={item.document_url} target="_blank" rel="noopener noreferrer" className="academic-document">Dokumen<span aria-hidden="true"> ↗</span></a>}</li>)}</ol> : <p className="academic-empty">Kalender akademik akan tersedia setelah diterbitkan oleh program studi.</p>}</div></section>

    <section className="section academic-section" id="kurikulum" aria-labelledby="kurikulum-heading"><div className="container"><div className="academic-heading fade-up"><div className="section-tag">— Rencana Pembelajaran</div><h2 className="section-title" id="kurikulum-heading">Kurikulum</h2><p>Dokumen kurikulum yang menjadi acuan penyelenggaraan pembelajaran.</p></div>{curriculums.length ? <div className="curriculum-list">{curriculums.map((item) => <article key={item.id} className="curriculum-row"><div><div className="curriculum-meta">{item.academic_year || 'Tahun berlaku belum diisi'}</div><h3>{item.name}</h3>{item.description && <p>{item.description}</p>}</div><div className="curriculum-actions">{item.is_active && <span className="academic-status">Aktif</span>}{item.document_url && <a href={item.document_url} target="_blank" rel="noopener noreferrer" className="academic-document">Lihat dokumen<span aria-hidden="true"> ↗</span></a>}</div></article>)}</div> : <p className="academic-empty">Dokumen kurikulum belum tersedia.</p>}</div></section>

    <section className="section academic-section academic-section-white" id="mata-kuliah" aria-labelledby="mata-kuliah-heading"><div className="container"><div className="academic-heading fade-up"><div className="section-tag">— Struktur Pembelajaran</div><h2 className="section-title" id="mata-kuliah-heading">Mata Kuliah</h2><p>Daftar mata kuliah yang disusun berdasarkan semester.</p></div><CourseList courses={courses} /></div></section>
  </>;
}
