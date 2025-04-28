import React from "react";
import {FormEvent, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import  TextField  from "@mui/material/TextField";
import { toast } from "react-toastify";
import {containerVariants, itemVariants, style} from '../styles/styles'
import {Car} from '../interfaces/interfaces'
import { useNavigate } from "react-router-dom";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faArrowRightFromBracket} from '@fortawesome/free-solid-svg-icons'

function Admin() {


  const [open, setOpen] = useState(false);
  const [openCarModal, setopenCarModal] = useState(false)
  const [selectedId, setselectedId] = useState<string | null>(null);
  const handleOpen = () =>setOpen(true);
  const handleClose = () => setOpen(false);
  const [cars, setCars] = useState<Car[]>([]);
//   const initialCarState: Car = {
//     id: "",
//     brand: "",
//     model: "",
//     price: 0,
//     mileage: 0,
//     color: "",
//     description: "",
//     image_url: "",
//   };
//   const [formData, setFormData] = useState<Car>(initialCarState);
   const navigate = useNavigate()


//  useEffect(() => {
//  const getCars = async () => {
//       const response = await fetch(`http://localhost:5001/cars`, {
//         method: "GET",
//         headers: { "Content-Type": "application/json" },
//       });
//       const cars = await response.json();
//       console.log(cars)
//       setCars(cars);
//     };
//     getCars();
//   }, []);


//   const handleDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
  
//     if (name === "year" || name === "price" || name === "mileage") {
//       const parsedValue = value === "" ? 0 : parseFloat(value); 
//       setFormData((prev) => ({
//         ...prev,
//         [name]: parsedValue,
//       }));
//     } else {
//       setFormData((prev) => ({
//         ...prev,
//         [name]: value,
//       }));
//     }
//   };

//   const handleUpload = async (e: FormEvent<HTMLElement>) => {
//     e.preventDefault();
//     const data = {
//       brand: formData.brand,
//       model: formData.model,
//       year: formData.year,
//       price: formData.price,
//       mileage: formData.mileage, 
//       color: formData.color,
//       description: formData.description,
//       image_url: `testserver/carPictures/${formData.image_url}`, // Ha nincs feltöltött kép, akkor üres
//     };
//     console.log(data);
//     try{
//      const response = await fetch("http://localhost:5001/cars", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(data),
//     })
//     const newCar = await response.json();
//     setCars((prevCars) => [...prevCars, newCar])
//     setFormData(initialCarState)
//     toast.success("Megtörtént a hozzáadás")
    
//   }catch (error) {
//     console.log("Hiba történt", error);
//     toast.error("Hiba a művelet során")
//   }
// }

// const handleDeleteModal = (id: string) => {
//   setopenCarModal(true)
//   setselectedId(id)
// }

// const handleCloseModal = () => {
//   setopenCarModal(false)
//   setselectedId(null)
// }


// const handleRemove = async () => {
//   if(! selectedId) return;
//    const newCarList = cars.filter((item) => item.id !== selectedId)

//       try{
//         const response = await fetch(`http://localhost:5001/cars/${selectedId}`,{
//           method: "DELETE",
//           headers: {"Content-Type": "application/json"}
//         })
//         if (response.ok) {
//           console.log(`Törölve lett ez az idjű autó: ${selectedId}.`);
//           setCars(newCarList);
//         } else {
//           console.log("Hiba történt a törlés közben.");
//         }
//       }catch(error){
//         console.log(error);
//       }
//       setopenCarModal(false);
//       setselectedId(null);
//   }


    const  handleLogout = () =>{
      navigate('/')
      localStorage.clear()
      toast.success("Sikeres kiejelentkezés")
    }


  return (

    <div>hello

<button className="text-sm bg-blue-500 rounded-lg  p-5" onClick={handleLogout}>
          <FontAwesomeIcon icon={faArrowRightFromBracket} />
          </button>   
    </div>
//     <div>
//       <Modal
//         open={openCarModal}
//         onClose={handleCloseModal}
//         aria-labelledby="delete-confirmation-modal"
//         aria-describedby="delete-confirmation-description"
//         className="border-2 border-gray-500 rounded-lg"
//       >
//         <Box sx={{ ...style, width: 400 }} >
//           <h1 className="text-center font-bold text-2xl">
//             Biztosan törölni akarod ezt az autót?
//           </h1>
//           <Box className="flex justify-center mt-5 ">
//           <button 
//             onClick={handleRemove}
//             className="p-2 m-5  text-bold font-medium text-center text-white bg-green-500 rounded-lg hover:bg-green-600 transition-all hover:scale-105">
//               Igen
//             </button>
//             <button onClick={handleCloseModal}
//               className="p-2 m-5 text-bold font-medium text-center text-white bg-red-500 rounded-lg hover:bg-red-600 transition-all hover:scale-105">
//               Mégse
//             </button>
//           </Box>
//         </Box>
//       </Modal>
    


//       <div className="text-center font-bold text-3xl text-white m-5 justify-center items-center flex flex-row">   
             
//         <motion.div
//           initial={{ scale: 0 }}
//           animate={{ scale: 1, transition: { duration: 0.5 } }}
//           className="bg-blue-500 p-3  rounded-lg w-fit mx-auto shadow-light"
//         >
//           Hello Admin
//         </motion.div>
//       </div>
//       <div className="flex justify-center text-center">
//         <button type="submit" onClick={handleOpen}className=" w-96 m-10 text-white bg-blue-700 hover:bg-blue-800 transition-all hover:scale-105 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm  mb-5 px-5 py-2.5 text-center">Autó hozzáadása</button>
//       </div>
//        <Modal
//         aria-labelledby="transition-modal-title"
//         aria-describedby="transition-modal-description"
//         open={open}
//         onClose={handleClose}
//         closeAfterTransition
//         slots={{ backdrop: Backdrop }}
//         slotProps={{
//           backdrop: {
//             timeout: 500,
//           },
//         }}
//       >
//       <Fade in={open}>
//           <Box sx={style} className="bg-slate-400 rounded-lg text-center">
//             <form onSubmit={handleUpload}>
//             <h1 className="text-center font-bold  border-gray-500 rounded-lg">Autó hozzáadása a rendszerbe</h1>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-5">
//            <TextField id="outlined-basic" label="Brand" variant="outlined" name="brand" value={formData.brand} onChange={handleDataChange}/> 
//             <TextField id="outlined-basic" label="Model" variant="outlined" name="model" value={formData.model} onChange={handleDataChange}/>
//             <TextField id="outlined-basic" label="Year" variant="outlined" name= "year" type="number" value={formData.year} onChange={handleDataChange}/>
//             <TextField id="outlined-basic" label="Price" variant="outlined" name="price" type="number" value={formData.price} onChange={handleDataChange}/>
//             <TextField id="outlined-basic" label="Mileage" variant="outlined" name="mileage" type="number" value={formData.mileage} onChange={handleDataChange}/>
//             <TextField id="outlined-basic" label="Color" variant="outlined" name="color" value={formData.color} onChange={handleDataChange}/>          
//             <TextField id="outlined-basic" label="Description" variant="outlined"  name="description" value={formData.description} onChange={handleDataChange}/>
//             <label id="outlined-basic"className="text-gray-500 px-4 py-2 rounded corsor-pointer flex items-center justify-center hover:bg-blue-300 ">
//               Kép kiválasztása
//             <input type="file" accept="image/*" name="imageurl"   className="hidden"/>
//             </label>
//             </div>

//           <button type="submit" className=" m-10 text-white bg-blue-700 hover:bg-blue-800 transition-all hover:scale-105 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm  mb-5 px-5 py-2.5 text-center">Feltöltés</button>
//             </form>
//           </Box>
//         </Fade>
//       </Modal>


//          <motion.ul
//         className="grid md:grid-cols-4 gap-5 grid-cols-2"
//         variants={container}
//         initial="hidden"
//         animate="visible"

//       >
//         {cars.map((car, index) => (
//           <motion.li
//             key={index}
//             variants={itemTo}
//             className="flex flex-col h-full"
//           >
//             <div className="m-1 border-gray-300 border-2 rounded-lg shadow-light flex flex-col h-full">
//               <div className="h-78 overflow-hidden rounded-t-lg">
//                 <img className="h-full rounded-t-lg" src={car.image_url} />
//               </div>

//               <div className="p-5 flex flex-col flex-grow">
//                 <h5 className="text-2xl font-bold line-clamp-1 tracking-tight text-gray-900 ">
//                   {car.brand} {car.model} {car.year}
//                 </h5>
//                 <div className="mt-2 space-y-1 flex-grow">
//                   <p className="mb-3 font-normal text-gray-700 ">
//                     Szín : {car.color}
//                   </p>
//                   <p className="mb-3 font-normal text-gray-700 ">
//                     Ár: {car.price}/nap
//                   </p>
//                   <p className="mb-3 font-normal text-gray-700 ">
//                     Km: {car.mileage}
//                   </p>
//                   <p className="mb-3 font-normal text-gray-700 ">
//                     {car.description}
//                   </p>
//                 </div>
//                 <div className="flex gap-5">
//                   <button  className="w-full my-5 px-3 py-2 text-bold font-medium text-center text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-all hover:scale-105">Módosítás</button>
//                   <button onClick={() => handleDeleteModal(car.id)} className="w-full my-5 px-3 py-2 text-bold font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 transition-all hover:scale-105">Törlés</button>
//                 </div>
//               </div>
//             </div>
//           </motion.li>
//         ))}
//       </motion.ul>

//    </div>
  );
  }

export default Admin;
