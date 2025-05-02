import React, { useState, useEffect } from 'react'
import { motion } from "framer-motion";
import { Car, User, CarsProps } from '../interfaces/interfaces';
import { containerVariants, itemVariants } from '../styles/styles';
import AdminCarModal from './AdminCarModal';
import { toast } from "react-toastify";




//TODO törlésnél is frissuljon
function AdminCars({ refreshKey }: { refreshKey: number }) {
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
  }, [refreshKey]); 

const handleCloseModal = () => {
    setModal(false);
  };

  return (
    <div>
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
                Váltó: {car.transmission === "Manual" ? "Manuális" : "Automata"}
                </p>
                <p className="mb-3 font-normal text-gray-700 ">
                  Fogyasztás: {car.consumption}
                </p>
                <p className="mb-3 font-normal text-gray-700 ">
                  Férőhelyek: {car.capacity}
                </p>
                <p className="mb-3 font-normal text-gray-700 ">
                  Kategória: {car.carCategoryId}
                </p>
                <p className="mb-3 font-normal text-gray-700 ">
                  Motor: {car.engine === "Electric" ? "Elektromos" : "Diesel"}
                </p>
                <p className="mb-3 font-normal text-gray-700 ">
                  Státusz: {(car.status === "Available" ? "Elérhető" : "Nem elérhető")}
                </p>
              </div>
              <div className='flex gap-2'>
                <button
                  onClick={() => {setSelectedCar(car)}}
                  className="w-full my-5 px-3 py-2 text-bold font-medium text-center text-white bg-green-700 rounded-lg hover:bg-green-800 transition-all hover:scale-105"
                >
                  Módosítás
                </button>
                <button
                  onClick={() => {setSelectedCar(car), setModal(true)}}
                  className="w-full my-5 px-3 py-2 text-bold font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 transition-all hover:scale-105"
                >
                  Törlés
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
    <AdminCarModal deleteCar={selectedCar} open={modal} handleClose={handleCloseModal}/>
    </div>
  )
}

export default AdminCars