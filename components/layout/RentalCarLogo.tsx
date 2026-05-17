type RentalCarLogoProps = {
  className?: string;
};

export function RentalCarLogo({ className }: RentalCarLogoProps) {
  return (
    <img
      src="/rental-car-logo.svg"
      alt=""
      width={104}
      height={16}
      className={className}
      decoding="async"
    />
  );
}
