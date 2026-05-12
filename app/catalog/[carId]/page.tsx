import { notFound } from "next/navigation";
import { getCarById } from "@/lib/api/cars";
import { CarDetailView } from "@/components/car-detail/CarDetailView";

type PageProps = { params: Promise<{ carId: string }> };

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
