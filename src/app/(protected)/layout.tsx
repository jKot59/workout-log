'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Spin } from 'antd';
import { IAuthState, useAuthStore } from '@/stores/auth-store';
import { AppLayout } from '@/widgets/appLayout/AppLayout';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((store: IAuthState) => store.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) router.replace('/');
  }, [isAuthenticated, router]);

  if (!isAuthenticated)
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <Spin size='large' />
      </div>
    );

  return <AppLayout>{children}</AppLayout>;
}
