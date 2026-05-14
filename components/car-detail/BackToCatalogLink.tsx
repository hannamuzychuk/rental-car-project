"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LuArrowLeft } from "react-icons/lu";
import { isCatalogListHref } from "@/lib/catalog-url";
import styles from "./CarDetailView.module.css";

export function BackToCatalogLink() {
  const [href, setHref] = useState("/catalog");

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("catalog-last-path");
      if (saved && isCatalogListHref(saved)) {
        setHref(saved);
      }
    } catch {
    }
  }, []);

  return (
    <Link
      href={href}
      className={styles.backLink}
      scroll={false}
      suppressHydrationWarning
    >
      <LuArrowLeft className={styles.backIcon} aria-hidden />
      Back to catalog
    </Link>
  );
}
