import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Find your rental car with RentalCar. Open the catalog to browse available vehicles and prices.",
};

export default function Home() {
  return (
    <main>
      <Hero />
    </main>
  );
}
