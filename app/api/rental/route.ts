import { NextResponse } from "next/server";
import * as yup from "yup";
import { rentalPostBodySchema } from "@/lib/rental-validation";

export async function POST(request: Request) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  let body: yup.InferType<typeof rentalPostBodySchema>;
  try {
    body = await rentalPostBodySchema.validate(raw, {
      abortEarly: false,
      stripUnknown: true,
    });
  } catch (e) {
    if (e instanceof yup.ValidationError) {
      return NextResponse.json(
        { message: e.errors.join(" ") || "Validation failed" },
        { status: 400 },
      );
    }
    throw e;
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
