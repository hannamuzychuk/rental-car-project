import type { Car } from "@/lib/types/cars";
import { CatalogCarCard } from "./CatalogCarCard";
import styles from "./CatalogCarGrid.module.css";

type CatalogCarGridProps = {
  cars: Car[];
  favoriteIds: ReadonlySet<string>;
  onToggleFavorite: (carId: string) => void;
};

export function CatalogCarGrid({
  cars,
  favoriteIds,
  onToggleFavorite,
}: CatalogCarGridProps) {
  return (
    <ul className={styles.grid}>
      {cars.map((car) => (
        <CatalogCarCard
          key={car.id}
          car={car}
          isFavorite={favoriteIds.has(car.id)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </ul>
  );
}