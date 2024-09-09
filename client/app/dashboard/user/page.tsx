"use client"
import { Button } from '@/components/ui/button'
import React, { ChangeEvent, useState ,} from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion } from 'framer-motion'
import * as XLSX from 'xlsx';
import TableUser from "@/components/user/tableUser"
import { BookPlus  ,UserPlus} from 'lucide-react';
import CreateUser from "@/components/user/createUser"





function Page() {
  const [filexlxs, setFilexlxs] = useState<any[]>();
  const [nameFile, setNameFile] =useState<string | undefined>()

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setNameFile(file?.name)
    const reader = new FileReader();
    reader.onload = (event) => {
      const workbook = XLSX.read(event?.target?.result, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const sheetData = XLSX.utils.sheet_to_json(sheet);
      console.log(sheetData ,"sheet")
      setFilexlxs(sheetData)

      
    };
if(file != undefined){
    reader.readAsBinaryString(file);
  };

  
    
}
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    

    try {
      const response = await fetch('/api/importUsers', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "*",
          "Access-Control-Allow-Origin": "*",
        },
         body:JSON.stringify(filexlxs),
      });

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      const data = await response.json();
      console.log(data); 


    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className=' bg-gradient heighWithOutBar'>
        <div className='h-14 flex items-center container justify-end gap-2'>
        <Dialog>
      <DialogTrigger asChild>
      <Button className='h-9 rounded-sm   text-foreground card-gradient  hover:text-gray-400 '>   
              <UserPlus className='h-4 w-4 mr-2 text-green-300 ' />
          Create User</Button>
      
      </DialogTrigger>
      <DialogContent className="w-full bg-gradient">
      <DialogHeader>
          <DialogTitle>Create Users</DialogTitle>
        </DialogHeader>
        <CreateUser/>
        
      </DialogContent>
      </Dialog>
          
          <Dialog>
      <DialogTrigger asChild>
      <Button  className='h-9  text-foreground  shadow-sm rounded-sm  card-gradient  hover:text-gray-400'> 
      <BookPlus  className='h-4 w-4 mr-2 text-blue-300' />

      Import Users</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-gradient">
        <DialogHeader>
          <DialogTitle>Upload Users</DialogTitle>
          <DialogDescription>
          Please upload your data in Excel format
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="items-center w-full h-12 flex ">
          
            <Label htmlFor="name" className="w-full border border-foreground/50 rounded-sm hover:border-foreground/30 cursor-auto border-dashed flex h-10 items-center justify-center ">
              {nameFile == undefined ? "Add Excel File" : nameFile}
            </Label>
           
            <Input
              id="name"
              type='file'
              onChange={handleFileChange}
              
              className="hidden"
            />
          </div>
        </div>
        <DialogFooter>
          <Button className='h-8'   onClick={(e)=>handleSubmit(e)}>Upload</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
        </div>
        <TableUser/>
    </div>
  )
}

export default Page