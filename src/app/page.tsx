import styles from './page.module.css';

//TODO make it work in offline(manifest)

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}></main>
    </div>
  );
}
