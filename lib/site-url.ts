const LOCAL_SITE_URL = "http://localhost:3000";

export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) {
    return explicit.replace(/\/$/, "");
  }

  const vercelHost = process.env.VERCEL_URL?.trim();
  if (vercelHost) {
    return `https://${vercelHost}`;
  }

  return LOCAL_SITE_URL;
}
