'use client';

import { Button } from '@/shared/ui/button/Button';
import styles from './signOutBtn.module.scss';
import authService from '@/services/auth.service';
import { useRouter } from 'next/navigation';

export function SignOutBtn() {
  const router = useRouter();

  async function onSignOut() {
    try {
      await authService.signout();
      router.push('/');
    } catch {
      return;
    }
  }

  return (
    <Button className={styles.btn} onClick={onSignOut}>
      Sign out
    </Button>
  );
}
