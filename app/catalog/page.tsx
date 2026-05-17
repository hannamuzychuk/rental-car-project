import type { Metadata } from "next";
import { Suspense } from "react";
import { CatalogView } from "@/components/catalog/CatalogView";
import styles from "@/components/common/route-state.module.css";

export const metadata: Metadata = {
  title: "Catalog",
  description:
    "Search and filter rental cars by brand, hourly price, and mileage. Load more results as you explore the catalog.",
};

function CatalogViewFallback() {
  return (
    <main className={styles.main} aria-busy="true" aria-label="Loading catalog">
      <h1 className={styles.title}>Catalog</h1>
      <p className={styles.message}>Loading...</p>
    </main>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<CatalogViewFallback />}>
      <CatalogView />
    </Suspense>
  );
}
