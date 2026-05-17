"use client";

import {
  getFavoriteCarIdsSnapshot,
  getServerFavoriteCarIdsSnapshot,
  subscribeFavoriteCarIds,
} from "@/lib/favorite-cars-storage";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { FaBars, FaHeart, FaTimes } from "react-icons/fa";
import { RentalCarLogo } from "./RentalCarLogo";
import styles from "./Header.module.css";

const links = [
  { href: "/", label: "Home" },
  { href: "/catalog", label: "Catalog" },
] as const;

const MOBILE_NAV_ID = "main-nav-mobile";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
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

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");

    const closeOnDesktop = () => {
      if (media.matches) setMenuOpen(false);
    };

    media.addEventListener("change", closeOnDesktop);
    return () => media.removeEventListener("change", closeOnDesktop);
  }, []);

  const closeMenu = () => setMenuOpen(false);
  const toggleMenu = () => setMenuOpen((open) => !open);

  return (
    <header className={styles.bar}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand} aria-label="RentalCar, home">
          <RentalCarLogo className={styles.logo} />
        </Link>

        <nav className={styles.navDesktop} aria-label="Main navigation">
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

        <button
          type="button"
          className={styles.menuButton}
          aria-expanded={menuOpen}
          aria-controls={MOBILE_NAV_ID}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={toggleMenu}
        >
          {menuOpen ? (
            <FaTimes className={styles.menuIcon} aria-hidden />
          ) : (
            <FaBars className={styles.menuIcon} aria-hidden />
          )}
        </button>
      </div>

      {menuOpen && (
        <button
          type="button"
          className={styles.backdrop}
          aria-label="Close menu"
          onClick={closeMenu}
        />
      )}

      <nav
        id={MOBILE_NAV_ID}
        className={
          menuOpen
            ? `${styles.navPanel} ${styles.navPanelOpen}`
            : styles.navPanel
        }
        aria-label="Main navigation"
        aria-hidden={!menuOpen}
      >
        <div className={styles.navPanelInner}>
          {links.map(({ href, label }) => {
            const active = isActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                className={
                  active
                    ? `${styles.panelLink} ${styles.panelLinkActive}`
                    : styles.panelLink
                }
                aria-current={active ? "page" : undefined}
                onClick={closeMenu}
              >
                {label}
              </Link>
            );
          })}
          <Link
            href="/favorites"
            className={
              favoritesActive
                ? `${styles.panelLink} ${styles.panelFavorites} ${styles.panelLinkActive}`
                : `${styles.panelLink} ${styles.panelFavorites}`
            }
            aria-current={favoritesActive ? "page" : undefined}
            onClick={closeMenu}
          >
            <FaHeart className={styles.panelHeartIcon} aria-hidden />
            <span>Favorites</span>
            {favoriteCount > 0 && (
              <span className={styles.panelBadge}>{favoriteCount}</span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  );
}
