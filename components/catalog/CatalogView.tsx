"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { useQuery } from "@tanstack/react-query";
import { CatalogFilter, type CatalogFilterDraft } from "./CatalogFilter";
import { getCarsList } from "@/lib/api/cars";
import type { Car } from "@/lib/types/cars";
import {
  getFavoriteCarIdsSnapshot,
  getServerFavoriteCarIdsSnapshot,
  subscribeFavoriteCarIds,
  writeFavoriteCarIds,
} from "@/lib/favorite-cars-storage";
import styles from "./CatalogView.module.css";
import { CatalogCarGrid } from "./CatalogCarGrid";

const PAGE_SIZE = 12;

const emptyFilter: CatalogFilterDraft = {
  brand: "",
  rentalPrice: "",
  minMileage: "",
  maxMileage: "",
};

function filtersSignature(f: CatalogFilterDraft) {
  return `${f.brand}|${f.rentalPrice}|${f.minMileage}|${f.maxMileage}`;
}

type CatalogPagedGridProps = {
  filters: CatalogFilterDraft;
  favoriteIds: ReadonlySet<string>;
  onToggleFavorite: (carId: string) => void;
  onSearchBusyChange: (busy: boolean) => void;
};

function CatalogPagedGrid({
  filters,
  favoriteIds,
  onToggleFavorite,
  onSearchBusyChange,
}: CatalogPagedGridProps) {
  const [page, setPage] = useState(1);
  const [cars, setCars] = useState<Car[]>([]);

  const query = useQuery({
    queryKey: ["cars", filters, page] as const,
    queryFn: () =>
      getCarsList({
        page,
        limit: PAGE_SIZE,
        brand: filters.brand,
        rentalPrice: filters.rentalPrice,
        minMileage: filters.minMileage,
        maxMileage: filters.maxMileage,
      }),
  });

  useEffect(() => {
    if (!query.data) return;
    const incoming = query.data.cars;
    setCars((prev) => {
      if (page === 1) return incoming;
      const seen = new Set(prev.map((c) => c.id));
      return [...prev, ...incoming.filter((c) => !seen.has(c.id))];
    });
  }, [query.data, page]);

  useEffect(() => {
    onSearchBusyChange(query.isFetching && !query.isPending && page === 1);
  }, [query.isFetching, query.isPending, page, onSearchBusyChange]);

  const totalPages = query.data?.totalPages ?? 0;
  const hasMore = query.isSuccess && page < totalPages;

  const errorMessage =
    query.error instanceof Error ? query.error.message : "Try again.";

  return (
    <>
      {query.isPending && page === 1 && cars.length === 0 && (
        <p className={styles.muted}>Loading...</p>
      )}
      {query.isError && (
        <p className={styles.error}>
          Could not load cars. {errorMessage}
        </p>
      )}
      {query.isSuccess && cars.length === 0 && (
        <p className={styles.muted}>No cars found</p>
      )}

      <CatalogCarGrid
        cars={cars}
        favoriteIds={favoriteIds}
        onToggleFavorite={onToggleFavorite}
      />
      {hasMore && (
        <button
          type="button"
          className={styles.loadMore}
          onClick={() => setPage((p) => p + 1)}
          disabled={query.isFetching}
        >
          {query.isFetching && page > 1 ? "Loading..." : "Load more"}
        </button>
      )}
    </>
  );
}

export function CatalogView() {
  const [filters, setFilters] = useState<CatalogFilterDraft>(emptyFilter);
  const [draft, setDraft] = useState<CatalogFilterDraft>(emptyFilter);
  const [searchBusy, setSearchBusy] = useState(false);

  const filtersKey = useMemo(() => filtersSignature(filters), [filters]);

  const favoritesSnapshot = useSyncExternalStore(
    subscribeFavoriteCarIds,
    getFavoriteCarIdsSnapshot,
    getServerFavoriteCarIdsSnapshot,
  );
  const favoriteIds = useMemo(
    () => new Set(JSON.parse(favoritesSnapshot) as string[]),
    [favoritesSnapshot],
  );

  const onToggleFavorite = useCallback(
    (carId: string) => {
      const next = new Set(favoriteIds);
      if (next.has(carId)) next.delete(carId);
      else next.add(carId);
      writeFavoriteCarIds(next);
    },
    [favoriteIds],
  );

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Catalog</h1>
      <CatalogFilter
        draft={draft}
        onDraftChange={setDraft}
        onSearch={() => setFilters(draft)}
        isBusy={searchBusy}
      />
      <CatalogPagedGrid
        key={filtersKey}
        filters={filters}
        favoriteIds={favoriteIds}
        onToggleFavorite={onToggleFavorite}
        onSearchBusyChange={setSearchBusy}
      />
    </main>
  );
}
