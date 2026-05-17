"use client";

import { GlobalErrorView } from "./GlobalErrorView";

type RouteSegmentErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
  title: string;
  message: string;
  secondaryHref: string;
  secondaryLabel: string;
};

export function RouteSegmentError({
  error,
  reset,
  title,
  message,
  secondaryHref,
  secondaryLabel,
}: RouteSegmentErrorProps) {
  return (
    <GlobalErrorView
      error={error}
      reset={reset}
      title={title}
      message={message}
      secondaryHref={secondaryHref}
      secondaryLabel={secondaryLabel}
    />
  );
}
