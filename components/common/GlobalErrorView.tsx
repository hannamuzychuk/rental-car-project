"use client";

import Link from "next/link";
import { useEffect } from "react";
import styles from "./route-state.module.css";

type GlobalErrorViewProps = {
  error?: Error & { digest?: string };
  reset?: () => void;
  title: string;
  message: string;
  secondaryHref: string;
  secondaryLabel: string;
};

export function GlobalErrorView({
  error,
  reset,
  title,
  message,
  secondaryHref,
  secondaryLabel,
}: GlobalErrorViewProps) {
  useEffect(() => {
    if (error) console.error(error);
  }, [error]);

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.errorText}>{message}</p>
      <div className={styles.actions}>
        {reset && (
          <button type="button" className={styles.primary} onClick={reset}>
            Try again
          </button>
        )}
        <Link href={secondaryHref} className={styles.secondary}>
          {secondaryLabel}
        </Link>
      </div>
    </main>
  );
}
