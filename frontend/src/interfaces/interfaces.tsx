import { jwtDecode, JwtPayload } from "jwt-decode";

export interface CustomJwtPayload extends JwtPayload {
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"?: string;
}


export interface CarData {
  licensePlateNumber: '',
  brand: '',
  model: '',
  yearOfManufacture: 0,
  seats: 0,
  transmission: '',
  distance: 0,
  consumption: 0,
  capacity: 0,
  carCategoryId: 0,
  engine: '',
  price: 0,
}

export interface Car {
  id: number;
  licensePlateNumber: string;
  brand: string;
  model: string;
  yearOfManufacture: number;
  seats: number;
  transmission: string;
  distance: number;
  consumption: number;
  capacity: number;
  carCategoryId: number,
  carCategory:{
    id: number,
    name: string
  }
  engine: string;
  price: number;
  status: string;
}
export interface Rents{
  car: Car;
  id: string;
  rentStatus: string;
  carId: number;
  startDate: string;
  endDate: string;
  email: string;
  addressId: number;
}
export interface CarsProps{
  user: User;
}

export interface User {
  id: string;
  email: string;
  name: string,
  phone_number: number;
  address: {
    postalCode: number,
    street: string;
    city: string;
  };
}

