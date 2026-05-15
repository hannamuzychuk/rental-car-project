import type { CatalogFilterDraft } from "@/components/catalog/CatalogFilter";

export function buildCatalogSearch(filters: CatalogFilterDraft): string {
  const sp = new URLSearchParams();
  const brand = filters.brand.trim();
  if (brand) sp.set("brand", brand);
  const price = filters.price.trim();
  if (price) sp.set("price", price);
  const minMileage = filters.minMileage.trim();
  if (minMileage) sp.set("minMileage", minMileage);
  const maxMileage = filters.maxMileage.trim();
  if (maxMileage) sp.set("maxMileage", maxMileage);
  const q = sp.toString();
  return q ? `?${q}` : "";
}

export function parseCatalogFilters(sp: URLSearchParams): CatalogFilterDraft {
  return {
    brand: sp.get("brand") ?? "",
    price: sp.get("price") ?? sp.get("rentalPrice") ?? "",
    minMileage: sp.get("minMileage") ?? "",
    maxMileage: sp.get("maxMileage") ?? "",
  };
}

export function isCatalogListHref(href: string): boolean {
  if (href === "/catalog") return true;
  return href.startsWith("/catalog?");
}
