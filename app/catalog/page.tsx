import type { Metadata } from "next";
import { Suspense } from "react";
import { CatalogView } from "@/components/catalog/CatalogView";
import { stableFilterKey } from "@/lib/catalog-url";
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

type CatalogPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function searchParamsToFilterKey(
  raw: Record<string, string | string[] | undefined>,
): string {
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(raw)) {
    if (typeof value === "string") sp.set(key, value);
    else if (Array.isArray(value) && value[0]) sp.set(key, value[0]);
  }
  return stableFilterKey(sp);
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const raw = await searchParams;
  const initialFilterKey = searchParamsToFilterKey(raw);

  return (
    <Suspense fallback={<CatalogViewFallback />}>
      <CatalogView initialFilterKey={initialFilterKey} />
    </Suspense>
  );
}
