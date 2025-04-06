import './App.css'
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


function App() {
  return (
    <>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <SkeletonTheme baseColor='#313131' highlightColor='#525252'>
    <Router>
      <Routes>
        <Route path="/"  element={<><Datepicker/><Registration/></>} />
        <Route path="/login" element={<><Datepicker/><Login /></>} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/user" element={<User />} />
      </Routes>
    </Router>
      <ToastContainer position='bottom-center' theme='dark'/>
      </SkeletonTheme>
    </LocalizationProvider>
    </>
  )
}

export default App
