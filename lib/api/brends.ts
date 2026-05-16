import { getCarsFilters } from "@/lib/api/cars";

export const getBrandsList = async (): Promise<string[]> => {
  const { brands } = await getCarsFilters();
  return brands;
};
