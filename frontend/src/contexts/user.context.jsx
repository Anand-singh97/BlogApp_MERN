import { createContext, useEffect, useState } from "react";

//Actual value you want to access.
export const UserContext = createContext({
    currentUser:null,
    setCurrentUser:()=>{}
});

//Provider
export const UserProvider = ({children})=>{
    const [currentUser, setCurrentUser] = useState(null);
    useEffect(()=>{
        if(localStorage.getItem('user-data'))
        {
            setCurrentUser(localStorage.getItem('user-data'));
        }
    }, [])
    const value = {currentUser, setCurrentUser};
    return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}