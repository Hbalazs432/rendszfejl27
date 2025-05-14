import React, { useState, useEffect } from 'react'
import { Car, User, CarsProps } from '../../interfaces/interfaces';
import { style } from "../../styles/styles";
import {toast} from 'react-toastify'
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

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
                <h2 className="text-xl text-center mb-2 font-bold">Autó szerkesztése</h2>
            <div className='grid grid-cols-2 gap-3 justify-center items-center'>
                <label className="text-center">Márka:</label>
                  <input
                    name="brand"
                    type="text"
                    value={formData.brand}
                    onChange={handleChange}
                    className="w-1/2 border m-2 bg-gray-300 rounded-md px-2 py-1"
                    placeholder="Márka"
                  />
              <label className="text-center">Modell:</label>
              <input
                name="model"
                type="text"
                value={formData.model}
                onChange={handleChange}
                className="w-1/2 border m-2 bg-gray-300 rounded-md px-2 py-1"
                placeholder="Modell"
              />

            <label className="text-center">Szín:</label>
            <input
              name="yearOfManufacture"
              type='number'
              value={formData.yearOfManufacture}
              onChange={handleChange}
              className="w-1/2 border m-2 bg-gray-300 rounded-md px-2 py-1"
              placeholder="Évjárat"
            />
            <label className="text-center">Rendszám:</label>
            <input
              name="licensePlateNumber"
              type='text'
              value={formData.licensePlateNumber}
              onChange={handleChange}
              className="w-1/2 border m-2 bg-gray-300 rounded-md px-2 py-1"
              placeholder="Rendszám"
            />
            <label className="text-center">Ár:</label>
            <input
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              className="w-1/2 border m-2 bg-gray-300 rounded-md px-2 py-1"
              placeholder="Ár / nap"
            />
            <label className="text-center">Táv:</label>
            <input
              name="distance"
              type="number"
              value={formData.distance}
              onChange={handleChange}
              className="w-1/2 border m-2 bg-gray-300 rounded-md px-2 py-1"
              placeholder="Táv"
            />
            <label className="text-center">Ülések:</label>
            <input
              name="seats"
              type="number"
              value={formData.seats}
              onChange={handleChange}
              className="w-1/2 border m-2 bg-gray-300 rounded-md px-2 py-1"
              placeholder="Ülések"
            />
                          
            <label className="text-center">Típus:</label>           
              <select
                name="transmission"
                value={formData.transmission}
                onChange={handleChange}
                className="w-1/2 border m-2 bg-gray-300 rounded-md px-2 py-1"
              >
                <option value="Manual">Manuális</option>
                <option value="Automatic">Automata</option>
              </select>
            <label className="text-center">Fogyasztás:</label>
            <input
              name="consumption"
              type="number"
              value={formData.consumption}
              onChange={handleChange}
              className="w-1/2 border m-2 bg-gray-300 rounded-md px-2 py-1"
              placeholder="fogyasztás"
            />


            <label className="text-center">Űrtartalom:</label>
            <input
              name="capacity"
              type="number"
              value={formData.capacity}
              onChange={handleChange}
              className="w-1/2 border m-2 bg-gray-300 rounded-md px-2 py-1"
              placeholder="Kapacitás"
            />
            <label className="text-center">Kategória:</label>
            <input
              name="carCategoryId"
              type="number"
              value={formData.carCategoryId}
              onChange={handleChange}
              className="w-1/2 border m-2 bg-gray-300 rounded-md px-2 py-1"
              placeholder="carCategoryId"
            />
            <label className="text-center">Motor:</label>
              <select
              name="engine"
              value={formData.engine}
              onChange={handleChange}
              className="w-1/2 border m-2 bg-gray-300 rounded-md px-2 py-1"
            >
              <option value="Electronic">Elektromos</option>
              <option value="Diesel">Diesel</option>
            </select>
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