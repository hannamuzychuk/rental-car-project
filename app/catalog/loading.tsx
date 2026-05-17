import styles from "@/components/common/route-state.module.css";

export default function CatalogLoading() {
  return (
    <main className={styles.main} aria-busy="true" aria-label="Loading catalog">
      <h1 className={styles.title}>Catalog</h1>
      <p className={styles.message}>Loading...</p>
    </main>
  );
}
