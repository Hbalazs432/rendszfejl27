export interface Car {
  id: string;
  licensePlateNumber: string;
  brand: string;
  model: string;
  yearOfManufacture: number;
  seats: number;
  transmission: string;
  distance: number;
  consumption: number;
  capacity: number;
  engine: number;
  price: number;
  description: string;
  image_url?: string;
  status: string;
}

export interface CarsProps{
  user: User;
}

export interface User {
  id: string;
  email: string;
  phone_number: number;
  address: {
    country: string;
    street: string;
    city: string;
    state: string;
    zip: number;
  };
}

