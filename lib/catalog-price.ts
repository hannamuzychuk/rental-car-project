const PRICE_STEP = 10;

export function buildPriceFilterOptions(min: number, max: number): string[] {
  const minN = Number(min);
  const maxN = Number(max);
  if (!Number.isFinite(minN) || !Number.isFinite(maxN) || minN > maxN) {
    return [];
  }

  const options: string[] = [];
  for (let n = minN; n <= maxN; n += PRICE_STEP) {
    options.push(String(n));
  }
  return options;
}
