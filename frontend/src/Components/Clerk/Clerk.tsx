import React, {useState, useEffect} from 'react'
import {toast } from 'react-toastify';
import { jwtDecode } from "jwt-decode";
import { CustomJwtPayload } from '../../interfaces/interfaces';
import { convertFieldResponseIntoMuiTextFieldProps } from '@mui/x-date-pickers/internals';


function Clerk() {
    const [clerk, setClerk] = useState<any>({
       user: "",
     });
    
    useEffect(() => {
       const token = localStorage.getItem("token");
       if (!token) {
         toast.error("Nincs token, jelentkezz be újra");
         return;
       }
       try {
         const decoded = jwtDecode<CustomJwtPayload>(token);
         // const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
         const userId =
           decoded[
             "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
           ];
         const loadClerkData = async () => {
           const response = await fetch(
             `https://localhost:7175/api/Users/${userId}`,
             {
               headers: {
                 Authorization: `Bearer ${token}`,
               },
             }
           );
           const clerkData = await response.json();
           setClerk(clerkData);
         };
         loadClerkData();
       } catch (error) {
         console.log(error);
       }
     }, []);
  return (
    <div>Clerk</div>
  )
}

export default Clerk