'use client';

//TODO make this page as SSR and logic move to CSR
import { useState } from 'react';
import styles from './page.module.scss';
import { LoginModal } from '@/components/auth/LoginModal';
import { RegisterModal } from '@/components/auth/RegisterModal';
import { Button } from 'antd';

export default function Home() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Workout log</h1>
        <p>Track your workouts, manage your exercises, and keep progress in one place.</p>
        <div className={styles.actions}>
          <Button type='primary' size='large' onClick={() => setLoginOpen(true)}>
            Login
          </Button>
          <Button size='large' onClick={() => setRegisterOpen(true)}>
            Register
          </Button>
        </div>
      </main>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
      <RegisterModal open={registerOpen} onClose={() => setRegisterOpen(false)} />
    </div>
  );
}
