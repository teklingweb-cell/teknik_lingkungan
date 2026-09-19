'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export type AlertState = { type: 'success' | 'error'; message: string } | null;

/** Transient success/error banner that clears itself after 4 seconds. */
export function useAlert() {
  const [alert, setAlert] = useState<AlertState>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback((type: 'success' | 'error', message: string) => {
    if (timer.current) clearTimeout(timer.current);
    setAlert({ type, message });
    timer.current = setTimeout(() => setAlert(null), 4000);
  }, []);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  return { alert, show };
}

export function AlertBox({ alert }: { alert: AlertState }) {
  if (!alert) return null;
  return <div className={`alert alert-${alert.type}`}>{alert.message}</div>;
}
