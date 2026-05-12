"use client";

import { getBrandsList } from "@/lib/api/brends";
import { useQuery } from "@tanstack/react-query";
import styles from "./CatalogFilter.module.css";

type CatalogBrandSelectProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export function CatalogBrandSelect({
  value,
  onChange,
  disabled,
}: CatalogBrandSelectProps) {
  const brandsQuery = useQuery({
    queryKey: ["brands"],
    queryFn: () => getBrandsList(),
  });

  const brands = brandsQuery.data ?? [];
  const selectDisabled =
    Boolean(disabled) || brandsQuery.isLoading || brandsQuery.isError;

  return (
    <label className={styles.field}>
      <span>Car brand</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={selectDisabled}
      >
        <option value="">All brands</option>
        {brands.map((brand) => (
          <option key={brand} value={brand}>
            {brand}
          </option>
        ))}
      </select>
      {brandsQuery.isError && (
        <p className={styles.error}>Could not load brands. Try again.</p>
      )}
    </label>
  );
}
