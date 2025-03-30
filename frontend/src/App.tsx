import './App.css'
import Registration from './Components/Registration'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Components/Login';
import User from './Components/User';
import Admin from './Components/Admin';

function App() {

  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/user" element={<User />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
