export function getCarDisplayIdFromImg(imgUrl: string): string | null {
  if (!imgUrl?.trim()) return null;
  const match = imgUrl.match(/(\d{4})/);
  return match?.[1] ?? null;
}
