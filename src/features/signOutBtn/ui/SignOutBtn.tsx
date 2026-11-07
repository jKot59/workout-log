'use client';

import { Button } from '@/shared/ui/button/Button';
import styles from './signOutBtn.module.scss';
import authService from '@/services/auth.service';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

export function SignOutBtn() {
  const router = useRouter();
  const queryClient = useQueryClient();

  async function onSignOut() {
    try {
      await authService.signout();
      queryClient.clear();
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
