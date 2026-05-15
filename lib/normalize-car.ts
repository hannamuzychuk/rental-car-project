import { getCarLocation } from "@/lib/car-location";
import type { Car } from "@/lib/types/cars";

type RawCar = Partial<Car> & {
  id: string;
  address?: string;
  engineSize?: string;
  accessories?: string[];
  functionalities?: string[];
};

export function normalizeCar(raw: RawCar): Car {
  const features =
    raw.features ??
    [...(raw.accessories ?? []), ...(raw.functionalities ?? [])];

  return {
    ...(raw as Car),
    engine: raw.engine ?? raw.engineSize ?? "",
    features,
    location: getCarLocation(raw as Car & { address?: string }),
  };
}
