import React, { createContext, useState, useContext } from "react";
import { ProductSalesOrder } from "@/dataType/dataTypeSalesOrder/dataTypeSalesOrder";

interface SalesOrderSelectedTypeContext {
  salesOrderProductsSelected: ProductSalesOrder[];
  setSalesOrderProductsSelected: React.Dispatch<
    React.SetStateAction<ProductSalesOrder[]>
  >;
}
const SalesOrderProductsSelectedContext =
  createContext<SalesOrderSelectedTypeContext | null>(null);

const SalesOrderProductsSelectedProvider = ({
  children,
}: {
  children: any;
}) => {
  const [salesOrderProductsSelected, setSalesOrderProductsSelected] = useState<
    ProductSalesOrder[]
  >([]);

  return (
    <SalesOrderProductsSelectedContext.Provider
      value={{ salesOrderProductsSelected, setSalesOrderProductsSelected }}
    >
      {children}
    </SalesOrderProductsSelectedContext.Provider>
  );
};

export {
  SalesOrderProductsSelectedContext,
  SalesOrderProductsSelectedProvider,
};
