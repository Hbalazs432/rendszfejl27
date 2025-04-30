import React, { useEffect, useState } from 'react';
import { Car, User, CarsProps } from '../interfaces/interfaces';
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from '../styles/styles';
import CarModal from './CarModal';
import { toast } from "react-toastify";



function Cars({user}: CarsProps) {
  const [cars, setCars] = useState<Car[]>([]);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [modal, setModal] = useState(false);

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
      console.log(cars);
    };
    getCars();
  }, []);

  const handleRent = async (car_id: number, userEmail: string) => {
    // console.log(selectedCar)
    try {
      const response = await fetch('https://localhost:7175/api/Rents', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          CarId: car_id,
          Email: userEmail,
          StartDate: "2025-12-12",
          EndDate: "2025-12-13",
        }),
      });
      if (response.ok) {
        toast.success('Sikeres foglalás');
        setModal(false)
        console.log("lefoglalt auto", selectedCar)
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
                  Ülések: {car.seats}
                </p>
                <p className="mb-3 font-normal text-gray-700 ">
                  Státusz: {(car.status === "Available" ? "Elérhető" : "Nem elérhető")}
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
      <CarModal car={selectedCar} open={modal} handleClose={handleCloseModal} handleRent={handleRent} userEmail={user.email}/>
    </motion.div>
  );
}

export default Cars;
