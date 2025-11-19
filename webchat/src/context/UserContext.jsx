import {createContext, useState, useEffect } from "react";
import userService from "../services/userService";

export const UserContext = createContext(null);

export const UserProvider = ({children}) => {
    const [loading, setLoading] = useState(false)

    const search = async (NameOrEmail) =>{
        setLoading(true);
        try {
            const data = await userService.search(NameOrEmail);
            if(data.success) {
                return data.data;
            }
        } catch(error) {
            console.error("failed:", error);
            throw error;
        } finally{
            setLoading(false);
        }
    } 
    const value = {search, loading};
    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}