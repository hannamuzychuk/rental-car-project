import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Container } from "@/components/layout/Container";
import { Header } from "@/components/layout/Header";
import { getSiteUrl } from "@/lib/site-url";
import { QueryProvider } from "@/providers/QueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "RentalCar — rent a car online",
    template: "%s | RentalCar",
  },
  description:
    "RentalCar: browse our catalog, filter by brand, price, and mileage, view vehicle details, and submit a booking request.",
  applicationName: "RentalCar",
  keywords: ["car rental", "rent a car", "vehicle catalog", "RentalCar"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "RentalCar",
    title: "RentalCar — rent a car online",
    description:
      "Browse rental cars, compare options, and book your ride through our web app.",
  },
  twitter: {
    card: "summary_large_image",
    title: "RentalCar — rent a car online",
    description:
      "Browse rental cars, compare options, and book your ride through our web app.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <Header />
          <Container>{children}</Container>
        </QueryProvider>
      </body>
    </html>
  );
}
