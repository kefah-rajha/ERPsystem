"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { MapPin, Package, Search, Store, Truck, ArrowLeft, Box, BarChart, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";

type Product = {
  id: string;
  name: string;
  category: string;
  quantity: number;
  minStock: number;
  location: string;
  status: string;
  price: number;
};

export default function WarehouseDetails({ params }: { params: { id: string } }) {
  const warehouse = {
    id: params.id,
    name: "Main Distribution Center",
    location: "New York, NY",
    totalItems: 1245,
    capacity: "85%",
    status: "active",
    manager: "John Smith",
    lastUpdated: "2024-03-21 14:30",
    address: "123 Warehouse St, New York, NY 10001",
    contact: "+1 (555) 123-4567",
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [stockFilter, setStockFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const products: Product[] = [
    {
      id: "PRD001",
      name: "Wireless Mouse",
      category: "Electronics",
      quantity: 156,
      minStock: 50,
      location: "Zone A-12",
      status: "In Stock",
      price: 29.99,
    },
    {
      id: "PRD002",
      name: "USB-C Cable",
      category: "Accessories",
      quantity: 423,
      minStock: 100,
      location: "Zone B-03",
      status: "In Stock",
      price: 12.99,
    },
    {
      id: "PRD003",
      name: "Laptop Stand",
      category: "Accessories",
      quantity: 32,
      minStock: 45,
      location: "Zone A-15",
      status: "Low Stock",
      price: 49.99,
    },
    {
      id: "PRD004",
      name: "Mechanical Keyboard",
      category: "Electronics",
      quantity: 0,
      minStock: 20,
      location: "Zone C-01",
      status: "Out of Stock",
      price: 89.99,
    },
  ];

  const categories = Array.from(new Set(products.map(p => p.category)));

  const filteredProducts = products
    .filter(product => {
      // Search filter
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.id.toLowerCase().includes(searchTerm.toLowerCase());

      // Stock filter
      const matchesStock = stockFilter === "all" ||
        (stockFilter === "in-stock" && product.quantity > product.minStock) ||
        (stockFilter === "low-stock" && product.quantity <= product.minStock && product.quantity > 0) ||
        (stockFilter === "out-of-stock" && product.quantity === 0);

      // Category filter
      const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;

      return matchesSearch && matchesStock && matchesCategory;
    })
    .sort((a, b) => {
      const multiplier = sortOrder === "asc" ? 1 : -1;
      switch (sortBy) {
        case "price":
          return (a.price - b.price) * multiplier;
        case "quantity":
          return (a.quantity - b.quantity) * multiplier;
        case "name":
          return a.name.localeCompare(b.name) * multiplier;
        default:
          return 0;
      }
    });

  return (
    <div className="container mx-auto p-4 space-y-6 heighWithOutBar overflow-auto">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/inventory">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Warehouse Details</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              {warehouse.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Location</p>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <p className="font-medium">{warehouse.location}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Status</p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  warehouse.status === 'active' 
                 ? 'text-green-100 bg-green-700' 
                            : 'text-yellow-100 bg-yellow-700'
                }`}>
                  {warehouse.status.charAt(0).toUpperCase() + warehouse.status.slice(1)}
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Items</p>
                <p className="font-medium">{warehouse.totalItems}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Capacity Used</p>
                <p className="font-medium">{warehouse.capacity}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Manager</p>
                <p className="font-medium">{warehouse.manager}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="font-medium">{warehouse.lastUpdated}</p>
              </div>
              <div className="col-span-2 space-y-1">
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-medium">{warehouse.address}</p>
              </div>
              <div className="col-span-2 space-y-1">
                <p className="text-sm text-muted-foreground">Contact</p>
                <p className="font-medium">{warehouse.contact}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Warehouse Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 p-4 card-gradient rounded-lg">
                <Box className="h-8 w-8 text-primary " />
                <div>
                  <p className="text-sm text-muted-foreground">Total SKUs</p>
                  <p className="text-2xl font-bold">487</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-4 card-gradient rounded-lg">
                <Truck className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Turnover</p>
                  <p className="text-2xl font-bold">1.2k</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-4 card-gradient rounded-lg">
                <Package className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Low Stock Items</p>
                  <p className="text-2xl font-bold">24</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-4 card-gradient rounded-lg">
                <BarChart className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Utilization</p>
                  <p className="text-2xl font-bold">85%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle>Warehouse Inventory</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search products..." 
                  className="pl-8 w-[250px] inputCustom"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="card-gradient text-white">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">Sort by</h4>
                      <div className="flex gap-2">
                        <Select value={sortBy} onValueChange={setSortBy}>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Sort by" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="name">Name</SelectItem>
                            <SelectItem value="price">Price</SelectItem>
                            <SelectItem value="quantity">Quantity</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                        >
                          {sortOrder === "asc" ? "↑" : "↓"}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">Stock Status</h4>
                      <Select value={stockFilter} onValueChange={setStockFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Filter by stock" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Items</SelectItem>
                          <SelectItem value="in-stock">In Stock</SelectItem>
                          <SelectItem value="low-stock">Low Stock</SelectItem>
                          <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">Category</h4>
                      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Filter by category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          {categories.map(category => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <Button className="card-gradient text-white">
                <Package className="h-4 w-4 mr-2 " />
                Add Product
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Min. Stock</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.id}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell>{product.minStock}</TableCell>
                    <TableCell>{product.location}</TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        product.status === 'In Stock' 
                          ? 'bg-green-100 text-green-700'
                          : product.status === 'Low Stock'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {product.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}