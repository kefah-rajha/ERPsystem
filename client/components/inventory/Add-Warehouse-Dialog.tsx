"use client"

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from "@/components/ui/use-toast";

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger

} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Plus } from 'lucide-react'
export interface IWarehouse {
  _id: string
  name: string
  location: {
    address: string
    city: string
    state: string
    zipCode: string
    country: string
    coordinates?: {
      latitude?: number
      longitude?: number
    }
  }
  capacity: {
    totalSquareFeet: number
    usedSquareFeet: number
  }
  manager: {
    name: string
    contactNumber: string
    email: string
  }
  features: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}



// Zod Schema for Warehouse Validation
const warehouseSchema = z.object({
  name: z.string().min(2, { message: "Warehouse name must be at least 2 characters" }),

  location: z.object({
    address: z.string().min(5, { message: "Address must be at least 5 characters" }),
    city: z.string().min(2, { message: "City must be at least 2 characters" }),
    state: z.string().min(2, { message: "State must be at least 2 characters" }),
    zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, { message: "Invalid ZIP code" }),
    country: z.string().min(2, { message: "Country must be at least 2 characters" }),
    coordinates: z.object({
      latitude: z.number().optional(),
      longitude: z.number().optional()
    }).optional()
  }),

  capacity: z.object({
    totalSquareFeet: z.number().min(1, { message: "Total square feet must be at least 1" }),
    usedSquareFeet: z.number().min(0, { message: "Used square feet cannot be negative" }).optional()
  }),

  manager: z.object({
    name: z.string().min(2, { message: "Manager name must be at least 2 characters" }),
    contactNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, { message: "Invalid phone number" }),
    email: z.string().email({ message: "Invalid email address" })
  }),

  features: z.array(z.string()).optional(),
  isActive: z.boolean().default(true)
})

// Type inference for TypeScript
type WarehouseFormData = z.infer<typeof warehouseSchema>
interface CreateWarehouseFormProps {
  onCreateSuccess: (createWarehouse: IWarehouse) => void;
}


export function CreateWarehouseForm({onCreateSuccess}: CreateWarehouseFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize form with zod resolver
  const form = useForm<WarehouseFormData>({
    resolver: zodResolver(warehouseSchema),
    defaultValues: {
      name: "",
      location: {
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: "United States"
      },
      capacity: {
        totalSquareFeet: 0,
        usedSquareFeet: 0
      },
      manager: {
        name: "",
        contactNumber: "",
        email: ""
      },
      isActive: true,
      features: []
    }
  })

  // Form submission handler
  const onSubmit = async (data: WarehouseFormData) => {
    setIsSubmitting(true)
    console.log(data)
    try {
      // Fetch API call to create warehouse
      const response = await fetch('/api/warehouse/createWarehouse', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "*",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(data)
      })

      // Check if the response is ok (status in the range 200-299)
     

      // Parse successful response
      const result = await response.json()
      console.log(result)

      // Success toast
if(result.success ===true){
  toast({
    title: 'Warehouse Created Successfully',
    description: (
      <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
        <p>Create New WarehouseIs Done</p>
      </pre>
    ),
  });
    // Reset form
    form.reset()
}
if(result.success ===false){
  toast({
    title: 'Error Creating Warehouse',
    description: (
      <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
        <p>{result.message}</p>
      </pre>
    ),
  });
    // Reset form
    form.reset()
}
      

      // Reset form
  
    } catch (error:any) {
      // Error handling
      toast({
        title: 'Error Creating Warehouse',
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <p>{error.message}</p>
          </pre>
        ),
      });
  
      console.error('Warehouse Creation Error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog  >
      <DialogTrigger asChild>
        <Button className="card-gradient text-white hover:text-white/50">
          <Plus className="h-4 w-4 mr-2" />
          Add Warehouse
        </Button>
      </DialogTrigger>
      <DialogContent className="h-[90vh] w-[90%] bg-gradient overflow-hidden">
        <Card className=" overflow-auto">
          <CardHeader>
            <CardTitle>Create New Warehouse</CardTitle>
            <CardDescription>
              Fill out the details for a new warehouse in your network.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Basic Information Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Warehouse Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Central Warehouse" {...field} className='inputCustom' />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="isActive"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Active Status</FormLabel>
                            <FormDescription>
                              Toggle if this warehouse is currently operational
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Separator />

                {/* Location Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Location Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="location.address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street Address</FormLabel>
                          <FormControl>
                            <Input placeholder="123 Logistics Lane" {...field} className='inputCustom' />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="location.city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="Warehouse City" {...field} className='inputCustom' />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="location.state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <FormControl>
                            <Input placeholder="State" {...field} className='inputCustom' />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="location.zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ZIP Code</FormLabel>
                          <FormControl>
                            <Input placeholder="12345" {...field} className='inputCustom' />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Separator />

                {/* Capacity Section */}
                <h3 className="text-lg font-semibold mb-4">Warehouse Capacity</h3>

                <div className='flex'>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="capacity.totalSquareFeet"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Total Square Feet</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="10000"
                              className='inputCustom'
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="capacity.usedSquareFeet"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Used Square Feet</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="10000"
                              className='inputCustom'
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>


                <Separator />

                {/* Manager Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Manager Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="manager.name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Manager Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} className='inputCustom' />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="manager.email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Manager Email</FormLabel>
                          <FormControl>
                            <Input placeholder="john@example.com" {...field} className='inputCustom' />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="manager.contactNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Number</FormLabel>
                          <FormControl>
                            <Input placeholder="+1234567890" {...field} className='inputCustom' />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full">Create Warehouse</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}


























