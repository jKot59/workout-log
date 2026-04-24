import Image from 'next/image';
import styles from './logo.module.scss';

export function Logo() {
  return (
    <div className={styles.logo}>
      <div className={styles.image}>
        <Image src='/workout-log-logo.png' alt='logo' fill sizes='(max-width: 768px) 100% 100%' priority />
      </div>
      <span>Workout log</span>
    </div>
  );
}
