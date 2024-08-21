import React, { createContext, useState, useContext } from 'react';
type ProductAttrubite = {
    id: number;
    name: string;
    price: string;
    Discount: string;
    Quantity: number;
    subTotal: string;
    photo:string;
  };
  interface ProductContextType {
    products: ProductAttrubite[]; 
    setProducts: React.Dispatch<React.SetStateAction<ProductAttrubite[]>>;
}
const productToInvoice = createContext<ProductContextType |null>(null);

   
   const CounterProvider = ({ children }: {
    children: any;
    
}) => {
    const [products, setProducts] = useState<ProductAttrubite[]>([]);

   
    return (
      <productToInvoice.Provider value={{products, setProducts}}>
        {children}
      </productToInvoice.Provider>
    );
   };
   
   export { productToInvoice, CounterProvider };