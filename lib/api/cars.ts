import { normalizeMileageForApi } from "@/lib/catalog-mileage";
import { normalizeCar } from "@/lib/normalize-car";
import type {
  Car,
  CarsFiltersResponse,
  CarsListResponse,
} from "@/lib/types/cars";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://car-rental-api.goit.study";

export type CarsListParams = {
  page: number;
  perPage: number;
  brand?: string;
  price?: string;
  minMileage?: string;
  maxMileage?: string;
};

function getCarsSearchParams(params: CarsListParams): URLSearchParams {
  const search = new URLSearchParams();
  search.set("page", String(params.page));
  search.set("perPage", String(params.perPage));

  const brand = params.brand?.trim();
  if (brand) search.set("brand", brand);

  const price = params.price?.trim();
  if (price) search.set("price", price);

  const mileage = normalizeMileageForApi(
    params.minMileage ?? "",
    params.maxMileage ?? "",
  );
  if (mileage.minMileage) search.set("minMileage", mileage.minMileage);
  if (mileage.maxMileage) search.set("maxMileage", mileage.maxMileage);

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

  const data = (await response.json()) as CarsListResponse;
  return {
    ...data,
    cars: data.cars.map((car) => normalizeCar(car)),
    page: Number(data.page),
    totalPages: Number(data.totalPages),
    totalCars: Number(data.totalCars),
  };
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

  const raw = (await response.json()) as Car;
  return normalizeCar(raw);
};

export const getCarsFilters = async (): Promise<CarsFiltersResponse> => {
  const response = await fetch(`${BASE_URL}/cars/filters`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`GET /cars/filters failed: ${response.status}`);
  }

  return response.json() as Promise<CarsFiltersResponse>;
};

export type BookingRequestPayload = {
  name: string;
  email: string;
  comment?: string;
};

export type BookingRequestResponse = {
  message: string;
};

export async function createBookingRequest(
  carId: string,
  payload: BookingRequestPayload,
): Promise<BookingRequestResponse> {
  const response = await fetch(
    `${BASE_URL}/cars/${encodeURIComponent(carId)}/booking-requests`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: payload.name,
        email: payload.email,
        comment: payload.comment ?? "",
      }),
    },
  );

  const text = await response.text();
  let data: BookingRequestResponse | { message?: string } = { message: text };

  try {
    data = JSON.parse(text) as BookingRequestResponse;
  } catch {
  }

  if (!response.ok) {
    const message =
      typeof data.message === "string" && data.message
        ? data.message
        : text || `POST /cars/${carId}/booking-requests failed: ${response.status}`;
    throw new Error(message);
  }

  if (typeof data.message !== "string" || !data.message) {
    return { message: "Booking submitted successfully." };
  }

  return { message: data.message };
}
