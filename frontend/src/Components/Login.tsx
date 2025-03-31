import React from "react";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import {toast} from 'react-toastify';
import {motion} from 'framer-motion'; 

function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLElement>) => {
    e.preventDefault();
    try{
      //GET METHOD. ez itt egy teszt, majd ki kell cserélni
      const response = await fetch("http://localhost:5001/register?email=" + email);
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      console.log(data);
      if (data.length == 0){
        toast.error("Nem található ilyen felhasználó!");
        return;
      }
      const user = data[0];
      if(user.password !== password){
        toast.error("Hibás email cím vagy jelszó!");
        return;
      }
      toast.success("Sikeres bejelentkezés!");
      navigate('/user', {state: {user: data[0]}});
    }catch(error){
      console.log("Hiba történt", error);
    }
}

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <div className="overflow-hidden">
    <motion.div initial={{opacity: 2, scale: 0}} animate={{opacity: 2, scale: 1}} className="h-screen w-screen flex justify-center items-center">

      <form onSubmit={handleSubmit} className="w-96 mx-auto  border-2 rounded-lg p-10 shadow-light">
        <h1 className="text-black font-bold text-center text-2xl mb-10">Bejelentkezés</h1>
        
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
          <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full mb-5 px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Bejelentkezés</button>
          <div className="text-center font-medium text-sm">
          Nincs még fiókod? <a href="/" className="hover:underline">Regisztrálj</a>
          </div>
      </form>
    </motion.div>
  </div>
  );
}

export default Login;
