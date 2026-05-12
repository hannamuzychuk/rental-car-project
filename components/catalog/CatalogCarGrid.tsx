import { Car } from "@/lib/types/cars";
import { CatalogCarCard } from "./CatalogCarCard";
import styles from "./CatalogCarGrid.module.css";

type CatalogCarGridProps = {
    cars: Car[];
};

export function CatalogCarGrid({ cars }: CatalogCarGridProps) {
    return (
        <ul className={styles.grid}>
            {cars.map((car) => (
                <CatalogCarCard key={car.id} car={car} />
            ))}
        </ul>
    );
}