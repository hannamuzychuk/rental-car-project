import styles from "@/components/common/route-state.module.css";

export default function CarDetailLoading() {
  return (
    <main className={styles.main} aria-busy="true" aria-label="Loading car details">
      <p className={styles.message}>Loading...</p>
    </main>
  );
}
