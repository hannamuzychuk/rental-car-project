"use client";

import { useMemo, useState } from "react";
import { CatalogFilter, type CatalogFilterDraft } from "./CatalogFilter";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getCarsList } from "@/lib/api/cars";
import styles from "./CatalogView.module.css";
import { CatalogCarGrid } from "./CatalogCarGrid";

const PAGE_SIZE = 12;

const emptyFilter: CatalogFilterDraft = {
  brand: "",
  rentalPrice: "",
  minMileage: "",
  maxMileage: "",
};

export function CatalogView() {
  const [filters, setFilters] = useState<CatalogFilterDraft>(emptyFilter);
  const [draft, setDraft] = useState<CatalogFilterDraft>(emptyFilter);

  const queryKey = useMemo(() => ["cars", filters] as const, [filters]);

  const query = useInfiniteQuery({
    queryKey,
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      getCarsList({
        page: pageParam,
        limit: PAGE_SIZE,
        brand: filters.brand,
        rentalPrice: filters.rentalPrice,
        minMileage: filters.minMileage,
        maxMileage: filters.maxMileage,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
  });

  const cars = query.data?.pages.flatMap((page) => page.cars) ?? [];
  const searchBusy = query.isFetching && !query.isFetchingNextPage;

  const errorMessage =
    query.error instanceof Error ? query.error.message : "Try again.";

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Catalog</h1>
      <CatalogFilter
        draft={draft}
        onDraftChange={setDraft}
        onSearch={() => setFilters(draft)}
        isBusy={searchBusy}
      />
      {query.isLoading && <p className={styles.muted}>Loading...</p>}
      {query.isError && (
        <p className={styles.error}>
          Could not load cars. {errorMessage}
        </p>
      )}
      {query.isSuccess && cars.length === 0 && (
        <p className={styles.muted}>No cars found</p>
      )}

      <CatalogCarGrid cars={cars} />
      {query.hasNextPage && (
        <button
          type="button"
          className={styles.loadMore}
          onClick={() => query.fetchNextPage()}
          disabled={query.isFetchingNextPage}
        >
          {query.isFetchingNextPage ? "Loading..." : "Load more"}
        </button>
      )}
    </main>
  );
}
