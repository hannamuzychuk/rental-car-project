export type Car = {
    id: string;
    year: number;
    brand: string;
    model: string;
    type: string;
    img: string;
    description: string;
    fuelConsumption: string;
    engineSize: string;
    accessories: string[];
    functionalities: string[];
    rentalPrice: string;
    rentalCompany: string;
    address: string;
    rentalConditions: string[];
    mileage: number;
  };
  
  export type CarsListResponse = {
    cars: Car[];
    totalCars: number;
    page: number;
    totalPages: number;
  };