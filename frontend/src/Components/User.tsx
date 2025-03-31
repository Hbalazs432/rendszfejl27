import React from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface User {
  id: string;
  email: string;
  phone_number: number;
  address: {
    country: string;
    street: string;
    city: string;
    state: string;
    zip: number;
  };
}

interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  color: string;
  description: string;
  image_url: string;
}

function User() {
  const { state } = useLocation();
  const [user, setUser] = useState<User>(state?.user);
  const [editing, setEditing] = useState(false);
  const [tempData, setTempData] = useState({ ...user });
  const [cars, setCars] = useState<Car[]>([]);

  //kinda felesleges
  if (!user) {
    toast.error("Nincs ilyen user");
  }

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5001/register/${user.id}`
        );
        const userData = await response.json();
        setUser(userData);
        setTempData(userData);
      } catch (error) {
        console.log("Hiba történt", error);
      }
    };
    loadUserData();
    const getCars = async () => {
      const response = await fetch(`http://localhost:5001/cars`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const cars = await response.json();
      console.log(cars);
      const carsArray: Car[] = Object.values(cars);
      setCars(carsArray);
    };
    getCars();
  }, [user?.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (
      name === "country" ||
      name === "zip" ||
      name === "street" ||
      name === "city" ||
      name === "state"
    ) {
      setTempData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [name]: value,
        },
      }));
    } else {
      setTempData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSave = async () => {
    //csere majd a kellőre
    try {
      const response = await fetch(
        `http://localhost:5001/register/${user.id}`,
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

  return (
    <>
      <div className="text-center font-bold text-3xl text-white m-5 ">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1, transition: { duration: 0.5 } }}
          className="bg-blue-500 p-3  rounded-lg w-fit mx-auto"
        >
          {" "}
          Hello {user.email}
        </motion.div>
      </div>
      <div className="flex text-white font-semibold m-5">
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
              value={tempData.phone_number}
              onChange={handleChange}
              className="bg-slate-400 outline-none p-1"
            />
          ) : (
            <div>phone number: {user.phone_number}</div>
          )}
          {editing ? (
            <input
              type="text"
              name="country"
              value={tempData.address.country}
              onChange={handleChange}
              className="bg-slate-400  outline-none p-1"
            />
          ) : (
            <div>address country: {user.address.country}</div>
          )}
          {editing ? (
            <input
              type="text"
              name="street"
              value={tempData.address.street}
              onChange={handleChange}
              className="bg-slate-400  outline-none p-1"
            />
          ) : (
            <div>address street: {user.address.street}</div>
          )}
          {editing ? (
            <input
              type="text"
              name="city"
              value={tempData.address.city}
              onChange={handleChange}
              className="bg-slate-400  outline-none p-1"
            />
          ) : (
            <div>address city: {user.address.city}</div>
          )}
          {editing ? (
            <input
              type="text"
              name="state"
              value={tempData.address.state}
              onChange={handleChange}
              className="bg-slate-400  outline-none p-1"
            />
          ) : (
            <div>address state: {user.address.state}</div>
          )}
          {editing ? (
            <input
              type="text"
              name="zip"
              value={tempData.address.zip}
              onChange={handleChange}
              className="bg-slate-400  outline-none p-1"
            />
          ) : (
            <div>address zip: {user.address.zip}</div>
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

      {cars.map((car) => (
        <div key={car.id}>
          <motion.div className="border-2 rounded-lg p-10 shadow-light flex flex-col items-center w-96 mx-auto mt-5">
            {car.brand}
            {car.model}
            {car.year}
            {car.price}
            {car.mileage}
            {car.color}
            {car.description}
          </motion.div>
        </div>
      ))}
    </>
  );
}

export default User;
