export const FAVORITE_CARS_STORAGE_KEY = "rental-car-favorites";

const listeners = new Set<() => void>();

function parseStoredIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(FAVORITE_CARS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is string => typeof id === "string");
  } catch {
    return [];
  }
}

function emit() {
  for (const cb of listeners) cb();
}

export function getFavoriteCarIdsSnapshot(): string {
  const ids = [...new Set(parseStoredIds())].sort();
  return JSON.stringify(ids);
}

export function getServerFavoriteCarIdsSnapshot(): string {
  return "[]";
}

export function subscribeFavoriteCarIds(onStoreChange: () => void) {
  function onStorage(e: StorageEvent) {
    if (e.key === FAVORITE_CARS_STORAGE_KEY || e.key === null) {
      onStoreChange();
    }
  }
  if (typeof window !== "undefined") {
    window.addEventListener("storage", onStorage);
  }
  listeners.add(onStoreChange);
  return () => {
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", onStorage);
    }
    listeners.delete(onStoreChange);
  };
}

export function writeFavoriteCarIds(ids: Set<string>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      FAVORITE_CARS_STORAGE_KEY,
      JSON.stringify([...ids]),
    );
  } catch {
  }
  emit();
}
