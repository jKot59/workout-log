import Image from 'next/image';
import styles from './logo.module.scss';

export function Logo() {
  return (
    <div className={styles.logo}>
      <div className={styles.image}>
        <Image src='/workout-log-logo.png' alt='logo' fill priority />
      </div>
      <span>Workout log</span>
    </div>
  );
}
