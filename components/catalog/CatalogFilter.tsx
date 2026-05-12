import { CatalogBrandSelect } from "./CatalogBrandSelect";
import styles from "./CatalogFilter.module.css";

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
      <CatalogBrandSelect
        value={draft.brand}
        onChange={(brand) => onDraftChange({ ...draft, brand })}
        disabled={isBusy}
      />

      <label className={styles.field}>
        <span>Price / 1 hour</span>
        <input
          type="text"
          value={draft.rentalPrice}
          onChange={(e) =>
            onDraftChange({ ...draft, rentalPrice: e.target.value })
          }
          placeholder="Enter the text"
        />
      </label>

      <label className={styles.field}>
        <span>Car mileage / km</span>
        <input
          type="text"
          value={draft.minMileage}
          onChange={(e) =>
            onDraftChange({ ...draft, minMileage: e.target.value })
          }
          placeholder="From"
        />
      </label>

      <label className={styles.field}>
        <span aria-hidden="true">&nbsp;</span>
        <input
          type="text"
          value={draft.maxMileage}
          onChange={(e) =>
            onDraftChange({ ...draft, maxMileage: e.target.value })
          }
          placeholder="To"
        />
      </label>

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
