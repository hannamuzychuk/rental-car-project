import type { Car, CarLocation } from "@/lib/types/cars";

type CarWithLegacyFields = Car & {
  address?: string;
};

function parseAddressCityCountry(address: string): Pick<CarLocation, "city" | "country"> {
  const parts = address
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length === 0) return { city: "", country: "" };
  if (parts.length === 1) return { city: parts[0], country: "" };
  if (parts.length === 2) return { city: parts[0], country: parts[1] };
  return {
    city: parts[parts.length - 2] ?? "",
    country: parts[parts.length - 1] ?? "",
  };
}

export function getCarLocation(car: CarWithLegacyFields): CarLocation {
  if (car.location) {
    return {
      address: car.location.address ?? "",
      city: car.location.city ?? "",
      country: car.location.country ?? "",
    };
  }

  if (typeof car.address === "string" && car.address.trim()) {
    const address = car.address.trim();
    const { city, country } = parseAddressCityCountry(address);
    return { address, city, country };
  }

  return { address: "", city: "", country: "" };
}

export function formatCarLocationLine(location: CarLocation): string {
  return [location.address, location.city, location.country]
    .filter(Boolean)
    .join(", ");
}

export function formatCarLocationShort(location: CarLocation): string {
  const city = location.city?.trim() ?? "";
  const country = location.country?.trim() ?? "";
  if (city && country) return `${city}, ${country}`;
  if (city) return city;
  if (country) return country;
  return formatCarLocationLine(location);
}
