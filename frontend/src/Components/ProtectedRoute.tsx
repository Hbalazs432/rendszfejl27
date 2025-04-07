import {Navigate } from 'react-router-dom'
import {FC,  ReactNode } from 'react'


export interface ProtectedRouteProp {
    children: ReactNode
  }

const ProtectedRoute: FC<ProtectedRouteProp>  = ({children}) => {
    const user = localStorage.getItem("user")
    console.log(user)
    if(!user)
    {
        return <Navigate to='/login' replace/> 
    } 
    return <>{children}</> 
}

export default ProtectedRoute

