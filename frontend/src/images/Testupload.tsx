import React from 'react'
import { useEffect, useState } from 'react';
import { Car } from '../interfaces/interfaces';

const handleFileUpload = async (file: any) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("https://localhost:7175/api/Cars/upload", {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const data = await res.json();
  console.log("Kép URL:", data.imageUrl);
};


function Testupload() {

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
            //console.log(cars.status);
          };
          getCars();
        }, []); 
    
  return (
    <div>testupload


        <input type="file" onChange={handleFileUpload} />


        
      {cars.map((car, index) => (
        <div key={index}
          className="flex flex-col h-full"
        >
          <div className="m-1 border-gray-300 border-2 rounded-lg shadow-light flex flex-col h-full">
            <div className="h-78 overflow-hidden rounded-t-lg">
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
        </div>
      ))}
    </div>
  )
}

export default Testupload