import { Logo } from '@/shared/logo/ui/Logo';
import { AppSider } from '@/widgets/appSider';
import { MainHeader } from '@/widgets/mainHeader';
import { Layout } from 'antd';
import type { Metadata } from 'next';
import './globals.css';
import styles from './layout.module.scss';

export const metadata: Metadata = {
  title: 'Workout log',
  description: 'Plan your sets, track your reps - turn every workout into progress.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang='en'>
      <body>
        <Layout className={styles.layout}>
          <AppSider aboveMenuSlot={<Logo />} />

          <Layout>
            <MainHeader />
            {children}
          </Layout>
        </Layout>
      </body>
    </html>
  );
}
