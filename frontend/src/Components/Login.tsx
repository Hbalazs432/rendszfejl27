import React from "react";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent<HTMLElement>) => {
    e.preventDefault();
    console.log(email, password);
    //GET METHOD
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center">

      <form onSubmit={handleSubmit} className="w-96 mx-auto  border-2 rounded-lg p-10 shadow-light">
        <h1 className="text-black font-bold text-center text-2xl mb-10">Bejelentkezés</h1>
        
        <div className="my-5">
          <label className="block mb-2 text-sm font-medium text-gray-900">email cím</label>
          <input
            className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-300  dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="email"
            value={email}
            onChange={handleEmailChange}
          />
          </div>
          <div className="my-5">
          <label className="block mb-2 text-sm font-medium text-gray-900">jelszó</label>
          <input
            className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-300  dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
    </div>
  );
}

export default Login;
