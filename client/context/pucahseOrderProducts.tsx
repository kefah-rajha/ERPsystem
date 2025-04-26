import React, { createContext, useState, useContext } from "react";
import { ProductSalesOrder } from "@/dataType/dataTypeSalesOrder/dataTypeSalesOrder";

interface PurchaseOrderSelectedTypeContext {
  purchaseOrderProductsSelected: ProductSalesOrder[];
  setPurchaseOrderProductsSelected: React.Dispatch<
    React.SetStateAction<ProductSalesOrder[]>
  >;
}

const PurchaseOrderProductsSelectedContext =
  createContext<PurchaseOrderSelectedTypeContext | null>(null);

const PurchaseOrderProductsSelectedProvider = ({
  children,
}: {
  children: any;
}) => {
  const [purchaseOrderProductsSelected, setPurchaseOrderProductsSelected] =
    useState<ProductSalesOrder[]>([]);

  return (
    <PurchaseOrderProductsSelectedContext.Provider
      value={{ purchaseOrderProductsSelected, setPurchaseOrderProductsSelected }}
    >
      {children}
    </PurchaseOrderProductsSelectedContext.Provider>
  );
};

export {
  PurchaseOrderProductsSelectedContext,
  PurchaseOrderProductsSelectedProvider,
};