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
    Id: number,
    Name: string
  }
  engine: number;
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

