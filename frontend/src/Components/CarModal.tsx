import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { style } from "../styles/styles";
import { Car } from '../interfaces/interfaces';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, {Dayjs} from 'dayjs';

interface carModalProps {
  car: Car | null;
  open: boolean;
  handleClose: () => void;
  handleRent: (carId: number, userEmail: string) => void;
  userEmail: string;
  onDatesChangeStart: (start: Date | null) => void;
  onDatesChangeEnd : (end: Date | null) => void;
}


function CarModal({
  car,
  open,
  handleClose,
  handleRent,
  userEmail,
  onDatesChangeStart,
  onDatesChangeEnd
  }: 
  carModalProps) {
  

   const [startDate, setstartDate] = useState<Dayjs | null>(null);
  const [endDate, setendDate] = useState<Dayjs | null>(null);
 
     const handleStartDateChange = (date: Dayjs | null) =>{
       if(date){
        const nativeDate = date.toDate();
         setstartDate(date)
         console.log(nativeDate)
         onDatesChangeStart(nativeDate)
      }
    }
    const handleEndDateChange = (date: Dayjs | null) =>{
      if(date){
        const nativeDate = date.toDate();
        setendDate(date)
        console.log(nativeDate)
        onDatesChangeEnd(nativeDate)
      }
    }
  
  
    useEffect(()=>{
   
  }, [startDate, endDate])

  return (
    <div>
    <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="delete-confirmation-modal"
        aria-describedby="delete-confirmation-description"
        className="border-2 border-gray-500 rounded-lg"
      >
        <Box sx={{ ...style, width: 600 }} >
          <h1 className="text-center font-bold text-2xl my-5">
            Az autó lefoglalása
          </h1>
          <div className="flex ">

          <div className="p-5 flex flex-col flex-grow">
          <div className="mt-2 space-y-1 flex-grow  text-center">
              <h5 className='font-bold  text-center'>{car?.brand}  {car?.model} {car?.yearOfManufacture}</h5>
              
                  <p className="mb-3 font-normal text-gray-700 ">
                    Rendszám : {car?.licensePlateNumber}
                  </p>
                  <p className="mb-3 font-normal text-gray-700 ">
                    Ár: {car?.price}/nap
                  </p>
                  <p className="mb-3 font-normal text-gray-700 ">
                    Km: {car?.distance}
                  </p>
                 
                  <p className="mb-3 font-normal text-gray-700 ">
                    Ülések: {car?.seats}
                  </p>
                  <p className="mb-3 font-normal text-gray-700 ">
                    Státusz: {(car?.status ==="Available"? "Elérhető": "Nem elérhető")}
                  </p>
                </div>
                <div className='my-5 flex'>
                <DatePicker label="Bérlés kezdésének ideje" value={startDate} onChange={handleStartDateChange}></DatePicker>
                <DatePicker label="Bérlés lejáratának ideje" value={endDate} onChange={handleEndDateChange}></DatePicker> 

                </div>
                </div>
          </div>
          <Box className="flex justify-center mt-5 ">
          <button 
            onClick={() => handleRent(Number(car?.id), userEmail)}
            className="p-2 m-5  text-bold font-medium text-center text-white bg-green-500 rounded-lg hover:bg-green-600 transition-all hover:scale-105">
              Igen
            </button>
            <button onClick={handleClose}
              className="p-2 m-5 text-bold font-medium text-center text-white bg-red-500 rounded-lg hover:bg-red-600 transition-all hover:scale-105">
              Mégse
            </button>
          </Box>
        </Box>
      </Modal>
    </div>
  )
}

export default CarModal