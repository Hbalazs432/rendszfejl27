import React, { useEffect, useState } from 'react';
import { Car, User} from '../interfaces/interfaces';
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from '../styles/styles';
import CarModal from './CarModal';
import { toast } from "react-toastify";
import {format} from 'date-fns';



function Cars({user, onRefresh}: {user: User, onRefresh: () => void}) {
  const [cars, setCars] = useState<Car[]>([]);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [modal, setModal] = useState(false);  
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  
 const carCategories = {
    1:	"Személyautó",
    4:	"Sedan",
    5:	"Kombi",
    6:	"Hatchback",
    7:	"SUV",
    8:	"Crossover",
    9:	"Kupé",
    10:	"Cabrio",
    11:	"MPV / Egyterű",
    12:	"Pickup"
 }
  

  useEffect(() => {
    const getCars = async () => {
      const response = await fetch("https://localhost:7175/api/Cars/list-available-cars", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      const cars = await response.json();
      setCars(cars);
      console.log(cars.status);
    };
    getCars();
  }, []); 


  const handleDatesChangeStart = (start: Date | null) => {
    setStartDate(start);
    if(start){
      const formattedDate =  format(start, 'yyyy-MM-dd');
      console.log("Dátumok a szülőben:", formattedDate, start);
    }
  }
  const handleDatesChangeEnd = (end: Date | null) =>{
    setEndDate(end);
    if(end){
      const formattedDate = format(end, 'yyyy-MM-dd')
      console.log("Dátumok a szülőben:", formattedDate, end)
    }
  };

  const handleRent = async (car_id: number, userEmail: string) => {
    console.log(startDate, endDate)
    try {
          if (!startDate || !endDate) {
      toast.error("Hiányzó adat a foglaláshoz.");
      return;
     }
      const response = await fetch('https://localhost:7175/api/Rents', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          CarId: car_id,
          Email: userEmail,
          StartDate: format(startDate, 'yyyy-MM-dd'),
          EndDate: format(endDate, 'yyyy-MM-dd'),
        }),
      });
      if (response.ok) {
        toast.success('Sikeres foglalás');
        onRefresh()
        setModal(false)
      } else {
        console.error('Foglalás sikertelen', await response.text());
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCloseModal = () => {
    setModal(false);
  };

  return (
    <motion.div
      key={cars.length}
      className="grid md:grid-cols-4 gap-5 grid-cols-2"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      viewport={{ once: false, amount: 0.2 }}
    >
      {cars.map((car, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          className="flex flex-col h-full"
        >
          <div className="m-1 border-gray-300 border-2 rounded-lg shadow-light flex flex-col h-full">
            <div className="h-78 overflow-hidden rounded-t-lg">
              {/* <img className="h-full rounded-t-lg" src={car.image_url} /> */}
            </div>

            <div className="p-5 flex flex-col flex-grow">
              <h5 className="text-2xl font-bold line-clamp-1 tracking-tight text-gray-900 ">
                {car.brand} {car.model} {car.yearOfManufacture}
              </h5>
              <div className="mt-2 space-y-1 flex-grow">
                <p className="mb-3 font-normal text-gray-700 ">
                  Rendszám : {car.licensePlateNumber}
                </p>
                <p className="mb-3 font-normal text-gray-700 ">
                  Ár: {car.price}/nap
                </p>

                <p className="mb-3 font-normal text-gray-700 ">
                  Km: {car.distance}
                </p>

                <p className="mb-3 font-normal text-gray-700 ">
                  Fogyasztás: {car.consumption} liter
                  </p>
                <p className="mb-3 font-normal text-gray-700 "> 
                  Űrtartalom: {car.capacity} liter
                </p>
                <p className="mb-3 font-normal text-gray-700 "> 
                  Motor: {car.engine}
                </p>
                <p className="mb-3 font-normal text-gray-700 ">
                  Ülések: {car.seats}
                </p>
                {/* //TODO  Carcategory fix*/}
                <p className="mb-3 font-normal text-gray-700 ">
                  Kategória: {car.carCategoryId} 
                </p>
                <p className="mb-3 font-normal text-gray-700 ">
                  Státusz: {(car.status === "Available" ? "Elérhető" : car.status === "Rented" ? "Nem elérhető" : "Hiba")}
                </p>
              </div>
              <button
                onClick={() => {setSelectedCar(car), setModal(true)}}
                className="w-full my-5 px-3 py-2 text-bold font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-all hover:scale-105"
              >
                Lefoglalás
              </button>
            </div>
          </div>
        </motion.div>
      ))}
      <CarModal onDatesChangeEnd={handleDatesChangeEnd} onDatesChangeStart={handleDatesChangeStart} car={selectedCar} open={modal} handleClose={handleCloseModal} handleRent={handleRent} userEmail={user.email}/>
    </motion.div>
  );
}

export default Cars;
