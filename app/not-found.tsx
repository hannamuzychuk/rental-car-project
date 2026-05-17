import type { Metadata } from "next";
import Link from "next/link";
import styles from "./not-found.module.css";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you are looking for does not exist or has been moved.",
};

export default function NotFound() {
  return (
    <main className={styles.main}>
      <div className={styles.inner}>
        <p className={styles.code} aria-hidden>
          404
        </p>
        <h1 className={styles.title}>Page not found</h1>
        <p className={styles.text}>
          We could not find this page. The car may have been removed, or the
          link might be incorrect.
        </p>
        <div className={styles.actions}>
          <Link href="/catalog" className={styles.primary}>
            Back to catalog
          </Link>
          <Link href="/" className={styles.secondary}>
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
