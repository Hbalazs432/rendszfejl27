import React, { useState, useEffect } from 'react'
import { motion } from "framer-motion";
import { Car, User, CarsProps } from '../interfaces/interfaces';
import { style } from "../styles/styles";
import {toast} from 'react-toastify'
import Box from "@mui/material/Box";
import Modal, { ModalRoot } from "@mui/material/Modal";

function ModifyCarModal({
    modifyCar,
    open,
    handleClose,
    refreshCars
  }: {
    modifyCar: Car | null;
    open: boolean;
    refreshCars: () => void;
    handleClose: () => void;
  }) {
    const [formData, setFormData] = useState<Car | null>(null);
  
    useEffect(() => {
      if (modifyCar) setFormData(modifyCar);
    }, [modifyCar]);
  
    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
      if (!formData) return;
      const { name, value } = e.target;
    
      setFormData({
        ...formData,
        [name]: ["price", "distance", "seats", "yearOfManufacture", "carCategoryId", "consumption"].includes(name)
          ? Number(value)
          : value,
      });
    };
  
    const handleUpdate = async () => {
      if (!formData) return;
  
      try {
        const token = localStorage.getItem("token");
        const id = modifyCar?.id
        const response = await fetch(
          `https://localhost:7175/api/Cars/update-car/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
          }
        );
  
        if (!response.ok) {
          throw new Error(await response.text());
        }
  
        toast.success("Sikeres frissítés!");
        console.log(modifyCar)
        refreshCars();
        handleClose();
      } catch (err) {
        console.error("Frissítési hiba:", err);
        
      }
    };
  
    if (!formData) return null;
  
    return (
        <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="delete-confirmation-modal"
        aria-describedby="delete-confirmation-description"
        className="border-2 border-gray-500 rounded-lg"
      >
        <Box sx={{ ...style, width: 600 }}>
            <div className='text-center justify-center'>
            <h2 className="text-xl font-bold">Autó szerkesztése</h2>
            <input
              name="brand"
              type='text'
              value={formData.brand}
              onChange={handleChange}
              className="w-1/2 border m-2 bg-gray-300 rounded-md px-2 py-1"
              placeholder="Márka"
            />
            <input
              name="model"
              type='text'
              value={formData.model}
              onChange={handleChange}
              className="w-1/2 border m-2 bg-gray-300 rounded-md px-2 py-1"
              placeholder="Modell"
            />
            <input
              name="yearOfManufacture"
              type='number'
              value={formData.yearOfManufacture}
              onChange={handleChange}
              className="w-1/2 border m-2 bg-gray-300 rounded-md px-2 py-1"
              placeholder="year"
            />
            <input
              name="licensePlateNumber"
              type='text'
              value={formData.licensePlateNumber}
              onChange={handleChange}
              className="w-1/2 border m-2 bg-gray-300 rounded-md px-2 py-1"
              placeholder="license plate"
            />
            <input
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              className="w-1/2 border m-2 bg-gray-300 rounded-md px-2 py-1"
              placeholder="Ár / nap"
            />
            <input
              name="distance"
              type="number"
              value={formData.distance}
              onChange={handleChange}
              className="w-1/2 border m-2 bg-gray-300 rounded-md px-2 py-1"
              placeholder="Táv"
            />
            <input
              name="seats"
              type="number"
              value={formData.seats}
              onChange={handleChange}
              className="w-1/2 border m-2 bg-gray-300 rounded-md px-2 py-1"
              placeholder="ülések"
            />
                          <select
                name="transmission"
                value={formData.transmission}
                onChange={handleChange}
                className="w-1/2 border m-2 bg-gray-300 rounded-md px-2 py-1"
              >
                <option value="Manual">Manuális</option>
                <option value="Automatic">Automata</option>
              </select>
            <input
              name="consumption"
              type="number"
              value={formData.consumption}
              onChange={handleChange}
              className="w-1/2 border m-2 bg-gray-300 rounded-md px-2 py-1"
              placeholder="fogyasztás"
            />


            {/*carcategory fix */}
            <input
              name="carCategoryId"
              type="number"
              value={formData.carCategoryId}
              onChange={handleChange}
              className="w-1/2 border m-2 bg-gray-300 rounded-md px-2 py-1"
              placeholder="carCategoryId"
            />
                        <select
              name="engine"
              value={formData.engine}
              onChange={handleChange}
              className="w-1/2 border m-2 bg-gray-300 rounded-md px-2 py-1"
            >
              <option value="Electronic">Elektromos</option>
              <option value="Diesel">Dízel</option>
            </select>
            {/* <input
              name="status"
              type="text"
              value={formData.status}
              onChange={handleChange}
              className="w-1/2 border m-2 bg-gray-300 rounded-md px-2 py-1"
              placeholder="státusz"
            />
            */}
            </div>
           
            <div className="flex justify-between">
              <button
                onClick={handleUpdate}
                className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Mentés
              </button>
              <button
                onClick={handleClose}
                className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                Mégse
              </button>
            </div>
        </Box>
        </Modal>
    );
  }

  export default ModifyCarModal