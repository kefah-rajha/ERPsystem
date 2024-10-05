import React, { createContext, useState, useContext } from 'react';
import { AllusersResponse } from "@/dataType/dataTypeUser/dataTypeUser";


  interface UserTypeContext {
    users: AllusersResponse[]; 
    setUsers: React.Dispatch<React.SetStateAction<AllusersResponse[]>>;
}
const UserContext = createContext<UserTypeContext |null >(null);

   
   const UserProvider = ({ children }: {
    children: any;
    
}) => {
    const [users, setUsers] = useState<AllusersResponse[] >([]);

   
    return (
      <UserContext.Provider value={{users, setUsers}}>
        {children}
      </UserContext.Provider>
    );
   };
   
   export { UserContext, UserProvider };