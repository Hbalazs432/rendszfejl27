import React, { FormEvent, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import { MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import TextField from "@mui/material/TextField";
import { toast } from "react-toastify";
import { containerVariants, itemVariants, style } from "../styles/styles";
import { CarData } from "../interfaces/interfaces";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { jwtDecode } from "jwt-decode";
import { SelectChangeEvent } from "@mui/material";
import AdminCars from "./AdminCars";


// TODO CAR DELETE 
// TODO CAR MODIFY 
function Admin() {
  const [user, setUser] = useState<any>({
    user: "",
  });
  const transmissionOptions = ["Manual", "Automatic"];
  const engineOptions = ["Diesel", "Electronic"];
  const [refreshKey, setRefreshKey] = useState(0)
  const [openCarModal, setopenCarModal] = useState(false);
  const [addedCar, setaddedCar] = useState<CarData>(
    {
      licensePlateNumber: "",
      brand: "",
      model: "",
      yearOfManufacture: 0,
      seats: 0,
      transmission: "",
      distance: 0,
      consumption: 0,
      capacity: 0,
      carCategoryId: 0,
      engine: "",
      price: 0
    }
  );



  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Nincs token, jelentkezz be újra");
      return;
    }
    try {
      const decoded = jwtDecode(token);
      const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
      console.log(role)
      const userId =
        decoded[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ];
      const loadUserData = async () => {
        const response = await fetch(
          `https://localhost:7175/api/Users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const adminData = await response.json();
        setUser(adminData);
      };
      loadUserData();
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleOpenModal = () => {
    setopenCarModal(true);
  };

  const handleCloseModal = () => {
    setopenCarModal(false);
  };

  const handleDataChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
  
    // Automatikus szám konvertálás, ha number mező
    const numericFields = [
      "yearOfManufacture",
      "seats",
      "distance",
      "consumption",
      "capacity",
      "carCategoryId",
      "price"
    ];
  
    setaddedCar({
      ...addedCar,
      [name]: numericFields.includes(name) ? Number(value) : value,
    });
  };

  const handleSelectChange = (
    e: SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    setaddedCar({
      ...addedCar,
      [name]: value,
    });
  };
 
  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    

    // DUMMY DATA AMI MUKODIK
    // const carData = {
    //   licensePlateNumber: "ABC-123",
    //   brand: "AUDI",
    //   model: "S24",
    //   yearOfManufacture: 2005,
    //   seats: 2,
    //   transmission: "Manual",
    //   distance: 5454,
    //   consumption: 3.2,
    //   capacity: 4,
    //   carCategoryId: 4,
    //   engine: "Diesel",
    //   price: 2220
    // };

    
     console.log(addedCar)
  
    try {
      const response = await fetch("https://localhost:7175/api/Cars/create-car", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(addedCar), 
      }); 
        if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Hiba történt a kocsi létrehozása közben. ${errorText}, ${response.status}`);
      }
      toast.success("Sikeres hozzáadás.")
      setRefreshKey(prev => prev + 1);
      } catch (error) {
        console.error("Hiba történt:", error);
        toast.error("Hiba a feltöltés során");
    }
  };

  const handleLogout = () => {
    navigate("/");
    localStorage.clear();
    toast.success("Sikeres kijelentkezés");
  };

  return (
    <div>
      <div className="flex flex-row text-center font-bold text-3xl text-white m-5 ">
        <button
          className="text-sm bg-blue-500 rounded-lg p-5"
          onClick={handleLogout}
        >
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

      <button
        className="bg-blue-500 text-white rounded-lg p-2 font-bold hover:bg-blue-700"
        onClick={handleOpenModal}
      >
        Autók hozzáadása a rendszerbe
      </button>
      <Modal
        open={openCarModal}
        onClose={handleCloseModal}
        aria-labelledby="delete-confirmation-modal"
        aria-describedby="delete-confirmation-description"
        className="border-2 border-gray-500 rounded-lg"
      >
        <Fade in={openCarModal}>
          <Box sx={style} className="bg-slate-400 rounded-lg text-center">
            <form onSubmit={handleUpload}>
              <h1 className="text-center font-bold border-gray-500 rounded-lg">
                Autó hozzáadása a rendszerbe
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-5">
                 <TextField
                  id="outlined-basic"
                  label="License Plate"
                  variant="outlined"
                  name="licensePlateNumber"
                  type="text"
                  value={addedCar.licensePlateNumber}
                  onChange={handleDataChange}
                />
                <TextField
                  id="outlined-basic"
                  label="Brand"
                  variant="outlined"
                  name="brand"
                  type="text"
                  value={addedCar.brand}
                  onChange={handleDataChange}
                />
                <TextField
                  id="outlined-basic"
                  label="Model"
                  variant="outlined"
                  name="model"
                  type="text"
                  value={addedCar.model}
                  onChange={handleDataChange}
                />
                <TextField
                  id="outlined-basic"
                  label="Capacity"
                  variant="outlined"
                  name="capacity"
                  type="number"
                  value={addedCar.capacity}
                  onChange={handleDataChange}
                />
                <TextField
                  id="outlined-basic"
                  label="Year"
                  variant="outlined"
                  name="yearOfManufacture"
                  type="number"
                  value={addedCar.yearOfManufacture}
                  onChange={handleDataChange}
                />
                <TextField
                  id="outlined-basic"
                  label="Seats"
                  variant="outlined"
                  name="seats"
                  type="number"
                  value={addedCar.seats}
                  onChange={handleDataChange}
                />
                <FormControl fullWidth>
                <InputLabel id="transmission-label">Transmission</InputLabel>
                  <Select
                    labelId="transmission-label"
                    name="transmission"
                    value={addedCar.transmission}
                    onChange={handleSelectChange}
                  >
                    {transmissionOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel id="engine-label">Engine</InputLabel>
                  <Select
                    labelId="engine-label"
                    name="engine"
                    value={addedCar.engine}
                    onChange={handleSelectChange}
                  >
                    {engineOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  id="outlined-basic"
                  label="Distance"
                  variant="outlined"
                  name="distance"
                  type="number"
                  value={addedCar.distance}
                  onChange={handleDataChange}
                />
                <TextField
                  id="outlined-basic"
                  label="Consumption"
                  variant="outlined"
                  name="consumption"
                  type="number"
                  value={addedCar.consumption}
                  onChange={handleDataChange}
                />
                <TextField
                  id="outlined-basic"
                  label="Car category id"
                  variant="outlined"
                  name="carCategoryId"
                  type="number"
                  value={addedCar.carCategoryId}
                  onChange={handleDataChange}
                />
                <TextField
                  id="outlined-basic"
                  label="Price"
                  variant="outlined"
                  name="price"
                  type="number"
                  value={addedCar.price}
                  onChange={handleDataChange}
                />  
              </div>
 
              <button
                type="submit"
                className=" m-10 text-white bg-blue-700 hover:bg-blue-800 transition-all hover:scale-105 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm  mb-5 px-5 py-2.5 text-center"
              >
                Feltöltés
              </button>
            </form>
          </Box>
        </Fade>
      </Modal>
      <AdminCars refreshKey={refreshKey} />
    </div>
);
}

export default Admin;
