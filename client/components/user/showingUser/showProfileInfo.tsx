"use client";
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { responseUserInfo } from "@/dataType/dataTypeProfile/dataTypeProfile";
interface ShowProfileInfo {
  data: responseUserInfo
}

function ShowProfileInfo({data}:ShowProfileInfo) {
  const rowPropreties = Object.entries(data)
  .filter(
    ([key]) =>
      key !== "password" &&
      key !== "photos" &&
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
    <div>
      <Card className="card-gradient shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            Users Profile Info
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
          <TableBody>{rowPropreties}</TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default ShowProfileInfo;
