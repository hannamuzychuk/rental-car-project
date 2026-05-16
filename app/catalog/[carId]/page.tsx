import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCarById } from "@/lib/api/cars";
import { CarDetailView } from "@/components/car-detail/CarDetailView";

type PageProps = { params: Promise<{ carId: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { carId } = await params;
  try {
    const car = await getCarById(carId);
    const title = `${car.brand} ${car.model} (${car.year})`;
    const description =
      car.description.length > 160
        ? `${car.description.slice(0, 157)}…`
        : car.description;
    return {
      title,
      description,
      openGraph: {
        title: `${title} | RentalCar`,
        description,
        images: car.img ? [{ url: car.img, alt: title }] : undefined,
      },
    };
  } catch (e) {
    if (e instanceof Error && e.message === "NOT_FOUND") {
      return { title: "Car not found" };
    }
    return { title: "Car details" };
  }
}

export default async function CarDetailPage({ params }: PageProps) {
  const { carId } = await params;

  let car;
  try {
    car = await getCarById(carId);
  } catch (e) {
    if (e instanceof Error && e.message === "NOT_FOUND") notFound();
    throw e;
  }

  return <CarDetailView car={car} />;
}
