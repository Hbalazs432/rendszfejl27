import { ReactNode } from "react";

export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  color: string;
  description: string;
  image_url?: string;
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

