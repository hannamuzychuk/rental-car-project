import { Car } from "@/lib/types/cars";
import styles from "./CatalogCarCard.module.css";
import Link from "next/link";

type CatalogCarCardProps = {
    car: Car;
};

export function CatalogCarCard({ car }: CatalogCarCardProps) {
    const label = `${car.brand} ${car.model}, ${car.year}`;
    return(
        <li className={styles.card}>
            <img className={styles.thumb} src={car.img} alt={label} width={274} height={268} loading="lazy" />
            <div className={styles.body}>
                <div className={styles.meta}>
                    <span className={styles.model}>{label}</span>
                    <span className={styles.price}>{car.rentalPrice}$</span>
                </div>
                <Link href={`/catalog/${car.id}`} className={styles.readMore}>
                    Read more
                </Link>
            </div>
        </li>
    );
}