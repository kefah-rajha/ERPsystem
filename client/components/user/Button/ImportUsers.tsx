"use  client";
import React, { ChangeEvent, useState } from "react";


import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import * as XLSX from "xlsx";
import { BookPlus, Loader2, UserPlus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

function ImportUsers() {
  const [filexlxs, setFilexlxs] = useState<any[]| null>(null);
  const [nameFile, setNameFile] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setNameFile(file?.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const workbook = XLSX.read(event?.target?.result, { type: "binary" });
      const sheetName = workbook.SheetNames[0];

      const sheet = workbook.Sheets[sheetName];
      const sheetData = XLSX.utils.sheet_to_json(sheet, {
  raw: false,    
  dateNF: 'dd/mm/yyyy'   
});
      console.log(sheetData, "sheet");
      setFilexlxs(sheetData);
    };
    if (file != undefined) {
      reader.readAsBinaryString(file);
    }
  }
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/importUsers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "*",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(filexlxs),
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      const data = await response.json();
      console.log(data)
      if(data.success == true){
        setIsLoading(false);
        toast({
          title: "Success",
          description: "Users imported successfully",
        });
        window.location.reload()


      }
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="h-10  text-foreground  shadow-sm rounded-sm  card-gradient  hover:text-gray-400">
          <BookPlus className="h-4 w-4 mr-2 text-blue-300" />
          Import Users
        </Button>
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
            <Label
              htmlFor="name"
              className="w-full border border-foreground/50 rounded-sm hover:border-foreground/30 cursor-auto border-dashed flex h-10 items-center justify-center "
            >
              {nameFile == undefined ? "Add Excel File" : nameFile}
            </Label>

            <Input
              id="name"
              type="file"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>
        <DialogFooter>
          <Button className="h-8" disabled={isLoading } onClick={(e) => handleSubmit(e)}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            'Upload File'
          )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ImportUsers;
