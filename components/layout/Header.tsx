"use client";

import {
  getFavoriteCarIdsSnapshot,
  getServerFavoriteCarIdsSnapshot,
  subscribeFavoriteCarIds,
} from "@/lib/favorite-cars-storage";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useSyncExternalStore } from "react";
import { FaHeart } from "react-icons/fa";
import styles from "./Header.module.css";

const links = [
  { href: "/", label: "Home" },
  { href: "/catalog", label: "Catalog" },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const favoritesActive = isActive(pathname, "/favorites");

  const favoritesSnapshot = useSyncExternalStore(
    subscribeFavoriteCarIds,
    getFavoriteCarIdsSnapshot,
    getServerFavoriteCarIdsSnapshot,
  );
  const favoriteCount = useMemo(() => {
    const ids = JSON.parse(favoritesSnapshot) as string[];
    return ids.length;
  }, [favoritesSnapshot]);

  const favoritesLabel =
    favoriteCount > 0
      ? `Favorites, ${favoriteCount} saved`
      : "Favorites";

  return (
    <header className={styles.bar}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand}>
          <span className={styles.brandRental}>Rental</span>
          <span className={styles.brandCar}>Car</span>
        </Link>
        <nav className={styles.nav} aria-label="Main navigation">
          {links.map(({ href, label }) => {
            const active = isActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                className={
                  active
                    ? `${styles.link} ${styles.linkActive}`
                    : styles.link
                }
                aria-current={active ? "page" : undefined}
              >
                {label}
              </Link>
            );
          })}
          <Link
            href="/favorites"
            className={
              favoritesActive
                ? `${styles.favorites} ${styles.favoritesActive}`
                : styles.favorites
            }
            aria-current={favoritesActive ? "page" : undefined}
            aria-label={favoritesLabel}
          >
            <FaHeart className={styles.heartIcon} aria-hidden />
            {favoriteCount > 0 && (
              <span className={styles.favoritesBadge} aria-hidden>
                {favoriteCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
