import { createContext, useEffect, useState } from "react";

//Actual value you want to access.
export const UserContext = createContext({
    currentUser:null,
    setCurrentUser:()=>{}
});

//Provider
export const UserProvider = ({children})=>{
    const [currentUser, setCurrentUser] = useState(null);
    useEffect(() => {
        const storedUserData = localStorage.getItem('user-data');
        const {username, userId} = JSON.parse(storedUserData);
        setCurrentUser({username, userId});
      
        try {
          if (storedUserData) {
            const userData = JSON.parse(storedUserData);
            setCurrentUser(userData);
          }
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }, []);
    const value = {currentUser, setCurrentUser};
    return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
