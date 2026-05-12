import type { Car, CarsListResponse } from "@/lib/types/cars";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://car-rental-api.goit.global";

export type CarsListParams = {
  page: number;
  limit: number;
  brand?: string;
  rentalPrice?: string;
  minMileage?: string;
  maxMileage?: string;
};

function getCarsSearchParams(params: CarsListParams): URLSearchParams {
  const search = new URLSearchParams();
  search.set("page", String(params.page));
  search.set("limit", String(params.limit));

  const brand = params.brand?.trim();
  if (brand) search.set("brand", brand);

  const rentalPrice = params.rentalPrice?.trim();
  if (rentalPrice) search.set("rentalPrice", rentalPrice);

  const minMileage = params.minMileage?.trim();
  if (minMileage) search.set("minMileage", minMileage);

  const maxMileage = params.maxMileage?.trim();
  if (maxMileage) search.set("maxMileage", maxMileage);

  return search;
}

export const getCarsList = async (
  params: CarsListParams,
): Promise<CarsListResponse> => {
  const query = getCarsSearchParams(params).toString();
  const response = await fetch(`${BASE_URL}/cars?${query}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`GET /cars failed: ${response.status}`);
  }

  return response.json() as Promise<CarsListResponse>;
};

export const getCarById = async (id: string): Promise<Car> => {
  const response = await fetch(
    `${BASE_URL}/cars/${encodeURIComponent(id)}`,
    {
      cache: "no-store",
    },
  );

  if (response.status === 404) {
    throw new Error("NOT_FOUND");
  }

  if (!response.ok) {
    throw new Error(`GET /cars/${id} failed: ${response.status}`);
  }

  return response.json() as Promise<Car>;
};