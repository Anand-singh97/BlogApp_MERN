import { createContext, useEffect, useState } from "react";

//Actual value you want to access.
export const UserContext = createContext({
    currentUser:null,
    setCurrentUser:()=>{}
});

//Provider
export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {

    const storedUserData = localStorage.getItem('user-data');
    try {
      if (storedUserData) {
        const { username, userId } = JSON.parse(storedUserData);
        setCurrentUser({ username, userId });
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      // Handle the error, maybe clear localStorage or take appropriate action
    }
  }, []);
  const value = { currentUser, setCurrentUser };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
