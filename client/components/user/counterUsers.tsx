"use client"
import React, { useEffect, useState } from 'react'
interface CounterUsersProps {
    startNumberProductInThePage :number
}
function CounterUsers({startNumberProductInThePage}:CounterUsersProps) {
const [counter,setCounter] =useState<number>(0)

let endNumberProductInThePage = Math.min(
  startNumberProductInThePage + 9,
  counter
);
    useEffect(() => {
        let ignore = false;
        fetch(`/api/getNumberUsers`)
          .then((res) => {
            
            return res.json();
          })
          .then((jsonData) => {
            if (!ignore) {
              console.log(jsonData, "Counter");
    
              setCounter(jsonData.data);
            }
          })
          .catch((err: unknown) => {
            console.log(err);
          })
          .finally(() => {
            if (!ignore) {
              console.log("noLoding");
            }
          });
        return () => {
          ignore = true;
        };
      }, []);
  return (
    <div className="text-xs text-muted-foreground">
    Showing <strong>{startNumberProductInThePage}</strong>-
    <strong>{endNumberProductInThePage}</strong> of{" "}
    <strong>{counter}</strong> Users
  </div>
  )
}

export default CounterUsers