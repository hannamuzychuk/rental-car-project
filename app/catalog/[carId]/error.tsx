"use client";

import { RouteSegmentError } from "@/components/common/RouteSegmentError";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function CarDetailError({ error, reset }: ErrorProps) {
  return (
    <RouteSegmentError
      error={error}
      reset={reset}
      title="Could not load car"
      message="We could not load this vehicle. Check your connection and try again."
      secondaryHref="/catalog"
      secondaryLabel="Back to catalog"
    />
  );
}
