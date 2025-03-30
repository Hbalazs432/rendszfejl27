import React from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";

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

function User() {
  const { state } = useLocation();
  const [user, setUser] = useState<User>(state?.user);
  const [editing, setEditing] = useState(false);
  const [tempData, setTempData] = useState({ ...user });

  


  //kinda felesleges
  if (!user) {
    toast.error("Nincs ilyen user");
  }

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const response = await fetch( `http://localhost:5001/register/${user.id}`);
        const userData = await response.json();
        setUser(userData);
        setTempData(userData)
      } catch (error) {
        console.log("Hiba történt", error);
      }
    }
    loadUserData();
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
      <div>Hello {user.email}</div>
      <div className="bg-red-500 flex text-white font-semibold">
        <div className="bg-blue-500 flex ml-auto mr-0 rounded-lg flex-col items-right w-96 p-5">
          {editing ? (
            <input
              type="text"
              name="phone_number"
              value={tempData.phone_number}
              onChange={handleChange}
              className="bg-slate-400"
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
              className="bg-slate-400"
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
              className="bg-slate-400"
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
              className="bg-slate-400"
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
              className="bg-slate-400"
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
              className="bg-slate-400"
            />
          ) : (
            <div>address zip: {user.address.zip}</div>
          )}
          {editing ? (
            <button onClick={handleSave}>Mentés</button>
          ) : (
            <button
              onClick={() => {
                setTempData({ ...user });
                setEditing(true);
              }}
              className="bg-purple-600"
            >
              Módosítás
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default User;
