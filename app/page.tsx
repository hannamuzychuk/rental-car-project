import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Find your rental car with RentalCar. Open the catalog to browse available vehicles and prices.",
};

export default function Home() {
  return (
    <main className={`home-viewport-lock ${styles.wrap}`}>
      <Hero />
    </main>
  );
}
