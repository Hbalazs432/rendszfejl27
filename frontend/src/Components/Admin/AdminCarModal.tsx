import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { style } from "../../styles/styles";
import { Car } from "../../interfaces/interfaces";
import { toast } from "react-toastify";

function AdminCarModal({
  deleteCar,
  open,
  handleClose,
  refreshCars
  
}: {
  deleteCar: Car | null;
  open: boolean;
  handleClose: () => void;
  refreshCars: () => void;
  
}) {


  const handleDelete = async () => {
    try {
      if (!deleteCar) {
        toast.error("Nincs ilyen autó ezzel az id-vel");
      }
      const carId = deleteCar?.id;
      console.log(carId);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://localhost:7175/api/Cars/delete-car/${carId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        toast.success("Sikeresen törölted az autót.");
        refreshCars()
      } else toast.error("Nem tudod törölni mert le van foglalava az autó");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="delete-confirmation-modal"
        aria-describedby="delete-confirmation-description"
        className="border-2 border-gray-500 rounded-lg"
      >
        <Box sx={{ ...style, width: 600 }}>
          <h1 className="text-center font-bold text-2xl my-5">
            Biztosan eltávolítod az autót?
          </h1>
          <div className="flex text-center justify-center gap-4 text-bold">
          <p>{deleteCar?.brand}</p>
          <p>{deleteCar?.model}</p>
          <p>{deleteCar?.licensePlateNumber}</p>
          </div>
          <Box className="flex justify-center mt-5 ">
            <button
              onClick={() => handleDelete()}
              className="p-2 m-5  text-bold font-medium text-center text-white bg-green-500 rounded-lg hover:bg-green-600 transition-all hover:scale-105"
            >
              Igen
            </button>
            <button
              onClick={handleClose}
              className="p-2 m-5 text-bold font-medium text-center text-white bg-red-500 rounded-lg hover:bg-red-600 transition-all hover:scale-105"
            >
              Mégse
            </button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

export default AdminCarModal;
