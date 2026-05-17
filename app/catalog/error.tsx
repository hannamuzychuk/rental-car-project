"use client";

import { RouteSegmentError } from "@/components/common/RouteSegmentError";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function CatalogError({ error, reset }: ErrorProps) {
  return (
    <RouteSegmentError
      error={error}
      reset={reset}
      title="Catalog unavailable"
      message="Could not load the catalog. Check your connection and try again."
      secondaryHref="/"
      secondaryLabel="Back to home"
    />
  );
}
