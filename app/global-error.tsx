"use client";

import { GlobalErrorView } from "@/components/common/GlobalErrorView";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: '"Manrope", "Inter", sans-serif',
        }}
      >
        <GlobalErrorView
          error={error}
          reset={reset}
          title="Something went wrong"
          message="The app ran into an unexpected error. Try again or go back to the home page."
          secondaryHref="/"
          secondaryLabel="Back to home"
        />
      </body>
    </html>
  );
}
