import Image from 'next/image';
import styles from './logo.module.scss';

export function Logo() {
  return (
    <div className={styles.logo}>
      <div className={styles.image}>
        <Image src='/workout-log-logo.png' alt='logo' width={38} height={43.8} priority />
      </div>
      <span>Workout log</span>
    </div>
  );
}
