'use client';

import React, { useEffect, useState } from 'react';
import { IAuthState, useAuthStore } from '@/stores/auth-store';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const setToken = useAuthStore((store: IAuthState) => store.setToken);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const res = await fetch('/api/auth/refresh', { method: 'POST', credentials: 'include' });
        if (res.ok) {
          const json = await res.json().catch(() => null);
          const token = json?.accessToken;
          if (token && mounted) setToken(token);
        }
      } catch (e) {
        // ignore
      } finally {
        if (mounted) setReady(true);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [setToken]);

  if (!ready) return null;

  return <>{children}</>;
}
