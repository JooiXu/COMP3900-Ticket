import React, { createContext, useContext, useState } from 'react';

//This context is used to check which user is currently logged in
const UserContext = createContext(null);

export const UserContextProvider = ({ usr, children }) => {

    const [ user, setUser ] = useState(usr);
    
    return (
      <UserContext.Provider value={{ user, setUser }}>
        {children}
      </UserContext.Provider>
    )
}

export const useUser = () => useContext(UserContext)