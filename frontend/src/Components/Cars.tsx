import React from 'react'
import {Car} from '../interfaces/interfaces'
import { motion } from "framer-motion";
import {useEffect, useState } from 'react';
import {containerVariants, itemVariants} from '../styles/styles'
import CarModal from './CarModal';



function Cars() {
    const [cars, setCars] = useState<Car[]>([])
    const [selectedCar, setselectedCar] = useState<Car | null>(null)
    const [modal, setModal] = useState(false)

    //autók lékérése
    useEffect(() => {
        const getCars = async () =>{
            const response = await fetch("https://localhost:7175/api/Cars",{
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                },
            })
            const cars = await response.json()
            setCars(cars)
            console.log(cars)
        }
        getCars()
    }, [])


    const handleRent = (car_id: Car) =>{
        setselectedCar(car_id)
        setModal(true)
      }
    
      const handleCloseModal = () => {
       setModal(false)
      }
   
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
                    {car.description}
                  </p>
                  <p className="mb-3 font-normal text-gray-700 ">
                    Ülések: {car.seats}
                  </p>
                  <p className="mb-3 font-normal text-gray-700 ">
                    Státusz: {(car.status ==="Available"? "Elérhető": "Nem elérhető")}
                  </p>
                </div>
                <button onClick={ () => handleRent(car)} className="w-full my-5 px-3 py-2 text-bold font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-all hover:scale-105">
                  Lefoglalás
                </button>
              </div>
            </div>
          </motion.div>
        ))}
        <CarModal car={selectedCar} open={modal} handleClose={handleCloseModal} />
      </motion.div>
  )
}

export default Cars