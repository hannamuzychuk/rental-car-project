"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { CatalogFilter, type CatalogFilterDraft } from "./CatalogFilter";
import { getCarsList } from "@/lib/api/cars";
import type { Car } from "@/lib/types/cars";
import { normalizeMileageDraft } from "@/lib/catalog-mileage";
import {
  buildCatalogSearch,
  filtersFromFilterKey,
  stableFilterKey,
} from "@/lib/catalog-url";
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
  filterKey: string;
  favoriteIds: ReadonlySet<string>;
  onToggleFavorite: (carId: string) => void;
};

function CatalogPagedGrid({
  filterKey,
  favoriteIds,
  onToggleFavorite,
}: CatalogPagedGridProps) {
  const filters = useMemo(
    () => filtersFromFilterKey(filterKey),
    [filterKey],
  );

  const query = useInfiniteQuery({
    queryKey: ["cars", filterKey] as const,
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

type CatalogViewProps = {
  initialFilterKey: string;
};

export function CatalogView({ initialFilterKey }: CatalogViewProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  const filterKey = useMemo(() => {
    const clientKey = stableFilterKey(searchParams);
    return clientKey || initialFilterKey;
  }, [searchParams, initialFilterKey]);

  const filters = useMemo(
    () => filtersFromFilterKey(filterKey),
    [filterKey],
  );

  const [draftOverride, setDraftOverride] = useState<CatalogFilterDraft | null>(
    null,
  );
  const [committedFilterKey, setCommittedFilterKey] = useState(filterKey);

  if (filterKey !== committedFilterKey) {
    setCommittedFilterKey(filterKey);
    setDraftOverride(null);
  }

  const draft = draftOverride ?? filters;

  const setDraft = useCallback<Dispatch<SetStateAction<CatalogFilterDraft>>>(
    (action) => {
      setDraftOverride((prev) => {
        const base = prev ?? filters;
        return typeof action === "function" ? action(base) : action;
      });
    },
    [filters],
  );

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

  const applySearch = () => {
    const mileage = normalizeMileageDraft(draft.minMileage, draft.maxMileage);
    const next: CatalogFilterDraft = { ...draft, ...mileage };
    const href = `/catalog${buildCatalogSearch(next)}`;
    const nextKey = stableFilterKey(
      new URLSearchParams(href.split("?")[1] ?? ""),
    );

    setDraftOverride(null);

    if (nextKey === filterKey) {
      void queryClient.resetQueries({ queryKey: ["cars", filterKey] });
      return;
    }

    router.push(href, { scroll: false });
  };

  return (
    <main className={listingStyles.main}>
      <h1 className={listingStyles.visuallyHidden}>Catalog</h1>
      <CatalogFilter
        draft={draft}
        onDraftChange={setDraft}
        onSearch={applySearch}
      />
      <CatalogPagedGrid
        filterKey={filterKey}
        favoriteIds={favoriteIds}
        onToggleFavorite={onToggleFavorite}
      />
    </main>
  );
}
