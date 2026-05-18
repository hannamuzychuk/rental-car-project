import type { Dispatch, SetStateAction } from "react";
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
  onDraftChange: Dispatch<SetStateAction<CatalogFilterDraft>>;
  onSearch: () => void;
};

export function CatalogFilter({
  draft,
  onDraftChange,
  onSearch,
}: CatalogFilterProps) {
  return (
    <section className={styles.filters} aria-label="Filters">
      <div className={styles.filterRow}>
        <div className={styles.colBrand}>
          <CatalogBrandSelect
            value={draft.brand}
            onChange={(brand) =>
              onDraftChange((prev) => ({ ...prev, brand }))
            }
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
              onDraftChange((prev) => ({ ...prev, minMileage, maxMileage }))
            }
          />
        </div>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.apply}
          onClick={onSearch}
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
