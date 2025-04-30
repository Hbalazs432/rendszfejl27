import './App.css'
import React from 'react';
import Registration from './Components/Registration'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Components/Login';
import User from './Components/User';
import Admin from './Components/Admin';
import { ToastContainer, toast } from 'react-toastify';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import Datepicker from './Components/DatePicker';
import {SkeletonTheme} from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import ProtectedRoute  from './Components/ProtectedRoute';
import Cars from './Components/Cars';


function App() {
  return (
    <>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <SkeletonTheme baseColor='#313131' highlightColor='#525252'>
    <Router>
      <Routes>
        <Route path="/"  element={<><Datepicker/><Login/></>} />
        <Route path="/registration" element={<><Datepicker/><Registration /></>} />
        <Route path="/admin" element={<ProtectedRoute><Admin/></ProtectedRoute>}/>
        <Route path="/user" element={<ProtectedRoute><User/></ProtectedRoute>} />
      </Routes>
    </Router>
      <ToastContainer position='bottom-center' theme='dark'/>
      </SkeletonTheme>
    </LocalizationProvider>
    </>
  )
}

export default App
