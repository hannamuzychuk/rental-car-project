import { CatalogBrandSelect } from "./CatalogBrandSelect";
import styles from "./CatalogFilter.module.css";

/** Hourly price tiers from UI kit (Price component). */
const PRICE_OPTIONS = [30, 40, 50, 60, 70, 80] as const;

export type CatalogFilterDraft = {
  brand: string;
  rentalPrice: string;
  minMileage: string;
  maxMileage: string;
};

type CatalogFilterProps = {
  draft: CatalogFilterDraft;
  onDraftChange: (next: CatalogFilterDraft) => void;
  onSearch: () => void;
  isBusy: boolean;
};

export function CatalogFilter({
  draft,
  onDraftChange,
  onSearch,
  isBusy,
}: CatalogFilterProps) {
  return (
    <section className={styles.filters} aria-label="Filters">
      <div className={styles.filterRow}>
        <div className={styles.colBrand}>
          <CatalogBrandSelect
            value={draft.brand}
            onChange={(brand) => onDraftChange({ ...draft, brand })}
            disabled={isBusy}
          />
        </div>

        <label className={`${styles.field} ${styles.colPrice}`}>
          <span className={styles.label}>Price/ 1 hour</span>
          <select
            value={draft.rentalPrice}
            onChange={(e) =>
              onDraftChange({ ...draft, rentalPrice: e.target.value })
            }
            disabled={isBusy}
            aria-label="Price per hour"
          >
            <option value="">Choose a price</option>
            {PRICE_OPTIONS.map((n) => (
              <option key={n} value={String(n)}>
                {n}
              </option>
            ))}
          </select>
        </label>

        <div className={`${styles.colMileage}`}>
          <span className={styles.label}>Car mileage / km</span>
          <div className={styles.mileagePair}>
            <input
              type="text"
              className={styles.mileageFrom}
              value={draft.minMileage}
              onChange={(e) =>
                onDraftChange({ ...draft, minMileage: e.target.value })
              }
              placeholder="From"
              disabled={isBusy}
              aria-label="Mileage from"
            />
            <input
              type="text"
              className={styles.mileageTo}
              value={draft.maxMileage}
              onChange={(e) =>
                onDraftChange({ ...draft, maxMileage: e.target.value })
              }
              placeholder="To"
              disabled={isBusy}
              aria-label="Mileage to"
            />
          </div>
        </div>
      </div>

      <button
        type="button"
        className={styles.apply}
        onClick={onSearch}
        disabled={isBusy}
      >
        Search
      </button>
    </section>
  );
}
