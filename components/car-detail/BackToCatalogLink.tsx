"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { LuArrowLeft } from "react-icons/lu";
import { isCatalogListHref } from "@/lib/catalog-url";
import listingStyles from "@/components/common/listing-page.module.css";
import styles from "./BackToCatalogLink.module.css";

function subscribe() {
  return () => {};
}

function getCatalogBackHref(): string {
  try {
    const saved = sessionStorage.getItem("catalog-last-path");
    if (saved && isCatalogListHref(saved)) return saved;
  } catch {
  }
  return "/catalog";
}

type BackToCatalogLinkProps = {
  className?: string;
};

export function BackToCatalogLink({ className }: BackToCatalogLinkProps) {
  const href = useSyncExternalStore(
    subscribe,
    getCatalogBackHref,
    () => "/catalog",
  );

  const linkClassName = [
    listingStyles.outlineButton,
    styles.root,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Link href={href} className={linkClassName} scroll={false}>
      <LuArrowLeft className={styles.icon} aria-hidden />
      Back to catalog
    </Link>
  );
}
