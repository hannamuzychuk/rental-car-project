export function mileageDigits(value: string): string {
  return value.replace(/\D/g, "").slice(0, 9);
}

export function normalizeMileageDraft(minMileage: string, maxMileage: string): {
  minMileage: string;
  maxMileage: string;
} {
  const min = mileageDigits(minMileage);
  const max = mileageDigits(maxMileage);
  const minIsZero = min === "0";

  if (!min && !max) return { minMileage: "", maxMileage: "" };
  if ((!min || minIsZero) && max) return { minMileage: "", maxMileage: max };
  if (min && !max) return { minMileage: min, maxMileage: "" };

  if (Number(min) > Number(max)) {
    return { minMileage: "", maxMileage: max };
  }

  return { minMileage: min, maxMileage: max };
}

export function normalizeMileageForApi(minMileage: string, maxMileage: string): {
  minMileage?: string;
  maxMileage?: string;
} {
  const min = mileageDigits(minMileage);
  const max = mileageDigits(maxMileage);
  const minIsZero = min === "0";

  if (!min && !max) return {};
  if ((!min || minIsZero) && max) return { minMileage: "0", maxMileage: max };
  if (min && !max) return { minMileage: min };

  if (Number(min) > Number(max)) {
    return { minMileage: "0", maxMileage: max };
  }

  return { minMileage: min, maxMileage: max };
}
