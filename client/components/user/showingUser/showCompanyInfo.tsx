"use client"
import React, { useEffect, useState } from 'react'
import { useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { responseCompanyInfo } from '@/dataType/dataTypeProfile/dataTypeProfile';


function ShowCompanyInfo() {
    const { userID } = useParams();
    const [companyInfo, setCompanyInfo] = useState<responseCompanyInfo>({
        nameComapny: "",
        userId: "",
        phone: "",
        email: "",
        address: "",
        website: "",
        postCode: "",
        city: "",
        street: "",
      });
    useEffect(() => {
        let ignore = false;
        fetch(`/api/profile/companyInfo/${userID}`)
          .then((res) => {
            
            return res.json();
          })
          .then((jsonData) => {
            if (!ignore) {
              console.log(jsonData.data, "setUser companyINFO");
              if(jsonData.data !== undefined){
                setCompanyInfo(jsonData.data);
              }

    
              
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
      }, [userID]);
      const rowPropreties = Object.entries(companyInfo)
  .filter(
    ([key]) =>
    
      key !== "_id" &&
      key !== "__v"
  )
  .map(([key, value]) => (
    <TableRow key={key} className="p-0">
      <TableCell>
        <strong className="text-foreground/70 font-light py-4">
          {key.toUpperCase()}
        </strong>
      </TableCell>
      <TableCell className="font-light py-4 ">{value as string}</TableCell>
    </TableRow>
  ));
  return (
     <div className='mt-4'>
      <Card className="card-gradient shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            Users Company Info
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
           <TableBody>{rowPropreties}</TableBody> 
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default ShowCompanyInfo