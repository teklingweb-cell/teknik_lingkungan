'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Email dan password wajib diisi.');
      return;
    }

    setBusy(true);
    const supabase = createSupabaseBrowserClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setError('Login gagal: ' + signInError.message);
      setBusy(false);
      return;
    }

    // Middleware guards these paths, so only send the user back to an admin
    // route — never to an arbitrary URL carried in ?next=.
    const next = searchParams.get('next');
    const destination = next && next.startsWith('/admin') ? next : '/admin';
    router.push(destination);
    router.refresh();
  }

  return (
    <div className="login-card">
      <div className="logo">
        <div className="logo-icon">U</div>
        <div>
          <div className="logo-text">Universitas</div>
          <div className="logo-sub">Admin Panel</div>
        </div>
      </div>
      <h1>Masuk ke Dashboard</h1>
      <p className="subtitle">Gunakan akun admin untuk melanjutkan.</p>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            type="email"
            placeholder="admin@universitas.ac.id"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="btn" type="submit" disabled={busy}>
          {busy ? 'Memproses…' : 'Masuk'}
        </button>
      </form>
    </div>
  );
}
