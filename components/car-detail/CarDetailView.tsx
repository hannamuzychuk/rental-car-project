import type { Car } from "@/lib/types/cars";
import { RentalForm } from "./RentalForm";
import styles from "./CarDetailView.module.css";

export function CarDetailView({ car }: { car: Car }) {
  const title = `${car.brand} ${car.model}`;

  return (
    <main className={styles.main}>
      <img className={styles.hero} src={car.img} alt={title} />

      <div className={styles.content}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.price}>{car.rentalPrice}$ / hour</p>

        <section className={styles.block}>
          <h2>Description</h2>
          <p>{car.description}</p>
        </section>

        <section className={styles.block}>
          <h2>Rental conditions</h2>
          <ul>
            {car.rentalConditions.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </section>

        <RentalForm carId={car.id} />
      </div>
    </main>
  );
}