import { getCarsFilters } from "@/lib/api/cars";
import type { CarsFiltersResponse } from "@/lib/types/cars";

export const getCatalogFilters = (): Promise<CarsFiltersResponse> =>
  getCarsFilters();

export const getBrandsList = async (): Promise<string[]> => {
  const { brands } = await getCatalogFilters();
  return brands;
};
