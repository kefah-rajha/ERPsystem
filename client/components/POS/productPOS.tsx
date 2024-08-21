"use client";
import Image from "next/image";
import React, { createContext, useState, useContext } from "react";
import { productToInvoice } from "@/context/productPosContext";

function ProductPOS() {
  const ProductContext = useContext(productToInvoice);

  type ProductAttrubite = {
    photo: string;
    id: number;
    name: string;
    price: string;
    Discount: string;
    Quantity: number;
    subTotal: string;
  };
  const productss = [
    {
      id: 12321,
      name: "Chair",
      price: "50",
      Discount: "10%",
      Quantity: 1,
      subTotal: "50",
      photo: "/p1.png",
    },
    {
      id: 5632,
      name: "Bedding",
      price: "100",
      Discount: "10%",
      Quantity: 1,
      subTotal: "50",
      photo: "/p2.png",
    },
  ];

  const handleProductClick = (product: ProductAttrubite) => {
    ProductContext &&
      ProductContext.setProducts((prevProducts) => {
        const isProductExists = prevProducts.some(
          (productperv) => productperv.id === product.id
        );

        if (isProductExists) {
          return prevProducts.map((productperv) => {
            if (productperv.id === product.id) {
              return { ...productperv, Quantity: productperv.Quantity + 1 };
            } else {
              return productperv;
            }
          });
        } else {
          return [...prevProducts, product];
        }
      });
  };

  const productList = productss.map((product: ProductAttrubite) => {
    return (
      <div
        key={product.id}
        className="w-3/12  cursor-pointer hover:backdrop-grayscale-0	 relative"
        onClick={() => handleProductClick(product)}
      >
        <Image
          src={product.photo}
          alt={product.name}
          width={500}
          height={500}
          className="w-full h-full  bg-cover backdrop-grayscale	  "
        />
        <p className="absolute bottom-2 left-2 text-gray-600 text-background">
          {product.name}
        </p>
        <p className="absolute bottom-2 right-2 text-gray-600">
          {product.price}$
        </p>
      </div>
    );
  });
  return (
    <div className="px-4">
      <h3 className="font-black text-2xl h-12 flex items-center border-b	border-[#312F2F]">
        Products
      </h3>
      <div className="mt-4 flex">{productList}</div>
    </div>
  );
}

export default ProductPOS;
