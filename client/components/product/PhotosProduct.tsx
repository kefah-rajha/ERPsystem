"use client";
import React, { useEffect, useRef, useState } from "react";
import { PlusCircle, Upload } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
type ImageData = string | ArrayBuffer | [];

interface PhotosProductType {
  AllImage:(inputImages:ImageData[])=>void
}
function PhotosProduct({AllImage}:PhotosProductType) {
  type ImageData = string | ArrayBuffer | [];

  const [inputImages, setInputImages] = useState<ImageData[]>([]);
  const mainPhoto = useRef<HTMLImageElement>(null);
  const [multiPhoto, setMultiPhotho] = useState<any[]>([]);
  console.log(inputImages ,"inputImages",multiPhoto)
  useEffect(()=>{
    const AllImageInComponentPhoto=[...multiPhoto,...inputImages]
    
    AllImage(AllImageInComponentPhoto)

  },[AllImage, inputImages, multiPhoto])
  const inputFiles = (e:any) => {
    const files = [...e.target.files];

    const newfiles:any = [];
    files.map((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        newfiles.push(reader.result);
        setMultiPhotho([...multiPhoto , ...newfiles]);
      };
    });
  };
  const deletPhoto = (index: number) => {
    const newMultiPhoto = [...multiPhoto];
    newMultiPhoto.splice(index, 1);

    setMultiPhotho(newMultiPhoto);
  };

  return (
    <Card className="overflow-hidden " x-chunk="dashboard-07-chunk-4">
      <CardHeader>
        <CardTitle>Product Images</CardTitle>
        <CardDescription>
          Lipsum dolor sit amet, consectetur adipiscing elit
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <div className="w-full border relative  cursor-pointer h-72 rounded-sm">
{     inputImages.length >0 &&       <p className="absolute -top-5 z-50 " onClick={()=>{setInputImages([])

mainPhoto?.current?.removeAttribute("src");
mainPhoto?.current?.classList.remove("block");
                    mainPhoto?.current?.classList.add("hidden");
}}>x</p>
}            <PlusCircle className="h-10 w-6 m-3 text-foreground z-50" />
            <input
              type="file"
              // value={input}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                const photo = event?.target?.files
                  ? event?.target?.files[0]
                  : null;
                if (photo !== null) {
                  const reader = new FileReader();
                  reader.readAsDataURL(photo);
                  reader.onloadend = () => {
                    setInputImages((prevImages) => {
                      if (
                        typeof reader.result === "string" ||
                        reader.result instanceof ArrayBuffer
                      ) {
                        return [...prevImages, reader.result]; // Only add if valid type
                      } else {
                        // Handle potential errors or ignore null results (optional)
                        return prevImages; // Or return prevImages to avoid unnecessary updates
                      }
                    });
                   
                    if (typeof reader.result == "string") {
                      mainPhoto?.current?.setAttribute("src", reader.result);
                    }
                    mainPhoto?.current?.classList.add("block");
                    mainPhoto?.current?.classList.remove("hidden");
                  };
                }
              }}
              style={{ display: "none" }}
              id="firstphotoSelect"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={mainPhoto}
              alt="main product photo"
              src=""
              className="w-full h-full hidden absolute top-0 rounded-sm z-50"
            />
            <label
              htmlFor="firstphotoSelect"
              className="absolute w-full h-full top-0 z-20 bg-background/20 inputCustom cursor-pointer hover:bg-foreground/10 hover:text-foreground text-foreground/20 transition-colors  rounded-sm font-bold flex justify-center items-center"
            >
              {" "}
              Chose main photo
            </label>
          </div>

          <div className="grid grid-cols-3 gap-2">
          <div >
        {multiPhoto.length > 0 &&
          multiPhoto.map((photo, index) => {
            return (
              <div key={index} >
                <p onClick={() => deletPhoto(index)}>x</p>
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo} alt="photoProducts"/>
              </div>
            );
          })}
      </div>
            <div className="flex  relative aspect-square w-full items-center justify-center rounded-md border border-dashed">
              
              add photo
              <input
                type="file"
                // value={input}
                 onChange={inputFiles}
                 multiple

                style={{ display: "none" }}
                id="photoSelect"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}

              <label
                htmlFor="photoSelect"
                className="absolute w-full h-full top-0 z-index hover:bg-background/15 cursor-pointer bg-foreground/5 hover:text-foreground text-foreground/20 transition-colors  rounded-sm font-bold flex justify-center items-center"
              ></label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default PhotosProduct;
