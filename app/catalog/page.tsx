import type { Metadata } from "next";
import { Suspense } from "react";
import { CatalogView } from "@/components/catalog/CatalogView";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Catalog",
  description:
    "Search and filter rental cars by brand, hourly price, and mileage. Load more results as you explore the catalog.",
};

export default function CatalogPage() {
  return (
    <Suspense fallback={<p className={styles.fallback}>Loading...</p>}>
      <CatalogView />
    </Suspense>
  );
}
