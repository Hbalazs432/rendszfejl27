import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { CustomJwtPayload, Rents } from "../../interfaces/interfaces";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, {SelectChangeEvent} from '@mui/material/Select';

function Clerk() {
  const [clerk, setClerk] = useState<any>({
    name: "",
  });
  const [pendingRents, setPendingRents] = useState<Rents[]>([]);
  const [acceptedRents, setAcceptedRents] = useState<Rents[]>([]);
  const [finishedRents, setFinishedRents] = useState<Rents[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedOption, setselectedOption] = useState("");

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
        console.log(pendingRents);
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
        console.log(acceptedRents);
      } catch (error) {
        console.log(error);
      }
    };
    const finishedRents = async () =>{
      try{
        const response = await fetch(`https://localhost:7175/api/Rents/finished-rents`,{
            method:'GET',
            headers: {
              Authorization: `Bearer ${token}`
            }
        })
        const finished = await response.json()
        setFinishedRents(finished);
        console.log(finished)
      }catch(error){console.log(error)}
    }
    loadAcceptRents();
    loadPendingRents();
    finishedRents();
  }, [refreshKey]);

  //HALFWAY
  const acceptedRent = async (pendig: string) => {
    const token = localStorage.getItem("token");
    try {
      const orderId = pendig;
      const response = await fetch(
        `https://localhost:7175/api/Rents/accept-rent/${orderId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        toast.success("A kérés elfogadva");
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
    //console.log("Kiválasztott opció:", e.target.value);
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
          <Select       
            value={selectedOption}
            onChange={handleChange}
          >
            <MenuItem value="pendingRents">Függő bérlések</MenuItem>
            <MenuItem value="deniedRents">Elutasított bérlések</MenuItem>
            <MenuItem value="acceptedRents">Jóváhagyott bérlések</MenuItem>
            <MenuItem value="finishedRents">Lejárt bérlések</MenuItem>
          </Select>
        </FormControl>
             </div>
</div>

      {selectedOption === "pendingRents" ? (
        <div className="flex justify-center items-center min-h-screen">
          <div className="bg-white border-2 border-gray-300 rounded-xl shadow-lg p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
              Függő Bérlések
            </h2>
            <div className="space-y-4">
              {pendingRents.map((pending, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 shadow-sm hover:shadow-gray-300 transition bg-gray-200"
                >
                  <div className="space-y-5">
                    <p className="text-gray-700 font-medium">
                      Igénylő: <span className="font-bold">{pending.email}</span>
                    </p>
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
                        onClick={() => acceptedRent(pending.id)}
                      >
                        Elfogadás
                      </button>
                      <button className="bg-red-500  hover:bg-red-700 p-2 rounded-lg text-white">
                        Elutasítás
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : selectedOption === "acceptedRents" ? (
        <div className="flex justify-center items-center min-h-screen">
          <div className="bg-white border-2 border-gray-300 rounded-xl shadow-lg p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
             Jóváhagyott bérlések 
            </h2>
            <div className="space-y-4">
              {acceptedRents.map((accepted, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 shadow-sm hover:shadow-gray-300 transition bg-gray-200"
                >
                  <div className="space-y-5">
                    <p className="text-gray-700 font-medium">
                      Igénylő: <span className="font-bold">{accepted.email}</span>
                    </p>
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
          </div>
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
                      Igénylő: <span className="font-bold">{finished.email}</span>
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
        <div>Denied</div>
      )
       : ""}
    </div>
  );
}

export default Clerk;
