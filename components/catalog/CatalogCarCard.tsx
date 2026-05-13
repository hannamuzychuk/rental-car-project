"use client";

import type { Car } from "@/lib/types/cars";
import { FaHeart } from "react-icons/fa";
import styles from "./CatalogCarCard.module.css";
import Link from "next/link";

function formatMileageKm(value: number) {
  if (!Number.isFinite(value)) return "";
  return `${Math.trunc(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ")} km`;
}

function parseAddressCityCountry(address: string): {
  city: string;
  country: string;
} {
  const parts = address
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length === 0) return { city: "", country: "" };
  if (parts.length === 1) return { city: parts[0], country: "" };
  if (parts.length === 2) return { city: parts[0], country: parts[1] };
  return {
    city: parts[parts.length - 2] ?? "",
    country: parts[parts.length - 1] ?? "",
  };
}

type CatalogCarCardProps = {
  car: Car;
  isFavorite: boolean;
  onToggleFavorite: (carId: string) => void;
};

export function CatalogCarCard({
  car,
  isFavorite,
  onToggleFavorite,
}: CatalogCarCardProps) {
  const label = `${car.brand} ${car.model}, ${car.year}`;
  const mileageLabel = formatMileageKm(car.mileage);
  const { city, country } = parseAddressCityCountry(car.address);

  return (
    <li className={styles.card}>
      <div className={styles.stack}>
        <div className={styles.media}>
          <img
            className={styles.thumb}
            src={car.img}
            alt={label}
            width={276}
            height={268}
            loading="lazy"
          />
          <div className={styles.scrim} aria-hidden />
          <button
            type="button"
            className={`${styles.favorite} ${isFavorite ? styles.favoriteOn : ""}`}
            aria-pressed={isFavorite}
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleFavorite(car.id);
            }}
          >
            <FaHeart className={styles.heartIcon} aria-hidden />
          </button>
        </div>

        <div className={styles.infoBlock}>
          <div className={styles.nameRow}>
            <span className={styles.model} title={label}>
              <span className={styles.modelBrand}>{car.brand} </span>
              <span className={styles.modelSeries}>{car.model}</span>
              <span className={styles.modelYear}>, {car.year}</span>
            </span>
            <span className={styles.price}>${car.rentalPrice}</span>
          </div>

          <div className={styles.specBlock}>
            <div className={styles.specRow}>
              <span className={styles.specItem} title={city || undefined}>
                {city}
              </span>
              <span className={styles.divider} aria-hidden />
              <span className={styles.specItem} title={country || undefined}>
                {country}
              </span>
              <span className={styles.divider} aria-hidden />
              <span
                className={`${styles.specItem} ${styles.specItemGrow}`}
                title={car.rentalCompany}
              >
                {car.rentalCompany}
              </span>
            </div>
            <div className={styles.specRow}>
              <span
                className={`${styles.specItem} ${styles.specItemGrow}`}
                title={car.type}
              >
                {car.type.trim()}
              </span>
              <span className={styles.divider} aria-hidden />
              <span
                className={`${styles.specItem} ${styles.specItemNoShrink}`}
              >
                {mileageLabel}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.ctaWrap}>
        <Link
          href={`/catalog/${car.id}`}
          className={styles.readMore}
          target="_blank"
          rel="noopener noreferrer"
        >
          Read more
        </Link>
      </div>
    </li>
  );
}
