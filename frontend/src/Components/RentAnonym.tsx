import React, { useState, useEffect } from 'react'
import Cars from './Cars';
import { format } from 'date-fns';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { toast } from 'react-toastify';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { style, scrollModal } from "../styles/styles";
import { Car } from '../interfaces/interfaces';
import { carCategories } from '../utils/carCategories';

function RentAnonym() {
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [modal, setModal] = useState(false)
  const [cars, setCars] = useState<Car[]>([]);
  const [openRentCar, setOpenRentCar] = useState(false)
  const [selectedCar, setSelectedCar] = useState<number>(0)
  const [email, setEmail] = useState("")
 
  


  

  const handleStartDateChange = (start: Dayjs | null) => {
    setStartDate(start);
    if(start){
      const formattedDate =  start.format('YYYY-MM-DD');
      console.log("Dátumok a szülőben:", formattedDate, start);
    }
  }
  const handleEndDateChange = (end: Dayjs | null) =>{
    setEndDate(end);
    if(end){
      const formattedDate = end.format('YYYY-MM-DD')
      console.log("Dátumok a szülőben:", formattedDate, end)
    }
  };
 
  const handleCloseModal = () => {
    setModal(false);
  };

  //autok lekerese
  useEffect(() => {
    const getCars = async () => {
      const response = await fetch("https://localhost:7175/api/Cars/list-available-cars", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const cars = await response.json();
      setCars(cars);
      console.log(cars);
    };
    getCars();
  }, []);
  
  

// idot valasszon
 const handleRentAnonym = async () => {
    try{
        if(!startDate != null && endDate != null)
           setModal(true)    
        else
           toast.error("Válaszd ki a dátumokat")
    }catch(error)
    {console.log(error)}
}
//auto kivalasztasa
const handleRentCar = async (carId : number) =>{
  setOpenRentCar(true)
  setSelectedCar(carId)
}


//vegso rent
const handleFinalRent = async () =>{ 
  try{
  const response = await fetch(`https://localhost:7175/api/Rents/anonym`,{
    method: 'POST',
    headers: {
          "Content-Type": "application/json",
        },  
        body: JSON.stringify({
          carId: selectedCar, 
          email: email, 
          startDate: startDate?.format("YYYY-MM-DD"), 
          endDate: startDate?.format("YYYY-MM-DD")
      })
    })
      const data = await response.json()
  console.log(data)
  if(response.ok)
  {
    toast.success("Sikeres lefoglalás")
    setEmail('')
    setSelectedCar(0)
    handleCloseModal()
    setOpenRentCar(false)
  }
  }catch(error)
  {console.log(error)}
}

  return (
    <div>
     <div className="relative h-96">
  
  <div className="absolute inset-0 bg-[url('images/renting.jpg')] bg-no-repeat bg-center bg-cover" />

 
  <div className="absolute inset-0 bg-black opacity-50" />


  <div className="absolute inset-0 flex justify-center items-center z-10">
    <div className="bg-white w-3/4 p-10 rounded-lg shadow-lg">
      <div className="flex justify-center text-center font-bold text-lg mb-5">
        <h1>Kölcsönzés bejelentkezés nélkül</h1>
      </div>
      <div className="flex justify-center text-center space-x-7">
        <DatePicker
          label="Bérlés kezdésének ideje"
          value={startDate}
          onChange={handleStartDateChange}
        />
        <DatePicker
          label="Bérlés lejáratának ideje"
          value={endDate}
          onChange={handleEndDateChange}
        />
        <button
          className="bg-green-500 text-white font-bold rounded-lg p-2"
          onClick={handleRentAnonym}
        >
          Kölcsönzés
        </button>
      </div>
    </div>
  </div>
</div>


        <Modal
        open={modal}
        onClose={handleCloseModal}
        aria-labelledby="delete-confirmation-modal"
        aria-describedby="delete-confirmation-description"
        className="border-2 border-gray-500 rounded-lg"
      >
         <Box sx={scrollModal} >
            <div className='flex justify-around m-5 gap-5'>
            <DatePicker label="Bérlés kezdésének ideje" minDate={dayjs()} value={startDate} onChange={handleStartDateChange}></DatePicker>
            <DatePicker label="Bérlés lejáratának ideje" value={endDate} onChange={handleEndDateChange}></DatePicker> 
            </div>
           <h1 className='font-bold text-center text-lg mb-2 bg-blue-500 rounded-lg p-2 text-white'>Kölcsönözhető autók</h1>
           <div className='overflow-y-auto max-h-[60vh] space-y-4 justify-center text-center'>
            {cars.map((car, index) =>(
                <div key={index} className="border-2 rounded-lg border-gray-300 p-2">
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
                    Kategória: {car.carCategoryId && carCategories[car.carCategoryId] 
                        ? carCategories[car.carCategoryId] 
                        : "Ismeretlen"}
                    </p> 
                    <p className="mb-3 font-normal text-gray-700 ">
                    Státusz: {(car.status === "Available" ? "Elérhető" : car.status === "Rented" ? "Nem elérhető" : "Hiba")}
                    </p>
                    <button
                    onClick={() => handleRentCar(car.id)}
                  className="w-1/2 my-5 px-3 py-2 text-bold font-medium text-center text-white bg-green-700 rounded-lg hover:bg-green-800 transition-all hover:scale-105"
                >
                  Lefoglalás
                </button>
                </div>
                </div>
            ))}
            </div>
        </Box>
        </Modal>


        <Modal
        open={openRentCar}
        onClose={() => setOpenRentCar(false)}
        aria-labelledby="delete-confirmation-modal"
        aria-describedby="delete-confirmation-description"
        className="border-2 border-gray-500 rounded-lg"
      >
        <Box  sx={{ ...style, width: 500 }}>
          <div className='flex flex-col justify-center items-center'>

              <h1 className='font-bold'>Adja meg az adatait</h1>
                <input
                  name="email"
                  type='Email'
                  className="w-1/2 border m-2 bg-gray-300 rounded-md px-2 py-1"
                  placeholder="Email cím"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  name="start"
                  type='date'
                  value={startDate?.format("YYYY-MM-DD")}
                  className="w-1/2 border m-2 bg-gray-300 rounded-md px-2 py-1"
                />
                <input
                  name="end"
                  type='date'                  
                  value={endDate?.format("YYYY-MM-DD")}
                  className="w-1/2 border m-2 bg-gray-300 rounded-md px-2 py-1"
                  placeholder="year"
                />
                <button
                onClick={() => handleFinalRent()}
                className="w-1/2 my-5 px-3 py-2 text-bold font-medium text-center text-white bg-green-700 rounded-lg hover:bg-green-800 transition-all hover:scale-105"
                >Lefoglalás
                </button>
          </div>
        </Box>
      </Modal>
  </div>
  )
}

export default RentAnonym