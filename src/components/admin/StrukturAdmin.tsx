'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import type { Staff } from '@/lib/types';
import AdminShell from './AdminShell';
import DeleteModal from './DeleteModal';
import { Badge } from './AdminList';
import { AlertBox, useAlert } from './useAlert';
import { revalidatePublic } from './revalidate';

const TIERS = [
  { key: 'rektor', label: 'Ketua Jurusan', color: '#1a2e1e' },
  { key: 'wakil', label: 'Koordinator Program Studi', color: '#2d6a40' },
  { key: 'kbk_rekayasa', label: 'Ketua KBK Rekayasa Infrastruktur Lingkungan', color: '#0f766e' },
  { key: 'kbk_manajemen', label: 'Ketua KBK Manajemen Lingkungan', color: '#0f766e' },
  { key: 'kbk_pengendalian', label: 'Ketua KBK Pengendalian Pencemaran Lingkungan', color: '#0f766e' },
  { key: 'lab_kualitas_air', label: 'Kepala Lab. Kualitas Air', color: '#b91c1c' },
  { key: 'lab_mikrobiologi', label: 'Kepala Lab. Mikrobiologi', color: '#b91c1c' },
  { key: 'lab_kualitas_udara', label: 'Kepala Lab. Kualitas Udara', color: '#b91c1c' },
  { key: 'dosen', label: 'Dosen / Profesor', color: '#2563eb' },
  { key: 'staf', label: 'Staf Administrasi', color: '#9333ea' },
];

const TIER_KEYS = new Set(TIERS.map((t) => t.key));



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
              <td>
                <div className="actions-cell">
                  <button className="btn btn-ghost btn-sm" onClick={() => onEdit(m)}>
                    Atur Level
                  </button>

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
  const [selected, setSelected] = useState<Set<string>>(() =>
    new Set(member.org_level ? member.org_level.split(',').filter(Boolean) : [])
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onCancel]);

  const toggle = (key: string) => {
    const next = new Set(selected);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setSelected(next);
  };

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
        <label className="form-label" style={{ marginBottom: 12 }}>
          Level Hierarki di Bagan Organisasi (Bisa Pilih &gt; 1)
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
          {TIERS.map((t) => (
            <label key={t.key} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--text-main)' }}>
              <input
                type="checkbox"
                checked={selected.has(t.key)}
                onChange={() => toggle(t.key)}
                style={{ cursor: 'pointer' }}
              />
              {t.label}
            </label>
          ))}
        </div>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onCancel} disabled={busy}>
            Batal
          </button>
          <button className="btn btn-green" onClick={() => onSave(Array.from(selected).join(','))} disabled={busy}>
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
    await revalidatePublic('staff');
    await load();
  }

  // Alumni tidak boleh masuk bagan, jadi mereka tidak muncul di daftar yang
  // bisa ditugaskan. Level lama yang sudah dihapus (mis. "dekan") tetap masuk
  // ke daftar ini supaya orangnya tidak hilang dari admin.
  const assignable = staff.filter((s) => s.type !== 'alumni');
  const unassigned = assignable.filter((s) => {
    if (!s.org_level) return true;
    const levels = s.org_level.split(',');
    return !levels.some((l) => TIER_KEYS.has(l));
  });

  return (
    <AdminShell
      title="Struktur Organisasi"
      actions={null}
    >
      <AlertBox alert={alert} />

      <div className="info-banner">
        <span className="info-banner-icon">ℹ</span>
        <div className="info-banner-text">
          Halaman ini mengelola <strong>tampilan bagan organisasi</strong> di situs publik. Atur
          posisi hierarki setiap anggota yang sudah terdaftar. Anggota tanpa level hierarki tidak akan muncul di bagan.
          Hanya <strong>dosen</strong> dan <strong>staf</strong> yang bisa ditempatkan — alumni
          tidak ditampilkan di bagan organisasi.
        </div>
      </div>

      <div className="tier-grid">
        {TIERS.map((tier) => {
          const members = staff.filter((s) => s.org_level && s.org_level.split(',').includes(tier.key));
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
