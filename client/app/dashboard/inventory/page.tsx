"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Package, Store, TrendingUp, } from "lucide-react";
import Link from "next/link";
import { CreateWarehouseForm } from "@/components/inventory/Add-Warehouse-Dialog";
import { toast } from "@/components/ui/use-toast";
import {UpdateWarehouseForm} from "@/components/inventory/update-Warehouse-Dialog";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter
} from '@/components/ui/dialog'
import {
  MapPin,
  Box,
  Truck,
  Pencil,
  Trash2,
  AlertCircle
} from 'lucide-react'
import { useEffect, useState } from "react";
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


export default function Home() {
  const [warehouses, setWarehouses] = useState<IWarehouse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean
    warehouseId?: string
    warehouseName?: string
  }>({
    isOpen: false
  })
  const stats = [
    {
      title: "Total Products",
      value: "2,345",
      icon: Package,
      trend: "+12.5%",
      description: "from last month",
    },
    {
      title: "Total Warehouses",
      value: "4",
      icon: Store,
      trend: "+2",
      description: "new this month",
    },
    {
      title: "Stock Value",
      value: "$534,764",
      icon: TrendingUp,
      trend: "+8.2%",
      description: "from last month",
    },
    {
      title: "Low Stock Items",
      value: "24",
      icon: BarChart3,
      trend: "-3",
      description: "since last week",
    },
  ];



  const getAllWarehouses = async () => {
    try {
      const response = await fetch("/api/warehouse/getAllWarehouses", {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "*",
          "Access-Control-Allow-Origin": "*",
        },
        cache: 'no-store'
      })

      if (!response.ok) {
        throw new Error('Failed to fetch warehouses')
      }

      const data = await response.json()
      if (data.success == true) {
        setWarehouses(data.data)

      }
    } catch (error) {
      console.error('Error fetching warehouses:', error)
      throw error
    }
  }
  useEffect(() => {
    getAllWarehouses()
  }, [])

  const handleDeleteWarehouse = async () => {
    if (!deleteConfirmation.warehouseId) return

    try {
      const response = await fetch(`/api/warehouse/deleteWarehouse/${deleteConfirmation.warehouseId}`, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "*",
          "Access-Control-Allow-Origin": "*",
        },
      })
      const res = await response.json()
      if (res.success == true) {
        // Remove deleted warehouse from list
        setWarehouses(prev =>
          prev.filter(w => w._id !== deleteConfirmation.warehouseId)
        )

        toast({
          title: `${deleteConfirmation.warehouseName} has been removed.`,
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <p>Warehouse Deleted</p>
            </pre>
          ),
        });

      }
      if (res.success == false) {

        toast({
          title: 'Error delete Warehouse',
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <p>{res.message}</p>
            </pre>
          ),
        });
      }




      // Close confirmation dialog
      setDeleteConfirmation({ isOpen: false })
    } catch (error:any) {
      toast({
        title: 'Error delete Warehouse',
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <p>{error.message}</p>
          </pre>
        ),
      });
    }
  }
  const openDeleteConfirmation = (warehouse: IWarehouse) => {
    setDeleteConfirmation({
      isOpen: true,
      warehouseId: warehouse._id,
      warehouseName: warehouse.name
    })
  }
  const handleCreateSuccess = (createWarehouse :IWarehouse) => {
    setWarehouses(prevWarehouses => [
      ...prevWarehouses, 
      createWarehouse
    ])

  }

  
  const handleUpdateSuccess = (updatedWarehouse :IWarehouse) => {
    // Optional callback to handle successful update
    setWarehouses(prevWarehouses => {
      // Find the index of the warehouse to update
      const warehouseIndex = prevWarehouses.findIndex(
        warehouse => warehouse._id === updatedWarehouse._id
      )

      // If warehouse is found, create a new array with the updated warehouse
      if (warehouseIndex !== -1) {
        const updatedWarehouses = [...prevWarehouses]
        updatedWarehouses[warehouseIndex] = updatedWarehouse
        return updatedWarehouses
      }

      // If warehouse not found, return previous state
      return prevWarehouses
    })

  }

  return (
    <main className="container mx-auto p-8 bg-[#121212]  space-y-6 heighWithOutBar overflow-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white"> Inventory Management</h1>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-500">{stat.trend}</span> {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl">Warehouses Overview</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Monitor capacity and stock levels across all locations
              </p>
            </div>
            <CreateWarehouseForm    onCreateSuccess={handleCreateSuccess}/>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {warehouses.map((warehouse) => (

                <Card
                  key={warehouse._id}
                  className="card-gradient shadow-lg hover:bg-muted/70 transition-colors relative"
                >
                  <CardContent className="pt-6">
                    {/* Warehouse Actions */}
                    <div className="absolute bottom-2 right-2 flex gap-2">
                      {/* Edit Button */}

                     
                      <UpdateWarehouseForm 
      warehouse={warehouse} 
      onUpdateSuccess={handleUpdateSuccess} 
    />


                      {/* Delete Button */}
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8 card-gradient hover:text-red-500 text-red-400 shadow-md border-none"
                        onClick={() => openDeleteConfirmation(warehouse)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Warehouse Details */}
                    <Link href={`/dashboard/inventory/warehouse/${warehouse._id}`}>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold">{warehouse.name}</h3>
                          <div className="flex items-center text-sm text-muted-foreground mt-1">
                            <MapPin className="h-4 w-4 mr-1" />
                            {`${warehouse.location.address}, ${warehouse.location.city}, ${warehouse.location.state}`}
                          </div>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${warehouse.isActive
                            ? 'text-green-100 bg-green-700'
                            : 'text-yellow-100 bg-yellow-700'
                            }`}
                        >
                          {warehouse.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>

                      {/* Capacity and Details */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <Box className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">
                              {warehouse.capacity.usedSquareFeet} / {warehouse.capacity.totalSquareFeet} sq ft
                            </p>
                            <p className="text-xs text-muted-foreground">Capacity Used</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Truck className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">{warehouse.manager.name}</p>
                            <p className="text-xs text-muted-foreground">Manager</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </CardContent>
                </Card>

              ))}


              {/* Delete Confirmation Dialog */}
              <Dialog
                open={deleteConfirmation.isOpen}
                onOpenChange={(open) =>
                  setDeleteConfirmation(prev => ({ ...prev, isOpen: open }))
                }
              >
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="flex items-center">
                      <AlertCircle className="mr-2 text-destructive" />
                      Delete Warehouse
                    </DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete the warehouse {deleteConfirmation.warehouseName}?
                      This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button
                      variant="destructive"
                      onClick={handleDeleteWarehouse}
                    >
                      Delete
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Stock Movements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Placeholder for stock movements */}
              <p className="text-sm text-muted-foreground">Loading movements...</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Low Stock Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Placeholder for alerts */}
              <p className="text-sm text-muted-foreground">Loading alerts...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}