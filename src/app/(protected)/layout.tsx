'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Spin } from 'antd';
import { IAuthState, useAuthStore } from '@/stores/auth-store';
import { AppSider } from '@/widgets/appSider';
import { EquipmentListInitializer } from '../providers/EquipmentListInitializer';
import { IndexedDBInitializer } from '../providers/IndexedDBInitializer';
import { MainHeader } from '@/widgets/mainHeader';
import { Logo } from '@/shared/ui/logo/Logo';
import { Layout } from 'antd';
import styles from './layout.module.scss';

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

  return (
    <>
      <IndexedDBInitializer />
      <EquipmentListInitializer />
      <Layout className={styles.layout}>
        <AppSider aboveMenuSlot={<Logo />} />

        <Layout>
          <MainHeader />
          {children}
        </Layout>
      </Layout>
    </>
  );
}
