import type { CatalogFilterDraft } from "@/components/catalog/CatalogFilter";
import { normalizeMileageDraft } from "@/lib/catalog-mileage";

export function buildCatalogSearch(filters: CatalogFilterDraft): string {
  const sp = new URLSearchParams();
  const brand = filters.brand.trim();
  if (brand) sp.set("brand", brand);
  const price = filters.price.trim();
  if (price) sp.set("price", price);
  const { minMileage, maxMileage } = normalizeMileageDraft(
    filters.minMileage,
    filters.maxMileage,
  );
  if (minMileage) sp.set("minMileage", minMileage);
  if (maxMileage) sp.set("maxMileage", maxMileage);
  const q = sp.toString();
  return q ? `?${q}` : "";
}

export function parseCatalogFilters(sp: URLSearchParams): CatalogFilterDraft {
  const mileage = normalizeMileageDraft(
    sp.get("minMileage") ?? "",
    sp.get("maxMileage") ?? "",
  );
  return {
    brand: sp.get("brand") ?? "",
    price: sp.get("price") ?? sp.get("rentalPrice") ?? "",
    ...mileage,
  };
}

export function isCatalogListHref(href: string): boolean {
  if (href === "/catalog") return true;
  return href.startsWith("/catalog?");
}
