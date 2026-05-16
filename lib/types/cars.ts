export type CarLocation = {
  country: string;
  city: string;
  address: string;
};

export type Car = {
  id: string;
  year: number;
  brand: string;
  model: string;
  type: string;
  img: string;
  description: string;
  fuelConsumption: string;
  engine: string;
  features: string[];
  rentalPrice: string;
  rentalCompany: string;
  location: CarLocation;
  rentalConditions: string[];
  mileage: number;
};

export type CarsListResponse = {
  cars: Car[];
  totalCars: number;
  page: number;
  totalPages: number;
};

export type CarsFiltersResponse = {
  brands: string[];
  price: {
    min: number;
    max: number;
  };
};
