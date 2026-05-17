"use client";

import { GlobalErrorView } from "@/components/common/GlobalErrorView";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function RootError({ error, reset }: ErrorProps) {
  return (
    <GlobalErrorView
      error={error}
      reset={reset}
      title="Something went wrong"
      message="An unexpected error occurred. Try again or go back to the home page."
      secondaryHref="/"
      secondaryLabel="Back to home"
    />
  );
}
