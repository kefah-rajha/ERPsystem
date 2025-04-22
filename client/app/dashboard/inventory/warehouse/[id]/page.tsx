"use client";

import { 
  Building2, 
  MapPin, 
  LayoutGrid, 
  User, 
  Clock, 
  Check, 
  X, 
  Ruler, 
  Phone, 
  Mail, 
  ArrowLeft,
  Globe 
} from 'lucide-react';
import Link from "next/link";
import WareHouseProducts from "@/components/inventory/wareHouseProducts/wareHouseProducts"
import { Button } from "@/components/ui/button";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { usePathname } from "next/navigation";


// Warehouse type definition (same as previous example)
interface Warehouse {
  name: string;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    }
  };
  capacity: {
    totalSquareFeet: number;
    usedSquareFeet: number;
  };
  manager: {
    name: string;
    contactNumber: string;
    email: string;
  };
  features: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default function WarehouseDetailsPage() {
  const [warehouse, setWarehouse] = useState<Warehouse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();
    const id = pathname?.split("/").pop();

  useEffect(() => {
    let ignore = false;
    
    async function fetchWarehouse() {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/warehouse/getWarehouseById/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch warehouse details');
        }
        
        const data = await response.json();
        
        if (!ignore) {
          setWarehouse(data.data);
          setError(null);
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : 'An unknown error occurred');
          setWarehouse(null);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    fetchWarehouse();

    return () => {
      ignore = true;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-muted-foreground">Loading warehouse details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-xl mx-auto mt-10">
        <X className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!warehouse) {
    return (
      <Alert className="max-w-xl mx-auto mt-10">
        <X className="h-4 w-4" />
        <AlertTitle>No Warehouse Found</AlertTitle>
        <AlertDescription>The requested warehouse could not be retrieved.</AlertDescription>
      </Alert>
    );
  }

  // Capacity utilization calculation
  const capacityUtilization = ((warehouse.capacity.usedSquareFeet / warehouse.capacity.totalSquareFeet) * 100).toFixed(2);

  return (
    <div className="container mx-auto px-4 py-8 overflow-auto bg-gradient heighWithOutBar">
      <Button variant="ghost" size="icon" asChild >
                <Link href="/dashboard/inventory">
                
                  <ArrowLeft className="h-5 w-5" />
                  Back

                </Link>
              </Button>
      <Card className=" mx-auto shadow-lg overflow-auto">
        <CardHeader className=" border-b">
          <CardTitle className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Building2 className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">{warehouse.name} Warehouse</span>
            </div>
            <Badge 
              variant={warehouse.isActive ? "default" : "destructive"} 
              className="flex items-center space-x-2"
            >
              {warehouse.isActive ? <Check className="h-4 w-4 mr-1" /> : <X className="h-4 w-4 mr-1" />}
              {warehouse.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {/* Location Section */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center mb-4 space-x-2">
                <MapPin className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Location Details</h3>
              </div>
              <Separator className="mb-4" />
              <div className="space-y-2 pl-7">
                <p><Globe className="inline-block mr-2 h-4 w-4 text-muted-foreground" />{warehouse.location.address}</p>
                <p><MapPin className="inline-block mr-2 h-4 w-4 text-muted-foreground" />{warehouse.location.city}, {warehouse.location.state} {warehouse.location.zipCode}</p>
                <p><Globe className="inline-block mr-2 h-4 w-4 text-muted-foreground" />{warehouse.location.country}</p>
                {warehouse.location.coordinates && (
                  <p>
                    <MapPin className="inline-block mr-2 h-4 w-4 text-muted-foreground" />
                    Coordinates: {warehouse.location.coordinates.latitude}, 
                    {warehouse.location.coordinates.longitude}
                  </p>
                )}
              </div>
            </div>

            {/* Capacity Section */}
            <div>
              <div className="flex items-center mb-4 space-x-2">
                <Ruler className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Warehouse Capacity</h3>
              </div>
              <Separator className="mb-4" />
              <div className="space-y-2 pl-7">
                <p><LayoutGrid className="inline-block mr-2 h-4 w-4 text-muted-foreground" />Total Space: {warehouse.capacity.totalSquareFeet} sq ft</p>
                <p><LayoutGrid className="inline-block mr-2 h-4 w-4 text-muted-foreground" />Used Space: {warehouse.capacity.usedSquareFeet} sq ft</p>
                <p>
                  <Ruler className="inline-block mr-2 h-4 w-4 text-muted-foreground" />
                  Utilization: {capacityUtilization}%
                </p>
              </div>
            </div>

            {/* Manager Section */}
            <div>
              <div className="flex items-center mb-4 space-x-2">
                <User className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Manager Information</h3>
              </div>
              <Separator className="mb-4" />
              <div className="space-y-2 pl-7">
                <p><User className="inline-block mr-2 h-4 w-4 text-muted-foreground" />{warehouse.manager.name}</p>
                <p><Phone className="inline-block mr-2 h-4 w-4 text-muted-foreground" />{warehouse.manager.contactNumber}</p>
                <p><Mail className="inline-block mr-2 h-4 w-4 text-muted-foreground" />{warehouse.manager.email}</p>
              </div>
            </div>

            {/* Features Section */}
            <div>
              <div className="flex items-center mb-4 space-x-2">
                <LayoutGrid className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Warehouse Features</h3>
              </div>
              <Separator className="mb-4" />
              <div className="flex flex-wrap gap-2 pl-7">
                {warehouse.features.map((feature, index) => (
                  <Badge key={index} variant="outline" className="flex items-center">
                    <Check className="h-3 w-3 mr-1 text-primary" />
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Timestamp Section */}
          <Separator className="my-6" />
          <div className="text-sm text-muted-foreground flex items-center justify-center space-x-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Created: {new Date(warehouse.createdAt).toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Last Updated: {new Date(warehouse.updatedAt).toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
      <CardContent className='mt-2'>
        <h2 className='text-3xl py-4'>WareHouse's Products</h2>
      
        <WareHouseProducts/>
       </CardContent>
      </Card>

    </div>
  );
}