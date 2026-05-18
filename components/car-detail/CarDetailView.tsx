import type { ReactNode } from "react";
import Image from "next/image";
import { getCarDisplayIdFromImg } from "@/lib/car-image-id";
import {
  formatCarLocationShort,
  getCarLocation,
} from "@/lib/car-location";
import type { Car } from "@/lib/types/cars";
import type { IconType } from "react-icons";
import {
  LuCalendar,
  LuCar,
  LuCircleCheck,
  LuCog,
  LuFuel,
  LuGauge,
  LuMapPin,
} from "react-icons/lu";
import { BackToCatalogLink } from "./BackToCatalogLink";
import { RentalForm } from "./RentalForm";
import styles from "./CarDetailView.module.css";

function groupThousandsWithSpaces(value: number) {
  if (!Number.isFinite(value)) return "";
  return Math.trunc(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function InfoSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className={styles.infoSection}>
      <h2 className={styles.infoSectionTitle}>{title}</h2>
      {children}
    </section>
  );
}

function InfoList({ children }: { children: ReactNode }) {
  return <ul className={styles.infoList}>{children}</ul>;
}

function InfoRow({
  icon: Icon,
  children,
}: {
  icon: IconType;
  children: ReactNode;
}) {
  return (
    <li className={styles.infoRow}>
      <Icon className={styles.infoIcon} aria-hidden />
      <span>{children}</span>
    </li>
  );
}

export function CarDetailView({ car }: { car: Car }) {
  const heading = `${car.brand} ${car.model}, ${car.year}`;
  const mileageLabel = groupThousandsWithSpaces(car.mileage);
  const displayId = getCarDisplayIdFromImg(car.img) ?? car.id;

  const specRows = [
    { icon: LuCalendar, label: "Year", value: String(car.year) },
    {
      icon: LuCar,
      label: "Type",
      value: car.type.charAt(0).toUpperCase() + car.type.slice(1).toLowerCase(),
    },
    { icon: LuFuel, label: "Fuel Consumption", value: car.fuelConsumption },
    { icon: LuCog, label: "Engine Size", value: car.engine },
  ] as const;

  return (
    <main className={styles.main}>
      <BackToCatalogLink className={styles.backToCatalog} />
      <div className={styles.grid}>
        <div className={styles.left}>
          <Image
            className={styles.hero}
            src={car.img}
            alt={heading}
            width={640}
            height={512}
            sizes="(max-width: 1439px) 100vw, 640px"
            priority
          />
          <RentalForm carId={car.id} embedded />
        </div>

        <div className={styles.right}>
          <div className={styles.details}>
            <div className={styles.titleBlock}>
              <div className={styles.titleRow}>
                <h1 className={styles.title}>{heading}</h1>
                <span className={styles.id}>Id: {displayId}</span>
              </div>

              <div className={styles.detailsMeta}>
                <div className={styles.metaRow}>
                  <span className={styles.metaLocation}>
                    <LuMapPin className={styles.metaIcon} aria-hidden />
                    <span>{formatCarLocationShort(getCarLocation(car))}</span>
                  </span>
                  <span className={styles.metaMileage}>
                    <LuGauge className={styles.metaIcon} aria-hidden />
                    <span>Mileage: {mileageLabel} km</span>
                  </span>
                </div>
                <p className={styles.price}>${car.rentalPrice}</p>
              </div>
            </div>

            <p className={styles.description}>{car.description}</p>
          </div>

          <div className={styles.carInfo}>
            <InfoSection title="Rental Conditions:">
              <InfoList>
                {car.rentalConditions.map((item, i) => (
                  <InfoRow key={`${i}-${item}`} icon={LuCircleCheck}>
                    {item}
                  </InfoRow>
                ))}
              </InfoList>
            </InfoSection>

            <InfoSection title="Car Specifications:">
              <InfoList>
                {specRows.map(({ icon, label, value }) => (
                  <InfoRow key={label} icon={icon}>
                    {label}: {value}
                  </InfoRow>
                ))}
              </InfoList>
            </InfoSection>

            {(car.features?.length ?? 0) > 0 && (
              <InfoSection title="Accessories and functionalities:">
                <InfoList>
                  {(car.features ?? []).map((item, i) => (
                    <InfoRow key={`${i}-${item}`} icon={LuCircleCheck}>
                      {item}
                    </InfoRow>
                  ))}
                </InfoList>
              </InfoSection>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
