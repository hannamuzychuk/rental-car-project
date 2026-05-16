import type { Metadata } from "next";
import { FavoritesView } from "@/components/favorites/FavoritesView";

export const metadata: Metadata = {
  title: "Favorites",
  description:
    "Cars you have saved as favorites. Open a vehicle to book or remove it from this list.",
};

export default function FavoritesPage() {
  return <FavoritesView />;
}
