import Link from 'next/link'
import styles from './page.module.css'

export default function Home() {
  return (
    <div className={styles.homeContainer}>
      <div className={styles.welcomeCard}>
        <h1 className={styles.welcomeTitle}>Bienvenue</h1>
        <p className={styles.welcomeDescription}>
          Quiz sur la législation de l'ostéopathie animale en France
        </p>
        <div className={styles.buttonsContainer}>
          <Link href="./legislation" className={styles.startButton}>
            Législation
          </Link>
          <Link href="./zootechnie" className={styles.startButton}>
            Zootechnie
          </Link>
          <Link href="./pharmacologie" className={styles.startButton}>
            Pharmacologie
          </Link>
        </div>
      </div>
    </div>
  )
}
