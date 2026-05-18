"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { CatalogFilter, type CatalogFilterDraft } from "./CatalogFilter";
import { getCarsList } from "@/lib/api/cars";
import type { Car } from "@/lib/types/cars";
import { normalizeMileageDraft } from "@/lib/catalog-mileage";
import { buildCatalogSearch, parseCatalogFilters } from "@/lib/catalog-url";
import {
  getFavoriteCarIdsSnapshot,
  getServerFavoriteCarIdsSnapshot,
  subscribeFavoriteCarIds,
  writeFavoriteCarIds,
} from "@/lib/favorite-cars-storage";
import listingStyles from "@/components/common/listing-page.module.css";
import { CatalogCarGrid } from "./CatalogCarGrid";

const PAGE_SIZE = 12;

type CatalogPagedGridProps = {
  filters: CatalogFilterDraft;
  favoriteIds: ReadonlySet<string>;
  onToggleFavorite: (carId: string) => void;
};

function CatalogPagedGrid({
  filters,
  favoriteIds,
  onToggleFavorite,
}: CatalogPagedGridProps) {
  const query = useInfiniteQuery({
    queryKey: ["cars", filters] as const,
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      getCarsList({
        page: pageParam,
        perPage: PAGE_SIZE,
        brand: filters.brand,
        price: filters.price,
        minMileage: filters.minMileage,
        maxMileage: filters.maxMileage,
      }),
    getNextPageParam: (lastPage) => {
      const current = Number(lastPage.page);
      const total = Number(lastPage.totalPages);
      if (!Number.isFinite(current) || !Number.isFinite(total)) return undefined;
      return current < total ? current + 1 : undefined;
    },
  });

  const cars = useMemo((): Car[] => {
    const pages = query.data?.pages;
    if (!pages?.length) return [];
    return pages.flatMap((p) => p.cars);
  }, [query.data?.pages]);

  const errorMessage =
    query.error instanceof Error ? query.error.message : "Try again.";

  const showInitialLoading =
    query.isPending && cars.length === 0;

  return (
    <>
      {showInitialLoading && (
        <p className={listingStyles.muted}>Loading...</p>
      )}
      {query.isError && (
        <p className={listingStyles.error}>
          Could not load cars. {errorMessage}
        </p>
      )}
      {query.isSuccess && cars.length === 0 && (
        <p className={listingStyles.muted}>No cars found</p>
      )}

      <CatalogCarGrid
        cars={cars}
        favoriteIds={favoriteIds}
        onToggleFavorite={onToggleFavorite}
      />
      {query.hasNextPage && (
        <button
          type="button"
          className={listingStyles.outlineButton}
          onClick={() => void query.fetchNextPage()}
          disabled={query.isFetchingNextPage}
        >
          {query.isFetchingNextPage ? "Loading..." : "Load more"}
        </button>
      )}
    </>
  );
}

export function CatalogView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchKey = searchParams.toString();

  const filters = useMemo(
    () => parseCatalogFilters(new URLSearchParams(searchKey)),
    [searchKey],
  );

  const [draft, setDraft] = useState(filters);
  const [urlKey, setUrlKey] = useState(searchKey);

  if (searchKey !== urlKey) {
    setUrlKey(searchKey);
    setDraft(filters);
  }

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      sessionStorage.setItem(
        "catalog-last-path",
        `/catalog${buildCatalogSearch(filters)}`,
      );
    } catch {
    }
  }, [filters]);

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
      const wasFavorite = next.has(carId);
      if (wasFavorite) next.delete(carId);
      else next.add(carId);
      writeFavoriteCarIds(next);
      toast.success(
        wasFavorite ? "Removed from favorites" : "Added to favorites",
      );
    },
    [favoriteIds],
  );

  const applySearch = useCallback(() => {
    const mileage = normalizeMileageDraft(draft.minMileage, draft.maxMileage);
    const next: CatalogFilterDraft = { ...draft, ...mileage };
    const q = buildCatalogSearch(next);
    router.replace(`/catalog${q}`, { scroll: false });
  }, [draft, router]);

  return (
    <main className={listingStyles.main}>
      <h1 className={listingStyles.visuallyHidden}>Catalog</h1>
      <CatalogFilter
        draft={draft}
        onDraftChange={setDraft}
        onSearch={applySearch}
      />
      <CatalogPagedGrid
        filters={filters}
        favoriteIds={favoriteIds}
        onToggleFavorite={onToggleFavorite}
      />
    </main>
  );
}
