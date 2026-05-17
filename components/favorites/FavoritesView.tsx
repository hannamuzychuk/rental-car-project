"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getCarById } from "@/lib/api/cars";
import type { Car } from "@/lib/types/cars";
import {
  getFavoriteCarIdsSnapshot,
  getServerFavoriteCarIdsSnapshot,
  subscribeFavoriteCarIds,
  writeFavoriteCarIds,
} from "@/lib/favorite-cars-storage";
import { CatalogCarGrid } from "@/components/catalog/CatalogCarGrid";
import listingStyles from "@/components/common/listing-page.module.css";
import styles from "./FavoritesView.module.css";

async function fetchFavoriteCars(ids: string[]): Promise<Car[]> {
  const settled = await Promise.allSettled(ids.map((id) => getCarById(id)));
  const cars: Car[] = [];
  for (const result of settled) {
    if (result.status === "fulfilled") cars.push(result.value);
  }
  return cars;
}

export function FavoritesView() {
  const favoritesSnapshot = useSyncExternalStore(
    subscribeFavoriteCarIds,
    getFavoriteCarIdsSnapshot,
    getServerFavoriteCarIdsSnapshot,
  );
  const favoriteIds = useMemo(
    () => new Set(JSON.parse(favoritesSnapshot) as string[]),
    [favoritesSnapshot],
  );
  const sortedIds = useMemo(
    () => [...favoriteIds].sort(),
    [favoriteIds],
  );

  const query = useQuery({
    queryKey: ["favorite-cars", sortedIds] as const,
    queryFn: () => fetchFavoriteCars(sortedIds),
    enabled: sortedIds.length > 0,
  });

  const onToggleFavorite = useCallback(
    (carId: string) => {
      const next = new Set(favoriteIds);
      if (next.has(carId)) next.delete(carId);
      else next.add(carId);
      writeFavoriteCarIds(next);
    },
    [favoriteIds],
  );

  const errorMessage =
    query.error instanceof Error ? query.error.message : "Try again.";

  return (
    <main className={listingStyles.main}>
      <h1 className={listingStyles.visuallyHidden}>Favorites</h1>

      {sortedIds.length === 0 && (
        <>
          <p className={listingStyles.muted}>You have not saved any cars yet.</p>
          <Link
            href="/catalog"
            className={`${listingStyles.outlineButton} ${styles.emptyLink}`}
          >
            Browse catalog
          </Link>
        </>
      )}

      {sortedIds.length > 0 && query.isPending && (
        <p className={listingStyles.muted}>Loading...</p>
      )}
      {sortedIds.length > 0 && query.isError && (
        <p className={listingStyles.error}>
          Could not load favorites. {errorMessage}
        </p>
      )}
      {sortedIds.length > 0 &&
        query.isSuccess &&
        query.data.length === 0 && (
          <p className={listingStyles.muted}>
            None of your saved cars could be loaded. They may have been removed
            from the catalog.
          </p>
        )}

      {sortedIds.length > 0 && query.isSuccess && query.data.length > 0 && (
        <CatalogCarGrid
          cars={query.data}
          favoriteIds={favoriteIds}
          onToggleFavorite={onToggleFavorite}
        />
      )}
    </main>
  );
}
