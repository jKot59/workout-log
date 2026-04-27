import Image from 'next/image';
import styles from './logo.module.scss';
import Link from 'next/link';
import { paths } from '@/shared/paths';

export function Logo() {
  return (
    <Link href={paths.home} className={styles.logo}>
      <div className={styles.image}>
        <Image src='/workout-log-logo.png' alt='logo' fill sizes='(max-width: 768px) 100% 100%' priority />
      </div>
      <span>Workout log</span>
    </Link>
  );
}
