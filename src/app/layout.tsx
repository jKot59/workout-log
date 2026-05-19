import { Logo } from '@/shared/ui/logo/Logo';
import { AppSider } from '@/widgets/appSider';
import { MainHeader } from '@/widgets/mainHeader';
import { Layout } from 'antd';
import type { Metadata } from 'next';
import './globals.css';
import styles from './layout.module.scss';
import { IndexedDBInitializer } from './providers/IndexedDBInitializer';
import { AntdRegistry } from '@ant-design/nextjs-registry';

export const metadata: Metadata = {
  title: 'Workout log',
  description: 'Plan your sets, track your reps - turn every workout into progress.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang='en'>
      <body>
        <AntdRegistry>
          <IndexedDBInitializer />
          <Layout className={styles.layout}>
            <AppSider aboveMenuSlot={<Logo />} />

            <Layout>
              <MainHeader />
              {children}
            </Layout>
          </Layout>
        </AntdRegistry>
      </body>
    </html>
  );
}
