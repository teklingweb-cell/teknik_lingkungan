'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import type { Staff } from '@/lib/types';
import AdminShell from './AdminShell';
import DeleteModal from './DeleteModal';
import { Badge } from './AdminList';
import { AlertBox, useAlert } from './useAlert';

const TIERS = [
  { key: 'rektor', label: 'Ketua Jurusan', color: '#1a2e1e' },
  { key: 'wakil', label: 'Koordinator Program Studi', color: '#2d6a40' },
  { key: 'dosen', label: 'Dosen / Profesor', color: '#2563eb' },
  { key: 'staf', label: 'Staf Administrasi', color: '#9333ea' },
];

const TIER_KEYS = new Set(TIERS.map((t) => t.key));

const LEVEL_OPTIONS = [
  { value: '', label: '— Tidak tampil di bagan —' },
  ...TIERS.map((t) => ({ value: t.key, label: t.label })),
];

const TYPE_LABELS: Record<string, string> = { dosen: 'Dosen', alumni: 'Alumni', staf: 'Staf' };
const TYPE_COLORS: Record<string, string> = {
  dosen: '#2563eb',
  alumni: '#16a34a',
  staf: '#9333ea',
};

const UNASSIGNED_COLOR = '#9ca3af';

function MemberTable({
  members,
  avatarColor,
  onEdit,
  onRemove,
}: {
  members: Staff[];
  avatarColor: string;
  onEdit: (m: Staff) => void;
  onRemove: (m: Staff) => void;
}) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table>
        <thead>
          <tr>
            <th>Nama</th>
            <th className="hide-mobile">Jabatan</th>
            <th className="hide-mobile">Tipe</th>
            <th style={{ textAlign: 'right' }}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {members.map((m) => (
            <tr key={m.id}>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div className="avatar-circle" style={{ background: avatarColor }}>
                    {(m.name || '?')[0].toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 500, color: 'var(--navy)' }}>{m.name}</div>
                    <div style={{ fontSize: '0.73rem', color: 'var(--muted)' }}>
                      {m.bidang || '—'}
                    </div>
                  </div>
                </div>
              </td>
              <td className="hide-mobile" style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>
                {m.position || '—'}
              </td>
              <td className="hide-mobile">
                <Badge color={TYPE_COLORS[m.type] ?? '#6b7a6c'}>
                  {TYPE_LABELS[m.type] ?? m.type ?? '—'}
                </Badge>
              </td>
              <td>
                <div className="actions-cell">
                  <button className="btn btn-ghost btn-sm" onClick={() => onEdit(m)}>
                    Atur Level
                  </button>
                  <Link href={`/admin/staff-form?edit=${m.id}`} className="btn btn-ghost btn-sm">
                    Edit
                  </Link>
                  {m.org_level && (
                    <button className="btn btn-danger btn-sm" onClick={() => onRemove(m)}>
                      Keluarkan
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Modal for reassigning one person's tier in the org chart. */
function LevelModal({
  member,
  onCancel,
  onSave,
  busy,
}: {
  member: Staff;
  onCancel: () => void;
  onSave: (level: string) => void;
  busy: boolean;
}) {
  const [level, setLevel] = useState(member.org_level ?? '');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onCancel]);

  return (
    <div
      className="modal-overlay open"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="modal">
        <div className="modal-title">{member.name}</div>
        <div className="modal-sub">
          {(member.position ?? '') + (member.bidang ? ` · ${member.bidang}` : '')}
        </div>
        <label className="form-label" htmlFor="org-level">
          Level Hierarki di Bagan Organisasi
        </label>
        <select
          id="org-level"
          className="form-select"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
        >
          {LEVEL_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onCancel} disabled={busy}>
            Batal
          </button>
          <button className="btn btn-green" onClick={() => onSave(level)} disabled={busy}>
            {busy ? 'Menyimpan…' : 'Simpan'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function StrukturAdmin({ flash }: { flash?: string }) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const { alert, show } = useAlert();

  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [editTarget, setEditTarget] = useState<Staff | null>(null);
  const [removeTarget, setRemoveTarget] = useState<Staff | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from('staff')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      show('error', 'Gagal memuat data: ' + error.message);
      setLoading(false);
      return;
    }
    setStaff((data ?? []) as Staff[]);
    setLoading(false);
  }, [supabase, show]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (flash === 'added') show('success', '✓ Anggota baru berhasil ditambahkan.');
    if (flash === 'updated') show('success', '✓ Data berhasil diperbarui.');
  }, [flash, show]);

  /** Both the tier picker and "Keluarkan" write the same column. */
  async function setOrgLevel(id: number, level: string | null, successMessage: string) {
    setBusy(true);
    const { error } = await supabase.from('staff').update({ org_level: level }).eq('id', id);
    setBusy(false);
    setEditTarget(null);
    setRemoveTarget(null);

    if (error) {
      show('error', 'Gagal menyimpan: ' + error.message);
      return;
    }
    show('success', successMessage);
    await load();
  }

  // Level lama yang sudah dihapus (mis. "dekan") ikut masuk ke daftar ini
  // supaya orangnya tidak hilang dari admin.
  const unassigned = staff.filter((s) => !s.org_level || !TIER_KEYS.has(s.org_level));

  return (
    <AdminShell
      title="Struktur Organisasi"
      actions={
        <Link href="/admin/staff-form" className="btn btn-green">
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
          Tambah Anggota
        </Link>
      }
    >
      <AlertBox alert={alert} />

      <div className="info-banner">
        <span className="info-banner-icon">ℹ</span>
        <div className="info-banner-text">
          Halaman ini mengelola <strong>tampilan bagan organisasi</strong> di situs publik. Atur
          posisi hierarki setiap anggota, atau klik <strong>Tambah Anggota</strong> untuk
          mendaftarkan orang baru. Anggota tanpa level hierarki tidak akan muncul di bagan.
        </div>
      </div>

      <div className="tier-grid">
        {TIERS.map((tier) => {
          const members = staff.filter((s) => s.org_level === tier.key);
          return (
            <div key={tier.key} className="tier-card">
              <div className="tier-card-header">
                <div className="tier-dot" style={{ background: tier.color }} />
                <span className="tier-card-title">{tier.label}</span>
                <span className="tier-count">{members.length} orang</span>
              </div>
              {members.length ? (
                <MemberTable
                  members={members}
                  avatarColor={tier.color}
                  onEdit={setEditTarget}
                  onRemove={setRemoveTarget}
                />
              ) : (
                <div className="tier-empty">
                  {loading ? 'Memuat data…' : 'Belum ada anggota di tingkat ini.'}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="unassigned-card">
        <div className="unassigned-header">
          <span className="unassigned-title">Tidak Tampil di Bagan</span>
          <span className="tier-count">{loading ? '—' : `${unassigned.length} orang`}</span>
        </div>
        {loading ? (
          <div className="tier-empty">Memuat data…</div>
        ) : unassigned.length ? (
          <MemberTable
            members={unassigned}
            avatarColor={UNASSIGNED_COLOR}
            onEdit={setEditTarget}
            onRemove={setRemoveTarget}
          />
        ) : (
          <div className="tier-empty">Semua staf sudah memiliki posisi di bagan.</div>
        )}
      </div>

      {editTarget && (
        <LevelModal
          member={editTarget}
          busy={busy}
          onCancel={() => setEditTarget(null)}
          onSave={(level) =>
            setOrgLevel(editTarget.id, level || null, '✓ Level hierarki berhasil diperbarui.')
          }
        />
      )}

      <DeleteModal
        open={!!removeTarget}
        title="Hapus dari Bagan?"
        body={`"${removeTarget?.name ?? ''}" akan dikeluarkan dari bagan organisasi. Data staf tetap tersimpan.`}
        busy={busy}
        onCancel={() => setRemoveTarget(null)}
        onConfirm={() =>
          removeTarget &&
          setOrgLevel(removeTarget.id, null, '✓ Anggota dikeluarkan dari bagan organisasi.')
        }
      />
    </AdminShell>
  );
}
