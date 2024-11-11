import React, { createContext, useState, useContext } from 'react';
import { AllSupplierResponse } from "@/dataType/dataTypeSupplier/dataTypeSupplier";


  interface SupplierTypeContext {
    supplier: AllSupplierResponse[]; 
    setSupplier: React.Dispatch<React.SetStateAction<AllSupplierResponse[]>>;
}
const SupplierContext = createContext<SupplierTypeContext |null >(null);

   
   const SupplierProvider = ({ children }: {
    children: any;
    
}) => {
    const [supplier, setSupplier] = useState<AllSupplierResponse[] >([]);

   
    return (
      <SupplierContext.Provider value={{supplier, setSupplier}}>
        {children}
      </SupplierContext.Provider>
    );
   };
   
   export { SupplierContext, SupplierProvider };