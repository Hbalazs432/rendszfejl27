import './App.css'
import React from 'react';
import Registration from './Components/Registration'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Components/Login';
import User from './Components/User';
import Admin from './Components/Admin/Admin';
import { ToastContainer, toast } from 'react-toastify';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import {SkeletonTheme} from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import ProtectedRoute  from './Components/ProtectedRoute';
import Clerk from './Components/Clerk/Clerk';
import RentAnonym from './Components/RentAnonym';



function App() {
  return (
    <>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <SkeletonTheme baseColor='#313131' highlightColor='#525252'>
    <Router>
      <Routes>
        <Route path="/"  element={<><RentAnonym/><Login/></>} />
        <Route path="/registration" element={<><RentAnonym/><Registration /></>} />
        <Route path="/admin" element={<ProtectedRoute><Admin/></ProtectedRoute>}/>
        <Route path="/user" element={<ProtectedRoute><User/></ProtectedRoute>} />
        <Route path="/clerk" element={<ProtectedRoute><Clerk/></ProtectedRoute>} />
      </Routes>
    </Router>
      <ToastContainer position='bottom-center' theme='dark'/>
      </SkeletonTheme>
    </LocalizationProvider>
    </>
  )
}

export default App
