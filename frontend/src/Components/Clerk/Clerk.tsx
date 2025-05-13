import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { CustomJwtPayload, Rents } from "../../interfaces/interfaces";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { carCategories } from "../../utils/carCategories";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { style } from "../../styles/styles";

function Clerk() {
  const [clerk, setClerk] = useState<any>({
    name: "",
  });
  const [pendingRents, setPendingRents] = useState<Rents[]>([]);
  const [acceptedRents, setAcceptedRents] = useState<Rents[]>([]);
  const [declinedRents, setDeclinedRents] = useState<Rents[]>([]);
  const [finishedRents, setFinishedRents] = useState<Rents[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedOption, setselectedOption] = useState("");
  const [modal, setModal] = useState(false);

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    toast.success("Sikeres kijelentkezés");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Nincs token, jelentkezz be újra");
      return;
    }
    try {
      const decoded = jwtDecode<CustomJwtPayload>(token);
      // const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
      const userId =
        decoded[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ];
      const loadClerkData = async () => {
        const response = await fetch(
          `https://localhost:7175/api/Users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const clerkData = await response.json();
        setClerk(clerkData);
      };
      loadClerkData();
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Nincs token, jelentkezz be újra");
      return;
    }
    const loadPendingRents = async () => {
      try {
        const response = await fetch(
          `https://localhost:7175/api/Rents/pending-rents`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setPendingRents(data);
       // console.log(pendingRents);
      } catch (error) {
        console.log(error);
      }
    };
    const loadAcceptRents = async () => {
      try {
        const response = await fetch(
          `https://localhost:7175/api/Rents/accepted-rents`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const accepted = await response.json();
        setAcceptedRents(accepted);
      } catch (error) {
        console.log(error);
      }
    };
    const finishedRents = async () => {
      try {
        const response = await fetch(
          `https://localhost:7175/api/Rents/finished-rents`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const finished = await response.json();
        setFinishedRents(finished);
        //console.log(finished);
      } catch (error) {
        console.log(error);
      }
    };
      const loadDeclinedRents = async () => {
      try {
        const response = await fetch(
          `https://localhost:7175/api/Rents/declined-rents`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const declined = await response.json();
        setDeclinedRents(declined);
        //console.log(declined);
      } catch (error) {
        console.log(error);
      }
    };
    loadDeclinedRents();
    loadAcceptRents();
    loadPendingRents();
    finishedRents();

  }, [refreshKey]);
  //jó minden
  const acceptRent = async (pendig: number, StatusCar: number) => {
    const token = localStorage.getItem("token");
    try {
      const orderId = pendig;
      const carId = StatusCar;
      const response = await fetch(
        `https://localhost:7175/api/Rents/accept-rent/${orderId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

          const carResponse = await fetch(
        `https://localhost:7175/api/Cars/change-status-rented/${carId}`,{
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (response.ok && carResponse.ok) {
        toast.success("A kérés elfogadva");
        setRefreshKey((prev) => prev + 1);
      } else {
        const error = await response.text();
        toast.error(`Ez az autó már le van foglalva`);
      }
    } catch (error) {
      toast.error("A kérés sikertelen volt");
      console.log(error);
    }
  };


    const declineRent = async (pendig: number) => {
    const token = localStorage.getItem("token");
    try {
      const orderId = pendig;
      const response = await fetch(
        `https://localhost:7175/api/Rents/decline-rent/${orderId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
    

        if (response.ok) {
        toast.success("A kérés elutasítva");
        setRefreshKey((prev) => prev + 1);
      } else {
        const error = await response.text();
        toast.error(`Hiba történt: ${error}`);
      }
    } catch (error) {
      toast.error("A kérés sikertelen volt");
      console.log(error);
    }
  };
  const handleChange = (e: SelectChangeEvent<string>) => {
    setselectedOption(e.target.value);
  };

  const handleCloseModal = () => {
    setModal(false);
  };

  return (
    <div>
      <div className="flex flex-row text-center font-bold text-3xl text-white my-2">
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
          {clerk?.name && <div>Hello {clerk.name}</div>}
        </motion.div>
      </div>

      <div className="flex justify-center text-center">
        <div className=" m-5 w-1/2">
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Listázás</InputLabel>
            <Select value={selectedOption} onChange={handleChange}>
              <MenuItem value="pendingRents">Függő bérlések</MenuItem>
              <MenuItem value="deniedRents">Elutasított bérlések</MenuItem>
              <MenuItem value="acceptedRents">Jóváhagyott bérlések</MenuItem>
              <MenuItem value="finishedRents">Lejárt bérlések</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>


{/*TODO finishedrents  */}
      {selectedOption === "pendingRents" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pendingRents.map((pending, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 shadow-sm hover:shadow-gray-300 transition bg-gray-200"
            >
              <div className="space-y-5">
                <p className="text-gray-700 font-medium">
                  Igénylő: <span className="font-bold">{pending.email}</span>
                </p>
                <div className="border-2 border-gray-300 rounded-lg p-2 flex flex-col">
                  <div className="p-5 flex flex-col flex-grow">
                    <h5 className="text-2xl font-bold line-clamp-1 tracking-tight text-gray-900 ">
                      {pending.car.brand} {pending.car.model}{" "}
                      {pending.car.yearOfManufacture}
                      
                    </h5>
                    <div className="mt-2 space-y-1 flex-grow">
                      <p className="mb-3 font-normal text-gray-700 ">
                        Rendszám : {pending.car.licensePlateNumber}
                      </p>
                      <p className="mb-3 font-normal text-gray-700 ">
                        Ár: {pending.car.price}/nap
                      </p>
                      <p className="mb-3 font-normal text-gray-700 ">
                       carId: {pending.car.id}
                      </p>
                      <p className="mb-3 font-normal text-gray-700 ">
                        Km: {pending.car.distance}
                      </p>
                      <p className="mb-3 font-normal text-gray-700 ">
                        Ülések: {pending.car.seats}
                      </p>
                      <p className="mb-3 font-normal text-gray-700 ">
                        Váltó:{" "}
                        {pending.car.transmission === "Manual"
                          ? "Manuális"
                          : "Automata"}
                      </p>
                      <p className="mb-3 font-normal text-gray-700 ">
                        Fogyasztás: {pending.car.consumption}
                      </p>
                      <p className="mb-3 font-normal text-gray-700 ">
                        Férőhelyek: {pending.car.capacity}
                      </p>
                      <p className="mb-3 font-normal text-gray-700 ">
                        Kategória:{" "}
                        {pending.car.carCategoryId &&
                        carCategories[pending.car.carCategoryId]
                          ? carCategories[pending.car.carCategoryId]
                          : "Ismeretlen"}
                      </p>
                      <p className="mb-3 font-normal text-gray-700 ">
                        Motor:{" "}
                        {pending.car.engine === "Electronic"
                          ? "Elektromos"
                          : "Diesel"}
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 font-medium">
                  Id: <span className="font-bold">{pending.id}</span>
                </p>
                <p className="text-gray-700 font-medium">
                  Kezdés dátuma:{" "}
                  <span className="font-bold">{pending.startDate}</span>
                </p>
                <p className="text-gray-700 font-medium">
                  Befejezés dátuma:{" "}
                  <span className="font-bold">{pending.endDate}</span>
                </p>
                <p className="text-gray-600">
                  Státusz:{" "}
                  <span className="font-semibold bg-yellow-500 text-white p-2 mt-2 rounded-lg">
                    {pending.rentStatus === "Pending"
                      ? "Függőben"
                      : "Hiba történt"}
                  </span>
                </p>

                <div className="flex text-center justify-center space-x-3">
                  <button
                        className="bg-green-500 hover:bg-green-700 p-2 rounded-lg text-white"
                        onClick={() => acceptRent(pending.id, pending.car.id)}
                      >
                        Elfogadás
                      </button>
                  <button 
                  onClick={() => declineRent(pending.id)}
                  className="bg-red-500  hover:bg-red-700 p-2 rounded-lg text-white">
                    Elutasítás
                  </button>
                        <Modal
                open={modal}
                onClose={handleCloseModal}
                aria-labelledby="delete-confirmation-modal"
                aria-describedby="delete-confirmation-description"
                className="border-2 border-gray-500 rounded-lg"
              >
                <Box sx={{ ...style, width: 600 }}>
                  <div className="flex justify-center text-center">
                    <div className="flex justify-center flex-col gap-5  w-1/2">
                    <h1 className="font-bold">Lefoglaltra állítod az autót?</h1>
                    <button
                    onClick={() => acceptRent(pending.id, pending.car.id)}
                    className="bg-green-500 hover:bg-green-700 p-2 rounded-lg text-white">
                      Igen
                    </button>
                    <button
                      onClick={() => handleCloseModal()}
                      className="bg-red-500 hover:bg-red-700 p-2 rounded-lg text-white"
                    >
                      Nem
                    </button>
                  </div>
                  </div>
                </Box>
              </Modal>
                </div>
              </div>
            </div>
          ))}
          
        </div>
      ) : selectedOption === "acceptedRents" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {acceptedRents.map((accepted, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 shadow-sm hover:shadow-gray-300 transition bg-gray-200"
            >
              <div className="space-y-5">
                <p className="text-gray-700 font-medium">
                  Igénylő: <span className="font-bold">{accepted.email}</span>
                </p>
                <div className="border-2 border-gray-300 rounded-lg p-2 flex flex-col">
                  <div className="p-5 flex flex-col flex-grow">
                    <h5 className="text-2xl font-bold line-clamp-1 tracking-tight text-gray-900 ">
                      {accepted.car.brand} {accepted.car.model}{" "}
                      {accepted.car.yearOfManufacture}
                    </h5>
                    <div className="mt-2 space-y-1 flex-grow">
                      <p className="mb-3 font-normal text-gray-700 ">
                        Rendszám : {accepted.car.licensePlateNumber}
                      </p>
                      <p className="mb-3 font-normal text-gray-700 ">
                        Ár: {accepted.car.price}/nap
                      </p>
                      <p className="mb-3 font-normal text-gray-700 ">
                        Km: {accepted.car.distance}
                      </p>
                      <p className="mb-3 font-normal text-gray-700 ">
                        Ülések: {accepted.car.seats}
                      </p>
                      <p className="mb-3 font-normal text-gray-700 ">
                        Váltó:{" "}
                        {accepted.car.transmission === "Manual"
                          ? "Manuális"
                          : "Automata"}
                      </p>
                      <p className="mb-3 font-normal text-gray-700 ">
                        Fogyasztás: {accepted.car.consumption}
                      </p>
                      <p className="mb-3 font-normal text-gray-700 ">
                        Férőhelyek: {accepted.car.capacity}
                      </p>
                      <p className="mb-3 font-normal text-gray-700 ">
                        Kategória:{" "}
                        {accepted.car.carCategoryId &&
                        carCategories[accepted.car.carCategoryId]
                          ? carCategories[accepted.car.carCategoryId]
                          : "Ismeretlen"}
                      </p>
                      <p className="mb-3 font-normal text-gray-700 ">
                        Motor:{" "}
                        {accepted.car.engine === "Electronic"
                          ? "Elektromos"
                          : "Diesel"}
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 font-medium">
                  Id: <span className="font-bold">{accepted.id}</span>
                </p>
                <p className="text-gray-700 font-medium">
                  Kezdés dátuma:{" "}
                  <span className="font-bold">{accepted.startDate}</span>
                </p>
                <p className="text-gray-700 font-medium">
                  Befejezés dátuma:{" "}
                  <span className="font-bold">{accepted.endDate}</span>
                </p>
                <p className="text-gray-600">
                  Státusz:{" "}
                  <span className="font-semibold bg-green-500 text-white p-2 mt-2 rounded-lg">
                    {accepted.rentStatus === "Accepted"
                      ? "Elfogadva"
                      : "Hiba történt"}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : selectedOption === "finishedRents" ? (
        <div className="flex justify-center items-center min-h-screen">
          <div className="bg-white border-2 border-gray-300 rounded-xl shadow-lg p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
              Lejárt bérlések
            </h2>
            <div className="space-y-4">
              {finishedRents.map((finished, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 shadow-sm hover:shadow-gray-300 transition bg-gray-200"
                >
                  <div className="space-y-5">
                    <p className="text-gray-700 font-medium">
                      Igénylő:{" "}
                      <span className="font-bold">{finished.email}</span>
                    </p>
                    <p className="text-gray-700 font-medium">
                      Id: <span className="font-bold">{finished.id}</span>
                    </p>
                    <p className="text-gray-700 font-medium">
                      Kezdés dátuma:{" "}
                      <span className="font-bold">{finished.startDate}</span>
                    </p>
                    <p className="text-gray-700 font-medium">
                      Befejezés dátuma:{" "}
                      <span className="font-bold">{finished.endDate}</span>
                    </p>
                    <p className="text-gray-600">
                      Státusz:{" "}
                      <span className="font-semibold bg-green-500 text-white p-2 mt-2 rounded-lg">
                        {finished.rentStatus === "Accepted"
                          ? "Elfogadva"
                          : "Lejárt"}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : selectedOption === "deniedRents" ? (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {declinedRents.map((declined, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 shadow-sm hover:shadow-gray-300 transition bg-gray-200"
            >
              <div className="space-y-5">
                <p className="text-gray-700 font-medium">
                  Igénylő: <span className="font-bold">{declined.email}</span>
                </p>
                <div className="border-2 border-gray-300 rounded-lg p-2 flex flex-col">
                  <div className="p-5 flex flex-col flex-grow">
                    <h5 className="text-2xl font-bold line-clamp-1 tracking-tight text-gray-900 ">
                      {declined.car.brand} {declined.car.model}{" "}
                      {declined.car.yearOfManufacture}
                    </h5>
                    <div className="mt-2 space-y-1 flex-grow">
                      <p className="mb-3 font-normal text-gray-700 ">
                        Rendszám : {declined.car.licensePlateNumber}
                      </p>
                      <p className="mb-3 font-normal text-gray-700 ">
                        Ár: {declined.car.price}/nap
                      </p>
                      <p className="mb-3 font-normal text-gray-700 ">
                        Km: {declined.car.distance}
                      </p>
                      <p className="mb-3 font-normal text-gray-700 ">
                        Ülések: {declined.car.seats}
                      </p>
                      <p className="mb-3 font-normal text-gray-700 ">
                        Váltó:{" "}
                        {declined.car.transmission === "Manual"
                          ? "Manuális"
                          : "Automata"}
                      </p>
                      <p className="mb-3 font-normal text-gray-700 ">
                        Fogyasztás: {declined.car.consumption}
                      </p>
                      <p className="mb-3 font-normal text-gray-700 ">
                        Férőhelyek: {declined.car.capacity}
                      </p>
                      <p className="mb-3 font-normal text-gray-700 ">
                        Kategória:{" "}
                        {declined.car.carCategoryId &&
                        carCategories[declined.car.carCategoryId]
                          ? carCategories[declined.car.carCategoryId]
                          : "Ismeretlen"}
                      </p>
                      <p className="mb-3 font-normal text-gray-700 ">
                        Motor:{" "}
                        {declined.car.engine === "Electronic"
                          ? "Elektromos"
                          : "Diesel"}
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 font-medium">
                  Id: <span className="font-bold">{declined.id}</span>
                </p>
                <p className="text-gray-700 font-medium">
                  Kezdés dátuma:{" "}
                  <span className="font-bold">{declined.startDate}</span>
                </p>
                <p className="text-gray-700 font-medium">
                  Befejezés dátuma:{" "}
                  <span className="font-bold">{declined.endDate}</span>
                </p>
                <p className="text-gray-600">
                  Státusz:{" "}
                  <span className="font-semibold bg-red-500 text-white p-2 mt-2 rounded-lg">
                    {declined.rentStatus === "Denied"
                      ? "Elutasítva"
                      : "Hiba történt"}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default Clerk;
