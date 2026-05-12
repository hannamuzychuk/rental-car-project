import type { Car } from "@/lib/types/cars";
import {
  LuCalendar,
  LuCar,
  LuCircleCheck,
  LuCog,
  LuFuel,
  LuMapPin,
} from "react-icons/lu";
import { RentalForm } from "./RentalForm";
import styles from "./CarDetailView.module.css";

function groupThousandsWithSpaces(value: number) {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function CheckList({ items }: { items: string[] }) {
  return (
    <ul className={styles.checkList}>
      {items.map((item, i) => (
        <li key={`${i}-${item}`}>
          <LuCircleCheck className={styles.checkIcon} aria-hidden />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function CarDetailView({ car }: { car: Car }) {
  const heading = `${car.brand} ${car.model}, ${car.year}`;
  const mileageLabel = groupThousandsWithSpaces(car.mileage);

  const accessoriesAndFeatures = [...car.accessories, ...car.functionalities];

  const specRows = [
    { icon: LuCalendar, label: "Year", value: String(car.year) },
    { icon: LuCar, label: "Type", value: car.type },
    { icon: LuFuel, label: "Fuel Consumption", value: car.fuelConsumption },
    { icon: LuCog, label: "Engine Size", value: car.engineSize },
  ] as const;

  return (
    <main className={styles.main}>
      <div className={styles.grid}>
        <div className={styles.left}>
          <img className={styles.hero} src={car.img} alt={heading} />
          <RentalForm carId={car.id} embedded />
        </div>

        <div className={styles.right}>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>{heading}</h1>
            <span className={styles.id}>id: {car.id}</span>
          </div>

          <div className={styles.meta}>
            <LuMapPin className={styles.metaIcon} aria-hidden />
            <span>{car.address}</span>
            <span className={styles.metaDot} aria-hidden />
            <span>Mileage: {mileageLabel} km</span>
          </div>

          <p className={styles.price}>{car.rentalPrice}$</p>

          <p className={styles.description}>{car.description}</p>

          <section className={styles.block}>
            <h2 className={styles.blockTitle}>Rental Conditions:</h2>
            <CheckList items={car.rentalConditions} />
          </section>

          <section className={styles.block}>
            <h2 className={styles.blockTitle}>Car Specifications:</h2>
            <ul className={styles.specList}>
              {specRows.map(({ icon: Icon, label, value }) => (
                <li key={label} className={styles.specRow}>
                  <Icon className={styles.specIcon} aria-hidden />
                  <span className={styles.specLabel}>{label}:</span>
                  <span className={styles.specValue}>{value}</span>
                </li>
              ))}
            </ul>
          </section>

          {accessoriesAndFeatures.length > 0 && (
            <section className={styles.block}>
              <h2 className={styles.blockTitle}>
                Accessories and functionalities:
              </h2>
              <CheckList items={accessoriesAndFeatures} />
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
