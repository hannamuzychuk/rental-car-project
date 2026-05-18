import Link from "next/link";
import { CatalogBrandSelect } from "./CatalogBrandSelect";
import { CatalogMileageRange } from "./CatalogMileageRange";
import { CatalogPriceSelect } from "./CatalogPriceSelect";
import styles from "./CatalogFilter.module.css";

export type CatalogFilterDraft = {
  brand: string;
  price: string;
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
          />
        </div>

        <div className={styles.colPrice}>
          <CatalogPriceSelect
            value={draft.price}
            onChange={(price) => onDraftChange({ ...draft, price })}
          />
        </div>

        <div className={styles.colMileage}>
          <CatalogMileageRange
            minMileage={draft.minMileage}
            maxMileage={draft.maxMileage}
            onChange={({ minMileage, maxMileage }) =>
              onDraftChange({ ...draft, minMileage, maxMileage })
            }
          />
        </div>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.apply}
          onClick={onSearch}
          disabled={isBusy}
        >
          Search
        </button>
        <Link href="/favorites" className={styles.favoritesLink}>
          Favorites
        </Link>
      </div>
    </section>
  );
}
