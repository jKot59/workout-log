import type { Metadata } from 'next';
import './globals.css';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import Providers from './providers';
import AuthProvider from '@/components/providers/AuthProvider';

export const metadata: Metadata = {
  title: 'Workout log',
  description: 'Plan your sets, track your reps - turn every workout into progress.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang='en'>
      <body>
        <Providers>
          <AntdRegistry>
            <AuthProvider>{children}</AuthProvider>
          </AntdRegistry>
        </Providers>
      </body>
    </html>
  );
}
