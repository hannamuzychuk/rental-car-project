import type { Metadata } from "next";
import { CatalogView } from "@/components/catalog/CatalogView";

export const metadata: Metadata = {
  title: "Catalog",
  description:
    "Search and filter rental cars by brand, hourly price, and mileage. Load more results as you explore the catalog.",
};

export default function CatalogPage() {
  return <CatalogView />;
}
