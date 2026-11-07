import React from 'react';
import { Layout } from 'antd';
import { AppSider } from '@/widgets/appSider';
import { MainHeader } from '@/widgets/mainHeader';
import { Logo } from '@/shared/ui/logo/Logo';
import { EquipmentListInitializer } from '@/app/providers/EquipmentListInitializer';
import styles from './appLayout.module.scss';

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
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
