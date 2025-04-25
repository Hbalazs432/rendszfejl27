import React, { useRef, FormEvent, useState } from "react";
import { PropagateLoader } from "react-spinners";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Registration() {
  const [Phone, setPhone] = useState<string>("");
  const [Name, setName] = useState<string>("");
  const [Email, setEmail] = useState<string>("");
  const [PasswordHash, setPassword] = useState<string>("");
  const [City, setCity] = useState<string>("");
  const [Street, setStreet] = useState<string>("");
  const [PostalCode, setPostalCode] = useState<string>("");

  const [isPending, setIsPending] = useState(false);
  const resetFrom = useRef<HTMLFormElement>(null);

  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent<HTMLElement>) => {
    e.preventDefault();
    const data = {
      name: Name,
      email: Email,
      passwordHash: PasswordHash,
      address: {
        city: City,
        street: Street,
        postalCode: PostalCode,
      },
      phone: Phone,
    };
    console.log(data);
    setIsPending(true);
    //POST METHOD MŰKÖDIK
    fetch("https://localhost:7175/api/Users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then(async (response) => {
        if (!response.ok) {
          const errortext = await response.text();
          console.log("Hiba történt", errortext);
          throw new Error(errortext);
        }
        return response.json();
      })
      .then((data) => {
        setIsPending(false);
        setEmail("");
        setPassword("");
        setPhone("");
        setName("");
        setCity("");
        setStreet("");
        setPostalCode("");
        console.log("Felhasználó hozzáadva", data);
        toast.success("Sikeres regisztráció");
        navigate("/login");
      })
      .catch((error) => {
        console.log("Hiba történt", error);
        toast.error("Hiba történt a regisztráció során");
      });
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCity(e.target.value);
  };
  const handleStreetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStreet(e.target.value);
  };
  const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPostalCode(e.target.value);
  };
  return (
    <div className="overflow-hidden">
      <motion.div
        initial={{ opacity: 2, scale: 0 }}
        animate={{ opacity: 2, scale: 1 }}
        className="h-screen w-screen flex justify-center items-center"
      >
        {isPending ? (
          <PropagateLoader color="#0030ff" />
        ) : (
          <form
            onSubmit={handleSubmit}
            ref={resetFrom}
            className="w-96 mx-auto  border-2 rounded-lg p-10 shadow-light"
          >
            <h1 className="text-black font-bold text-center text-2xl mb-10">
              Regisztráció
            </h1>
            <div className="my-5">
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Név
              </label>
              <input
                className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-300  dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                type="text"
                value={Name}
                onChange={handleNameChange}
              />
              <label className="block mb-2 text-sm font-medium text-gray-900">
                email cím
              </label>
              <input
                className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-300  dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                type="email"
                value={Email}
                onChange={handleEmailChange}
              />

              <label className="block mb-2 text-sm font-medium text-gray-900">
                Telefonszám
              </label>
              <input
                className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-300  dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                type="phone"
                value={Phone}
                onChange={handlePhoneChange}
              />
            </div>
            <div className="my-5">
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Jelszó
              </label>
              <input
                className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-300  dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                type="password"
                value={PasswordHash}
                onChange={handlePasswordChange}
              />
              <div>
                <div className="flex gap-x-2 text-center">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      Város
                    </label>
                    <input
                      className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-300  dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      type="text"
                      value={City}
                      onChange={handleCityChange}
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      Utca
                    </label>
                    <input
                      className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-300  dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      type="text"
                      value={Street}
                      onChange={handleStreetChange}
                    />
                  </div>
                </div>
                <div className="flex flex-col justify-center items-center">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      Kód
                    </label>
                  </div>
                  <input
                    className="border w-1/2  border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5 bg-gray-300  dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    type="text"
                    value={PostalCode}
                    onChange={handlePostalCodeChange}
                  />
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full mb-5 px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Regisztráció
            </button>
            <div className="text-center font-medium text-sm">
              Van már fiókod?{" "}
              <a href="/login" className="hover:underline">
                Jelentkezz be
              </a>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}

export default Registration;
