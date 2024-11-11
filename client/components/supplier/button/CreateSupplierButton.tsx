"use client"
import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  import CreateSupplier from "@/components/supplier/createSupplier"
  import { UserPlus} from 'lucide-react';
  import { Button } from '@/components/ui/button'


function CreateUserButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
      <Button className='h-10 rounded-sm   text-foreground card-gradient  hover:text-gray-400 '>   
              <UserPlus className='h-4 w-4 mr-2 text-green-300 ' />
          Create Supplier</Button>
      
      </DialogTrigger>
      <DialogContent className="w-[90%] h-[95vh] bg-gradient overflow-hidden">
      <DialogHeader>
          <DialogTitle>Create Supplier</DialogTitle>
        </DialogHeader>
        <CreateSupplier/>
        
      </DialogContent>
      </Dialog>
  )
}

export default CreateUserButton