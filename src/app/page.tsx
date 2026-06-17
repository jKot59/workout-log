import styles from './page.module.scss';

//TODO make it work in offline(manifest)

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Workout log</h1>
      </main>
    </div>
  );
}
