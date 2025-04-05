import React from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Dayjs } from "dayjs";


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
  const [startDate, setstartDate] = useState<Dayjs | null>(null);
  const [endDate, setendDate] = useState<Dayjs | null>(null);
  //kinda felesleges


  const container = {
    hidden: { opacity: 1, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
        duration: 1,
      },
    },
  };

  const itemTo = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

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

    //autok lekerese
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

  const handleDateChange = (newDate: Dayjs | null) => {
    setstartDate(newDate);
    setendDate(newDate);
    const formatDatum = (date: Dayjs | null): string => {
      return date ? date.format("YYYY-MMMM-DD") : "";
    };
    console.log("start", formatDatum(newDate));
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
          animate={{ scale: 1, transition: { duration: 1.5 } }}
        >
          <DatePicker
            label="Igénylés idejének kezdete"
            value={startDate}
            onChange={handleDateChange}
          />
          <DatePicker
            label="Igénylés idejének vége"
            value={endDate}
            onChange={handleDateChange}
          />
        </motion.div>
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
              value={tempData.address?.country}
              onChange={handleChange}
              className="bg-slate-400  outline-none p-1"
            />
          ) : (
            <div>address country: {user.address?.country}</div>
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
              name="state"
              value={tempData.address?.state}
              onChange={handleChange}
              className="bg-slate-400  outline-none p-1"
            />
          ) : (
            <div>address state: {user.address?.state}</div>
          )}
          {editing ? (
            <input
              type="text"
              name="zip"
              value={tempData.address?.zip}
              onChange={handleChange}
              className="bg-slate-400  outline-none p-1"
            />
          ) : (
            <div>address zip: {user.address?.zip}</div>
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

      <motion.ul
        className="grid md:grid-cols-4 gap-5 grid-cols-2"
        variants={container}
        initial="hidden"
        animate="visible"
        viewport={{ once: false }}
      >
        {cars.map((car, index) => (
          <motion.li
            key={index}
            variants={itemTo}
            className="flex flex-col h-full"
          >
            <div className="m-1 border-gray-300 border-2 rounded-lg shadow-light flex flex-col h-full">
              <div className="h-78 overflow-hidden rounded-t-lg">
                <img className="h-full rounded-t-lg" src={car.image_url} />
              </div>

              <div className="p-5 flex flex-col flex-grow">
                <h5 className="text-2xl font-bold line-clamp-1 tracking-tight text-gray-900 ">
                  {car.brand} {car.model} {car.year}
                </h5>
                <div className="mt-2 space-y-1 flex-grow">
                  <p className="mb-3 font-normal text-gray-700 ">
                    Szín : {car.color}
                  </p>
                  <p className="mb-3 font-normal text-gray-700 ">
                    Ár: {car.price}/nap
                  </p>
                  <p className="mb-3 font-normal text-gray-700 ">
                    Km: {car.mileage}
                  </p>
                  <p className="mb-3 font-normal text-gray-700 ">
                    {car.description}
                  </p>
                </div>
                <button className="w-full my-5 px-3 py-2 text-bold font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 ">
                  Lefoglalás
                </button>
              </div>
            </div>
          </motion.li>
        ))}
      </motion.ul>
    </>
  );
}

export default User;
