import { NextResponse } from "next/server";

type RentalBody = {
  carId: string;
  name: string;
  email: string;
  bookingDate: string;
  comment: string;
};

export async function POST(request: Request) {
  let body: RentalBody;
  try {
    body = (await request.json()) as RentalBody;
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  if (!body.carId?.trim() || !body.name?.trim() || !body.email?.trim()) {
    return NextResponse.json(
      { message: "carId, name and email are required" },
      { status: 400 },
    );
  }

  const upstream = process.env.RENTAL_UPSTREAM_URL?.trim();
  if (upstream) {
    const res = await fetch(upstream, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    return new NextResponse(text, {
      status: res.status,
      headers: {
        "Content-Type":
          res.headers.get("Content-Type") ?? "application/json; charset=utf-8",
      },
    });
  }

  return NextResponse.json({ ok: true, message: "Booking request received" });
}
