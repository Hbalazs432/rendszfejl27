import React, { useRef, FormEvent, useState } from "react";
import { PropagateLoader } from "react-spinners";
import {motion} from 'framer-motion';


function Registration() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isPending, setIsPending] = useState(false);
  const resetFrom = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: FormEvent<HTMLElement>) => {
    e.preventDefault();
    console.log(email, password);
    const data = { email, password };
    setIsPending(true);
    //POST METHOD, ide kell majd az az url amin a backend fut
   fetch("http://localhost:5001/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setIsPending(false);
        setEmail("");
        setPassword("");
        console.log("Felhasználó hozzáadva", data);
      })
      .catch((error) => {
        console.log("Hiba történt", error);
      });
   
  };


  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <div className="overflow-hidden">
    <motion.div initial={{opacity: 2, scale: 0}} animate={{ opacity: 2, scale: 1}} className="h-screen w-screen flex justify-center items-center">
      {isPending ? (
        <PropagateLoader color="#0030ff" />
      ) : (
           <form onSubmit={handleSubmit} ref={resetFrom} className="w-96 mx-auto  border-2 rounded-lg p-10 shadow-light">
          <h1 className="text-black font-bold text-center text-2xl mb-10">Regisztráció</h1>
          <div className="my-5">
          <label className="block mb-2 text-sm font-medium text-gray-900">email cím</label>
          <input
            className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-300  dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="email"
            value={email}
            onChange={handleEmailChange}
          />
          </div>
          <div className="my-5">
          <label className="block mb-2 text-sm font-medium text-gray-900">jelszó</label>
          <input
            className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-300  dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
          </div>
          <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full mb-5 px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Regisztráció</button>
          <div className="text-center font-medium text-sm">
          Van már fiókod? <a href="/login" className="hover:underline">Jelentkezz be</a>
          </div>
        </form>
      )}
    </motion.div>
    </div>
  );
}

export default Registration;
