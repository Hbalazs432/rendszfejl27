import React from "react";
import {useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faArrowRightFromBracket} from '@fortawesome/free-solid-svg-icons'
import {jwtDecode} from "jwt-decode";
import Cars from "./Cars";
import { Car, Rents  } from "../interfaces/interfaces";


function User() {
  const [user, setUser] = useState<any>({
    name: '',
    phone_number: '',
    address: { street: '', city: '', postalCode: '' }
  });
  const [editing, setEditing] = useState(false);
  const [tempData, setTempData] = useState(user);
  const [refreshKey, setRefreshKey] = useState(0)
  const [historyCars, sethistoryCars] = useState<Rents[]>([])
  

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
    };
    loadUserData();
  } catch (error) {
    console.error("Hiba történt a felhasználó adatainak betöltésekor:", error);
  }
}, []);



useEffect(() =>{
  if(!user.id) return;
  const getHistoryCars = async () => {
    if(!user.id) return;
    const token = localStorage.getItem("token");
    if (!token) return;
      
        const response = await fetch(`https://localhost:7175/api/Rents/user-rents`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (response.ok) {
          const showHistoryCars = await response.json();
          sethistoryCars(showHistoryCars);
        } else {
          console.error("Nem sikerült lekérni az autók történetét:", response.status);
        }
    };
    getHistoryCars()
  }, [user, refreshKey])

   
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


 const handleSave = async () => {
  // Cím adatok eltávolítása az id-ről
  try {
    const token = localStorage.getItem("token");
    console.log(tempData)
  
    // // Cím mentése
    const addressResponse = await fetch("https://localhost:7175/api/Users/update-address", {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",  
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        city: tempData.address.city,
        street: tempData.address.street,
        postalCode: tempData.address.postalCode
      })
    });

    if (!addressResponse.ok) {
      const error = await addressResponse.json();
      // console.log("Küldött címadatok:", {
      //   city: tempData.address.city,
      //   street: tempData.address.street,
      //   postalCode: tempData.address.postalCode
      // });
      console.error("Cím hiba:", error);
      throw new Error("Hiba történt a cím mentésekor");
    }

    // Telefonszám mentése
    const phoneResponse = await fetch("https://localhost:7175/api/Users/update-phone", {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json", 
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ phone: tempData.phone })
    });
    if (!phoneResponse.ok) {
      const error = await phoneResponse.json();
      console.error("Telefonszám hiba:", error);
      throw new Error("Hiba történt a telefonszám mentésekor");
    }

    const updatedUser = await phoneResponse.json();
    const mergedUser = {
      ...updatedUser,
      address: tempData.address 
    };
    setUser(mergedUser);
    setTempData(mergedUser);
    setEditing(false);
    toast.success("Sikeres adatmódosítás!");
  } catch (error) {
    console.log("Hiba történt:", error);
    toast.error("Hiba történt a mentés során");
  }
};



  const navigate = useNavigate()
  const  handleLogout = () =>{
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/")
    toast.success("Sikeres kijelentkezés")
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
        <div className="bg-blue-500 shadow-light overflow-y-scroll h-48 w-auto rounded-lg">
          <h1 className="text-center my-2">Kölcsönzések</h1>
          {historyCars.length > 0 ? (
      historyCars.map((rent) => (
      <div className="m-5 p-5 border-2 rounded-lg group relative" key={rent.id}>
      {/* Tooltip */}
      <div className="absolute -top-5 left-1/2 -translate-x-1/2 -translate-y-full z-50 bg-gray-800 text-white text-sm px-4 py-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
        ha lesz ra ido
        szepseg
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-800"></div>
      </div>

      {/* Kártyatartalom */}
      <div className="flex justify-center items-center space-x-4">
        <p>Id: {rent.carId}</p>
        <p>Lefoglalás kezdete: {rent.startDate}</p>
        <p>Lefoglalás vége: {rent.endDate}</p>
        <p
          className={
            rent.rentStatus === "Pending"
              ? "bg-yellow-500 p-2 rounded-lg"
              : rent.rentStatus === "Accepted"
              ? "bg-green-600 p-2 rounded-lg"
               : rent.rentStatus === "Denied"
              ? "bg-red-500 p-2 rounded-lg" : ""
          }
        >
          {rent.rentStatus === "Pending"
            ? "ügyintézés alatt"
            : rent.rentStatus === "Accepted"
            ? "elfogadva"
            : rent.rentStatus === "Denied"
            ? "elutasítva" : ""}
        </p>
      </div>
    </div>
  ))
) : (
  <div>jelenleg nincs bérlés</div>
)}

 
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
          <div className="flex-col flex space-y-2">
          {editing ? (
            <input
              type="text"
              name="phone"
              value={tempData.phone}
              onChange={handleChange}
              className="bg-blue-600 rounded-lg outline-none p-1"
            />
          ) : (
            <>
            <div>
            Telefonszám: {user.phone}
               </div>
               </>
          )}
          {editing ? (
            <input
              type="text"
              name="street"
              value={tempData.address?.street}
              onChange={handleChange}
              className="bg-blue-600 rounded-lg outline-none p-1"
            />
          ) : (
            <div>Utca: {user.address?.street}</div>
          )}
          {editing ? (
            <input
              type="text"
              name="city"
              value={tempData.address?.city}
              onChange={handleChange}
              className="bg-blue-600 rounded-lg outline-none p-1"
            />
          ) : (
            <div>Város: {user.address?.city}</div>
          )}
          {editing ? (
            <input
              type="text"
              name="postalCode"
              value={tempData.address?.postalCode}
              onChange={handleChange}
              className="bg-blue-600 rounded-lg outline-none p-1"
            />
          ) : (
            <div>Irányítószám: {user.address?.postalCode}</div>
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
          </div>        
        </motion.div>
  </div>
  <Cars  user={user} onRefresh={() => setRefreshKey(prev => prev + 1)}/>
  </>

);
}
export default User;
