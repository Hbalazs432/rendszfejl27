import React from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { ProtectedRoute as PR } from '../interfaces/interfaces'


const ProtectedRoute = ({children}: PR) => {
    const user = localStorage.getItem("user")
    if(!user) 
    return <Navigate to='/login' replace/> 
    return <>{children}</> 
}

export default ProtectedRoute

