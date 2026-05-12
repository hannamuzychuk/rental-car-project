import type { BrandsListResponse } from "@/lib/types/brends";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://car-rental-api.goit.global";

function normalizeBrands(data: BrandsListResponse): string[] {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.brands)) return data.brands;
  throw new Error("Unexpected /brands response shape");
}

export const getBrandsList = async (): Promise<string[]> => {
  const response = await fetch(`${BASE_URL}/brands`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`GET /brands failed: ${response.status}`);
  }

  const json = (await response.json()) as BrandsListResponse;
  return normalizeBrands(json);
};
