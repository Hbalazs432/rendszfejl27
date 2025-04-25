import React from "react";
import {useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Dayjs } from "dayjs";
// import {containerVariants, itemVariants, style} from '../styles/styles'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faArrowRightFromBracket} from '@fortawesome/free-solid-svg-icons'
import {Car} from '../interfaces/interfaces'
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import {jwtDecode} from "jwt-decode";
import Cars from "./Cars";


function User() {
  const [user, setUser] = useState<any>({
    name: '',
    phone: '',
    address: { street: '', city: '', postalCode: '' }
  });
  const [editing, setEditing] = useState(false);
  const [tempData, setTempData] = useState(user.address);
  const [cars, setCars] = useState<Car[]>([]);
  const [startDate, setstartDate] = useState<Dayjs | null>(null);
  const [endDate, setendDate] = useState<Dayjs | null>(null);
  const [modal, setModal] = useState(false)
  const [selectedCar, setselectedCar] = useState<Car | null>(null)
  




// adatlekérés bejelentkezés után
  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      console.log("Nincs token, kérlek jelentkezz be.");
      return;
    }
    try {
        const decoded = jwtDecode<any>(token);
        const userId = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
        const loadUserData = async () => {
        const response = await fetch(
          `https://localhost:7175/api/Users/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const userData = await response.json();
        setUser(userData);
        setTempData(userData);
        console.log(userData)
        }
        loadUserData();
      } catch (error) {
        console.error("Hiba történt a felhasználó adatainak betöltésekor:", error);
      }
    }, []);

   
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
    
      // ha address propertyről van szó
      if (["postalCode", "street", "city"].includes(name)) {
        setTempData((prev: any) => ({
          ...prev,
          address: {
            ...prev.address,
            [name]: value,
          },
        }));
      } else {
        setTempData((prev: any) => ({
          ...prev,
          [name]: value,
        }));
      }
    };

  // const handleDateChange = (newDate: Dayjs | null) => {
  //   setstartDate(newDate);
  //   setendDate(newDate);
  //   const formatDatum = (date: Dayjs | null): string => {
  //     return date ? date.format("YYYY-MMMM-DD") : "";
  //   };
  //   console.log("start", formatDatum(newDate));
  // };

  const handleSave = async () => {
    //csere majd a kellőre
    try {
      const response = await fetch(
        `https://localhost:7175/api/update-address/${user.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(tempData),
        }
      );
      const updatedUser = await response.json();
      setUser(updatedUser);
      setTempData(updatedUser);
      setEditing(false);
      toast.success("Sikeres adatmódosítás!");
      console.log("Mentve:", user);
    } catch (error) {
      console.log("Hiba történt", error);
    }
  };


  // useEffect(() => {
  //   console.log("Selected car updated:", selectedCar);
  // }, [selectedCar]);

  // const handleRent = (car_id: Car) =>{
  //   setselectedCar(car_id)
  //   setModal(true)
  // }

  // const handleCloseModal = () => {
  //  setModal(false)
  // }

  const navigate = useNavigate()
  const  handleLogout = () =>{
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login")
    toast.success("Sikeres kiejelentkezés")
  }

  return (
    <>
  <div className="flex flex-row text-center font-bold text-3xl text-white m-5 ">
    <button className="text-sm bg-blue-500 rounded-lg p-5" onClick={handleLogout}>
      <FontAwesomeIcon icon={faArrowRightFromBracket} />
    </button>
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1, transition: { duration: 0.5 } }}
      className="bg-blue-500 p-3 rounded-lg w-fit mx-auto"
    >
    {user?.name && <div>Hello {user.name}</div>}
    </motion.div>
  </div>

  <div className="flex text-white font-semibold m-5">
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1, transition: { duration: 1.5 } }}
    >
      <div className="h-full flex items-center justify-center">
        <div className="bg-blue-500 shadow-light overflow-y-scroll h-48 w-96 rounded-lg">
          <h1 className="text-center my-2">Kölcsönzések</h1>
          ide jönnek az elmentek
        </div>
      </div>
    </motion.div>

    {/*Adatok*/}
    <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1, transition: { duration: 1 } }}
          className=" bg-blue-500 flex ml-auto mr-0 rounded-lg flex-col items-right w-96 p-5 shadow-lite"
        >
          <label className="text-center my-3 text-xl font-bold">
            Személyes adatok
          </label>
          {editing ? (
            <input
              type="text"
              name="phone_number"
              value={tempData.phone}
              onChange={handleChange}
              className="bg-slate-400 outline-none p-1"
            />
          ) : (
            <>
            <div>
            phone number: {user.phone}
               </div>
               </>
          )}
          {editing ? (
            <input
              type="text"
              name="street"
              value={tempData.address?.street}
              onChange={handleChange}
              className="bg-slate-400  outline-none p-1"
            />
          ) : (
            <div>address street: {user.address?.street}</div>
          )}
          {editing ? (
            <input
              type="text"
              name="city"
              value={tempData.address?.city}
              onChange={handleChange}
              className="bg-slate-400  outline-none p-1"
            />
          ) : (
            <div>address city: {user.address?.city}</div>
          )}
          {editing ? (
            <input
              type="text"
              name="postalCode"
              value={tempData.address?.postalCode}
              onChange={handleChange}
              className="bg-slate-400  outline-none p-1"
            />
          ) : (
            <div>Postal Code: {user.address?.postalCode}</div>
          )}
          {editing ? (
            <button
              className="rounded-lg p-1 my-5 bg-green-600 hover:bg-green-700 transition-all hover:scale-105"
              onClick={handleSave}
            >
              Mentés
            </button>
          ) : (
            <button
              onClick={() => {
                setTempData({ ...user });
                setEditing(true);
              }}
              className="rounded-lg p-1 my-5 bg-purple-600 hover:bg-purple-700 transition-all hover:scale-105"
            >
              Módosítás
            </button>
          )}
        </motion.div>
  </div>
  <Cars />
  </>

);
}
export default User;
